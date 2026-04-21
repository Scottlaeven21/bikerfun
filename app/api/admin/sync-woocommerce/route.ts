import { after } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { createAuditLog } from '@/lib/audit/logger';
import {
  syncOccasions,
  syncProducts,
  syncOrders,
} from '@/lib/woocommerce/full-sync';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * Start sync en return meteen 202 om Cloudflare 524-timeout te voorkomen.
 * De sync loopt op de achtergrond via after() — Vercel houdt de functie
 * in leven tot after() klaar is, ongeacht dat de HTTP-response al verstuurd is.
 */
export async function POST(request: NextRequest) {
  // Auth check — synchroon, vóór de response
  const supabaseAuth = await createClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Niet ingelogd' }, { status: 401 });
  }

  const { data: profileData } = await supabaseAuth
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin: boolean } | null;
  if (!profile?.is_admin) {
    return NextResponse.json({ success: false, error: 'Geen admin-toegang' }, { status: 403 });
  }

  const jobId = crypto.randomUUID();

  // Sla sync-start op zodat de frontend kan pollen
  const supabase = createAdminClient();
  await (supabase as any).from('audit_logs').insert({
    user_id: user.id,
    user_email: user.email,
    action: 'sync_woocommerce',
    resource_type: 'system',
    details: { jobId, status: 'running' },
    ip_address: 'server',
    user_agent: 'sync',
  });

  // Voer de sync uit ná het terugsturen van de 202 — geen timeout meer
  after(async () => {
    const db = createAdminClient();
    console.log('🔄 Starting WooCommerce sync (background)...');

    const errors: string[] = [];
    let occasions, products, orders;

    try {
      occasions = await syncOccasions(db);
    } catch (err: any) {
      errors.push(`Occasions: ${err.message}`);
      console.error('❌ Occasions sync failed:', err.message);
    }

    try {
      products = await syncProducts(db);
    } catch (err: any) {
      errors.push(`Producten: ${err.message}`);
      console.error('❌ Products sync failed:', err.message);
    }

    try {
      orders = await syncOrders(db);
    } catch (err: any) {
      errors.push(`Bestellingen: ${err.message}`);
      console.error('❌ Orders sync failed:', err.message);
    }

    // Sla eindresultaat op — frontend leest dit via poll
    await (db as any).from('audit_logs').insert({
      user_id: user.id,
      user_email: user.email,
      action: 'sync_woocommerce',
      resource_type: 'system',
      details: {
        jobId,
        status: errors.length === 0 ? 'completed' : 'completed_with_errors',
        occasions: occasions ?? null,
        products: products ?? null,
        orders: orders ?? null,
        errors,
      },
      ip_address: 'server',
      user_agent: 'sync',
    });

    console.log('✅ Background sync completed!', errors.length ? `Errors: ${errors.join(', ')}` : '');
  });

  // Meteen terugsturen — Cloudflare ziet nooit een timeout
  return NextResponse.json({ success: true, jobId }, { status: 202 });
}

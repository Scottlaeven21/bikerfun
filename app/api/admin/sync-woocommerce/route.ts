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

  // Registreer sync-start in audit log
  await createAuditLog(request, 'sync_woocommerce', 'system', undefined, { status: 'started' }, 'success');

  // Voer de sync uit ná het terugsturen van de 202 — geen timeout meer
  after(async () => {
    const supabase = createAdminClient();
    console.log('🔄 Starting WooCommerce sync (background)...');

    try {
      const occasions = await syncOccasions(supabase);
      await createAuditLog(request, 'sync_occasions', 'occasions', undefined, occasions, 'success');
      console.log('✅ Occasions synced:', occasions);
    } catch (err: any) {
      console.error('❌ Occasions sync failed:', err.message);
      await createAuditLog(request, 'sync_occasions', 'occasions', undefined, { error: err.message }, 'failure', err.message);
    }

    try {
      const products = await syncProducts(supabase);
      await createAuditLog(request, 'sync_products', 'products', undefined, products, 'success');
      console.log('✅ Products synced:', products);
    } catch (err: any) {
      console.error('❌ Products sync failed:', err.message);
      await createAuditLog(request, 'sync_products', 'products', undefined, { error: err.message }, 'failure', err.message);
    }

    try {
      const orders = await syncOrders(supabase);
      await createAuditLog(request, 'sync_orders', 'orders', undefined, orders, 'success');
      console.log('✅ Orders synced:', orders);
    } catch (err: any) {
      console.error('❌ Orders sync failed:', err.message);
      await createAuditLog(request, 'sync_orders', 'orders', undefined, { error: err.message }, 'failure', err.message);
    }

    console.log('✅ Background sync completed!');
  });

  // Meteen terugsturen — Cloudflare ziet nooit een timeout
  return NextResponse.json(
    { success: true, message: 'Sync gestart op de achtergrond. Ververs de pagina na ±1 minuut.' },
    { status: 202 }
  );
}

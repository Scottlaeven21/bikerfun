import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { createAuditLog } from '@/lib/audit/logger';
import {
  syncOccasions,
  syncProducts,
  syncOrders,
  type WooCommerceFullSyncResult,
} from '@/lib/woocommerce/full-sync';

/** Vercel Pro: allow long WooCommerce + DB run (Hobby blijft 10s; gebruik `npm run sync:woocommerce` lokaal). */
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

/**
 * Sync everything between WooCommerce and Supabase
 * - WooCommerce → Supabase: Occasions & Products
 * - Supabase → WooCommerce: Orders
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = await createClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

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

    const supabase = createAdminClient();
    const errors: string[] = [];
    const result: WooCommerceFullSyncResult = {
      success: true,
    };

    console.log('🔄 Starting WooCommerce sync...\n');

    try {
      result.occasions = await syncOccasions(supabase);
      await createAuditLog(request, 'sync_occasions', 'occasions', undefined, result.occasions, 'success');
    } catch (error: any) {
      errors.push(`Occasions sync failed: ${error.message}`);
      await createAuditLog(
        request,
        'sync_occasions',
        'occasions',
        undefined,
        { error: error.message },
        'failure',
        error.message
      );
    }

    try {
      result.products = await syncProducts(supabase);
      await createAuditLog(request, 'sync_products', 'products', undefined, result.products, 'success');
    } catch (error: any) {
      errors.push(`Products sync failed: ${error.message}`);
      await createAuditLog(
        request,
        'sync_products',
        'products',
        undefined,
        { error: error.message },
        'failure',
        error.message
      );
    }

    try {
      result.orders = await syncOrders(supabase);
      await createAuditLog(request, 'sync_orders', 'orders', undefined, result.orders, 'success');
    } catch (error: any) {
      errors.push(`Orders sync failed: ${error.message}`);
      await createAuditLog(
        request,
        'sync_orders',
        'orders',
        undefined,
        { error: error.message },
        'failure',
        error.message
      );
    }

    result.success = errors.length === 0;
    if (errors.length > 0) {
      result.errors = errors;
    }

    console.log('\n✅ Sync completed!');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Sync failed:', error);
    await createAuditLog(
      request,
      'sync_woocommerce',
      'system',
      undefined,
      { error: error.message },
      'failure',
      error.message
    );
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

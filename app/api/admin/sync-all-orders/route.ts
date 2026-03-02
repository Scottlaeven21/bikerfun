import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncOrdersToWooCommerce } from '@/lib/woocommerce/sync';

/**
 * Manual sync endpoint for admin dashboard
 * Syncs all paid orders without WooCommerce ID to WooCommerce
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [MANUAL SYNC] Starting manual order sync from admin dashboard...');

    const supabase = await createClient();

    // Find paid orders without WooCommerce ID
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select('*')
      .eq('payment_status', 'paid')
      .is('woo_order_id', null)
      .order('created_at', { ascending: true })
      .limit(10); // Sync max 10 orders at once

    if (error) {
      console.error('❌ [MANUAL SYNC] Error fetching orders:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      console.log('✅ [MANUAL SYNC] No unsynced orders found');
      return NextResponse.json({ synced: 0, message: 'Geen orders om te synchroniseren' });
    }

    console.log(`📦 [MANUAL SYNC] Found ${orders.length} paid order(s) to sync`);

    // Sync orders
    const result = await syncOrdersToWooCommerce(orders);

    console.log(`✅ [MANUAL SYNC] Successfully synced ${result.synced} order(s)`);

    if (result.errors.length > 0) {
      console.error(`⚠️ [MANUAL SYNC] ${result.errors.length} order(s) failed:`, result.errors);
    }

    return NextResponse.json({
      synced: result.synced,
      failed: result.errors.length,
      message: `${result.synced} order(s) gesynchroniseerd${result.errors.length > 0 ? `, ${result.errors.length} mislukt` : ''}`,
    });
  } catch (error) {
    console.error('❌ [MANUAL SYNC] Unexpected error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

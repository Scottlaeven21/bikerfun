import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncOrderToWooCommerce } from '@/lib/woocommerce/sync';

interface OrderWithItems {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  billing_address: any;
  shipping_address: any;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  mollie_payment_id: string;
  order_items?: Array<{
    product_id: number | null;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

/**
 * Manual sync endpoint for admin dashboard
 * Syncs all paid orders without WooCommerce ID to WooCommerce
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 [MANUAL SYNC] Starting manual order sync from admin dashboard...');

    const supabase = await createClient();

    // Find paid orders without WooCommerce ID
    const { data, error } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        order_items:webshop_order_items(*)
      `)
      .eq('payment_status', 'paid')
      .is('woo_order_id', null)
      .order('created_at', { ascending: true })
      .limit(10); // Sync max 10 orders at once
    
    const orders = data as OrderWithItems[] | null;

    if (error) {
      console.error('❌ [MANUAL SYNC] Error fetching orders:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      console.log('✅ [MANUAL SYNC] No unsynced orders found');
      return NextResponse.json({ synced: 0, message: 'Geen orders om te synchroniseren' });
    }

    console.log(`📦 [MANUAL SYNC] Found ${orders.length} paid order(s) to sync`);

    // Sync orders one by one
    let synced = 0;
    const errors: string[] = [];

    for (const order of orders) {
      try {
        // Transform order items to expected format
        const items = (order.order_items || []).map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }));

        const orderData = {
          ...order,
          items,
        };

        const wooOrderId = await syncOrderToWooCommerce(orderData);

        // Update Supabase with WooCommerce ID
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('webshop_orders')
          .update({ 
            woo_order_id: wooOrderId,
            synced_to_woo: true 
          })
          .eq('id', order.id);
        
        if (updateError) {
          throw new Error(`Failed to update order in database: ${updateError.message}`);
        }

        synced++;
        console.log(`✅ [MANUAL SYNC] Order ${order.order_number} synced (WC ID: ${wooOrderId})`);
      } catch (err) {
        const errorMsg = `Order ${order.order_number}: ${err instanceof Error ? err.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(`❌ [MANUAL SYNC] ${errorMsg}`);
      }
    }

    console.log(`✅ [MANUAL SYNC] Successfully synced ${synced} order(s)`);

    if (errors.length > 0) {
      console.error(`⚠️ [MANUAL SYNC] ${errors.length} order(s) failed:`, errors);
    }

    return NextResponse.json({
      synced,
      failed: errors.length,
      message: `${synced} order(s) gesynchroniseerd${errors.length > 0 ? `, ${errors.length} mislukt` : ''}`,
    });
  } catch (error) {
    console.error('❌ [MANUAL SYNC] Unexpected error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

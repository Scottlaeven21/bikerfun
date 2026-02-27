import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

/**
 * Vercel Cron Job - Runs every 5 minutes
 * Syncs paid orders without WooCommerce ID to WooCommerce
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 [CRON] Starting order sync job...');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Find paid orders without WooCommerce ID
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('payment_status', 'paid')
      .is('woo_order_id', null)
      .order('paid_at', { ascending: false })
      .limit(10); // Max 10 orders per run

    if (error || !orders || orders.length === 0) {
      console.log('✅ [CRON] No unsynced orders found');
      return NextResponse.json({ 
        success: true, 
        message: 'No orders to sync',
        synced: 0 
      });
    }

    console.log(`📋 [CRON] Found ${orders.length} unsynced order(s)`);

    let syncedCount = 0;
    let failedCount = 0;

    // Sync each order
    for (const order of orders) {
      try {
        console.log(`🔄 [CRON] Syncing order ${order.order_number}...`);

        // Transform order data for WooCommerce
        const orderData = {
          status: 'processing',
          set_paid: true,
          customer_id: 0,
          prices_include_tax: true, // NL standard - prices already include 21% VAT
          billing: {
            first_name: order.billing_first_name,
            last_name: order.billing_last_name,
            address_1: order.billing_address_1,
            city: order.billing_city,
            postcode: order.billing_postcode,
            country: order.billing_country || 'NL',
            email: order.customer_email,
            phone: order.customer_phone || '',
          },
          shipping: {
            first_name: order.shipping_first_name || order.billing_first_name,
            last_name: order.shipping_last_name || order.billing_last_name,
            address_1: order.shipping_address_1 || order.billing_address_1,
            city: order.shipping_city || order.billing_city,
            postcode: order.shipping_postcode || order.billing_postcode,
            country: order.shipping_country || order.billing_country || 'NL',
          },
          line_items: order.items.map((item: any) => ({
            product_id: item.woo_product_id,
            name: item.product_name,
            quantity: item.quantity,
            price: item.price.toString(),
            total: item.subtotal.toString(),
          })),
          shipping_lines: parseFloat(order.shipping_total || '0') > 0 ? [{
            method_id: 'flat_rate',
            method_title: 'Standaard verzending',
            total: order.shipping_total,
          }] : [],
          payment_method: 'mollie',
          payment_method_title: 'Mollie',
          transaction_id: order.mollie_payment_id,
          meta_data: [
            {
              key: '_bikerfun_order_id',
              value: order.id,
            },
            {
              key: '_bikerfun_order_number',
              value: order.order_number,
            },
            {
              key: '_mollie_payment_id',
              value: order.mollie_payment_id,
            },
            {
              key: '_send_order_email',
              value: 'true', // Trigger confirmation email
            },
          ],
        };

        // Create order in WooCommerce
        const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
        const response = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error(`❌ [CRON] Failed to sync ${order.order_number}: ${response.status}`);
          console.error(error.substring(0, 500));
          failedCount++;
          continue;
        }

        const wooOrder = await response.json();

        // Update Supabase with WooCommerce ID and sync flag
        await supabase
          .from('webshop_orders')
          .update({ 
            woo_order_id: wooOrder.id,
            synced_to_woo: true 
          })
          .eq('id', order.id);

        console.log(`✅ [CRON] Synced ${order.order_number} → WC Order ${wooOrder.id}`);
        syncedCount++;

      } catch (syncError) {
        console.error(`❌ [CRON] Error syncing ${order.order_number}:`, syncError);
        failedCount++;
      }
    }

    console.log(`🎉 [CRON] Sync complete: ${syncedCount} synced, ${failedCount} failed`);

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      failed: failedCount,
      total: orders.length,
    });

  } catch (error) {
    console.error('❌ [CRON] Fatal error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

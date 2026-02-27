import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

async function syncLatestUnsynced() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Finding latest unsynced paid order...\n');
    
    // Find latest paid order without WooCommerce ID
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('payment_status', 'paid')
      .is('woo_order_id', null)
      .order('paid_at', { ascending: false })
      .limit(5);

    if (error || !orders || orders.length === 0) {
      console.log('✅ No unsynced orders found!');
      console.log('   All paid orders are already synced to WooCommerce.');
      return;
    }

    console.log(`📋 Found ${orders.length} unsynced paid order(s):\n`);
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.order_number}`);
      console.log(`   Email: ${order.customer_email}`);
      console.log(`   Total: €${order.total}`);
      console.log(`   Paid at: ${order.paid_at}`);
      console.log('');
    });

    // Sync each one
    for (const order of orders) {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`🔄 Syncing ${order.order_number}...`);
      console.log('');

      const orderData = {
        status: 'processing',
        set_paid: true,
        customer_id: 0,
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
        ],
      };

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
        console.error(`❌ Failed: ${response.status}`);
        console.error(error.substring(0, 500));
        console.log('');
        continue; // Try next order
      }

      const wooOrder = await response.json();
      
      // Update Supabase with WooCommerce ID and synced flag
      await supabase
        .from('webshop_orders')
        .update({ 
          woo_order_id: wooOrder.id,
          synced_to_woo: true 
        })
        .eq('id', order.id);

      console.log(`✅ Synced! WooCommerce ID: ${wooOrder.id}`);
      console.log(`   URL: ${WC_URL}/wp-admin/post.php?post=${wooOrder.id}&action=edit`);
      console.log('');
    }

    console.log('🎉 All unsynced orders processed!');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

syncLatestUnsynced();

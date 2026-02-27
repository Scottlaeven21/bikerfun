import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

if (!supabaseUrl || !supabaseKey || !WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

async function manualSyncOrder(orderNumber: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log(`🔄 Manual sync for order ${orderNumber}...\n`);
    
    // Fetch order from Supabase
    const { data: order, error } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error || !order) {
      console.error('❌ Order not found:', error);
      return;
    }

    console.log('✅ Order found in Supabase');
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Email: ${order.customer_email}`);
    console.log(`   Total: €${order.total}`);
    console.log(`   Payment Status: ${order.payment_status}`);
    console.log(`   WooCommerce ID: ${order.woo_order_id || 'NULL'}`);
    console.log('');

    // Check if already synced
    if (order.woo_order_id) {
      console.log('⚠️  Order already has WooCommerce ID:', order.woo_order_id);
      console.log('   Skipping sync (already done)');
      return;
    }

    // Check payment status
    if (order.payment_status !== 'paid') {
      console.log('⚠️  Payment not confirmed yet');
      console.log(`   Payment Status: ${order.payment_status}`);
      console.log('   Cannot sync unpaid order to WooCommerce');
      return;
    }

    console.log('📤 Creating order in WooCommerce...\n');

    // Transform order data
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

    // Create in WooCommerce
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
      console.error('❌ WooCommerce API Error');
      console.error(`Status: ${response.status}`);
      console.error(`Response: ${error}`);
      return;
    }

    const wooOrder = await response.json();
    console.log('✅ Order created in WooCommerce!');
    console.log(`   WooCommerce Order ID: ${wooOrder.id}`);
    console.log('');

    // Update Supabase with WooCommerce ID and synced flag
    const { error: updateError } = await supabase
      .from('webshop_orders')
      .update({ 
        woo_order_id: wooOrder.id,
        synced_to_woo: true 
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('❌ Failed to update Supabase:', updateError);
      console.log('⚠️  Order exists in WooCommerce but Supabase not updated!');
      console.log(`   Manually set woo_order_id = ${wooOrder.id} for order ${order.id}`);
      return;
    }

    console.log('✅ Supabase updated with WooCommerce ID');
    console.log('');
    console.log('🎉 SYNC COMPLETE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Order ${orderNumber} successfully synced to WooCommerce`);
    console.log(`WooCommerce Order ID: ${wooOrder.id}`);
    console.log(`URL: ${WC_URL}/wp-admin/post.php?post=${wooOrder.id}&action=edit`);
    console.log('');
    console.log('📧 To send confirmation email:');
    console.log('1. Open the WooCommerce order URL above');
    console.log('2. Scroll to "Order Actions" dropdown');
    console.log('3. Select "Email invoice / order details to customer"');
    console.log('4. Click Update');
    
  } catch (error: any) {
    console.error('❌ Error during sync:', error.message || error);
  }
}

// Main
const orderNumber = process.argv[2];

if (!orderNumber) {
  console.error('❌ Please provide order number');
  console.log('Usage: npx tsx scripts/manual-sync-order.ts BF-1772197965169');
  process.exit(1);
}

manualSyncOrder(orderNumber);

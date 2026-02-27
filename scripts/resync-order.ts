import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('❌ Missing WooCommerce credentials');
  process.exit(1);
}

async function resyncOrder(wooOrderId: number) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log(`🔄 Re-syncing WooCommerce order ${wooOrderId}...\n`);
    
    // Step 1: Find Supabase order by woo_order_id
    console.log('📊 Step 1: Fetching order from Supabase...');
    const { data: supabaseOrder, error: fetchError } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('woo_order_id', wooOrderId)
      .single();

    if (fetchError || !supabaseOrder) {
      console.error('❌ Order not found in Supabase with woo_order_id:', wooOrderId);
      console.error('Error:', fetchError);
      return;
    }

    console.log(`✅ Found Supabase order: ${supabaseOrder.order_number}`);
    console.log(`   Order ID: ${supabaseOrder.id}`);
    console.log(`   Customer: ${supabaseOrder.billing_first_name} ${supabaseOrder.billing_last_name}`);
    console.log(`   Email: ${supabaseOrder.customer_email}`);
    console.log(`   Total: €${supabaseOrder.total}`);
    console.log('');

    // Step 2: Transform order data
    console.log('🔧 Step 2: Transforming order data...');
    const orderData = {
      billing_address: {
        firstName: supabaseOrder.billing_first_name,
        lastName: supabaseOrder.billing_last_name,
        street: supabaseOrder.billing_address_1?.split(' ')[0] || '',
        houseNumber: supabaseOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
        city: supabaseOrder.billing_city,
        postalCode: supabaseOrder.billing_postcode,
        country: supabaseOrder.billing_country || 'NL',
      },
      shipping_address: {
        firstName: supabaseOrder.shipping_first_name || supabaseOrder.billing_first_name,
        lastName: supabaseOrder.shipping_last_name || supabaseOrder.billing_last_name,
        street: supabaseOrder.shipping_address_1?.split(' ')[0] || supabaseOrder.billing_address_1?.split(' ')[0] || '',
        houseNumber: supabaseOrder.shipping_address_1?.split(' ').slice(1).join(' ') || supabaseOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
        city: supabaseOrder.shipping_city || supabaseOrder.billing_city,
        postalCode: supabaseOrder.shipping_postcode || supabaseOrder.billing_postcode,
        country: supabaseOrder.shipping_country || supabaseOrder.billing_country || 'NL',
      },
      line_items: supabaseOrder.items.map((item: any) => ({
        product_id: item.woo_product_id,
        name: item.product_name,
        quantity: item.quantity,
        price: item.price.toString(),
        total: item.subtotal.toString(),
      })),
      shipping_lines: parseFloat(supabaseOrder.shipping_total || '0') > 0 ? [{
        method_id: 'flat_rate',
        method_title: 'Standaard verzending',
        total: supabaseOrder.shipping_total,
      }] : [],
    };

    console.log('✅ Order data transformed');
    console.log('');

    // Step 3: Update WooCommerce order
    console.log('📤 Step 3: Updating WooCommerce order...');
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    
    const updatePayload = {
      status: 'processing',
      set_paid: true,
      billing: {
        first_name: orderData.billing_address.firstName,
        last_name: orderData.billing_address.lastName,
        address_1: `${orderData.billing_address.street} ${orderData.billing_address.houseNumber}`.trim(),
        city: orderData.billing_address.city,
        postcode: orderData.billing_address.postalCode,
        country: orderData.billing_address.country,
        email: supabaseOrder.customer_email,
        phone: supabaseOrder.customer_phone || '',
      },
      shipping: {
        first_name: orderData.shipping_address.firstName,
        last_name: orderData.shipping_address.lastName,
        address_1: `${orderData.shipping_address.street} ${orderData.shipping_address.houseNumber}`.trim(),
        city: orderData.shipping_address.city,
        postcode: orderData.shipping_address.postalCode,
        country: orderData.shipping_address.country,
      },
      line_items: orderData.line_items,
      shipping_lines: orderData.shipping_lines,
    };

    console.log('Payload:', JSON.stringify(updatePayload, null, 2));
    console.log('');

    const response = await fetch(`${WC_URL}/wp-json/wc/v3/orders/${wooOrderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatePayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to update WooCommerce order');
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error(`Error: ${error}`);
      return;
    }

    const updatedOrder = await response.json();
    console.log('✅ WooCommerce order updated successfully!');
    console.log('');
    console.log('📦 Updated Order Info:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Order ID:     ${updatedOrder.id}`);
    console.log(`Status:       ${updatedOrder.status}`);
    console.log(`Customer:     ${updatedOrder.billing.first_name} ${updatedOrder.billing.last_name}`);
    console.log(`Email:        ${updatedOrder.billing.email}`);
    console.log(`Total:        €${updatedOrder.total}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // Step 4: Trigger email resend (optional)
    console.log('📧 Step 4: To resend the order email:');
    console.log(`   1. Go to: ${WC_URL}/wp-admin/post.php?post=${wooOrderId}&action=edit`);
    console.log(`   2. Scroll to "Order Actions" dropdown`);
    console.log(`   3. Select "Email invoice / order details to customer"`);
    console.log(`   4. Click Update`);
    console.log('');
    
    console.log('✅ Re-sync complete! Check WooCommerce admin to verify.');
    
  } catch (error) {
    console.error('❌ Error during re-sync:', error);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Please provide a WooCommerce order ID');
  console.log('Usage: npx tsx scripts/resync-order.ts <WOO_ORDER_ID>');
  console.log('Example: npx tsx scripts/resync-order.ts 3016');
  process.exit(1);
}

const wooOrderId = parseInt(args[0]);

if (isNaN(wooOrderId)) {
  console.error('❌ Invalid order ID. Must be a number.');
  process.exit(1);
}

resyncOrder(wooOrderId);

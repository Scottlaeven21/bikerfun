import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function simulatePaymentSuccess() {
  const orderId = 'edc78536-4a97-48de-9970-c99508fb6cae';
  
  console.log('💳 Simulating Payment Success...\n');
  console.log('═'.repeat(60));

  // Get the order
  const { data: order } = await supabase
    .from('webshop_orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (!order) {
    console.log('❌ Order not found!');
    return;
  }

  console.log(`📦 Order: ${order.order_number}`);
  console.log(`   Payment ID: ${order.mollie_payment_id}`);
  console.log(`   Current status: ${order.payment_status}`);

  // Simulate Mollie webhook by directly updating the order and triggering sync
  console.log('\n🔄 Step 1: Marking order as paid in Supabase...');
  
  const { error: updateError } = await supabase
    .from('webshop_orders')
    .update({
      payment_status: 'paid',
      status: 'processing',
    })
    .eq('id', orderId);

  if (updateError) {
    console.log('❌ Failed to update order:', updateError);
    return;
  }

  console.log('✅ Order marked as paid!');

  // Trigger sync to WooCommerce
  console.log('\n🔄 Step 2: Syncing order to WooCommerce...');
  
  const baseUrl = 'http://localhost:3002';
  
  try {
    // Call the webhook endpoint to trigger sync
    const { data: fullOrder } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (!fullOrder) {
      console.log('❌ Could not fetch full order');
      return;
    }

    console.log(`   Order has ${fullOrder.items?.length || 0} items`);

    // Import sync function
    const { syncOrderToWooCommerce } = await import('../lib/woocommerce/sync');

    const orderData = {
      id: fullOrder.id,
      order_number: fullOrder.order_number,
      customer_email: fullOrder.customer_email,
      customer_name: `${fullOrder.billing_first_name} ${fullOrder.billing_last_name}`,
      customer_phone: fullOrder.customer_phone,
      billing_address: {
        firstName: fullOrder.billing_first_name,
        lastName: fullOrder.billing_last_name,
        street: fullOrder.billing_address_1?.split(' ')[0] || '',
        houseNumber: fullOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
        city: fullOrder.billing_city,
        postalCode: fullOrder.billing_postcode,
        country: fullOrder.billing_country || 'NL',
      },
      shipping_address: {
        firstName: fullOrder.shipping_first_name || fullOrder.billing_first_name,
        lastName: fullOrder.shipping_last_name || fullOrder.billing_last_name,
        street: fullOrder.shipping_address_1?.split(' ')[0] || fullOrder.billing_address_1?.split(' ')[0] || '',
        houseNumber: fullOrder.shipping_address_1?.split(' ').slice(1).join(' ') || fullOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
        city: fullOrder.shipping_city || fullOrder.billing_city,
        postalCode: fullOrder.shipping_postcode || fullOrder.billing_postcode,
        country: fullOrder.shipping_country || fullOrder.billing_country || 'NL',
      },
      subtotal: parseFloat(fullOrder.subtotal),
      shipping_cost: parseFloat(fullOrder.shipping_total || '0'),
      tax: parseFloat(fullOrder.tax_total || '0'),
      total: parseFloat(fullOrder.total),
      items: fullOrder.items.map((item: any) => ({
        product_id: item.woo_product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.subtotal),
      })),
      mollie_payment_id: fullOrder.mollie_payment_id,
    };

    const wooOrderId = await syncOrderToWooCommerce(orderData);

    // Update Supabase with WooCommerce order ID
    await supabase
      .from('webshop_orders')
      .update({
        woo_order_id: wooOrderId,
        synced_to_woo: true,
      })
      .eq('id', orderId);

    console.log('✅ Order synced to WooCommerce!');
    console.log(`   WooCommerce Order ID: ${wooOrderId}`);

    // Final verification
    console.log('\n🔍 Step 3: Final Verification...');
    
    const { data: finalOrder } = await supabase
      .from('webshop_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    console.log('✅ Order Status:');
    console.log(`   Payment Status: ${finalOrder?.payment_status}`);
    console.log(`   Order Status: ${finalOrder?.status}`);
    console.log(`   WooCommerce ID: ${finalOrder?.woo_order_id}`);
    console.log(`   Synced: ${finalOrder?.synced_to_woo ? 'Yes' : 'No'}`);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ PAYMENT SIMULATION COMPLETE!\n');
    console.log('🔗 Links to verify:');
    console.log(`   Order Confirmation: ${baseUrl}/order-confirmation/${orderId}`);
    console.log(`   Admin Dashboard: ${baseUrl}/admin/orders`);
    console.log(`   WooCommerce: ${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${wooOrderId}&action=edit`);

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

simulatePaymentSuccess();

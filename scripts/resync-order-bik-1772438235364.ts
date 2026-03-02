import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { syncOrderToWooCommerce } from '../lib/woocommerce/sync';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resyncOrder() {
  const orderNumber = 'BF-1772438235364';
  console.log(`🔄 Re-syncing Order ${orderNumber} to WooCommerce...\n`);

  // Fetch the order from Supabase
  const { data: order, error } = await supabase
    .from('webshop_orders')
    .select(`
      *,
      items:webshop_order_items(*)
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error || !order) {
    console.error('❌ Order not found in Supabase:', error);
    return;
  }

  console.log('✅ Order found in Supabase:');
  console.log(`   Order Number: ${order.order_number}`);
  console.log(`   Customer: ${order.billing_first_name} ${order.billing_last_name}`);
  console.log(`   Email: ${order.customer_email}`);
  console.log(`   Address: ${order.billing_address_1}, ${order.billing_city}`);
  console.log(`   Total: €${order.total}`);
  console.log(`   Current WooCommerce ID: ${order.woo_order_id || 'None'}`);
  console.log(`   Items: ${order.items.length}`);
  console.log('');

  // Transform order data
  const orderData = {
    id: order.id,
    order_number: order.order_number,
    customer_email: order.customer_email,
    customer_name: `${order.billing_first_name} ${order.billing_last_name}`,
    customer_phone: order.customer_phone,
    billing_address: {
      firstName: order.billing_first_name,
      lastName: order.billing_last_name,
      street: order.billing_address_1?.split(' ')[0] || '',
      houseNumber: order.billing_address_1?.split(' ').slice(1).join(' ') || '',
      city: order.billing_city,
      postalCode: order.billing_postcode,
      country: order.billing_country || 'NL',
    },
    shipping_address: {
      firstName: order.shipping_first_name || order.billing_first_name,
      lastName: order.shipping_last_name || order.billing_last_name,
      street: order.shipping_address_1?.split(' ')[0] || order.billing_address_1?.split(' ')[0] || '',
      houseNumber: order.shipping_address_1?.split(' ').slice(1).join(' ') || order.billing_address_1?.split(' ').slice(1).join(' ') || '',
      city: order.shipping_city || order.billing_city,
      postalCode: order.shipping_postcode || order.billing_postcode,
      country: order.shipping_country || order.billing_country || 'NL',
    },
    subtotal: parseFloat(order.subtotal),
    shipping_cost: parseFloat(order.shipping_total || '0'),
    tax: parseFloat(order.tax_total || '0'),
    total: parseFloat(order.total),
    items: order.items.map((item: any) => ({
      product_id: item.woo_product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.subtotal),
    })),
    mollie_payment_id: order.mollie_payment_id || 'manual-resync',
  };

  console.log('📤 Sending order to WooCommerce...');
  console.log('   Order Data:');
  console.log(JSON.stringify(orderData, null, 2));
  console.log('');

  try {
    const wooOrderId = await syncOrderToWooCommerce(orderData);
    
    console.log('');
    console.log(`✅ Order successfully synced to WooCommerce!`);
    console.log(`   New WooCommerce Order ID: ${wooOrderId}`);
    console.log(`   Previous WooCommerce ID: ${order.woo_order_id || 'None'}`);
    
    // Update Supabase with new WooCommerce ID
    await supabase
      .from('webshop_orders')
      .update({ 
        woo_order_id: wooOrderId,
        synced_to_woo: true 
      })
      .eq('id', order.id);
    
    console.log('');
    console.log('✅ Supabase updated with new WooCommerce ID');
    console.log('');
    console.log(`🔗 View order in WooCommerce:`);
    console.log(`   ${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${wooOrderId}&action=edit`);
    
  } catch (error: any) {
    console.error('');
    console.error('❌ Error syncing order:', error.message);
    console.error('   Full error:', error);
  }
}

resyncOrder();

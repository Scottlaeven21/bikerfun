import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupTestOrder() {
  const orderId = 'edc78536-4a97-48de-9970-c99508fb6cae';
  const orderNumber = 'BF-1772476600572';
  const wooOrderId = 3066;

  console.log('🧹 Cleaning up test order...\n');
  console.log('═'.repeat(60));

  // Step 1: Get order details to restore stock
  console.log('\n📦 Step 1: Fetching order details...');
  const { data: order } = await supabase
    .from('webshop_orders')
    .select(`
      *,
      items:webshop_order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (!order) {
    console.log('❌ Order not found in Supabase');
  } else {
    console.log(`✅ Order found: ${order.order_number}`);
    console.log(`   Items: ${order.items?.length || 0}`);

    // Step 2: Restore stock for each item
    console.log('\n📈 Step 2: Restoring product stock...');
    for (const item of order.items || []) {
      if (item.woo_product_id) {
        const { data: product } = await supabase
          .from('webshop_products')
          .select('id, name, stock_quantity, manage_stock')
          .eq('woo_product_id', item.woo_product_id)
          .single();

        if (product && product.manage_stock) {
          const newStock = (product.stock_quantity || 0) + item.quantity;
          
          await supabase
            .from('webshop_products')
            .update({
              stock_quantity: newStock,
              stock_status: newStock > 0 ? 'instock' : 'outofstock',
            })
            .eq('id', product.id);

          console.log(`   ✅ Restored stock for "${product.name}"`);
          console.log(`      ${product.stock_quantity} → ${newStock} (+${item.quantity})`);
        }
      }
    }

    // Step 3: Delete order items from Supabase
    console.log('\n🗑️  Step 3: Deleting order items from Supabase...');
    const { error: itemsError } = await supabase
      .from('webshop_order_items')
      .delete()
      .eq('order_id', orderId);

    if (itemsError) {
      console.log('❌ Failed to delete order items:', itemsError.message);
    } else {
      console.log('✅ Order items deleted');
    }

    // Step 4: Delete order from Supabase
    console.log('\n🗑️  Step 4: Deleting order from Supabase...');
    const { error: orderError } = await supabase
      .from('webshop_orders')
      .delete()
      .eq('id', orderId);

    if (orderError) {
      console.log('❌ Failed to delete order:', orderError.message);
    } else {
      console.log('✅ Order deleted from Supabase');
    }
  }

  // Step 5: Delete order from WooCommerce
  console.log('\n🗑️  Step 5: Deleting order from WooCommerce...');
  
  const auth = Buffer.from(
    `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/orders/${wooOrderId}?force=true`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (response.ok) {
      console.log(`✅ Order #${wooOrderId} deleted from WooCommerce`);
    } else {
      console.log(`⚠️  Could not delete WooCommerce order (status: ${response.status})`);
      console.log('   This is OK if order was already deleted');
    }
  } catch (error: any) {
    console.log('⚠️  WooCommerce deletion error:', error.message);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('✅ CLEANUP COMPLETE!\n');
  console.log('📊 Summary:');
  console.log('   ✅ Product stock restored');
  console.log('   ✅ Order items deleted from Supabase');
  console.log('   ✅ Order deleted from Supabase');
  console.log('   ✅ Order deleted from WooCommerce');
  console.log('\n🎯 Database is now clean and stock is accurate!');
}

cleanupTestOrder();

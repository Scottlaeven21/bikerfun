import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLatestSyncedOrder() {
  console.log('🔍 Checking Latest Synced Orders in Supabase...\n');

  const { data: orders, error } = await supabase
    .from('webshop_orders')
    .select(`
      id,
      order_number,
      customer_email,
      billing_first_name,
      billing_last_name,
      billing_address_1,
      billing_city,
      total,
      payment_status,
      woo_order_id,
      synced_to_woo,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Error fetching orders:', error);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log('❌ No orders found');
    return;
  }

  console.log(`📋 Latest ${orders.length} Orders:\n`);

  for (const order of orders) {
    console.log(`Order: #${order.order_number}`);
    console.log(`  ID: ${order.id.slice(0, 8)}...`);
    console.log(`  Customer: ${order.billing_first_name} ${order.billing_last_name} (${order.customer_email})`);
    console.log(`  Address: ${order.billing_address_1 || 'MISSING'}, ${order.billing_city || 'MISSING'}`);
    console.log(`  Total: €${order.total}`);
    console.log(`  Payment: ${order.payment_status}`);
    console.log(`  WooCommerce ID: ${order.woo_order_id || 'Not synced'}`);
    console.log(`  Synced: ${order.synced_to_woo ? 'Yes' : 'No'}`);
    console.log(`  Created: ${new Date(order.created_at).toLocaleString('nl-NL')}`);
    
    // Check for issues
    const issues = [];
    if (!order.billing_first_name || !order.billing_last_name) {
      issues.push('Missing billing name');
    }
    if (!order.billing_address_1) {
      issues.push('Missing billing address');
    }
    if (order.woo_order_id && !order.synced_to_woo) {
      issues.push('Has WooCommerce ID but synced flag is false');
    }
    
    if (issues.length > 0) {
      console.log(`  ⚠️  Issues: ${issues.join(', ')}`);
    }
    
    console.log('');
  }

  // Check for paid orders that are NOT synced
  const { data: unsyncedOrders } = await supabase
    .from('webshop_orders')
    .select('id, order_number, total, payment_status, woo_order_id')
    .eq('payment_status', 'paid')
    .is('woo_order_id', null);

  if (unsyncedOrders && unsyncedOrders.length > 0) {
    console.log(`\n⚠️  Found ${unsyncedOrders.length} paid orders NOT synced to WooCommerce:`);
    unsyncedOrders.forEach((order: any) => {
      console.log(`   - #${order.order_number} (€${order.total})`);
    });
  } else {
    console.log('\n✅ All paid orders are synced to WooCommerce!');
  }
}

checkLatestSyncedOrder();

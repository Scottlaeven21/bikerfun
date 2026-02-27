import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function checkRecentOrders() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('📊 Fetching recent orders from Supabase...\n');
    
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    if (!orders || orders.length === 0) {
      console.log('📭 No orders found in Supabase');
      return;
    }

    console.log(`✅ Found ${orders.length} recent orders:\n`);
    console.log('Recent Orders:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Order Number        | WC ID | Email                 | Total  | Status   | Created');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    orders.forEach((order: any) => {
      const orderNum = String(order.order_number || 'N/A').padEnd(18);
      const wooId = String(order.woo_order_id || 'NULL').padEnd(5);
      const email = String(order.customer_email || 'N/A').padEnd(20);
      const total = `€${order.total}`.padEnd(7);
      const status = String(order.status || 'N/A').padEnd(8);
      const created = order.created_at?.substring(0, 16).replace('T', ' ') || 'N/A';
      
      console.log(`${orderNum} | ${wooId} | ${email} | ${total} | ${status} | ${created}`);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Check for duplicate woo_order_ids
    const wooIds = orders.map(o => o.woo_order_id).filter(id => id !== null);
    const duplicates = wooIds.filter((id, index) => wooIds.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      console.log('⚠️  WARNING: Duplicate WooCommerce Order IDs found:');
      duplicates.forEach(id => {
        const dupeOrders = orders.filter(o => o.woo_order_id === id);
        console.log(`\n   WooCommerce ID ${id} is used by ${dupeOrders.length} orders:`);
        dupeOrders.forEach(o => {
          console.log(`   - ${o.order_number} (${o.customer_email}) - ${o.created_at}`);
        });
      });
      console.log('');
    }
    
    // Show detailed info for latest order
    const latest = orders[0];
    console.log('📦 Latest Order Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Order Number:        ${latest.order_number}`);
    console.log(`Supabase ID:         ${latest.id}`);
    console.log(`WooCommerce ID:      ${latest.woo_order_id || 'NULL'}`);
    console.log(`Customer Email:      ${latest.customer_email}`);
    console.log(`Customer Phone:      ${latest.customer_phone || 'N/A'}`);
    console.log(`Billing Name:        ${latest.billing_first_name} ${latest.billing_last_name}`);
    console.log(`Billing Address:     ${latest.billing_address_1}`);
    console.log(`Billing City:        ${latest.billing_city}`);
    console.log(`Billing Postcode:    ${latest.billing_postcode}`);
    console.log(`Billing Country:     ${latest.billing_country}`);
    console.log(`Shipping Name:       ${latest.shipping_first_name || 'N/A'} ${latest.shipping_last_name || 'N/A'}`);
    console.log(`Shipping Address:    ${latest.shipping_address_1 || 'N/A'}`);
    console.log(`Subtotal:            €${latest.subtotal}`);
    console.log(`Shipping:            €${latest.shipping_total}`);
    console.log(`Total:               €${latest.total}`);
    console.log(`Status:              ${latest.status}`);
    console.log(`Payment Status:      ${latest.payment_status || 'N/A'}`);
    console.log(`Mollie Payment ID:   ${latest.mollie_payment_id || 'N/A'}`);
    console.log(`Created At:          ${latest.created_at}`);
    console.log(`Paid At:             ${latest.paid_at || 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkRecentOrders();

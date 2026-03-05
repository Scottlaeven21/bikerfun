/**
 * Debug script to check why orders aren't showing in account page
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAccountOrders() {
  console.log('🔍 Debugging Account Orders...\n');

  // 1. Check user email
  const testEmail = 'scottlaeven@hotmail.com';
  console.log(`📧 Checking for orders with email: ${testEmail}\n`);

  // 2. Get ALL orders from webshop_orders (no filters)
  const { data: allOrders, error: allOrdersError } = await supabase
    .from('webshop_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (allOrdersError) {
    console.error('❌ Error fetching all orders:', allOrdersError);
  } else {
    console.log(`📦 Total orders in webshop_orders: ${allOrders?.length || 0}`);
    
    if (allOrders && allOrders.length > 0) {
      console.log('\n📋 Recent orders:');
      allOrders.forEach((order: any) => {
        console.log(`  - Order ${order.order_number}`);
        console.log(`    Email: ${order.customer_email}`); // FIXED: was order.email, should be customer_email
        console.log(`    Payment Status: ${order.payment_status}`);
        console.log(`    Total: €${order.total}`); // FIXED: was total_amount, should be total
        console.log(`    Created: ${new Date(order.created_at).toLocaleString('nl-NL')}`);
        console.log('');
      });
    }
  }

  // 3. Get orders for specific email
  const { data: userOrders, error: userOrdersError } = await supabase
    .from('webshop_orders')
    .select('*')
    .eq('customer_email', testEmail)
    .order('created_at', { ascending: false });

  console.log(`\n🔎 Orders for ${testEmail}:`);
  if (userOrdersError) {
    console.error('❌ Error:', userOrdersError);
  } else {
    console.log(`  Total: ${userOrders?.length || 0}`);
    userOrders?.forEach((order: any) => {
      console.log(`  - ${order.order_number} | ${order.payment_status} | €${order.total}`);
    });
  }

  // 4. Get only PAID orders for specific email (what account page does)
  const { data: paidOrders, error: paidOrdersError } = await supabase
    .from('webshop_orders')
    .select('*')
    .eq('customer_email', testEmail)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false });

  console.log(`\n✅ PAID orders for ${testEmail} (what account page shows):`);
  if (paidOrdersError) {
    console.error('❌ Error:', paidOrdersError);
  } else {
    console.log(`  Total: ${paidOrders?.length || 0}`);
    paidOrders?.forEach((order: any) => {
      console.log(`  - ${order.order_number} | €${order.total}`);
    });
  }

  // 5. Check auth.users to see if email matches
  const { data: authUser } = await supabase.auth.admin.listUsers();
  const user = authUser.users.find(u => u.email === testEmail);
  
  console.log(`\n👤 Auth user check:`);
  if (user) {
    console.log(`  ✅ User exists in auth.users`);
    console.log(`  Email: ${user.email}`);
    console.log(`  ID: ${user.id}`);
  } else {
    console.log(`  ❌ No user found with email ${testEmail}`);
  }

  console.log('\n✅ Debug complete!');
}

debugAccountOrders().catch(console.error);

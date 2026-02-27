import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkSyncedColumn() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔍 Checking synced_to_woo column...\n');
    
    // Get latest orders with synced_to_woo column
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select('order_number, woo_order_id, synced_to_woo, payment_status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log('📋 Recent Orders:\n');
    orders?.forEach(order => {
      console.log(`Order: ${order.order_number}`);
      console.log(`  WC ID: ${order.woo_order_id || 'NULL'}`);
      console.log(`  Synced: ${order.synced_to_woo}`);
      console.log(`  Payment: ${order.payment_status}`);
      console.log('');
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

checkSyncedColumn();

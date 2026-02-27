import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function fixSyncedFlag() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('🔧 Fixing synced_to_woo flag for orders with WooCommerce ID...\n');
    
    // Find all orders that have woo_order_id but synced_to_woo = false
    const { data: orders, error: fetchError } = await supabase
      .from('webshop_orders')
      .select('id, order_number, woo_order_id, synced_to_woo')
      .not('woo_order_id', 'is', null)
      .eq('synced_to_woo', false);

    if (fetchError) {
      console.error('❌ Error fetching orders:', fetchError.message);
      return;
    }

    if (!orders || orders.length === 0) {
      console.log('✅ No orders to fix - all are correctly synced!');
      return;
    }

    console.log(`📋 Found ${orders.length} order(s) to fix:\n`);
    orders.forEach(order => {
      console.log(`  - ${order.order_number} (WC ID: ${order.woo_order_id})`);
    });
    console.log('');

    // Update all at once
    const { error: updateError } = await supabase
      .from('webshop_orders')
      .update({ synced_to_woo: true })
      .not('woo_order_id', 'is', null)
      .eq('synced_to_woo', false);

    if (updateError) {
      console.error('❌ Error updating orders:', updateError.message);
      return;
    }

    console.log('✅ Successfully updated synced_to_woo = true for all orders with WooCommerce ID!\n');
    
    // Verify
    const { data: verified } = await supabase
      .from('webshop_orders')
      .select('order_number, woo_order_id, synced_to_woo')
      .not('woo_order_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log('🔍 Verification - Latest synced orders:\n');
    verified?.forEach(order => {
      const icon = order.synced_to_woo ? '✅' : '❌';
      console.log(`${icon} ${order.order_number} (WC ID: ${order.woo_order_id}) → synced: ${order.synced_to_woo}`);
    });
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

fixSyncedFlag();

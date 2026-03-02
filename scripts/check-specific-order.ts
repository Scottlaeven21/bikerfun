import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkOrder() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: order, error } = await supabase
    .from('webshop_orders')
    .select('*')
    .eq('order_number', 'BF-1772438235364')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\n📦 Order BF-1772438235364 Details:\n');
  console.log('Order Number:', order.order_number);
  console.log('Status:', order.status);
  console.log('Payment Status:', order.payment_status);
  console.log('Paid At:', order.paid_at);
  console.log('WooCommerce ID:', order.woo_order_id);
  console.log('Synced to WooCommerce:', order.synced_to_woo);
  console.log('\n🔍 Sync Criteria Check:');
  console.log('- payment_status === "paid":', order.payment_status === 'paid');
  console.log('- woo_order_id === null:', order.woo_order_id === null);
  console.log('- Should sync:', order.payment_status === 'paid' && order.woo_order_id === null);
}

checkOrder();

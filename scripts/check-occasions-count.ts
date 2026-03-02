import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOccasions() {
  console.log('🏍️ Checking Occasions in Database...\n');

  const { data: occasions, error, count } = await supabase
    .from('occasions')
    .select('id, brand, model, price, woo_product_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`✅ Total Occasions: ${count || 0}\n`);
  
  if (occasions && occasions.length > 0) {
    console.log('📋 Latest 15 Occasions:');
    occasions.forEach((occ, i) => {
      console.log(`   ${i + 1}. ${occ.brand} ${occ.model} - €${occ.price} ${occ.woo_product_id ? `(WC: ${occ.woo_product_id})` : '(No WC ID)'}`);
    });
  } else {
    console.log('❌ No occasions found!');
  }

  // Check how many have woo_product_id
  const { count: syncedCount } = await supabase
    .from('occasions')
    .select('*', { count: 'exact', head: true })
    .not('woo_product_id', 'is', null);

  console.log(`\n📊 Sync Status:`);
  console.log(`   Synced (have woo_product_id): ${syncedCount || 0}`);
  console.log(`   Not synced: ${(count || 0) - (syncedCount || 0)}`);
}

checkOccasions();

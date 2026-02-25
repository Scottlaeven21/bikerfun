/**
 * Check what's in the occasions table
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOccasions() {
  console.log('Checking occasions table...\n');
  
  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Total occasions: ${occasions?.length || 0}\n`);
  
  occasions?.forEach((occasion, index) => {
    console.log(`${index + 1}. ${occasion.brand} ${occasion.model} - €${occasion.price}`);
    if (occasion.price < 100) {
      console.log('   ⚠️  WARNING: Low price - might be a webshop product!');
    }
  });
  
  // Check for potential webshop products (low price items)
  const lowPriceItems = occasions?.filter(o => o.price < 100) || [];
  if (lowPriceItems.length > 0) {
    console.log(`\n⚠️  Found ${lowPriceItems.length} items with price < €100`);
    console.log('These might be webshop products that should be moved!\n');
    lowPriceItems.forEach(item => {
      console.log(`- ${item.brand} ${item.model} (€${item.price}) - ID: ${item.id}`);
    });
  }
}

checkOccasions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

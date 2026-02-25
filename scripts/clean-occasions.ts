/**
 * Remove webshop products from occasions table
 * (Items with price < €100 are not real occasions)
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanOccasions() {
  console.log('Cleaning occasions table...\n');
  
  // Find items with price < €100 (these are webshop products)
  const { data: lowPriceItems, error: fetchError } = await supabase
    .from('occasions')
    .select('*')
    .lt('price', 100);
  
  if (fetchError) {
    console.error('Error fetching:', fetchError);
    return;
  }
  
  console.log(`Found ${lowPriceItems?.length || 0} webshop products in occasions table\n`);
  
  if (!lowPriceItems || lowPriceItems.length === 0) {
    console.log('No items to clean!');
    return;
  }
  
  // Show what will be deleted
  lowPriceItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.brand} ${item.model} - €${item.price} (ID: ${item.id})`);
  });
  
  console.log('\nDeleting these items...');
  
  // Delete items with price < €100
  const { error: deleteError } = await supabase
    .from('occasions')
    .delete()
    .lt('price', 100);
  
  if (deleteError) {
    console.error('Error deleting:', deleteError);
    return;
  }
  
  console.log(`\nSuccessfully deleted ${lowPriceItems.length} webshop products from occasions table!`);
  
  // Show remaining occasions
  const { data: remaining, error: countError } = await supabase
    .from('occasions')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    console.error('Error counting:', countError);
    return;
  }
  
  console.log(`Remaining occasions in database: ${remaining || 0}`);
}

cleanOccasions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupDuplicateProducts() {
  console.log('🧹 Starting cleanup of duplicate products...\n');

  // First, check how many products we have
  const { data: allProducts, error: countError } = await supabase
    .from('webshop_products')
    .select('id, name, woo_product_id, sku');

  if (countError) {
    console.error('❌ Error fetching products:', countError);
    return;
  }

  console.log(`📊 Total products in database: ${allProducts?.length || 0}`);

  const productsWithWooId = allProducts?.filter(p => p.woo_product_id !== null) || [];
  const productsWithoutWooId = allProducts?.filter(p => p.woo_product_id === null) || [];

  console.log(`✅ Products from WooCommerce sync (have woo_product_id): ${productsWithWooId.length}`);
  console.log(`❌ Products from CSV import (no woo_product_id): ${productsWithoutWooId.length}\n`);

  if (productsWithoutWooId.length === 0) {
    console.log('✨ No duplicate products to clean up!');
    return;
  }

  console.log('🗑️  Products to be deleted (CSV imports):');
  productsWithoutWooId.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.name} (ID: ${p.id.slice(0, 8)}...)`);
  });

  console.log('\n⚠️  Deleting products without woo_product_id...');

  // Delete products without woo_product_id
  const { error: deleteError } = await supabase
    .from('webshop_products')
    .delete()
    .is('woo_product_id', null);

  if (deleteError) {
    console.error('❌ Error deleting products:', deleteError);
    return;
  }

  console.log(`\n✅ Successfully deleted ${productsWithoutWooId.length} duplicate products!`);
  console.log(`✨ Remaining products (from WooCommerce): ${productsWithWooId.length}`);
}

cleanupDuplicateProducts()
  .then(() => {
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  });

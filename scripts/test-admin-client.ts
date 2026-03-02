/**
 * Test Admin Client - Verify service role key bypasses RLS
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local explicitly
config({ path: resolve(process.cwd(), '.env.local') });

import { createAdminClient } from '../lib/supabase/admin';

async function testAdminClient() {
  console.log('🧪 Testing Admin Client...\n');

  try {
    const supabase = createAdminClient();

    // Test 1: Try to insert a test product
    console.log('Test 1: Insert test product...');
    const { data: insertData, error: insertError } = await supabase
      .from('webshop_products')
      .insert({
        woo_product_id: 99999,
        sku: 'TEST-SKU-99999',
        name: 'Test Product - DELETE ME',
        slug: 'test-product-99999',
        price: 10.00,
        regular_price: 10.00,
        stock_status: 'instock',
        categories: ['Test'],
        tags: [],
        images: [],
        status: 'draft',
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      return;
    }

    console.log('✅ Insert successful:', insertData);

    // Test 2: Clean up - delete test product
    console.log('\nTest 2: Delete test product...');
    const { error: deleteError } = await supabase
      .from('webshop_products')
      .delete()
      .eq('woo_product_id', 99999);

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError);
      return;
    }

    console.log('✅ Delete successful');

    // Test 3: Check if we can query all products
    console.log('\nTest 3: Query all products...');
    const { data: products, error: queryError } = await supabase
      .from('webshop_products')
      .select('woo_product_id, name')
      .limit(5);

    if (queryError) {
      console.error('❌ Query failed:', queryError);
      return;
    }

    console.log(`✅ Query successful: Found ${products?.length || 0} products`);

    console.log('\n✅ All tests passed! Admin client works correctly.');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAdminClient();

import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function importTestProduct() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('📥 Importing test product to Supabase...\n');
    
    // Product details from WooCommerce (ID: 3048)
    const productData = {
      woo_product_id: 3048,
      name: 'TEST PRODUCT - €0.01 - DO NOT ORDER',
      slug: 'test-product-e0-01-do-not-order',
      price: '0.01',
      regular_price: '0.01',
      description: 'Dit is een test product voor het testen van bestellingen. NIET BESTELLEN voor echte aankoop!',
      short_description: 'Test product - €0.01',
      sku: 'TEST-1772200062045',
      stock_status: 'instock',
      manage_stock: false,
      stock_quantity: null,
      images: [],
    };

    const { data, error } = await supabase
      .from('webshop_products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log('⚠️  Product already exists in Supabase!');
        
        // Update instead
        const { data: updated, error: updateError } = await supabase
          .from('webshop_products')
          .update(productData)
          .eq('woo_product_id', 3048)
          .select()
          .single();
        
        if (updateError) {
          console.error('❌ Failed to update:', updateError.message);
          return;
        }
        
        console.log('✅ Product updated in Supabase!');
        console.log(`   Supabase ID: ${updated.id}`);
      } else {
        console.error('❌ Failed to import:', error.message);
        return;
      }
    } else {
      console.log('✅ Product imported to Supabase!');
      console.log(`   Supabase ID: ${data.id}`);
    }

    console.log('');
    console.log('🎉 TEST PRODUCT READY TO USE!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Product: TEST PRODUCT - €0.01');
    console.log('Price: €0.01 (+ gratis verzending in NL)');
    console.log('Website: https://bikerfun.nl/products');
    console.log('');
    console.log('🧪 To test checkout:');
    console.log('1. Go to: bikerfun.nl/products');
    console.log('2. Search for "TEST PRODUCT"');
    console.log('3. Add to cart');
    console.log('4. Checkout → pay only €0.01!');
    console.log('5. Check if auto-sync works');
    console.log('');
    console.log('📊 After payment, check:');
    console.log('   npx tsx scripts/check-supabase-orders.ts');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

importTestProduct();

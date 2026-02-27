import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function createTestProduct() {
  try {
    console.log('🧪 Creating test product in WooCommerce...\n');
    
    // Create product in WooCommerce
    const productData = {
      name: 'TEST PRODUCT - €0.01 - DO NOT ORDER',
      type: 'simple',
      regular_price: '0.01',
      description: 'Dit is een test product voor het testen van bestellingen. NIET BESTELLEN voor echte aankoop!',
      short_description: 'Test product - €0.01',
      sku: `TEST-${Date.now()}`,
      manage_stock: false,
      stock_status: 'instock',
      catalog_visibility: 'visible',
      status: 'publish',
      categories: [
        {
          name: 'Test Products'
        }
      ],
    };

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    
    const response = await fetch(`${WC_URL}/wp-json/wc/v3/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Failed to create product in WooCommerce');
      console.error(`Status: ${response.status}`);
      console.error(error);
      return;
    }

    const wooProduct = await response.json();
    console.log('✅ Product created in WooCommerce!');
    console.log(`   WooCommerce ID: ${wooProduct.id}`);
    console.log(`   Name: ${wooProduct.name}`);
    console.log(`   Price: €${wooProduct.price}`);
    console.log(`   SKU: ${wooProduct.sku}`);
    console.log(`   URL: ${WC_URL}/wp-admin/post.php?post=${wooProduct.id}&action=edit`);
    console.log('');

    // Import to Supabase
    console.log('📥 Importing to Supabase...');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('webshop_products')
      .insert({
        woo_product_id: wooProduct.id,
        name: wooProduct.name,
        slug: wooProduct.slug,
        price: wooProduct.price,
        description: wooProduct.description,
        short_description: wooProduct.short_description,
        sku: wooProduct.sku,
        stock_status: wooProduct.stock_status,
        manage_stock: wooProduct.manage_stock,
        stock_quantity: wooProduct.stock_quantity,
        category: 'Test Products',
        images: wooProduct.images?.map((img: any) => img.src) || [],
        is_featured: false,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to import to Supabase:', error.message);
      console.log('⚠️  Product exists in WooCommerce but not in Supabase');
      console.log('   You can still use it, but it won\'t show on the website');
      return;
    }

    console.log('✅ Product imported to Supabase!');
    console.log(`   Supabase ID: ${data.id}`);
    console.log('');
    console.log('🎉 TEST PRODUCT READY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Product: ${wooProduct.name}`);
    console.log(`Price: €0.01`);
    console.log(`Website URL: https://bikerfun.nl/products`);
    console.log('');
    console.log('🧪 To test checkout:');
    console.log('1. Go to bikerfun.nl/products');
    console.log('2. Find "TEST PRODUCT"');
    console.log('3. Add to cart');
    console.log('4. Checkout (only pay €0.01!)');
    console.log('5. Check if order syncs to WooCommerce automatically');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

createTestProduct();

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugProductImages() {
  console.log('🔍 Debugging product images...\n');

  // Get first 3 products
  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, slug, images, price, stock_status')
    .eq('status', 'publish')
    .limit(3);

  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📦 Found ${products?.length || 0} products\n`);

  products?.forEach((product, index) => {
    console.log(`\n${index + 1}. ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Price: €${product.price}`);
    console.log(`   Stock: ${product.stock_status}`);
    console.log(`   Images:`, JSON.stringify(product.images, null, 2));
    
    if (product.images && Array.isArray(product.images)) {
      console.log(`   ✅ Has ${product.images.length} images`);
      if (product.images[0]) {
        console.log(`   First image URL: ${product.images[0].src || product.images[0]}`);
      }
    } else {
      console.log(`   ❌ No images or wrong format`);
    }
  });

  console.log('\n✅ Debug complete');
}

debugProductImages();

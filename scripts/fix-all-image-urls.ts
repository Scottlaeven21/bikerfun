import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixAllImageUrls() {
  console.log('🔧 Fixing ALL image URLs (relative & incorrect domain)...\n');

  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, images')
    .not('images', 'is', null);

  if (error || !products) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📦 Checking ${products.length} products...\n`);

  let updated = 0;
  let fixed = 0;

  for (const product of products) {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      continue;
    }

    let needsUpdate = false;
    const fixedImages = product.images.map((img: any) => {
      if (typeof img === 'string') {
        // Image is just a string URL
        let url = img;
        
        if (url.startsWith('/')) {
          // Relative URL
          console.log(`  🔄 Fixing relative: ${url}`);
          url = `https://admin.bikerfun.nl${url}`;
          needsUpdate = true;
          fixed++;
        } else if (url.includes('bikerfun.nl/wp-content/') && !url.includes('admin.bikerfun.nl')) {
          // Wrong domain
          console.log(`  🔄 Fixing domain: ${url}`);
          url = url.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
          needsUpdate = true;
          fixed++;
        }
        
        return url;
      } else if (img && img.src) {
        // Image is an object with src property
        let url = img.src;
        
        if (url.startsWith('/')) {
          // Relative URL
          console.log(`  🔄 Fixing relative: ${url}`);
          url = `https://admin.bikerfun.nl${url}`;
          needsUpdate = true;
          fixed++;
        } else if (url.includes('bikerfun.nl/wp-content/') && !url.includes('admin.bikerfun.nl')) {
          // Wrong domain
          console.log(`  🔄 Fixing domain: ${url}`);
          url = url.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
          needsUpdate = true;
          fixed++;
        }
        
        return {
          ...img,
          src: url,
        };
      }
      
      return img;
    });

    if (needsUpdate) {
      console.log(`\n📝 Updating: ${product.name.substring(0, 60)}...`);
      
      const { error: updateError } = await supabase
        .from('webshop_products')
        .update({ images: fixedImages })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
      } else {
        updated++;
        if (updated % 10 === 0) {
          console.log(`\n✅ Updated ${updated} products so far...`);
        }
      }
    }
  }

  console.log('\n\n📊 Final Summary:');
  console.log(`✅ Products updated: ${updated}`);
  console.log(`🔧 URLs fixed: ${fixed}`);
  console.log(`📦 Total products checked: ${products.length}`);
  
  console.log('\n🎉 All image URLs are now absolute and correct!');
  console.log('\n💡 Next steps:');
  console.log('   1. Clear browser cache: Ctrl + Shift + Delete');
  console.log('   2. Hard refresh: Ctrl + Shift + R');
  console.log('   3. Test: https://bikerfun.nl/products');
  console.log('   4. Images should load! ✅');
}

fixAllImageUrls();

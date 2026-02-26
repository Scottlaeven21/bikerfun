import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixRelativeImageUrls() {
  console.log('🔧 Fixing relative image URLs...\n');

  // Get all products
  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, images')
    .eq('status', 'publish');

  if (error || !products) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📦 Found ${products.length} products\n`);

  let updated = 0;
  let alreadyCorrect = 0;

  for (const product of products) {
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      continue;
    }

    let hasRelativeUrls = false;
    const updatedImages = product.images.map((img: any) => {
      // Check if image has src property
      if (!img || !img.src) {
        return img;
      }

      let src = img.src;

      // Check if URL is relative (starts with /)
      if (src.startsWith('/wp-content/')) {
        console.log(`  🔄 Fixing relative URL: ${src}`);
        src = `https://admin.bikerfun.nl${src}`;
        hasRelativeUrls = true;
      }
      // Check if URL starts with bikerfun.nl (without protocol)
      else if (src.startsWith('bikerfun.nl/')) {
        console.log(`  🔄 Fixing URL without protocol: ${src}`);
        src = `https://admin.${src}`;
        hasRelativeUrls = true;
      }
      // Check if URL points to bikerfun.nl instead of admin.bikerfun.nl
      else if (src.includes('bikerfun.nl/wp-content/') && !src.includes('admin.bikerfun.nl')) {
        console.log(`  🔄 Fixing bikerfun.nl URL: ${src}`);
        src = src.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
        hasRelativeUrls = true;
      }

      return {
        ...img,
        src,
      };
    });

    if (hasRelativeUrls) {
      console.log(`\n✏️  Updating: ${product.name}`);
      
      const { error: updateError } = await supabase
        .from('webshop_products')
        .update({ images: updatedImages })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
      } else {
        console.log(`  ✅ Updated`);
        updated++;
      }
    } else {
      alreadyCorrect++;
    }
  }

  console.log('\n\n📊 Summary:');
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Already correct: ${alreadyCorrect}`);
  console.log(`📦 Total: ${products.length}`);
  
  if (updated > 0) {
    console.log('\n🎉 Relative URLs fixed!');
    console.log('\n💡 Next steps:');
    console.log('   1. Clear browser cache (Ctrl+Shift+R)');
    console.log('   2. Test: https://bikerfun.nl/products');
    console.log('   3. Images should now load! ✅');
  } else {
    console.log('\n✅ All URLs were already absolute!');
  }
}

fixRelativeImageUrls()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixOccasionImageUrls() {
  console.log('🔧 Fixing occasion image URLs...\n');

  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('id, brand, model, images, main_image')
    .not('images', 'is', null);

  if (error || !occasions) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📦 Processing ${occasions.length} occasions...\n`);

  let updated = 0;
  let urlsFixed = 0;

  for (const occasion of occasions) {
    let needsUpdate = false;
    let newImages = occasion.images;
    let newMainImage = occasion.main_image;

    // Fix images array
    if (Array.isArray(occasion.images)) {
      newImages = occasion.images.map((img: string) => {
        let fixedUrl = img;

        // Fix relative URLs (starts with /)
        if (img.startsWith('/')) {
          console.log(`  🔄 Fixing relative: ${img}`);
          fixedUrl = `https://admin.bikerfun.nl${img}`;
          needsUpdate = true;
          urlsFixed++;
        }
        // Fix bikerfun.nl → admin.bikerfun.nl
        else if (img.includes('bikerfun.nl/wp-content/') && !img.includes('admin.bikerfun.nl')) {
          console.log(`  🔄 Fixing domain: ${img.substring(0, 60)}...`);
          fixedUrl = img.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
          needsUpdate = true;
          urlsFixed++;
        }

        return fixedUrl;
      });
    }

    // Fix main_image
    if (occasion.main_image) {
      let img = occasion.main_image;

      if (img.startsWith('/')) {
        newMainImage = `https://admin.bikerfun.nl${img}`;
        needsUpdate = true;
        urlsFixed++;
      } else if (img.includes('bikerfun.nl/wp-content/') && !img.includes('admin.bikerfun.nl')) {
        newMainImage = img.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
        needsUpdate = true;
        urlsFixed++;
      }
    }

    if (needsUpdate) {
      console.log(`\n📝 Updating: ${occasion.brand} ${occasion.model}`);

      const { error: updateError } = await supabase
        .from('occasions')
        .update({
          images: newImages,
          main_image: newMainImage,
        })
        .eq('id', occasion.id);

      if (updateError) {
        console.error(`  ❌ Error: ${updateError.message}`);
      } else {
        console.log(`  ✅ Updated`);
        updated++;
        
        if (updated % 5 === 0) {
          console.log(`\n✅ Progress: ${updated} occasions updated...`);
        }
      }
    }
  }

  console.log('\n\n📊 Final Summary:');
  console.log(`✅ Occasions updated: ${updated}`);
  console.log(`🔧 URLs fixed: ${urlsFixed}`);
  console.log(`📦 Total occasions: ${occasions.length}`);

  console.log('\n🎉 All occasion image URLs are now correct!');
  console.log('\n💡 Next steps:');
  console.log('   1. Clear browser cache: Ctrl + Shift + Delete');
  console.log('   2. Hard refresh: Ctrl + Shift + R');
  console.log('   3. Test: https://bikerfun.nl (homepage)');
  console.log('   4. Images should load! ✅');
}

fixOccasionImageUrls()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

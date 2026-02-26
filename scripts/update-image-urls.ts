/**
 * Update Image URLs in Database
 * 
 * This script updates all product image URLs from:
 *   https://bikerfun.nl/wp-content/uploads/...
 * to:
 *   https://admin.bikerfun.nl/wp-content/uploads/...
 * 
 * Prerequisites:
 * - WordPress must be accessible at admin.bikerfun.nl
 * - Images must exist at admin.bikerfun.nl/wp-content/uploads/
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function updateImageUrls() {
  console.log('🔄 Starting image URL update...\n');
  
  // Step 1: Test if admin.bikerfun.nl images are accessible
  console.log('🔍 Testing image accessibility on admin.bikerfun.nl...');
  const testUrl = 'https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg';
  const isAccessible = await testImageAccessibility(testUrl);
  
  if (!isAccessible) {
    console.error('❌ ERROR: Images are not accessible at admin.bikerfun.nl');
    console.error('   Test URL:', testUrl);
    console.error('\n⚠️  Please ensure:');
    console.error('   1. WordPress is installed at admin.bikerfun.nl');
    console.error('   2. Images exist in /wp-content/uploads/');
    console.error('   3. The subdomain is properly configured');
    console.error('\n💡 Run this command to check:');
    console.error('   curl -I', testUrl);
    process.exit(1);
  }
  
  console.log('✅ Images are accessible at admin.bikerfun.nl\n');
  
  // Step 2: Fetch all products
  console.log('📦 Fetching products from database...');
  const { data: products, error: fetchError } = await supabase
    .from('webshop_products')
    .select('id, name, images');
  
  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError);
    process.exit(1);
  }
  
  console.log(`✅ Found ${products?.length || 0} products\n`);
  
  // Step 3: Update image URLs
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  console.log('🔄 Updating image URLs...\n');
  
  for (const product of products || []) {
    if (!product.images || product.images.length === 0) {
      skipped++;
      continue;
    }
    
    // Check if any image needs updating
    const needsUpdate = product.images.some((img: any) => 
      img.src && img.src.includes('bikerfun.nl/wp-content') && !img.src.includes('admin.bikerfun.nl')
    );
    
    if (!needsUpdate) {
      skipped++;
      continue;
    }
    
    try {
      // Update image URLs
      const updatedImages = product.images.map((img: any) => ({
        ...img,
        src: img.src.replace('https://bikerfun.nl', 'https://admin.bikerfun.nl')
      }));
      
      // Update in database
      const { error: updateError } = await supabase
        .from('webshop_products')
        .update({ images: updatedImages })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${product.name}:`, updateError.message);
        errors++;
      } else {
        updated++;
        if (updated % 25 === 0) {
          console.log(`✅ Updated ${updated} products...`);
        }
      }
    } catch (error: any) {
      console.error(`❌ Error processing ${product.name}:`, error.message);
      errors++;
    }
  }
  
  // Step 4: Summary
  console.log('\n📊 Update Summary:');
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped: ${skipped} (already correct or no images)`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📦 Total: ${products?.length || 0}`);
  
  // Step 5: Verify changes
  console.log('\n🔍 Verifying changes...');
  const { data: verifyProducts } = await supabase
    .from('webshop_products')
    .select('images')
    .limit(5);
  
  console.log('\n📸 Sample updated URLs:');
  verifyProducts?.forEach((p, i) => {
    if (p.images && p.images.length > 0) {
      console.log(`   ${i + 1}. ${p.images[0].src}`);
    }
  });
  
  console.log('\n✅ Image URL update completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Clear browser cache (Ctrl+Shift+R)');
  console.log('   2. Test product pages on bikerfun.nl');
  console.log('   3. Check browser console for any remaining errors');
}

updateImageUrls()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });

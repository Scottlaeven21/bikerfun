/**
 * Check Image URLs in Database
 * 
 * This script checks all product images in the database and verifies:
 * 1. Which domains are being used
 * 2. If any images are missing
 * 3. Sample of image URLs
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

async function checkImageUrls() {
  console.log('🔍 Checking image URLs in database...\n');
  
  // Fetch all products
  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, images')
    .eq('status', 'publish');
  
  if (error) {
    console.error('❌ Error fetching products:', error);
    return;
  }
  
  console.log(`📦 Found ${products?.length || 0} published products\n`);
  
  // Analyze image URLs
  const domainCount: Record<string, number> = {};
  const productsWithoutImages: any[] = [];
  const sampleUrls: string[] = [];
  
  products?.forEach(product => {
    if (!product.images || product.images.length === 0) {
      productsWithoutImages.push(product);
    } else {
      product.images.forEach((img: any) => {
        try {
          const url = new URL(img.src);
          const domain = url.hostname;
          domainCount[domain] = (domainCount[domain] || 0) + 1;
          
          if (sampleUrls.length < 10) {
            sampleUrls.push(img.src);
          }
        } catch (e) {
          console.error(`❌ Invalid URL for product ${product.name}:`, img.src);
        }
      });
    }
  });
  
  // Report findings
  console.log('📊 Image URL Analysis:\n');
  
  console.log('🌐 Domains used:');
  Object.entries(domainCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([domain, count]) => {
      console.log(`   ${domain}: ${count} images`);
    });
  
  console.log('\n📸 Sample image URLs:');
  sampleUrls.forEach((url, i) => {
    console.log(`   ${i + 1}. ${url}`);
  });
  
  console.log(`\n⚠️  Products without images: ${productsWithoutImages.length}`);
  if (productsWithoutImages.length > 0) {
    console.log('   First 5:');
    productsWithoutImages.slice(0, 5).forEach(p => {
      console.log(`   - ${p.name} (ID: ${p.id})`);
    });
  }
  
  // Check if images are accessible
  console.log('\n🔗 Testing image accessibility...');
  if (sampleUrls.length > 0) {
    const testUrl = sampleUrls[0];
    console.log(`   Testing: ${testUrl}`);
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.status === 200) {
        console.log('   ✅ Image is accessible');
      } else {
        console.log('   ❌ Image is NOT accessible');
      }
    } catch (error: any) {
      console.log(`   ❌ Error accessing image: ${error.message}`);
    }
  }
  
  // Check Next.js config
  console.log('\n⚙️  Next.js Image Configuration:');
  console.log('   Allowed domains in next.config.ts:');
  console.log('   - **.supabase.co');
  console.log('   - admin.bikerfun.nl');
  console.log('   - **.bikerfun.nl');
  console.log('   - http://admin.bikerfun.nl');
  
  console.log('\n💡 Recommendations:');
  
  const hasBikerfunNl = Object.keys(domainCount).some(d => d === 'bikerfun.nl');
  const hasWpContent = sampleUrls.some(url => url.includes('/wp-content/'));
  
  if (hasBikerfunNl && hasWpContent) {
    console.log('   ⚠️  Images are hosted on bikerfun.nl (WordPress/WooCommerce)');
    console.log('   ⚠️  These images may not be accessible if:');
    console.log('      1. The old WordPress site is down or moved');
    console.log('      2. DNS has been changed to point to new site');
    console.log('      3. CORS headers are not configured');
    console.log('\n   📋 Solutions:');
    console.log('      1. Upload images to Supabase Storage');
    console.log('      2. Update image URLs in database');
    console.log('      3. Or ensure old WordPress site remains accessible');
  }
}

checkImageUrls()
  .then(() => {
    console.log('\n✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error);
    process.exit(1);
  });

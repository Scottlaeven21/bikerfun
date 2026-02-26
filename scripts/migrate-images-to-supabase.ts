/**
 * Migrate Product Images to Supabase Storage
 * Downloads images from WordPress and uploads to Supabase
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Temporary download directory
const TEMP_DIR = path.join(process.cwd(), 'temp-images');

async function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    console.log(`  📥 Downloading: ${filename}`);
    
    // Try original URL first
    let response = await fetch(url);
    
    // If fails, try with admin.bikerfun.nl
    if (!response.ok && url.includes('bikerfun.nl/wp-content/')) {
      const adminUrl = url.replace('bikerfun.nl/wp-content/', 'admin.bikerfun.nl/wp-content/');
      console.log(`  🔄 Trying admin URL: ${adminUrl}`);
      response = await fetch(adminUrl);
    }
    
    if (!response.ok) {
      console.log(`  ❌ Failed to download (${response.status})`);
      return null;
    }

    const filePath = path.join(TEMP_DIR, filename);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    console.log(`  ✅ Downloaded to: ${filePath}`);
    return filePath;
  } catch (error: any) {
    console.error(`  ❌ Download error: ${error.message}`);
    return null;
  }
}

async function uploadToSupabase(filePath: string, filename: string): Promise<string | null> {
  try {
    console.log(`  📤 Uploading to Supabase: ${filename}`);
    
    const fileBuffer = fs.readFileSync(filePath);
    const fileExt = path.extname(filename);
    const contentType = fileExt === '.png' ? 'image/png' : fileExt === '.jpg' || fileExt === '.jpeg' ? 'image/jpeg' : 'image/webp';
    
    const storagePath = `products/${filename}`;
    
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`  ❌ Upload error: ${error.message}`);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(storagePath);

    console.log(`  ✅ Uploaded: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error(`  ❌ Upload error: ${error.message}`);
    return null;
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Supabase Storage...\n');

  // Ensure temp directory
  await ensureTempDir();

  // Get all products with images
  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, images')
    .eq('status', 'publish')
    .not('images', 'is', null);

  if (error || !products) {
    console.error('❌ Error fetching products:', error);
    return;
  }

  console.log(`📦 Found ${products.length} products with images\n`);

  let totalImages = 0;
  let downloaded = 0;
  let uploaded = 0;
  let failed = 0;

  for (const product of products) {
    console.log(`\n🔄 Processing: ${product.name}`);
    const images = product.images as Array<{ src: string; alt: string; id: string }>;
    
    if (!images || images.length === 0) continue;

    const newImages: Array<{ src: string; alt: string; id: string }> = [];

    for (const image of images) {
      totalImages++;
      
      if (image.src.includes('supabase.co')) {
        // Already on Supabase
        console.log(`  ⏭️  Already on Supabase: ${image.src}`);
        newImages.push(image);
        continue;
      }

      const filename = path.basename(new URL(image.src).pathname);
      
      // Download
      const localPath = await downloadImage(image.src, filename);
      if (!localPath) {
        failed++;
        // Keep original URL (broken, but don't lose data)
        newImages.push(image);
        continue;
      }
      downloaded++;

      // Upload to Supabase
      const supabaseUrl = await uploadToSupabase(localPath, filename);
      if (!supabaseUrl) {
        failed++;
        newImages.push(image);
        continue;
      }
      uploaded++;

      // Update image object
      newImages.push({
        src: supabaseUrl,
        alt: image.alt || product.name,
        id: image.id,
      });

      // Clean up local file
      try {
        fs.unlinkSync(localPath);
      } catch (e) {}
    }

    // Update product in database
    const { error: updateError } = await supabase
      .from('webshop_products')
      .update({ images: newImages })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  ❌ Database update error: ${updateError.message}`);
    } else {
      console.log(`  ✅ Product updated in database`);
    }
  }

  // Clean up temp directory
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n\n📊 Migration Summary:');
  console.log(`📦 Total products: ${products.length}`);
  console.log(`📸 Total images: ${totalImages}`);
  console.log(`📥 Downloaded: ${downloaded}`);
  console.log(`📤 Uploaded to Supabase: ${uploaded}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (uploaded === totalImages) {
    console.log('\n🎉 All images migrated successfully!');
  } else if (uploaded > 0) {
    console.log('\n⚠️  Some images migrated, some failed. Check logs above.');
  } else {
    console.log('\n❌ Migration failed. Images may not be accessible.');
  }
}

// Run migration
migrateImages()
  .then(() => {
    console.log('\n✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

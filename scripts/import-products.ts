/**
 * Import Products from WooCommerce CSV to Supabase
 * 
 * This script:
 * 1. Runs database migrations if needed
 * 2. Parses WooCommerce product CSV
 * 3. Cleans and transforms data
 * 4. Imports into Supabase webshop_products table
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') });

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// CSV file path
const CSV_PATH = path.join(__dirname, '../data/woocommerce-products.csv');

/**
 * Parse price string to decimal
 * "34,95" -> 34.95
 * "0,00" -> null
 */
function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr === '0,00' || priceStr === '0') return null;
  const cleaned = priceStr.replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Parse images string to array
 * "url1, url2, url3" -> [{src: "url1", alt: ""}, ...]
 */
function parseImages(imagesStr: string, productName: string) {
  if (!imagesStr) return [];
  
  return imagesStr
    .split(',')
    .map(url => url.trim())
    .filter(url => url && url.startsWith('http'))
    .map(url => ({
      src: url,
      alt: productName,
      id: url.split('/').pop()?.split('.')[0] || ''
    }));
}

/**
 * Parse categories string to array
 * "Alles, Helmcovers" -> ["Helmcovers"]
 */
function parseCategories(categoriesStr: string): string[] {
  if (!categoriesStr) return [];
  
  const excluded = ['alle', 'alles', 'all'];
  
  return categoriesStr
    .split(',')
    .map(cat => cat.trim())
    .filter(cat => cat && !excluded.includes(cat.toLowerCase()));
}

/**
 * Parse tags string to array
 */
function parseTags(tagsStr: string): string[] {
  if (!tagsStr) return [];
  
  return tagsStr
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag);
}

/**
 * Generate slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check if product should be imported
 */
function shouldImportProduct(record: any): boolean {
  // Skip unpublished products
  if (record['Gepubliceerd'] === '-1') {
    return false;
  }
  
  // Skip products without price
  const price = parsePrice(record['Reguliere prijs']);
  if (!price || price === 0) {
    return false;
  }
  
  // Skip products without name
  if (!record['Naam']) {
    return false;
  }
  
  // Skip motors/occasions (we handle those separately)
  const name = record['Naam']?.toLowerCase() || '';
  const categories = record['Categorieën']?.toLowerCase() || '';
  
  const motorBrands = [
    'yamaha', 'honda', 'suzuki', 'kawasaki', 'ducati',
    'bmw', 'ktm', 'triumph', 'harley', 'r6', 'cbr', 'gsx', 'zx',
    'fireblade', 'ninja', 'monster'
  ];
  
  const hasMotorBrand = motorBrands.some(brand => name.includes(brand));
  const hasMotorCategory = categories.includes('motor') || 
                          categories.includes('occasion') || 
                          categories.includes('bike');
  const isHighPrice = price > 1000;
  
  const isMotor = hasMotorBrand || hasMotorCategory || isHighPrice;
  
  return !isMotor;
}

/**
 * Main import function
 */
async function importProducts() {
  console.log('🚀 Starting product import from WooCommerce CSV...\n');
  
  // Check if tables exist
  console.log('📊 Checking database tables...');
  const { error: tableCheck } = await supabase
    .from('webshop_products')
    .select('id')
    .limit(1);
  
  if (tableCheck) {
    console.log('\n❌ ERROR: webshop_products table does not exist!');
    console.log('Please run the Supabase migrations first:');
    console.log('1. Go to: https://supabase.com/dashboard → SQL Editor');
    console.log('2. Run: supabase/migrations/011_create_webshop_products.sql');
    console.log('3. Run: supabase/migrations/012_create_webshop_orders.sql');
    console.log('\nOr use: npm run migrations\n');
    process.exit(1);
  }
  
  console.log('✅ Database tables exist\n');
  
  // Step 1: Read and parse CSV
  console.log('📄 Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });
  
  console.log(`📦 Found ${records.length} products in CSV\n`);
  
  // Step 3: Transform and import
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const record of records) {
    // Check if should import
    if (!shouldImportProduct(record)) {
      skipped++;
      continue;
    }
    
    try {
      // Transform data
      const regularPrice = parsePrice(record['Reguliere prijs']);
      const salePrice = parsePrice(record['Actieprijs']);
      const price = salePrice || regularPrice;
      
      const product = {
        woo_product_id: parseInt(record['ID']),
        sku: record['SKU'] || null,
        name: record['Naam'],
        slug: generateSlug(record['Naam']),
        description: record['Beschrijving'] || null,
        short_description: record['Korte beschrijving'] || null,
        price: price,
        sale_price: salePrice,
        regular_price: regularPrice,
        on_sale: !!salePrice && salePrice < regularPrice!,
        stock_quantity: parseInt(record['Voorraad']) || 0,
        stock_status: record['Op voorraad?'] === '1' ? 'instock' : 'outofstock',
        manage_stock: true,
        categories: parseCategories(record['Categorieën']),
        tags: parseTags(record['Tags']),
        images: parseImages(record['Afbeeldingen'], record['Naam']),
        status: record['Gepubliceerd'] === '1' ? 'publish' : 'draft',
        featured: record['Uitgelicht?'] === '1',
        catalog_visibility: 'visible',
        weight: record['Gewicht (kg)'] ? parseFloat(record['Gewicht (kg)']) : null,
      };
      
      // Insert into Supabase
      const { error } = await supabase
        .from('webshop_products')
        .insert(product);
      
      if (error) {
        console.error(`❌ Error importing ${product.name}:`, error.message);
        errors++;
      } else {
        imported++;
        if (imported % 50 === 0) {
          console.log(`✅ Imported ${imported} products...`);
        }
      }
      
    } catch (error: any) {
      console.error(`❌ Error processing product:`, error.message);
      errors++;
    }
  }
  
  // Summary
  console.log('\n📊 Import Summary:');
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📦 Total: ${records.length}`);
  
  // Verify in database
  const { count } = await supabase
    .from('webshop_products')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n🗄️  Total products in database: ${count}`);
}

// Run import
importProducts()
  .then(() => {
    console.log('\n✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });

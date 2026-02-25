/**
 * Import Occasions (Motors) from WooCommerce CSV to Supabase
 * 
 * This script:
 * 1. Parses WooCommerce CSV
 * 2. Finds motor/occasion products (high price, motor brands, etc.)
 * 3. Imports into existing occasions table
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import * as path from 'path';

config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_PATH = path.join(__dirname, '../data/woocommerce-products.csv');

/**
 * Parse price
 */
function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr === '0,00' || priceStr === '0') return null;
  const cleaned = priceStr.replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Check if product is a motor/occasion
 */
function isMotorOccasion(record: any): boolean {
  const name = record['Naam']?.toLowerCase() || '';
  const categories = record['Categorieën']?.toLowerCase() || '';
  const price = parsePrice(record['Reguliere prijs']) || 0;
  
  // Check for motor brands in name
  const motorBrands = [
    'yamaha', 'honda', 'suzuki', 'kawasaki', 'ducati',
    'bmw', 'ktm', 'triumph', 'harley', 'r6', 'cbr', 'gsx', 'zx',
    'fireblade', 'ninja', 'monster'
  ];
  
  const hasMotorBrand = motorBrands.some(brand => name.includes(brand));
  
  // Check for motor categories
  const hasMotorCategory = categories.includes('motor') || 
                          categories.includes('occasion') || 
                          categories.includes('bike');
  
  // High price typically indicates a motor
  const isHighPrice = price > 1000;
  
  return hasMotorBrand || hasMotorCategory || isHighPrice;
}

/**
 * Extract motor specs from name
 */
function parseMotorSpecs(name: string) {
  const specs: any = {};
  
  // Brand
  const brands = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Triumph', 'Harley'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      specs.brand = brand;
      break;
    }
  }
  
  // Model (first word after brand, or extract pattern)
  const modelMatch = name.match(/\b(R6|CBR|GSX|ZX|Monster|Fireblade|Ninja|MT)\S*/i);
  if (modelMatch) {
    specs.model = modelMatch[0];
  }
  
  // Power restriction (35kw, A2, etc.)
  if (name.includes('35kw') || name.includes('35 kw')) {
    specs.power_restriction = '35kw';
  }
  
  // Transmission
  if (name.toLowerCase().includes('handgeschakeld')) {
    specs.transmission = 'manual';
  }
  
  // Fuel
  if (name.toLowerCase().includes('benzine')) {
    specs.fuel = 'benzine';
  }
  
  // Color
  const colorMatch = name.match(/\b(Zwart|Blauw|Rood|Groen|Wit|Grijs|Zilver|Oranje)\b/i);
  if (colorMatch) {
    specs.color = colorMatch[0];
  }
  
  // Year
  const yearMatch = name.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    specs.year = parseInt(yearMatch[0]);
  }
  
  return specs;
}

/**
 * Parse images
 */
function parseImages(imagesStr: string): string[] {
  if (!imagesStr) return [];
  
  return imagesStr
    .split(',')
    .map(url => url.trim())
    .filter(url => url && url.startsWith('http'));
}

/**
 * Generate slug from brand, model, year
 */
function generateSlug(brand: string, model: string, year: number, id?: string): string {
  const slug = `${brand}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  // Add unique ID to prevent conflicts
  if (id) {
    return `${slug}-${id}`;
  }
  
  // Fallback: add random string
  return `${slug}-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Main import function
 */
async function importOccasions() {
  console.log('Starting occasion import from WooCommerce CSV...\n');
  
  // Check if occasions table exists
  const { error: tableCheck } = await supabase
    .from('occasions')
    .select('id')
    .limit(1);
  
  if (tableCheck) {
    console.log('ERROR: occasions table does not exist!');
    process.exit(1);
  }
  
  console.log('Database table exists\n');
  
  // Read CSV
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });
  
  console.log(`Found ${records.length} products in CSV\n`);
  
  let imported = 0;
  let skipped = 0;
  
  for (const record of records) {
    // Only import motor/occasions
    if (!isMotorOccasion(record)) {
      skipped++;
      continue;
    }
    
    // Skip unpublished
    if (record['Gepubliceerd'] !== '1') {
      skipped++;
      continue;
    }
    
    try {
      const price = parsePrice(record['Reguliere prijs']);
      if (!price) {
        skipped++;
        continue;
      }
      
      const images = parseImages(record['Afbeeldingen']);
      const specs = parseMotorSpecs(record['Naam']);
      
      const brand = specs.brand || 'Onbekend';
      const model = specs.model || record['Naam'];
      const year = specs.year || new Date().getFullYear();
      const productId = record['ID'];
      
      const slug = generateSlug(brand, model, year, productId);
      
      const occasion = {
        brand: brand,
        model: model,
        year: year,
        price: price,
        slug: slug,
        mileage: 0, // Not in CSV
        transmission: specs.transmission || 'Handgeschakeld',
        fuel: specs.fuel || 'Benzine',
        power: specs.power_restriction || 'Onbekend',
        color: specs.color || null,
        description: record['Beschrijving'] || 'Geen beschrijving beschikbaar',
        images: images,
        main_image: images.length > 0 ? images[0] : null,
        is_active: true,
        status: 'available',
        specs: {
          woo_product_id: parseInt(productId),
          sku: record['SKU'] || null,
          original_name: record['Naam']
        }
      };
      
      const { error } = await supabase
        .from('occasions')
        .insert(occasion);
      
      if (error) {
        console.error(`Error importing ${occasion.brand} ${occasion.model}:`, error.message);
      } else {
        imported++;
        console.log(`Imported: ${occasion.brand} ${occasion.model}`);
      }
      
    } catch (error: any) {
      console.error(`Error processing occasion:`, error.message);
    }
  }
  
  console.log('\nOccasion Import Summary:');
  console.log(`Imported: ${imported}`);
  console.log(`Skipped: ${skipped}`);
  
  const { count } = await supabase
    .from('occasions')
    .select('*', { count: 'exact', head: true });
  
  console.log(`Total occasions in database: ${count}`);
}

importOccasions()
  .then(() => {
    console.log('\nOccasion import completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nImport failed:', error);
    process.exit(1);
  });

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

function extractYearFromName(name: string): number {
  // Try to find 4-digit year in name
  const yearMatch = name.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) return parseInt(yearMatch[0]);
  
  // Try to match RJ11, RJ15, PC37, PC40 etc. to estimate year
  if (name.includes('RJ15') || name.includes('PC40')) return 2010;
  if (name.includes('RJ11')) return 2007;
  if (name.includes('RJ09')) return 2005;
  if (name.includes('RJ05')) return 2003;
  if (name.includes('PC37')) return 2003;
  if (name.includes('K9')) return 2009;
  if (name.includes('K7')) return 2007;
  
  return new Date().getFullYear() - 10; // Default to 10 years old
}

function extractBrand(name: string): string {
  const brands = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Triumph', 'Harley'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Onbekend';
}

function extractModel(name: string, brand: string): string {
  // Remove brand from name
  let model = name.replace(new RegExp(brand, 'gi'), '').trim();
  
  // Extract model code (R6, CBR600RR, GSX-R, etc.)
  const modelMatch = model.match(/^([A-Z0-9\-]+)/);
  if (modelMatch) return modelMatch[1];
  
  return model.split('|')[0].trim();
}

function generateSlug(brand: string, model: string, year: number, wcId: number): string {
  return `${brand}-${model}-${year}-${wcId}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function importOccasionsFromWooCommerce() {
  console.log('🚀 Starting WooCommerce → Supabase Occasions Import\n');

  const supabase = createClient(supabaseUrl, supabaseKey);
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  // Fetch occasions from WooCommerce (products > €5000)
  const response = await fetch(
    `${WC_URL}/wp-json/wc/v3/products?per_page=100&min_price=5000&orderby=date&order=desc`,
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    console.error('❌ WooCommerce API error:', response.status);
    return;
  }

  const products = await response.json();
  console.log(`✅ Found ${products.length} occasions in WooCommerce\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const brand = extractBrand(product.name);
      const year = extractYearFromName(product.name);
      const model = extractModel(product.name, brand);
      const slug = generateSlug(brand, model, year, product.id);

      // Get main image
      const mainImage = product.images && product.images.length > 0 
        ? product.images[0].src 
        : null;

      // Get all images
      const images = product.images ? product.images.map((img: any) => img.src) : [];

      // Parse description for power/specs
      const power = product.name.match(/(\d+kw)/i)?.[1] || '35kw';
      
      // Determine status based on WooCommerce status
      let status: 'available' | 'sold' = 'available';
      if (product.status === 'private' || product.stock_status === 'outofstock') {
        status = 'sold';
      }

      const occasionData = {
        brand,
        model,
        year,
        price: parseFloat(product.price || '0'),
        status,
        is_active: product.status === 'publish',
        mileage: 0, // Not in WooCommerce data
        transmission: 'Handgeschakeld',
        fuel: 'Benzine',
        power,
        color: null,
        category: 'Sportmotor',
        condition: 'Gebruikt',
        owners: null,
        service_history: null,
        warranty: '3 maanden garantie',
        description: product.description || product.short_description || null,
        features: [],
        extras: [],
        images,
        main_image: mainImage,
        slug,
        specs: {},
      };

      const { error } = await supabase
        .from('occasions')
        .insert(occasionData);

      if (error) {
        console.error(`❌ Failed to import ${product.name}:`, error.message);
        failed++;
      } else {
        console.log(`✅ Imported: ${product.name}`);
        imported++;
      }

    } catch (err) {
      console.error(`❌ Error processing ${product.name}:`, err);
      failed++;
    }
  }

  console.log('\n📊 Import Summary:');
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📦 Total: ${products.length}`);
}

importOccasionsFromWooCommerce();

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

async function checkCategories() {
  console.log('🔍 Fetching WooCommerce categories...\n');

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  try {
    const response = await fetch(
      `${WC_URL}/wp-json/wc/v3/products/categories?per_page=100`,
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

    const categories = await response.json();
    
    console.log(`✅ Found ${categories.length} categories:\n`);
    
    categories.forEach((cat: any) => {
      console.log(`📁 ${cat.name}`);
      console.log(`   - ID: ${cat.id}`);
      console.log(`   - Slug: ${cat.slug}`);
      console.log(`   - Count: ${cat.count} products`);
      console.log('');
    });

    // Check for occasions
    const occasionsCategory = categories.find((cat: any) => 
      cat.name.toLowerCase().includes('occasion') || 
      cat.slug.toLowerCase().includes('occasion')
    );

    if (occasionsCategory) {
      console.log('🏍️ OCCASIONS CATEGORY FOUND:');
      console.log(`   Name: "${occasionsCategory.name}"`);
      console.log(`   Slug: "${occasionsCategory.slug}"`);
      console.log(`   ID: ${occasionsCategory.id}`);
    } else {
      console.log('⚠️ No "Occasions" category found!');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkCategories();

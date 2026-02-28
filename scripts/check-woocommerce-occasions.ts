import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

async function checkWooCommerceOccasions() {
  console.log('🔍 Checking WooCommerce for occasions/motors...\n');

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  // Search for expensive products (likely occasions)
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
    const error = await response.text();
    console.error(error.substring(0, 500));
    return;
  }

  const products = await response.json();

  console.log(`✅ Gevonden producten > €5000: ${products.length}\n`);

  if (products.length === 0) {
    console.log('⚠️  Geen occasions gevonden in WooCommerce');
    console.log('   Misschien zijn ze daar ook verwijderd?');
    return;
  }

  console.log('🏍️  Occasions in WooCommerce:\n');
  products.forEach((product: any, i: number) => {
    console.log(`${i + 1}. ${product.name}`);
    console.log(`   Prijs: €${product.price}`);
    console.log(`   WC ID: ${product.id}`);
    console.log(`   Status: ${product.status}`);
    console.log('');
  });

  console.log('\n💡 Om te importeren naar Supabase, run:');
  console.log('   npm run import:occasions');
}

checkWooCommerceOccasions();

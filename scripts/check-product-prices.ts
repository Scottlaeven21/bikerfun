import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkProductPrices() {
  console.log('🔍 Checking WooCommerce product prices...\n');

  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('❌ Missing WooCommerce credentials');
    return;
  }

  try {
    // Fetch products from WooCommerce API
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await fetch(`${baseUrl}/wp-json/wc/v3/products?per_page=10&status=publish`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      return;
    }

    const products = await response.json();

    console.log(`📦 Found ${products.length} products:\n`);

    // Find products around €6-7 range
    products.forEach((product: any) => {
      const price = parseFloat(product.price);
      console.log(`${product.name}`);
      console.log(`  ID: ${product.id}`);
      console.log(`  Price: €${price}`);
      console.log(`  Regular Price: €${product.regular_price}`);
      console.log(`  Sale Price: ${product.sale_price || 'N/A'}`);
      console.log(`  Stock: ${product.stock_status}`);
      console.log('');
    });

    // Check for €6.95 products
    const sixNinetyFive = products.filter((p: any) => parseFloat(p.price) === 6.95);
    if (sixNinetyFive.length > 0) {
      console.log(`\n💡 Found ${sixNinetyFive.length} product(s) priced at €6.95:`);
      sixNinetyFive.forEach((p: any) => console.log(`  - ${p.name} (ID: ${p.id})`));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductPrices();

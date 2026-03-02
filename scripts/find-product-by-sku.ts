import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

async function findProductBySKU(sku: string) {
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(`${WC_URL}/wp-json/wc/v3/products?sku=${sku}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      console.error('WooCommerce API Error:', response.status, response.statusText);
      return;
    }

    const products = await response.json();
    
    if (products.length === 0) {
      console.log(`❌ Geen product gevonden met SKU: ${sku}`);
    } else {
      console.log(`✅ Product gevonden met SKU ${sku}:`);
      console.log('   ID:', products[0].id);
      console.log('   Naam:', products[0].name);
      console.log('   Prijs:', products[0].price);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

findProductBySKU('6097719696642');

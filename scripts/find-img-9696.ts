import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function findImgProducts() {
  console.log('🔍 Searching for IMG_9696 products...\n');

  // Search webshop_products
  const { data: products, error } = await supabase
    .from('webshop_products')
    .select('id, name, images, status')
    .ilike('images', '%IMG_9696%');

  console.log('Products with IMG_9696:', products?.length || 0);
  products?.forEach(p => {
    console.log(`\n📦 ${p.name}`);
    console.log(`   Status: ${p.status}`);
    console.log(`   Images:`, JSON.stringify(p.images, null, 2));
  });

  // Also search for any /2025/04/ images
  const { data: productsApril, error: error2 } = await supabase
    .from('webshop_products')
    .select('id, name, images, status')
    .ilike('images', '%/2025/04/%');

  console.log('\n\nProducts with 2025/04 images:', productsApril?.length || 0);
  productsApril?.forEach(p => {
    console.log(`\n📦 ${p.name}`);
    console.log(`   Status: ${p.status}`);
    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      p.images.forEach((img: any) => {
        const src = typeof img === 'string' ? img : img?.src;
        if (src) {
          console.log(`   - ${src}`);
        }
      });
    }
  });

  console.log('\n✅ Search complete');
}

findImgProducts();

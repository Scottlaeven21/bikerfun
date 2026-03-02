import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function cleanupDuplicateSlugs() {
  console.log('🧹 Cleaning up duplicate slugs...\n');

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Find duplicate occasions
    console.log('📋 Checking occasions...');
    const { data: occasions } = await supabase
      .from('occasions')
      .select('id, slug, woo_product_id, created_at')
      .order('created_at', { ascending: true });

    if (occasions) {
      const slugMap = new Map<string, any[]>();
      
      // Group by slug
      occasions.forEach(occasion => {
        if (!slugMap.has(occasion.slug)) {
          slugMap.set(occasion.slug, []);
        }
        slugMap.get(occasion.slug)!.push(occasion);
      });

      // Find duplicates
      let occasionDuplicates = 0;
      for (const [slug, items] of slugMap.entries()) {
        if (items.length > 1) {
          console.log(`\n⚠️ Found ${items.length} occasions with slug: ${slug}`);
          
          // Keep the oldest one, delete the rest
          const toKeep = items[0];
          const toDelete = items.slice(1);
          
          console.log(`   ✅ Keeping: ID ${toKeep.id} (created: ${toKeep.created_at})`);
          
          for (const item of toDelete) {
            console.log(`   ❌ Deleting: ID ${item.id} (created: ${item.created_at})`);
            const { error } = await supabase
              .from('occasions')
              .delete()
              .eq('id', item.id);
            
            if (error) {
              console.error(`   Error deleting: ${error.message}`);
            } else {
              occasionDuplicates++;
            }
          }
        }
      }
      
      console.log(`\n✅ Removed ${occasionDuplicates} duplicate occasions`);
    }

    // Find duplicate products
    console.log('\n📋 Checking products...');
    const { data: products } = await supabase
      .from('webshop_products')
      .select('id, slug, woo_product_id, created_at')
      .order('created_at', { ascending: true });

    if (products) {
      const slugMap = new Map<string, any[]>();
      
      // Group by slug
      products.forEach(product => {
        if (!slugMap.has(product.slug)) {
          slugMap.set(product.slug, []);
        }
        slugMap.get(product.slug)!.push(product);
      });

      // Find duplicates
      let productDuplicates = 0;
      for (const [slug, items] of slugMap.entries()) {
        if (items.length > 1) {
          console.log(`\n⚠️ Found ${items.length} products with slug: ${slug}`);
          
          // Keep the oldest one, delete the rest
          const toKeep = items[0];
          const toDelete = items.slice(1);
          
          console.log(`   ✅ Keeping: ID ${toKeep.id} (created: ${toKeep.created_at})`);
          
          for (const item of toDelete) {
            console.log(`   ❌ Deleting: ID ${item.id} (created: ${item.created_at})`);
            const { error } = await supabase
              .from('webshop_products')
              .delete()
              .eq('id', item.id);
            
            if (error) {
              console.error(`   Error deleting: ${error.message}`);
            } else {
              productDuplicates++;
            }
          }
        }
      }
      
      console.log(`\n✅ Removed ${productDuplicates} duplicate products`);
    }

    console.log('\n🎉 Cleanup complete!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

cleanupDuplicateSlugs();

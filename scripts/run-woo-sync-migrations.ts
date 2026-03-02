import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function runMigrations() {
  console.log('🚀 Running WooCommerce Sync Migrations...\n');

  const supabase = createClient(supabaseUrl, supabaseKey);

  const migrations = [
    {
      name: '015_add_woo_product_id_to_occasions.sql',
      description: 'Add woo_product_id column to occasions',
    },
    {
      name: '016_fix_webshop_products_sku_constraint.sql',
      description: 'Fix SKU unique constraint on webshop_products',
    },
  ];

  for (const migration of migrations) {
    try {
      console.log(`📋 Running: ${migration.description}...`);
      
      const migrationPath = path.join(
        __dirname,
        '../supabase/migrations',
        migration.name
      );
      
      const sql = fs.readFileSync(migrationPath, 'utf-8');
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        console.error(`❌ Failed: ${error.message}`);
        console.log('\n⚠️ Manual action required:');
        console.log('1. Go to: https://supabase.com/dashboard');
        console.log('2. Navigate to: SQL Editor');
        console.log(`3. Copy and run: supabase/migrations/${migration.name}\n`);
        continue;
      }
      
      console.log(`✅ Success: ${migration.description}\n`);
    } catch (err: any) {
      console.error(`❌ Error: ${err.message}`);
      console.log('\n⚠️ Manual action required:');
      console.log('1. Go to: https://supabase.com/dashboard');
      console.log('2. Navigate to: SQL Editor');
      console.log(`3. Copy and run: supabase/migrations/${migration.name}\n`);
    }
  }

  console.log('✅ All migrations processed!');
  console.log('\nYou can now run the WooCommerce sync again.');
}

runMigrations();

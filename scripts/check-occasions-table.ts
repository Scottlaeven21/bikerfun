import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkTable() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Checking if occasions table exists...\n');

  // Try to query table info
  const { data, error } = await supabase
    .from('occasions')
    .select('count', { count: 'exact', head: true });

  if (error) {
    console.error('❌ Error querying occasions table:', error);
    console.log('\nMogelijk probleem:');
    console.log('   - Table bestaat niet');
    console.log('   - RLS policy blokkeert alles');
    return;
  }

  console.log(`✅ Table bestaat! Totaal rijen: ${data || 0}`);
  
  if (data === 0) {
    console.log('\n⚠️  Table is LEEG - alle data is verwijderd!');
    console.log('\nMogelijke oorzaken:');
    console.log('   1. Accidentele DELETE query');
    console.log('   2. Migration heeft table gecleared');
    console.log('   3. Backup restore nodig');
  }
}

checkTable();

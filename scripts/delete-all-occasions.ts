import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function deleteAllOccasions() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🗑️  Verwijderen van alle occasions...\n');

  const { error } = await supabase
    .from('occasions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ Alle occasions verwijderd!');
  
  // Verify
  const { count } = await supabase
    .from('occasions')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Occasions remaining: ${count || 0}`);
}

deleteAllOccasions();

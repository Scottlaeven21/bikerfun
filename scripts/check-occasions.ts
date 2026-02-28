import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkOccasions() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🔍 Checking occasions in Supabase...\n');

  // Get all occasions
  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching occasions:', error);
    return;
  }

  if (!occasions || occasions.length === 0) {
    console.log('❌ GEEN OCCASIONS GEVONDEN in Supabase!');
    console.log('\nMogelijke oorzaken:');
    console.log('   1. Table is leeg');
    console.log('   2. RLS policies blokkeren queries');
    console.log('   3. Table bestaat niet');
    return;
  }

  console.log(`✅ Totaal occasions gevonden: ${occasions.length}\n`);
  
  console.log('📊 Status overzicht:');
  const available = occasions.filter(o => o.status === 'available').length;
  const sold = occasions.filter(o => o.status === 'sold').length;
  const reserved = occasions.filter(o => o.status === 'reserved').length;
  const active = occasions.filter(o => o.is_active).length;
  const inactive = occasions.filter(o => !o.is_active).length;

  console.log(`   Beschikbaar: ${available}`);
  console.log(`   Verkocht: ${sold}`);
  console.log(`   Gereserveerd: ${reserved}`);
  console.log(`   Actief (is_active=true): ${active}`);
  console.log(`   Inactief (is_active=false): ${inactive}\n`);

  console.log('🏍️  Laatste 5 occasions:');
  occasions.slice(0, 5).forEach((occ, i) => {
    console.log(`\n${i + 1}. ${occ.brand} ${occ.model} (${occ.year})`);
    console.log(`   Status: ${occ.status} | Actief: ${occ.is_active ? '✅' : '❌'}`);
    console.log(`   Prijs: €${occ.price}`);
    console.log(`   ID: ${occ.id}`);
  });
}

checkOccasions();

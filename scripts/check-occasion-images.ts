import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkOccasionImages() {
  console.log('🔍 Checking occasion images...\n');

  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('id, brand, model, images')
    .eq('is_active', true)
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📦 Found ${occasions?.length || 0} active occasions\n`);

  occasions?.forEach((occasion, index) => {
    console.log(`${index + 1}. ${occasion.brand} ${occasion.model}`);
    console.log(`   Images:`, JSON.stringify(occasion.images, null, 2));
    console.log('');
  });

  console.log('✅ Check complete');
}

checkOccasionImages();

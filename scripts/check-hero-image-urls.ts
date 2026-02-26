import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHeroImageUrls() {
  console.log('🔍 Checking hero image URLs...\n');

  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('id, brand, model, main_image')
    .limit(5);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📸 Sample Hero Image URLs:\n');
  occasions?.forEach((occ) => {
    console.log(`${occ.brand} ${occ.model}:`);
    console.log(`  URL: ${occ.main_image}`);
    console.log(`  Contains resolution?: ${/-\d+x\d+/.test(occ.main_image || '')}`);
    console.log('');
  });

  // Check for common WordPress image size patterns
  const patternsFound = {
    scaled: occasions?.filter(o => o.main_image?.includes('-scaled')).length || 0,
    sized: occasions?.filter(o => /-\d+x\d+/.test(o.main_image || '')).length || 0,
    original: occasions?.filter(o => o.main_image && !/-\d+x\d+/.test(o.main_image) && !o.main_image.includes('-scaled')).length || 0,
  };

  console.log('📊 Summary:');
  console.log(`  Scaled images (-scaled.jpg): ${patternsFound.scaled}`);
  console.log(`  Resized images (-1024x768.jpg): ${patternsFound.sized}`);
  console.log(`  Original/Full size: ${patternsFound.original}`);
}

checkHeroImageUrls();

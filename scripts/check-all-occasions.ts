import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAllOccasions() {
  console.log('🔍 Checking ALL occasion images...\n');

  const { data: occasions, error } = await supabase
    .from('occasions')
    .select('id, brand, model, year, images, is_active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📦 Found ${occasions?.length || 0} occasions\n`);

  occasions?.forEach((occasion, index) => {
    if (occasion.images && occasion.images.length > 0) {
      console.log(`${index + 1}. ${occasion.brand} ${occasion.model} ${occasion.year || ''}`);
      console.log(`   Active: ${occasion.is_active}`);
      console.log(`   Images (${occasion.images.length}):`);
      occasion.images.forEach((img: string) => {
        if (img.startsWith('/')) {
          console.log(`   ⚠️  RELATIVE: ${img}`);
        } else if (img.includes('bikerfun.nl') && !img.includes('admin.bikerfun.nl')) {
          console.log(`   ⚠️  WRONG DOMAIN: ${img}`);
        } else {
          console.log(`   ✅ ${img.substring(0, 80)}...`);
        }
      });
      console.log('');
    }
  });

  // Count issues
  let relativeCount = 0;
  let wrongDomainCount = 0;
  
  occasions?.forEach((occasion) => {
    if (occasion.images && Array.isArray(occasion.images)) {
      occasion.images.forEach((img: string) => {
        if (img.startsWith('/')) relativeCount++;
        if (img.includes('bikerfun.nl') && !img.includes('admin.bikerfun.nl')) wrongDomainCount++;
      });
    }
  });

  console.log('\n📊 Summary:');
  console.log(`⚠️  Relative URLs: ${relativeCount}`);
  console.log(`⚠️  Wrong domain: ${wrongDomainCount}`);
  console.log(`📦 Total occasions: ${occasions?.length || 0}`);

  console.log('\n✅ Check complete');
}

checkAllOccasions();

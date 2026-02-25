/**
 * Clean up occasion descriptions
 * Remove HTML tags, fix escape characters, clean formatting
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';

config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function cleanDescription(desc: string | null): string {
  if (!desc) return '';
  
  return desc
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Convert escaped newlines to actual newlines
    .replace(/\\n/g, '\n')
    // Remove excessive whitespace
    .replace(/\n{3,}/g, '\n\n')
    // Remove HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // Trim
    .trim();
}

async function cleanDescriptions() {
  console.log('Cleaning occasion descriptions...\n');
  
  // Get all occasions
  const { data: occasions, error: fetchError } = await supabase
    .from('occasions')
    .select('id, brand, model, description');
  
  if (fetchError) {
    console.error('Error fetching occasions:', fetchError);
    return;
  }
  
  console.log(`Found ${occasions?.length || 0} occasions\n`);
  
  let cleaned = 0;
  let skipped = 0;
  
  for (const occasion of occasions || []) {
    if (!occasion.description) {
      skipped++;
      continue;
    }
    
    const originalLength = occasion.description.length;
    const cleanedDesc = cleanDescription(occasion.description);
    
    // Only update if changed
    if (cleanedDesc !== occasion.description) {
      const { error: updateError } = await supabase
        .from('occasions')
        .update({ description: cleanedDesc })
        .eq('id', occasion.id);
      
      if (updateError) {
        console.error(`Error updating ${occasion.brand} ${occasion.model}:`, updateError);
      } else {
        cleaned++;
        console.log(`Cleaned: ${occasion.brand} ${occasion.model}`);
        console.log(`  Before: ${originalLength} chars (with tags/escapes)`);
        console.log(`  After: ${cleanedDesc.length} chars (clean text)`);
        console.log();
      }
    } else {
      skipped++;
    }
  }
  
  console.log('\nSummary:');
  console.log(`Cleaned: ${cleaned}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${occasions?.length || 0}`);
}

cleanDescriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

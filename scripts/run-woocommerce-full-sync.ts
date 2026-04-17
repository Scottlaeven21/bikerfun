/**
 * Handmatige volledige sync: draait op jouw machine (geen Vercel 10s-limiet).
 *
 * Vereist in .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - NEXT_PUBLIC_WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET
 *
 * Gebruik: npm run sync:woocommerce
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const { createAdminClient } = await import('../lib/supabase/admin');
  const { executeWooCommerceFullSync } = await import('../lib/woocommerce/full-sync');

  console.log('🔄 Lokale WooCommerce full sync (occasions, producten, bestellingen)...\n');

  const supabase = createAdminClient();
  const result = await executeWooCommerceFullSync(supabase);

  console.log('\n📊 Resultaat:');
  console.log(JSON.stringify(result, null, 2));

  if (!result.success) {
    console.error('\n❌ Sync afgerond met fouten.');
    process.exit(1);
  }

  console.log('\n✅ Sync geslaagd.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

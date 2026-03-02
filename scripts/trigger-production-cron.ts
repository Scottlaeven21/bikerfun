import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function triggerProductionCron() {
  const cronSecret = '9q4jb5m3l6'; // Of proces.env.CRON_SECRET als deze al in .env.local staat
  const productionUrl = 'https://bikerfun.nl';

  console.log('🚀 Triggering Production Vercel Cron Job...\n');
  console.log(`   URL: ${productionUrl}/api/cron/sync-orders`);
  console.log(`   Secret: ${cronSecret.substring(0, 4)}...${cronSecret.substring(cronSecret.length - 4)}\n`);

  try {
    const response = await fetch(`${productionUrl}/api/cron/sync-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}\n`);

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('📊 Response:');
      console.log(JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('\n✅ Cron job executed successfully!');
        if (data.synced && data.synced > 0) {
          console.log(`   ${data.synced} order(s) synced to WooCommerce`);
        } else {
          console.log('   No orders to sync (or all already synced)');
        }
      } else {
        console.log('\n❌ Cron job failed!');
        if (response.status === 401) {
          console.log('\n⚠️  UNAUTHORIZED - Possible issues:');
          console.log('   1. CRON_SECRET not set in Vercel environment variables');
          console.log('   2. CRON_SECRET in Vercel does not match the secret used here');
          console.log('\n📝 Go to Vercel and check:');
          console.log('   https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables');
        }
      }
    } else {
      const text = await response.text();
      console.log('📊 Response (text):');
      console.log(text);
    }
  } catch (err) {
    console.error('❌ Error triggering cron:', err);
  }
}

triggerProductionCron();

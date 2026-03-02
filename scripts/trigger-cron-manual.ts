import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function triggerCron() {
  const cronSecret = process.env.CRON_SECRET || '9q4jb5m3l6';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  console.log('🚀 Manually triggering Vercel Cron job...\n');
  console.log(`   URL: ${appUrl}/api/cron/sync-orders`);
  console.log(`   Secret: ${cronSecret.substring(0, 4)}...${cronSecret.substring(cronSecret.length - 4)}\n`);

  try {
    const response = await fetch(`${appUrl}/api/cron/sync-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}\n`);

    const data = await response.json();
    console.log('📊 Response:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Cron job executed successfully!');
      if (data.synced > 0) {
        console.log(`   ${data.synced} order(s) synced to WooCommerce`);
      } else {
        console.log('   No orders to sync');
      }
    } else {
      console.log('\n❌ Cron job failed!');
    }
  } catch (err) {
    console.error('❌ Error triggering cron:', err);
  }
}

triggerCron();

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function fetchWCShipping() {
  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!baseUrl || !key || !secret) {
    console.error('❌ Missing credentials');
    return;
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  };

  try {
    console.log('🚚 Fetching WooCommerce Shipping Settings...\n');
    
    // Try simpler endpoint first - shipping settings
    console.log('📡 Trying: /wp-json/wc/v3/settings/shipping\n');
    const settingsRes = await fetch(`${baseUrl}/wp-json/wc/v3/settings/shipping`, { 
      headers,
      signal: AbortSignal.timeout(8000),
    });
    
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      console.log('✅ Shipping Settings:');
      settings.forEach((s: any) => {
        console.log(`  - ${s.label}: ${s.value || s.default}`);
      });
      console.log('');
    } else {
      console.log(`⚠️  Settings endpoint: ${settingsRes.status}\n`);
    }

    // Try zones
    console.log('📡 Trying: /wp-json/wc/v3/shipping/zones\n');
    const zonesRes = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones`, { 
      headers,
      signal: AbortSignal.timeout(8000),
    });

    if (!zonesRes.ok) {
      const errorText = await zonesRes.text();
      console.error(`❌ Zones Error (${zonesRes.status}):`, errorText.substring(0, 200));
      
      // Try to extract useful info from error
      if (errorText.includes('memory')) {
        console.log('\n💡 PHP Memory issue detected. Shipping zones exist but need memory fix.\n');
      }
      return;
    }

    const zones = await zonesRes.json();
    console.log(`✅ Found ${zones.length} Shipping Zones:\n`);

    for (const zone of zones) {
      console.log(`📦 ${zone.name} (ID: ${zone.id})`);
      
      // Fetch methods for this zone
      const methodsRes = await fetch(
        `${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`,
        { headers, signal: AbortSignal.timeout(8000) }
      );

      if (methodsRes.ok) {
        const methods = await methodsRes.json();
        methods.forEach((m: any) => {
          console.log(`   ${m.enabled ? '✅' : '❌'} ${m.method_title}`);
          if (m.settings?.cost?.value) {
            console.log(`      Cost: €${m.settings.cost.value}`);
          }
          if (m.settings?.min_amount?.value) {
            console.log(`      Min: €${m.settings.min_amount.value}`);
          }
        });
      } else {
        console.log(`   ⚠️  Could not fetch methods (${methodsRes.status})`);
      }
      console.log('');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

fetchWCShipping();

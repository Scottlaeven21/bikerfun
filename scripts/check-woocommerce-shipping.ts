import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkWooCommerceShipping() {
  console.log('🚚 Checking WooCommerce shipping settings...\n');

  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    console.error('❌ Missing WooCommerce credentials');
    return;
  }

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    // Fetch shipping zones
    console.log('📍 Fetching shipping zones...\n');
    const zonesResponse = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!zonesResponse.ok) {
      console.error('❌ Zones API Error:', zonesResponse.status, zonesResponse.statusText);
      const errorText = await zonesResponse.text();
      console.error('Error details:', errorText);
      return;
    }

    const zones = await zonesResponse.json();
    console.log(`✅ Found ${zones.length} shipping zones\n`);

    // Fetch methods for each zone
    for (const zone of zones) {
      console.log(`\n📦 Zone: ${zone.name} (ID: ${zone.id})`);
      console.log(`   Order: ${zone.order}`);

      const methodsResponse = await fetch(
        `${baseUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (methodsResponse.ok) {
        const methods = await methodsResponse.json();
        console.log(`   Methods (${methods.length}):`);

        methods.forEach((method: any) => {
          console.log(`\n   🔹 ${method.method_title} (${method.method_id})`);
          console.log(`      Enabled: ${method.enabled ? '✅' : '❌'}`);
          console.log(`      Order: ${method.order}`);
          
          if (method.settings) {
            if (method.settings.cost) {
              console.log(`      Cost: €${method.settings.cost.value || '0'}`);
            }
            if (method.settings.min_amount) {
              console.log(`      Min amount: €${method.settings.min_amount.value || 'none'}`);
            }
            if (method.settings.requires) {
              console.log(`      Requires: ${method.settings.requires.value || 'none'}`);
            }
          }
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkWooCommerceShipping();

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function getZoneDetails() {
  const baseUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const headers = { 
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json' 
  };

  console.log('🔍 Fetching detailed shipping info...\n');

  try {
    // Zone 1: Nederland
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 ZONE 1: NEDERLAND');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const nl = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones/1/methods`, { 
      headers,
      signal: AbortSignal.timeout(8000) 
    });
    
    if (!nl.ok) {
      console.log(`❌ Error ${nl.status}: ${nl.statusText}`);
      const errorText = await nl.text();
      console.log(errorText.substring(0, 300));
      return;
    }
    
    const nlMethods = await nl.json();
    
    if (!Array.isArray(nlMethods)) {
      console.log('⚠️  Response is not an array:', nlMethods);
      return;
    }
    
    nlMethods.forEach((m: any) => {
      console.log(`${m.enabled ? '✅' : '❌'} ${m.method_title} (${m.method_id})`);
      console.log(`   Instance ID: ${m.instance_id}`);
      
      if (m.settings) {
        Object.keys(m.settings).forEach(key => {
          const setting = m.settings[key];
          if (setting.value !== undefined && setting.value !== '') {
            console.log(`   ${setting.label}: ${setting.value}`);
          }
        });
      }
      console.log('');
    });

    // Zone 2: Belgie & Duitsland
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 ZONE 2: BELGIE & DUITSLAND');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    const bede = await fetch(`${baseUrl}/wp-json/wc/v3/shipping/zones/2/methods`, { 
      headers,
      signal: AbortSignal.timeout(8000) 
    });
    
    if (!bede.ok) {
      console.log(`❌ Error ${bede.status}: ${bede.statusText}`);
      const errorText = await bede.text();
      console.log(errorText.substring(0, 300));
      return;
    }
    
    const bedeMethods = await bede.json();
    
    if (!Array.isArray(bedeMethods)) {
      console.log('⚠️  Response is not an array:', bedeMethods);
      return;
    }
    
    bedeMethods.forEach((m: any) => {
      console.log(`${m.enabled ? '✅' : '❌'} ${m.method_title} (${m.method_id})`);
      console.log(`   Instance ID: ${m.instance_id}`);
      
      if (m.settings) {
        Object.keys(m.settings).forEach(key => {
          const setting = m.settings[key];
          if (setting.value !== undefined && setting.value !== '') {
            console.log(`   ${setting.label}: ${setting.value}`);
          }
        });
      }
      console.log('');
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

getZoneDetails();

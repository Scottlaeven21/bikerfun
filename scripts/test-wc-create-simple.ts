import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

async function testSimpleOrderCreate() {
  try {
    console.log('🧪 Testing simple WooCommerce order creation...\n');
    
    // Simpelste mogelijke order
    const simpleOrder = {
      status: 'processing',
      billing: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '0612345678',
        address_1: 'Teststraat 1',
        city: 'Amsterdam',
        postcode: '1000AA',
        country: 'NL',
      },
      shipping: {
        first_name: 'Test',
        last_name: 'User',
        address_1: 'Teststraat 1',
        city: 'Amsterdam',
        postcode: '1000AA',
        country: 'NL',
      },
      line_items: [
        {
          product_id: 152774335, // Key to Happiness
          quantity: 1,
        }
      ],
      payment_method: 'mollie',
      payment_method_title: 'Mollie',
      set_paid: true,
    };

    console.log('📤 Payload:', JSON.stringify(simpleOrder, null, 2));
    console.log('');

    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const url = `${WC_URL}/wp-json/wc/v3/orders`;
    
    console.log(`🔗 POST ${url}\n`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleOrder),
    });

    console.log(`📥 Response Status: ${response.status} ${response.statusText}\n`);

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Failed to create order');
      console.error('Response:', responseText);
      
      // Try to parse as JSON for better error message
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.data?.error) {
          console.error('\n🚨 PHP Error:');
          console.error(`   Type: ${errorJson.data.error.type}`);
          console.error(`   Message: ${errorJson.data.error.message}`);
          console.error(`   File: ${errorJson.data.error.file}`);
          console.error(`   Line: ${errorJson.data.error.line}`);
        }
      } catch (e) {
        // Not JSON
      }
      return;
    }

    const order = JSON.parse(responseText);
    console.log('✅ Order created successfully!');
    console.log(`   WooCommerce Order ID: ${order.id}`);
    console.log(`   Order Number: ${order.number}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Total: €${order.total}`);
    console.log('');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  }
}

testSimpleOrderCreate();

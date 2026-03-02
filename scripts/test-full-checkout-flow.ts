import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testCheckoutFlow() {
  console.log('🧪 Testing Full Checkout Flow\n');
  console.log('═'.repeat(60));
  
  // Step 1: Get a test product
  console.log('\n📦 STEP 1: Fetching test product...');
  const { data: products } = await supabase
    .from('webshop_products')
    .select('id, name, price, woo_product_id')
    .limit(1)
    .single();

  if (!products) {
    console.log('❌ No products found!');
    return;
  }

  console.log(`✅ Test product: ${products.name} (€${products.price})`);
  console.log(`   Product ID: ${products.id}`);
  console.log(`   WooCommerce ID: ${products.woo_product_id}`);

  // Step 2: Create test checkout
  console.log('\n🛒 STEP 2: Creating test checkout...');
  
  const testCustomer = {
    email: 'test@bikerfun.nl',
    phone: '0612345678',
  };

  const testBilling = {
    firstName: 'Test',
    lastName: 'Customer',
    street: 'Teststraat',
    houseNumber: '123',
    city: 'Amsterdam',
    postalCode: '1000AA',
    country: 'NL',
  };

  const testCartItems = [{
    product: {
      id: products.woo_product_id, // Use WooCommerce ID, not Supabase UUID
      name: products.name,
      price: products.price,
      woo_product_id: products.woo_product_id,
    },
    quantity: 1,
  }];

  console.log('✅ Test data prepared');
  console.log(`   Customer: ${testBilling.firstName} ${testBilling.lastName}`);
  console.log(`   Email: ${testCustomer.email}`);
  console.log(`   Address: ${testBilling.street} ${testBilling.houseNumber}, ${testBilling.city}`);

  // Step 3: Call checkout API
  console.log('\n💳 STEP 3: Calling checkout API...');
  
  const baseUrl = 'http://localhost:3002';
  
  try {
    const checkoutResponse = await fetch(`${baseUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems: testCartItems,
        customer: testCustomer,
        billing: testBilling,
        shipping: testBilling,
      }),
    });

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text();
      console.log('❌ Checkout failed:', error);
      return;
    }

    const checkoutData = await checkoutResponse.json();
    console.log('✅ Checkout successful!');
    console.log(`   Order ID: ${checkoutData.orderId}`);
    console.log(`   Order Number: ${checkoutData.orderNumber}`);
    console.log(`   Payment ID: ${checkoutData.paymentId}`);
    console.log(`   Payment URL: ${checkoutData.paymentUrl.substring(0, 50)}...`);

    // Step 4: Check order in Supabase
    console.log('\n📊 STEP 4: Verifying order in Supabase...');
    
    const { data: order } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('id', checkoutData.orderId)
      .single();

    if (!order) {
      console.log('❌ Order not found in Supabase!');
      return;
    }

    console.log('✅ Order found in Supabase:');
    console.log(`   Order Number: ${order.order_number}`);
    console.log(`   Customer: ${order.billing_first_name} ${order.billing_last_name}`);
    console.log(`   Email: ${order.customer_email}`);
    console.log(`   Address: ${order.billing_address_1}, ${order.billing_city}`);
    console.log(`   Total: €${order.total}`);
    console.log(`   Payment Status: ${order.payment_status}`);
    console.log(`   Items: ${order.items?.length || 0}`);
    console.log(`   WooCommerce ID: ${order.woo_order_id || 'Not synced yet'}`);

    // Step 5: Simulate Mollie payment success (manual step)
    console.log('\n💰 STEP 5: Payment Simulation');
    console.log('⚠️  Manual step required:');
    console.log(`   1. Open payment URL: ${checkoutData.paymentUrl}`);
    console.log(`   2. Complete the test payment in Mollie`);
    console.log(`   3. Mollie will trigger the webhook automatically`);
    console.log(`   4. Order will be synced to WooCommerce`);

    // Step 6: Instructions for verification
    console.log('\n🔍 STEP 6: Verification (after payment)');
    console.log('After completing the payment, verify:');
    console.log(`   1. Check order in Supabase: ${checkoutData.orderId}`);
    console.log(`   2. Check order in WooCommerce admin`);
    console.log(`   3. Check order confirmation page: ${baseUrl}/order-confirmation/${checkoutData.orderId}`);
    console.log(`   4. Check admin dashboard: ${baseUrl}/admin/orders`);

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Test Flow Completed!');
    console.log('\n📝 Summary:');
    console.log(`   • Order created in Supabase: ✅`);
    console.log(`   • Mollie payment URL generated: ✅`);
    console.log(`   • Awaiting payment completion: ⏳`);
    console.log(`   • After payment: Auto-sync to WooCommerce`);

  } catch (error: any) {
    console.error('\n❌ Error during checkout:', error.message);
  }
}

testCheckoutFlow();

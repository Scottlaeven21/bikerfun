import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function checkWooCommerceOrder() {
  console.log('🔍 Checking WooCommerce Order #3062...\n');

  const auth = Buffer.from(
    `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/orders/3062`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!response.ok) {
      console.log('❌ Cannot fetch order from WooCommerce');
      console.log(`   Status: ${response.status}`);
      return;
    }

    const order = await response.json();
    
    console.log('📦 Order #3062 Data:\n');
    console.log('Order Number:', order.number);
    console.log('Status:', order.status);
    console.log('Total:', order.total);
    console.log('\n👤 Billing Address:');
    console.log(JSON.stringify(order.billing, null, 2));
    console.log('\n📮 Shipping Address:');
    console.log(JSON.stringify(order.shipping, null, 2));
    console.log('\n📦 Line Items:');
    console.log(JSON.stringify(order.line_items, null, 2));
    console.log('\n💰 Payment:');
    console.log('Payment Method:', order.payment_method);
    console.log('Payment Method Title:', order.payment_method_title);
    console.log('Date Paid:', order.date_paid);
    console.log('Transaction ID:', order.transaction_id);
    
    console.log('\n📋 Meta Data:');
    order.meta_data.forEach((meta: any) => {
      console.log(`   ${meta.key}: ${meta.value}`);
    });

    // Check if data is missing
    console.log('\n🔍 Diagnostic:');
    const issues = [];
    
    if (!order.billing.first_name && !order.billing.last_name) {
      issues.push('❌ Billing name is missing');
    }
    if (!order.billing.address_1) {
      issues.push('❌ Billing address is missing');
    }
    if (!order.line_items || order.line_items.length === 0) {
      issues.push('❌ No line items');
    }
    if (parseFloat(order.total) === 0) {
      issues.push('❌ Total is €0.00');
    }
    
    if (issues.length > 0) {
      console.log('⚠️  Issues found:');
      issues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log('✅ Order looks complete!');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkWooCommerceOrder();

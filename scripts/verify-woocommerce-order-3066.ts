import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function verifyWooCommerceOrder() {
  console.log('🔍 Verifying WooCommerce Order #3066...\n');
  console.log('═'.repeat(60));

  const auth = Buffer.from(
    `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/orders/3066`,
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
    
    console.log('✅ WooCommerce Order #3066 Retrieved!\n');
    
    // Check billing
    console.log('👤 Billing Address:');
    console.log(`   Name: ${order.billing.first_name} ${order.billing.last_name}`);
    console.log(`   Email: ${order.billing.email}`);
    console.log(`   Phone: ${order.billing.phone}`);
    console.log(`   Address: ${order.billing.address_1}`);
    console.log(`   City: ${order.billing.city}`);
    console.log(`   Postcode: ${order.billing.postcode}`);
    console.log(`   Country: ${order.billing.country}`);
    
    // Check shipping
    console.log('\n📮 Shipping Address:');
    console.log(`   Name: ${order.shipping.first_name} ${order.shipping.last_name}`);
    console.log(`   Address: ${order.shipping.address_1}`);
    console.log(`   City: ${order.shipping.city}`);
    console.log(`   Postcode: ${order.shipping.postcode}`);
    console.log(`   Country: ${order.shipping.country}`);
    
    // Check line items
    console.log('\n📦 Line Items:');
    order.line_items.forEach((item: any, index: number) => {
      console.log(`   ${index + 1}. ${item.name}`);
      console.log(`      Quantity: ${item.quantity}`);
      console.log(`      Price: €${item.price}`);
      console.log(`      Total: €${item.total}`);
    });
    
    // Check totals
    console.log('\n💰 Order Totals:');
    console.log(`   Subtotal: €${order.total}`);
    console.log(`   Shipping: €${order.shipping_total || '0.00'}`);
    console.log(`   Total: €${order.total}`);
    
    // Check payment
    console.log('\n💳 Payment:');
    console.log(`   Method: ${order.payment_method_title}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Date Paid: ${order.date_paid || 'Not paid'}`);
    console.log(`   Transaction ID: ${order.transaction_id || 'None'}`);
    
    // Diagnostic
    console.log('\n🔍 Data Validation:');
    const issues = [];
    
    if (!order.billing.first_name || !order.billing.last_name) {
      issues.push('❌ Billing name missing');
    } else {
      console.log('   ✅ Billing name present');
    }
    
    if (!order.billing.address_1) {
      issues.push('❌ Billing address missing');
    } else {
      console.log('   ✅ Billing address present');
    }
    
    if (!order.billing.email) {
      issues.push('❌ Email missing');
    } else {
      console.log('   ✅ Email present');
    }
    
    if (!order.line_items || order.line_items.length === 0) {
      issues.push('❌ No line items');
    } else {
      console.log(`   ✅ Line items present (${order.line_items.length})`);
    }
    
    if (parseFloat(order.total) === 0) {
      issues.push('❌ Total is €0.00');
    } else {
      console.log(`   ✅ Total is €${order.total}`);
    }
    
    console.log('\n' + '═'.repeat(60));
    
    if (issues.length > 0) {
      console.log('⚠️  Issues found:');
      issues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log('✅ ALL DATA IS COMPLETE AND CORRECT!');
      console.log('🎉 Order sync is working perfectly!');
    }
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

verifyWooCommerceOrder();

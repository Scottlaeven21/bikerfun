import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const WC_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('❌ Missing WooCommerce credentials in .env.local');
  process.exit(1);
}

async function checkWooCommerceOrder(orderId: number) {
  try {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const url = `${WC_URL}/wp-json/wc/v3/orders/${orderId}`;
    
    console.log(`🔍 Fetching WooCommerce order ${orderId}...`);
    console.log(`URL: ${url}\n`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to fetch order ${orderId}`);
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error(`Error: ${error}\n`);
      return null;
    }

    const order = await response.json();
    
    console.log('✅ Order found in WooCommerce!\n');
    console.log('📦 Order Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Order ID:        ${order.id}`);
    console.log(`Order Number:    ${order.number}`);
    console.log(`Status:          ${order.status}`);
    console.log(`Date Created:    ${order.date_created}`);
    console.log(`Payment Method:  ${order.payment_method_title || order.payment_method}`);
    console.log('');
    
    console.log('👤 Customer:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Name:   ${order.billing.first_name} ${order.billing.last_name}`);
    console.log(`Email:  ${order.billing.email}`);
    console.log(`Phone:  ${order.billing.phone || 'N/A'}`);
    console.log('');
    
    console.log('📍 Shipping Address:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`${order.shipping.first_name} ${order.shipping.last_name}`);
    console.log(`${order.shipping.address_1}`);
    if (order.shipping.address_2) console.log(`${order.shipping.address_2}`);
    console.log(`${order.shipping.postcode} ${order.shipping.city}`);
    console.log(`${order.shipping.country}`);
    console.log('');
    
    console.log('🛒 Products:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    order.line_items.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.name}`);
      console.log(`   Quantity: ${item.quantity}`);
      console.log(`   Price:    €${item.price}`);
      console.log(`   Subtotal: €${item.subtotal}`);
      console.log('');
    });
    
    console.log('💰 Totals:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Subtotal:  €${order.total - order.shipping_total}`);
    console.log(`Shipping:  €${order.shipping_total}`);
    console.log(`Tax:       €${order.total_tax}`);
    console.log(`Total:     €${order.total}`);
    console.log('');
    
    console.log('📧 Email Status:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    // Check order notes for email info
    if (order.meta_data && order.meta_data.length > 0) {
      const emailSent = order.meta_data.find((meta: any) => 
        meta.key.includes('email') || meta.key.includes('notification')
      );
      if (emailSent) {
        console.log(`Email meta found: ${JSON.stringify(emailSent, null, 2)}`);
      } else {
        console.log('⚠️  No email meta data found');
      }
    } else {
      console.log('⚠️  No meta data available');
    }
    console.log('');
    
    return order;
    
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    return null;
  }
}

async function listRecentOrders(limit: number = 5) {
  try {
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
    const url = `${WC_URL}/wp-json/wc/v3/orders?per_page=${limit}&orderby=date&order=desc`;
    
    console.log(`📋 Fetching ${limit} most recent WooCommerce orders...\n`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to fetch orders`);
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error(`Error: ${error}\n`);
      return [];
    }

    const orders = await response.json();
    
    console.log(`✅ Found ${orders.length} recent orders:\n`);
    console.log('Recent Orders:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID      | Date                | Customer              | Total   | Status');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    orders.forEach((order: any) => {
      const id = String(order.id).padEnd(7);
      const date = order.date_created.substring(0, 19).replace('T', ' ');
      const customer = `${order.billing.first_name} ${order.billing.last_name}`.padEnd(20);
      const total = `€${order.total}`.padEnd(8);
      const status = order.status;
      
      console.log(`${id} | ${date} | ${customer} | ${total} | ${status}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return orders;
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return [];
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('📋 No order ID provided, showing recent orders...\n');
  listRecentOrders(10).then(() => {
    console.log('\n💡 To check a specific order:');
    console.log('   npx tsx scripts/check-woocommerce-order.ts <ORDER_ID>');
    console.log('   Example: npx tsx scripts/check-woocommerce-order.ts 12345\n');
  });
} else {
  const orderId = parseInt(args[0]);
  
  if (isNaN(orderId)) {
    console.error('❌ Invalid order ID. Must be a number.');
    console.log('Usage: npx tsx scripts/check-woocommerce-order.ts <ORDER_ID>');
    process.exit(1);
  }
  
  checkWooCommerceOrder(orderId);
}

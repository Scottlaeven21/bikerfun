/**
 * WooCommerce Order Sync
 * Sync orders from Supabase to WooCommerce for email/shipping automation
 */

import { WooCommerceClient } from './client';

const wooClient = new WooCommerceClient();

interface OrderItem {
  product_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  billing_address: any;
  shipping_address: any;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  items: OrderItem[];
  mollie_payment_id: string;
}

/**
 * Sync order to WooCommerce
 */
export async function syncOrderToWooCommerce(order: OrderData): Promise<number> {
  try {
    console.log(`Syncing order ${order.order_number} to WooCommerce...`);

    // Prepare billing address
    const billing = {
      first_name: order.billing_address?.firstName || '',
      last_name: order.billing_address?.lastName || '',
      address_1: `${order.billing_address?.street || ''} ${order.billing_address?.houseNumber || ''}`.trim() || 'N/A',
      address_2: '',
      city: order.billing_address?.city || '',
      state: '',
      postcode: order.billing_address?.postalCode || '',
      country: order.billing_address?.country || 'NL',
      email: order.customer_email || '',
      phone: order.customer_phone || '',
    };

    // Prepare shipping address (fallback to billing if not provided)
    const shipping = {
      first_name: order.shipping_address?.firstName || order.billing_address?.firstName || '',
      last_name: order.shipping_address?.lastName || order.billing_address?.lastName || '',
      address_1: `${order.shipping_address?.street || order.billing_address?.street || ''} ${order.shipping_address?.houseNumber || order.billing_address?.houseNumber || ''}`.trim() || 'N/A',
      address_2: '',
      city: order.shipping_address?.city || order.billing_address?.city || '',
      state: '',
      postcode: order.shipping_address?.postalCode || order.billing_address?.postalCode || '',
      country: order.shipping_address?.country || order.billing_address?.country || 'NL',
    };

    // Prepare line items
    // Note: product_id is omitted when null/0 to avoid WooCommerce validation errors
    // WooCommerce accepts line items with just name + price for custom products
    const lineItems = order.items.map(item => {
      const lineItem: any = {
        name: item.product_name,
        quantity: item.quantity,
        price: item.price.toString(),
        total: item.subtotal.toString(),
      };
      
      // Only add product_id if it's a valid WooCommerce product ID
      if (item.product_id && item.product_id > 0) {
        lineItem.product_id = item.product_id;
      }
      
      return lineItem;
    });

    // Prepare shipping lines
    const shippingLines = order.shipping_cost > 0 ? [{
      method_id: 'flat_rate',
      method_title: 'Standaard verzending',
      total: order.shipping_cost.toString(),
    }] : [];

    // Create order in WooCommerce
    const wooOrder = {
      status: 'processing',
      customer_id: 0,
      billing,
      shipping,
      line_items: lineItems,
      shipping_lines: shippingLines,
      payment_method: 'mollie',
      payment_method_title: 'Mollie',
      set_paid: true, // Mark as paid since Mollie payment succeeded
      prices_include_tax: true, // NL standard - prices already include 21% VAT
      transaction_id: order.mollie_payment_id,
      meta_data: [
        {
          key: '_bikerfun_order_id',
          value: order.id,
        },
        {
          key: '_bikerfun_order_number',
          value: order.order_number,
        },
        {
          key: '_mollie_payment_id',
          value: order.mollie_payment_id,
        },
        {
          key: '_send_order_email',
          value: 'true', // Trigger confirmation email
        },
      ],
    };

    const wooOrderResponse = await wooClient.createOrder(wooOrder);
    const wooOrderId = wooOrderResponse.id;
    
    console.log(`✅ Order synced to WooCommerce! WooCommerce Order ID: ${wooOrderId}`);
    
    return wooOrderId;

  } catch (error) {
    console.error('Error syncing order to WooCommerce:', error);
    throw error;
  }
}

/**
 * Check if order already exists in WooCommerce
 */
export async function checkOrderExists(supabaseOrderId: string): Promise<number | null> {
  try {
    // Search for order by meta data
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-json/wc/v3/orders?meta_key=_bikerfun_order_id&meta_value=${supabaseOrderId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    if (!response.ok) return null;

    const orders = await response.json();
    return orders.length > 0 ? orders[0].id : null;

  } catch (error) {
    console.error('Error checking order existence:', error);
    return null;
  }
}

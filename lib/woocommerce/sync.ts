/**
 * WooCommerce Order Sync
 * Sync orders from Supabase to WooCommerce for email/shipping automation
 */

import { WooCommerceClient } from './client';

const wooClient = new WooCommerceClient();

// Nederlandse standaard: alle webshopprijzen op bikerfun.nl zijn INCLUSIEF 21% BTW.
// We sturen daarom expliciete netto + BTW bedragen mee, zodat WooCommerce niet
// nogmaals BTW op de (incl) prijs gooit — ongeacht de "Prices entered with tax"
// instelling in WooCommerce → Settings → Tax.
const VAT_RATE = 0.21;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Splits een inc-BTW bedrag in (netto, btw). De som blijft exact gelijk aan het ingangsbedrag. */
function splitInclVat(amountIncl: number): { net: number; tax: number } {
  const safe = Number.isFinite(amountIncl) ? amountIncl : 0;
  const net = round2(safe / (1 + VAT_RATE));
  const tax = round2(safe - net);
  return { net, tax };
}

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

    // ── Line items met expliciete netto/BTW breakdown ─────────────────────────
    // De `price` op een product is incl. BTW (Nederlandse standaard).
    // WooCommerce verwacht `subtotal` / `total` EXCL. BTW als losse strings, plus
    // `subtotal_tax` / `total_tax` voor het BTW-deel. Door beide expliciet mee
    // te sturen voorkomen we dat WooCommerce zelf nogmaals 21% bovenop de
    // incl-prijs zet (het probleem dat de klant zag bij €34,95 → ~€42,29).
    let itemsTaxTotal = 0;
    const lineItems = order.items.map(item => {
      const lineTotalIncl = round2((Number(item.subtotal) || (item.price * item.quantity)));
      const { net: lineNet, tax: lineTax } = splitInclVat(lineTotalIncl);
      itemsTaxTotal = round2(itemsTaxTotal + lineTax);

      const lineItem: any = {
        name: item.product_name,
        quantity: item.quantity,
        subtotal: lineNet.toFixed(2),
        subtotal_tax: lineTax.toFixed(2),
        total: lineNet.toFixed(2),
        total_tax: lineTax.toFixed(2),
        tax_class: '',
      };

      // Alleen product_id meesturen als het een echte WooCommerce product ID is
      if (item.product_id && item.product_id > 0) {
        lineItem.product_id = item.product_id;
      }

      return lineItem;
    });

    // ── Verzendkosten met expliciete BTW-split ────────────────────────────────
    // Verzendkosten op bikerfun.nl worden incl. BTW getoond, dus zelfde aanpak.
    let shippingTaxTotal = 0;
    const shippingLines: any[] = [];
    if (order.shipping_cost > 0) {
      const { net: shipNet, tax: shipTax } = splitInclVat(round2(order.shipping_cost));
      shippingTaxTotal = shipTax;
      shippingLines.push({
        method_id: 'flat_rate',
        method_title: 'Standaard verzending',
        total: shipNet.toFixed(2),
        total_tax: shipTax.toFixed(2),
      });
    }

    // ── Tax line zodat WooCommerce de BTW correct boekt in de admin ──────────
    const totalTax = round2(itemsTaxTotal + shippingTaxTotal);
    const taxLines = totalTax > 0
      ? [{
          rate_code: 'NL-BTW-21',
          rate_id: 0,
          label: 'BTW (21%)',
          compound: false,
          tax_total: itemsTaxTotal.toFixed(2),
          shipping_tax_total: shippingTaxTotal.toFixed(2),
        }]
      : [];

    // Create order in WooCommerce
    const wooOrder: any = {
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

    if (taxLines.length > 0) {
      wooOrder.tax_lines = taxLines;
    }

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

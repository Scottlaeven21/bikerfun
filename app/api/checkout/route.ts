import { NextRequest, NextResponse } from 'next/server';
import { createMolliePayment } from '@/lib/mollie/client';
import { createClient } from '@supabase/supabase-js';
import { calculateShipping } from '@/lib/woocommerce/shipping';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cartItems, customer, billing, shipping } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Winkelwagen is leeg' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);
    
    // Get shipping cost from WooCommerce
    const shippingCost = await calculateShipping(subtotal, billing?.country || 'NL');
    const total = subtotal + shippingCost;

    // Create order in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Generate order number
    const { data: orderNumberResult } = await supabase.rpc('generate_order_number');
    const orderNumber = orderNumberResult || `BF-${Date.now()}`;
    
    // Use shipping address if provided, otherwise use billing
    const shippingAddr = shipping || billing;
    
    const { data: order, error: orderError } = await supabase
      .from('webshop_orders')
      .insert({
        order_number: orderNumber,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        
        // Billing address (separate columns)
        billing_first_name: billing.firstName,
        billing_last_name: billing.lastName,
        billing_company: billing.company || null,
        billing_address_1: `${billing.street} ${billing.houseNumber}`,
        billing_address_2: billing.addition || null,
        billing_city: billing.city,
        billing_postcode: billing.postalCode,
        billing_country: billing.country || 'NL',
        
        // Shipping address (separate columns)
        shipping_first_name: shippingAddr.firstName,
        shipping_last_name: shippingAddr.lastName,
        shipping_company: shippingAddr.company || null,
        shipping_address_1: `${shippingAddr.street} ${shippingAddr.houseNumber}`,
        shipping_address_2: shippingAddr.addition || null,
        shipping_city: shippingAddr.city,
        shipping_postcode: shippingAddr.postalCode,
        shipping_country: shippingAddr.country || 'NL',
        
        // Totals
        subtotal: subtotal,
        shipping_total: shippingCost,
        tax_total: 0,
        total: total,
        
        // Status
        status: 'pending',
        payment_method: 'mollie',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Fout bij aanmaken bestelling' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = cartItems.map((item: any) => {
      const itemPrice = parseFloat(item.product.price);
      const itemSubtotal = itemPrice * item.quantity;
      
      return {
        order_id: order.id,
        product_id: null, // We don't have Supabase product UUID in cart, only WooCommerce ID
        woo_product_id: item.product.id, // This is the WooCommerce product ID (number)
        product_name: item.product.name,
        product_sku: item.product.sku || null,
        product_image: item.product.images?.[0]?.src || null,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
        total: itemSubtotal, // Total is same as subtotal (no item-level discounts)
      };
    });

    const { error: itemsError } = await supabase
      .from('webshop_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      console.error('Order items data:', JSON.stringify(orderItems, null, 2));
      return NextResponse.json(
        { error: 'Fout bij aanmaken orderitems', details: itemsError.message },
        { status: 500 }
      );
    }

    // Create Mollie payment
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
    const payment = await createMolliePayment({
      amount: {
        currency: 'EUR',
        value: total.toFixed(2),
      },
      description: `Bikerfun Order #${order.order_number}`,
      redirectUrl: `${baseUrl}/payment-return?order=${order.id}`,
      webhookUrl: `${baseUrl}/api/webhooks/mollie`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
    });

    // Update order with Mollie payment ID
    await supabase
      .from('webshop_orders')
      .update({ mollie_payment_id: payment.id })
      .eq('id', order.id);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      paymentUrl: payment._links.checkout.href,
      paymentId: payment.id,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

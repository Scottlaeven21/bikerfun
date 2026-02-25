import { NextRequest, NextResponse } from 'next/server';
import { createMolliePayment } from '@/lib/mollie/client';
import { createClient } from '@supabase/supabase-js';

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

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item.product.price) * item.quantity);
    }, 0);
    
    const shippingCost = subtotal >= 50 ? 0 : 6.95; // Free shipping above €50
    const total = subtotal + shippingCost;

    // Create order in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: order, error: orderError } = await supabase
      .from('webshop_orders')
      .insert({
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone || null,
        billing_address: {
          firstName: billing.firstName,
          lastName: billing.lastName,
          street: billing.street,
          houseNumber: billing.houseNumber,
          postalCode: billing.postalCode,
          city: billing.city,
          country: billing.country || 'NL',
        },
        shipping_address: shipping || billing,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        tax: 0,
        total: total,
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
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.woo_product_id || null,
      product_name: item.product.name,
      product_image: item.product.images?.[0]?.src || null,
      quantity: item.quantity,
      price: parseFloat(item.product.price),
      subtotal: parseFloat(item.product.price) * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('webshop_order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json(
        { error: 'Fout bij aanmaken orderitems' },
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

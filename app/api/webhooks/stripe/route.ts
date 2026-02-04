import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createClient();
      const metadata = session.metadata!;

      // Parse items from metadata
      const items = JSON.parse(metadata.items);

      // Create order
      const orderData = {
        user_id: metadata.user_id || null,
        email: session.customer_email!,
        full_name: metadata.full_name,
        phone: metadata.phone || null,
        shipping_address_line1: metadata.shipping_address_line1,
        shipping_address_line2: metadata.shipping_address_line2 || null,
        shipping_city: metadata.shipping_city,
        shipping_postal_code: metadata.shipping_postal_code,
        shipping_country: metadata.shipping_country,
        subtotal: parseFloat(metadata.subtotal),
        shipping_cost: parseFloat(metadata.shipping_cost),
        tax: parseFloat(metadata.tax),
        total: parseFloat(metadata.total),
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_checkout_session_id: session.id,
        payment_status: 'paid' as const,
        fulfillment_status: 'unfulfilled' as const,
      };

      const { data, error: orderError } = await supabase
        .from('orders')
        .insert(orderData as any)
        .select()
        .single();

      const order = data as any;

      if (orderError) {
        console.error('Order creation error:', orderError);
        return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
      }

      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image_url: item.product_image_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
      }

      // TODO: Send confirmation email to customer
      // TODO: Update product stock

      console.log('Order created successfully:', order.id);
    } catch (error) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

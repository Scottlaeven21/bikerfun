import { NextRequest, NextResponse } from 'next/server';
import { getMolliePayment } from '@/lib/mollie/client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Mollie Webhook Handler
 * Called by Mollie when payment status changes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const paymentId = params.get('id');

    if (!paymentId) {
      console.error('No payment ID in webhook');
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    console.log(`Mollie webhook received for payment: ${paymentId}`);

    // Get payment details from Mollie
    const payment = await getMolliePayment(paymentId);
    
    console.log(`Payment status: ${payment.status}`);
    console.log(`Payment metadata:`, payment.metadata);

    // Update order in Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const orderId = payment.metadata?.order_id;
    if (!orderId) {
      console.error('No order_id in payment metadata');
      return NextResponse.json({ error: 'No order ID' }, { status: 400 });
    }

    let orderStatus = 'pending';
    if (payment.status === 'paid') {
      orderStatus = 'processing';
    } else if (payment.status === 'failed' || payment.status === 'canceled' || payment.status === 'expired') {
      orderStatus = 'failed';
    }

    const { error: updateError } = await supabase
      .from('webshop_orders')
      .update({
        status: orderStatus,
        payment_status: payment.status,
        paid_at: payment.status === 'paid' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`Order ${orderId} updated to status: ${orderStatus}`);

    // TODO: Trigger WooCommerce order sync here (Step 3)
    if (payment.status === 'paid') {
      console.log(`🎉 Payment successful for order ${orderId}! WooCommerce sync pending...`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook failed' },
      { status: 500 }
    );
  }
}

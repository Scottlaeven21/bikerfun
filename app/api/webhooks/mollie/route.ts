import { NextRequest, NextResponse } from 'next/server';
import { getMolliePayment } from '@/lib/mollie/client';
import { createClient } from '@supabase/supabase-js';
import { syncOrderToWooCommerce, checkOrderExists } from '@/lib/woocommerce/sync';
import { logAuditEvent } from '@/lib/audit/logger';

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
      await logAuditEvent({
        userEmail: 'system',
        action: 'update',
        resourceType: 'order',
        resourceId: orderId,
        details: { payment_status: payment.status, error: updateError.message },
      });
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`Order ${orderId} updated to status: ${orderStatus}`);
    
    // Log payment status update
    await logAuditEvent({
      userEmail: 'system',
      action: 'update',
      resourceType: 'order',
      resourceId: orderId,
      details: { 
        payment_status: payment.status, 
        order_status: orderStatus,
        payment_id: paymentId 
      },
    });

    // Sync to WooCommerce if payment is successful
    if (payment.status === 'paid') {
      console.log(`🎉 Payment successful for order ${orderId}! Starting WooCommerce sync...`);
      
      try {
        // First check in Supabase if already synced (more reliable than WooCommerce API)
        const { data: existingOrder } = await supabase
          .from('webshop_orders')
          .select('woo_order_id')
          .eq('id', orderId)
          .single();
        
        if (existingOrder?.woo_order_id) {
          console.log(`✅ Order already synced to WooCommerce (ID: ${existingOrder.woo_order_id})`);
          // Already synced, skip
          return NextResponse.json({ success: true, message: 'Order already synced' });
        }
        
        console.log('📤 Order not yet synced, creating in WooCommerce...');
          // Fetch full order details with items
          const { data: fullOrder } = await supabase
            .from('webshop_orders')
            .select(`
              *,
              items:webshop_order_items(*)
            `)
            .eq('id', orderId)
            .single();

          if (fullOrder) {
            // Transform order data to match sync function expected format
            const orderData = {
              id: fullOrder.id,
              order_number: fullOrder.order_number,
              customer_email: fullOrder.customer_email,
              customer_name: `${fullOrder.billing_first_name} ${fullOrder.billing_last_name}`,
              customer_phone: fullOrder.customer_phone,
              billing_address: {
                firstName: fullOrder.billing_first_name,
                lastName: fullOrder.billing_last_name,
                street: fullOrder.billing_address_1?.split(' ')[0] || '',
                houseNumber: fullOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
                city: fullOrder.billing_city,
                postalCode: fullOrder.billing_postcode,
                country: fullOrder.billing_country || 'NL',
              },
              shipping_address: {
                firstName: fullOrder.shipping_first_name || fullOrder.billing_first_name,
                lastName: fullOrder.shipping_last_name || fullOrder.billing_last_name,
                street: fullOrder.shipping_address_1?.split(' ')[0] || fullOrder.billing_address_1?.split(' ')[0] || '',
                houseNumber: fullOrder.shipping_address_1?.split(' ').slice(1).join(' ') || fullOrder.billing_address_1?.split(' ').slice(1).join(' ') || '',
                city: fullOrder.shipping_city || fullOrder.billing_city,
                postalCode: fullOrder.shipping_postcode || fullOrder.billing_postcode,
                country: fullOrder.shipping_country || fullOrder.billing_country || 'NL',
              },
              subtotal: parseFloat(fullOrder.subtotal),
              shipping_cost: parseFloat(fullOrder.shipping_total || '0'),
              tax: parseFloat(fullOrder.tax_total || '0'),
              total: parseFloat(fullOrder.total),
              items: fullOrder.items.map((item: any) => ({
                product_id: item.woo_product_id,
                product_name: item.product_name,
                quantity: item.quantity,
                price: parseFloat(item.price),
                subtotal: parseFloat(item.subtotal),
              })),
              mollie_payment_id: paymentId,
            };
            
            // Sync to WooCommerce
            const wooOrderId = await syncOrderToWooCommerce(orderData);
            
            // Update Supabase with WooCommerce order ID and synced flag
            await supabase
              .from('webshop_orders')
              .update({ 
                woo_order_id: wooOrderId,
                synced_to_woo: true 
              })
              .eq('id', orderId);
            
            console.log(`✅ Order synced! WooCommerce Order ID: ${wooOrderId}`);
            console.log(`✅ WooCommerce will now send emails and handle shipping.`);
            
            // Log successful sync
            await logAuditEvent({
              userEmail: 'system',
              action: 'sync',
              resourceType: 'order',
              resourceId: orderId,
              details: { woo_order_id: wooOrderId, payment_id: paymentId },
            });
          }
      } catch (syncError) {
        console.error('WooCommerce sync error:', syncError);
        // Log sync failure
        await logAuditEvent({
          userEmail: 'system',
          action: 'sync',
          resourceType: 'order',
          resourceId: orderId,
          details: { 
            error: syncError instanceof Error ? syncError.message : 'Unknown error',
            payment_id: paymentId 
          },
        });
        // Don't fail the webhook - order is already paid
        // We can retry sync manually later if needed
      }
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

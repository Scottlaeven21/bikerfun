import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncOrderToWooCommerce, checkOrderExists } from '@/lib/woocommerce/sync';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Manual order sync to WooCommerce
 * Use this if automatic sync failed
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already synced
    const existingWooOrderId = await checkOrderExists(orderId);
    
    if (existingWooOrderId) {
      return NextResponse.json({
        success: true,
        message: 'Order already synced',
        wooOrderId: existingWooOrderId,
      });
    }

    // Fetch full order details
    const { data: order, error } = await supabase
      .from('webshop_orders')
      .select(`
        *,
        items:webshop_order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order niet gevonden' },
        { status: 404 }
      );
    }

    // Check if payment is successful
    if (order.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Order is nog niet betaald' },
        { status: 400 }
      );
    }

    // Sync to WooCommerce
    const wooOrderId = await syncOrderToWooCommerce(order);
    
    // Update Supabase with WooCommerce order ID
    await supabase
      .from('webshop_orders')
      .update({ woo_order_id: wooOrderId })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      message: 'Order succesvol gesynchroniseerd',
      wooOrderId,
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync mislukt' },
      { status: 500 }
    );
  }
}

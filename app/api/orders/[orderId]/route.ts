import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    const supabase = createClient(supabaseUrl, supabaseKey);
    
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

    // Transform order data for frontend compatibility
    const transformedOrder = {
      ...order,
      shipping_cost: parseFloat(order.shipping_total || '0'),
      customer_name: `${order.billing_first_name} ${order.billing_last_name}`,
    };

    return NextResponse.json({ order: transformedOrder });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Fout bij ophalen order' },
      { status: 500 }
    );
  }
}

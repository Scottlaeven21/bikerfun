import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/woocommerce/shipping';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtotal, country = 'NL' } = body;

    if (typeof subtotal !== 'number') {
      return NextResponse.json(
        { error: 'Subtotal is verplicht' },
        { status: 400 }
      );
    }

    const shippingCost = await calculateShipping(subtotal, country);

    return NextResponse.json({
      subtotal,
      shipping_cost: shippingCost,
      total: subtotal + shippingCost,
      free_shipping_threshold: 50, // This could also be fetched from WooCommerce
    });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: 'Kon verzendkosten niet berekenen' },
      { status: 500 }
    );
  }
}

// GET endpoint for quick checks
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subtotal = parseFloat(searchParams.get('subtotal') || '0');
  const country = searchParams.get('country') || 'NL';

  if (!subtotal || subtotal <= 0) {
    return NextResponse.json(
      { error: 'Subtotal parameter is verplicht (bijv. ?subtotal=10.00)' },
      { status: 400 }
    );
  }

  try {
    const shippingCost = await calculateShipping(subtotal, country);

    return NextResponse.json({
      subtotal,
      shipping_cost: shippingCost,
      total: subtotal + shippingCost,
      free_shipping_threshold: 50,
    });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: 'Kon verzendkosten niet berekenen' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping, getCountryShippingInfo } from '@/lib/woocommerce/shipping';

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

    const [shippingCost, info] = await Promise.all([
      calculateShipping(subtotal, country),
      getCountryShippingInfo(country),
    ]);

    return NextResponse.json({
      subtotal,
      shipping_cost: shippingCost,
      total: subtotal + shippingCost,
      free_shipping_threshold: info.alwaysFree ? null : info.freeMin,
      country,
      source: 'woocommerce',
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
    const [shippingCost, info] = await Promise.all([
      calculateShipping(subtotal, country),
      getCountryShippingInfo(country),
    ]);

    return NextResponse.json({
      subtotal,
      shipping_cost: shippingCost,
      total: subtotal + shippingCost,
      free_shipping_threshold: info.alwaysFree ? null : info.freeMin,
      country,
    });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: 'Kon verzendkosten niet berekenen' },
      { status: 500 }
    );
  }
}

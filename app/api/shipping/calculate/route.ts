import { NextRequest, NextResponse } from 'next/server';
import { calculateShipping, quoteWooCommerceShipping } from '@/lib/woocommerce/shipping';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function normalizeItems(raw: unknown): { id: number; quantity: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item: any) => ({
      id: Number(item?.id ?? item?.product?.id),
      quantity: Number(item?.quantity) || 1,
    }))
    .filter((item) => item.id > 0 && item.quantity > 0);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subtotal = 0, country = 'NL', items, postcode, city } = body;
    const quoteItems = normalizeItems(items);

    const shippingCost =
      quoteItems.length > 0
        ? await quoteWooCommerceShipping(quoteItems, country, { postcode, city })
        : await calculateShipping(Number(subtotal) || 0, country);

    if (shippingCost === null) {
      return NextResponse.json(
        { error: 'Kon verzendkosten niet ophalen uit WooCommerce' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      subtotal,
      shipping_cost: shippingCost,
      total: (Number(subtotal) || 0) + shippingCost,
      free_shipping_threshold: null,
      country,
      source: quoteItems.length > 0 ? 'woocommerce-store' : 'woocommerce',
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
      free_shipping_threshold: null,
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

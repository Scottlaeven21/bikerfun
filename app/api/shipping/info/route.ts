import { NextResponse } from 'next/server';
import { getShippingSummary, formatShippingInfo } from '@/lib/woocommerce/shipping';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const summary = await getShippingSummary();
    return NextResponse.json({
      NL: { ...summary.NL, label: formatShippingInfo(summary.NL) },
      BE: { ...summary.BE, label: formatShippingInfo(summary.BE) },
      DE: { ...summary.DE, label: formatShippingInfo(summary.DE) },
    });
  } catch (error) {
    console.error('Error fetching shipping info:', error);
    return NextResponse.json({ error: 'Kon verzendinfo niet ophalen' }, { status: 500 });
  }
}

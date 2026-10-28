'use client';

import { setDealerInvoicePaid } from '@/app/actions/admin-dealers';

export function DealerInvoicePaidButton({ invoiceId, paid }: { invoiceId: string; paid: boolean }) {
  return (
    <button
      type="button"
      onClick={() => setDealerInvoicePaid(invoiceId, !paid)}
      className="text-xs font-semibold underline"
    >
      {paid ? 'Zet open' : 'Markeer betaald'}
    </button>
  );
}

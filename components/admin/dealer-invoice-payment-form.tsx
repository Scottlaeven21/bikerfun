'use client';

import { useState } from 'react';
import { recordDealerInvoicePayment, setDealerInvoicePaid } from '@/app/actions/admin-dealers';

export function DealerInvoicePaymentForm({
  invoiceId,
  remaining,
  paid,
}: {
  invoiceId: string;
  remaining: number;
  paid: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = e.currentTarget;
    const result = await recordDealerInvoicePayment(invoiceId, new FormData(form));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
  }

  return (
    <div className="space-y-2 min-w-[12rem]">
      {!paid && (
        <form onSubmit={handlePayment} className="flex items-center gap-2">
          <input
            name="amount"
            inputMode="decimal"
            placeholder="Bedrag"
            required
            className="w-24 px-2 py-1 border-2 border-gray-300 rounded-lg text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="text-xs font-semibold underline disabled:opacity-50"
          >
            {loading ? '...' : 'Deelbetaling'}
          </button>
        </form>
      )}
      <button
        type="button"
        onClick={async () => {
          setLoading(true);
          const result = await setDealerInvoicePaid(invoiceId, !paid);
          setLoading(false);
          if (result.error) setError(result.error);
        }}
        disabled={loading}
        className="text-xs font-semibold underline disabled:opacity-50"
      >
        {paid ? 'Zet open' : remaining > 0 ? 'Markeer volledig betaald' : 'Markeer betaald'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

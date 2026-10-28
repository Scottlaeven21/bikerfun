'use client';

import { useState } from 'react';
import { createDealerInvoice } from '@/app/actions/admin-dealers';

function defaultInvoiceDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 12).toISOString().slice(0, 10);
}

export function DealerInvoiceForm({
  dealerId,
  defaultDescription,
}: {
  dealerId: string;
  defaultDescription?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const result = await createDealerInvoice(new FormData(form));
    setLoading(false);
    setMessage(result.error || 'Factuur toegevoegd.');
    if (!result.error) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="dealer_id" value={dealerId} />
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Factuur-PDF *</span>
        <input
          type="file"
          name="invoice_pdf"
          accept="application/pdf,.pdf"
          required
          className="w-full text-sm"
        />
      </label>
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Omschrijving *</span>
        <input
          name="description"
          required
          defaultValue={defaultDescription}
          placeholder="Verzamelfactuur oktober 2026"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Bedrag *</span>
          <input
            name="amount"
            required
            inputMode="decimal"
            placeholder="0,00"
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Factuurdatum *</span>
          <input
            name="due_date"
            type="date"
            required
            defaultValue={defaultInvoiceDate()}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Uploaden...' : 'Factuur toevoegen'}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { createDealerInvoice } from '@/app/actions/admin-dealers';

export function DealerInvoiceForm({
  dealerId,
  applicationId,
}: {
  dealerId: string;
  applicationId?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const result = await createDealerInvoice(new FormData(form));
    setMessage(result.error || 'Factuur toegevoegd.');
    if (!result.error) form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="dealer_id" value={dealerId} />
      {applicationId && <input type="hidden" name="application_id" value={applicationId} />}
      <input
        name="description"
        required
        placeholder="Omschrijving"
        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="amount"
          required
          placeholder="Bedrag"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
        />
        <input name="due_date" type="date" className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg" />
      </div>
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
        Factuur toevoegen
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}

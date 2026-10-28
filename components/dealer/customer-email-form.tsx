'use client';

import { useState } from 'react';
import { updateDealerCustomerEmail } from '@/app/actions/dealer';

export function CustomerEmailForm({
  applicationId,
  customerName,
  customerEmail,
}: {
  applicationId: string;
  customerName: string;
  customerEmail: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await updateDealerCustomerEmail(applicationId, new FormData(e.currentTarget));
    setMessage(result.error || 'Opgeslagen. Statusmails gaan naar dit adres.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="customer_name"
          defaultValue={customerName}
          placeholder="Naam klant"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
        />
        <input
          name="customer_email"
          type="email"
          defaultValue={customerEmail}
          placeholder="klant@email.nl"
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg"
        />
      </div>
      <button type="submit" className="text-sm font-bold uppercase text-biker-black underline">
        Klantmail opslaan
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  );
}

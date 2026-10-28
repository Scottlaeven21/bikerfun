'use client';

import { useState } from 'react';
import { deleteDealer } from '@/app/actions/admin-dealers';

export function DeleteDealerButton({
  dealerId,
  companyName,
  compact,
}: {
  dealerId: string;
  companyName: string;
  compact?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (
      !confirm(
        `Dealerportaal van ${companyName} verwijderen? Aanvragen, facturen en inlog verdwijnen. Dit kan niet ongedaan worden gemaakt.`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    const result = await deleteDealer(dealerId);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          compact
            ? 'text-xs font-semibold text-red-600 hover:underline disabled:opacity-50'
            : 'bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50'
        }
      >
        {loading ? 'Verwijderen...' : compact ? 'Verwijder' : 'Dealer verwijderen'}
      </button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}

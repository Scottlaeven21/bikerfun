'use client';

import { useState } from 'react';
import { updateDealerEmailPreference } from '@/app/actions/dealer';
import { DEALER_EMAIL_UPDATE_OPTIONS, type DealerEmailUpdates } from '@/lib/dealer/status';

export function DealerEmailPreferenceForm({
  current,
}: {
  current?: DealerEmailUpdates | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const result = await updateDealerEmailPreference(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage('Voorkeur opgeslagen.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset className="space-y-3">
        <legend className="sr-only">Statusmails</legend>
        {DEALER_EMAIL_UPDATE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 cursor-pointer has-[:checked]:border-biker-yellow"
          >
            <input
              type="radio"
              name="email_updates"
              value={option.value}
              defaultChecked={(current || 'all') === option.value}
              className="mt-1 h-4 w-4 accent-biker-yellow"
            />
            <span>
              <span className="block font-semibold text-gray-900">{option.label}</span>
              <span className="block text-sm text-gray-600 mt-0.5">{option.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-biker-yellow text-biker-black px-5 py-2.5 rounded-full font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Opslaan...' : 'Voorkeur opslaan'}
      </button>
    </form>
  );
}

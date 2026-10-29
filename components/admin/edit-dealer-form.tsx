'use client';

import { useState } from 'react';
import { updateDealer } from '@/app/actions/admin-dealers';
import type { Dealer } from '@/lib/dealer/types';

const inputClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900';

export function EditDealerForm({ dealer }: { dealer: Dealer }) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const result = await updateDealer(dealer.id, new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage('Gegevens opgeslagen.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Gegevens aanpassen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Bedrijfsnaam *</span>
          <input name="company" required defaultValue={dealer.company_name} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Contactpersoon *</span>
          <input name="name" required defaultValue={dealer.contact_name} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">E-mail *</span>
          <input name="email" type="email" required defaultValue={dealer.email} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Telefoon</span>
          <input name="phone" defaultValue={dealer.phone || ''} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Locatie</span>
          <input name="location" defaultValue={dealer.location || ''} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">KVK</span>
          <input name="kvk" defaultValue={dealer.kvk || ''} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">BTW-nummer</span>
          <input name="vatNumber" defaultValue={dealer.vat_number || ''} className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">RDW-erkenning</span>
          <select name="rdwRecognized" defaultValue={dealer.rdw_recognized || ''} className={inputClass}>
            <option value="">Onbekend</option>
            <option value="Ja">Ja</option>
            <option value="Nee">Nee</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Werkplaats</span>
          <select name="hasWorkshop" defaultValue={dealer.has_workshop || ''} className={inputClass}>
            <option value="">Onbekend</option>
            <option value="Ja">Ja</option>
            <option value="Nee">Nee</option>
          </select>
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Geschatte omkeuringen</span>
          <input name="estimatedOmkeuren" defaultValue={dealer.estimated_omkeuren || ''} className={inputClass} />
        </label>
        <label className="block md:col-span-2">
          <span className="block text-sm font-semibold mb-1">Notitie</span>
          <textarea name="notes" rows={3} defaultValue={dealer.notes || ''} className={inputClass} />
        </label>
      </div>
      <p className="text-xs text-gray-500">
        Een nieuw e-mailadres wordt ook de login voor het dealerportaal.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-biker-yellow text-biker-black px-5 py-2.5 rounded-lg font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Opslaan...' : 'Gegevens opslaan'}
      </button>
    </form>
  );
}

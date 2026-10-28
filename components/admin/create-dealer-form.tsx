'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDealerFromAdmin } from '@/app/actions/admin-dealers';

const inputClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900';

export function CreateDealerForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const result = await createDealerFromAdmin(new FormData(form));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    if (result.alreadyExisted) {
      setMessage('Deze dealer had al een portaal. We hebben de gegevens bijgewerkt en een mail gestuurd.');
    } else if (result.createdUser) {
      setMessage('Dealerportaal aangemaakt. De inlog staat in hun mailbox.');
    } else {
      setMessage('Dealerportaal gekoppeld aan een bestaand account. Ze kunnen inloggen met hun huidige wachtwoord.');
    }
    if (result.dealerId) {
      router.push(`/admin/dealers/${result.dealerId}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Bedrijfsnaam *</span>
          <input name="company" required className={inputClass} placeholder="Motorzaak" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Contactpersoon *</span>
          <input name="name" required className={inputClass} placeholder="Naam" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">E-mail *</span>
          <input name="email" type="email" required className={inputClass} placeholder="dealer@zaak.nl" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Telefoon</span>
          <input name="phone" className={inputClass} placeholder="06 ..." />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Locatie</span>
          <input name="location" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">KVK</span>
          <input name="kvk" className={inputClass} />
        </label>
      </div>
      <p className="text-xs text-gray-500">
        Het portaal wordt meteen actief. De dealer krijgt een mail met inlog.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-biker-yellow text-biker-black px-5 py-2.5 rounded-lg font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Aanmaken...' : 'Dealerportaal aanmaken'}
      </button>
    </form>
  );
}

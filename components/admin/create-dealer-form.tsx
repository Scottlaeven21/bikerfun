'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDealerFromAdmin } from '@/app/actions/admin-dealers';

const inputClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900';

export type DealerFormPrefill = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  location?: string;
  kvk?: string;
  vatNumber?: string;
  rdwRecognized?: string;
  hasWorkshop?: string;
};

export function CreateDealerForm({
  pendingSignups = [],
}: {
  pendingSignups?: DealerFormPrefill[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prefill, setPrefill] = useState<DealerFormPrefill>({});
  const [formKey, setFormKey] = useState(0);

  function applySignup(signup: DealerFormPrefill) {
    setPrefill(signup);
    setFormKey((key) => key + 1);
    setMessage(null);
    setError(null);
  }

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
    setPrefill({});
    setFormKey((key) => key + 1);
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
    <div className="space-y-4">
      {pendingSignups.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Openstaande aanmeldingen</p>
          <div className="flex flex-wrap gap-2">
            {pendingSignups.map((signup) => (
              <button
                key={`${signup.email}-${signup.company}`}
                type="button"
                onClick={() => applySignup(signup)}
                className="text-left text-sm px-3 py-2 rounded-lg border border-gray-300 bg-white hover:border-biker-yellow"
              >
                <span className="font-semibold block">{signup.company || signup.name}</span>
                <span className="text-gray-500 text-xs">{signup.email}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Bedrijfsnaam *</span>
            <input name="company" required defaultValue={prefill.company || ''} className={inputClass} placeholder="Motorzaak" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Contactpersoon *</span>
            <input name="name" required defaultValue={prefill.name || ''} className={inputClass} placeholder="Naam" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">E-mail *</span>
            <input name="email" type="email" required defaultValue={prefill.email || ''} className={inputClass} placeholder="dealer@zaak.nl" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Telefoon</span>
            <input name="phone" defaultValue={prefill.phone || ''} className={inputClass} placeholder="06 ..." />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Locatie</span>
            <input name="location" defaultValue={prefill.location || ''} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">KVK</span>
            <input name="kvk" defaultValue={prefill.kvk || ''} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">BTW-nummer</span>
            <input name="vatNumber" defaultValue={prefill.vatNumber || ''} className={inputClass} placeholder="NL123456789B01" />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">RDW-erkenning</span>
            <select name="rdwRecognized" defaultValue={prefill.rdwRecognized || ''} className={inputClass}>
              <option value="">Onbekend</option>
              <option value="Ja">Ja</option>
              <option value="Nee">Nee</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-semibold mb-1">Werkplaats</span>
            <select name="hasWorkshop" defaultValue={prefill.hasWorkshop || ''} className={inputClass}>
              <option value="">Onbekend</option>
              <option value="Ja">Ja</option>
              <option value="Nee">Nee</option>
            </select>
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Het portaal wordt meteen actief. De dealer krijgt een mail met tijdelijk wachtwoord en moet dat bij de eerste login vervangen.
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
    </div>
  );
}

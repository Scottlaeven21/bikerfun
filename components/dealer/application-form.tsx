'use client';

import { useState } from 'react';
import { createDealerApplication } from '@/app/actions/dealer';
import { LoadingButton } from '@/components/loading/spinner';
import { DealerTerms } from '@/components/dealer/dealer-terms';

const inputClass =
  'w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-biker-black focus:border-biker-yellow focus:outline-none';

export function DealerApplicationForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createDealerApplication(new FormData(e.currentTarget));
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border-2 border-gray-200 p-6 md:p-8">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-1">Motorgegevens</h2>
        <p className="text-sm text-gray-600 mb-4">Kenteken, meldcode, framenummer en typegoedkeuring zijn verplicht.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Kenteken *</span>
            <input name="license_plate" required className={inputClass} placeholder="XX-XX-XX" />
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Meldcode *</span>
            <input name="meldcode" required className={inputClass} placeholder="4 cijfers" />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Framenummer *</span>
            <input name="vin" required className={inputClass} placeholder="VIN / chassisnummer" />
          </label>
          <label className="block md:col-span-2">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Typegoedkeuring *</span>
            <input
              name="type_approval"
              required
              className={inputClass}
              placeholder="e4*92/61*0190*…"
            />
            <span className="mt-2 block text-sm text-gray-600">
              Op de motor zit een typegoedkeuringsplaatje met dit nummer. In veel gevallen begint het
              met een e-nummer, bijvoorbeeld e4*92/61*0190*…
            </span>
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Merk</span>
            <input name="brand" className={inputClass} placeholder="Yamaha" />
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Model</span>
            <input name="model" className={inputClass} placeholder="MT-07" />
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Bouwjaar</span>
            <input name="year" className={inputClass} placeholder="2020" />
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-1">Klant (optioneel)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Vul het e-mailadres van de klant in, dan krijgen jullie allebei statusupdates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Naam klant</span>
            <input name="customer_name" className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">E-mail klant</span>
            <input name="customer_email" type="email" className={inputClass} placeholder="klant@email.nl" />
          </label>
          <label className="block">
            <span className="block text-sm font-bold uppercase tracking-wider mb-2">Telefoon klant</span>
            <input name="customer_phone" className={inputClass} />
          </label>
        </div>
      </div>

      <label className="block">
        <span className="block text-sm font-bold uppercase tracking-wider mb-2">Toelichting</span>
        <textarea
          name="notes"
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Vermeld het gewenste vermogen. Moet de motor terug naar het originele vermogen? Zet dat hier."
        />
        <span className="mt-2 block text-sm text-gray-600">
          Vermeld het gewenste vermogen. Als de motor terug moet naar het originele vermogen, vermeld dat dan hier.
        </span>
      </label>

      <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-5">
        <DealerTerms />
        <label className="mt-4 flex items-start gap-3 text-sm text-gray-800">
          <input type="checkbox" name="accept_terms" required className="mt-1 h-4 w-4 accent-biker-yellow" />
          <span>Ik ga akkoord met deze voorwaarden.</span>
        </label>
      </div>

      <LoadingButton
        type="submit"
        loading={loading}
        loadingText="OPSLAAN..."
        className="btn-primary w-full bg-biker-yellow text-biker-black border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider"
      >
        Motor aanmelden
      </LoadingButton>
    </form>
  );
}

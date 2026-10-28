'use client';

import { useState } from 'react';
import { sendAdminMailing } from '@/app/actions/admin-mailing';

const inputClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900';

export function AdminMailingForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const result = await sendAdminMailing(new FormData(form));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage(`Mail verstuurd naar ${result.sent} ${result.sent === 1 ? 'adres' : 'adressen'}.`);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Aan *</span>
        <textarea
          name="to"
          required
          rows={2}
          className={inputClass}
          placeholder="naam@zaak.nl, tweede@email.nl"
        />
        <span className="block text-xs text-gray-500 mt-1">
          Meerdere adressen scheiden met een komma of nieuwe regel. Iedereen krijgt een eigen mail.
        </span>
      </label>
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Onderwerp *</span>
        <input name="subject" required className={inputClass} placeholder="Update van Bikerfun" />
      </label>
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Titel in de mail</span>
        <input name="title" className={inputClass} placeholder="Laat leeg om het onderwerp te gebruiken" />
      </label>
      <label className="block">
        <span className="block text-sm font-semibold mb-1">Bericht *</span>
        <textarea
          name="body"
          required
          rows={8}
          className={inputClass}
          placeholder="Schrijf hier de mail. Enter maakt een nieuwe regel."
        />
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Knoptekst</span>
          <input name="button_label" className={inputClass} placeholder="Bekijk op de site" />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Knoplink</span>
          <input name="button_url" className={inputClass} placeholder="https://bikerfun.nl" />
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-biker-yellow text-biker-black px-5 py-2.5 rounded-lg font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Versturen...' : 'Mail versturen'}
      </button>
    </form>
  );
}

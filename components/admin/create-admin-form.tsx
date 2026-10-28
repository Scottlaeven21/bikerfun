'use client';

import { useState } from 'react';
import { createAdminFromAdmin } from '@/app/actions/admin-dealers';

const inputClass = 'w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900';

export function CreateAdminForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setPassword(null);
    const form = e.currentTarget;
    const result = await createAdminFromAdmin(new FormData(form));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    if (result.alreadyExisted) {
      setMessage('Dit account bestaat al en is nu admin. 2FA gaat naar dit e-mailadres.');
    } else {
      setMessage(
        result.emailed
          ? 'Admin-account aangemaakt. Inlog staat in de mail.'
          : 'Admin-account aangemaakt. Bewaar het tijdelijke wachtwoord hieronder.'
      );
      if (result.password) setPassword(result.password);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm font-semibold mb-1">Naam *</span>
          <input name="name" required defaultValue="Scott Laeven" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-semibold mb-1">E-mail *</span>
          <input
            name="email"
            type="email"
            required
            defaultValue="scottlaeven@hotmail.com"
            className={inputClass}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500">
        De 2FA-code gaat naar dit adres. Bij de eerste login moet het tijdelijke wachtwoord vervangen worden. Het zuyd-account blijft gewoon werken.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {password && (
        <p className="text-sm bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">
          Tijdelijk wachtwoord: <strong>{password}</strong>
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-5 py-2.5 rounded-lg font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Aanmaken...' : 'Admin-account aanmaken'}
      </button>
    </form>
  );
}

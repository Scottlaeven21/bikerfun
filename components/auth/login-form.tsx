'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setLoading(true);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // If no error, the server action will redirect
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <input type="hidden" name="redirect" value={redirect} />

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-biker-light mb-2 uppercase tracking-wider"
        >
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-biker-black border-2 border-biker-gray rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-white transition-all"
          placeholder="je@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-biker-light mb-2 uppercase tracking-wider"
        >
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-3 bg-biker-black border-2 border-biker-gray rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-white transition-all"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          loading ? 'opacity-50' : ''
        }`}
      >
        {loading ? 'Bezig met inloggen...' : 'Inloggen'}
      </button>
    </form>
  );
}

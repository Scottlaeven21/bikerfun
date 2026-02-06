'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Hard refresh to sync server-side session
      window.location.href = redirect;
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-biker-light mb-2 uppercase tracking-wider"
        >
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

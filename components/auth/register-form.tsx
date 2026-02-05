'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError('Registratie mislukt. Probeer het opnieuw.');
        return;
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName,
      } as any);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
    } finally {
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
          htmlFor="fullName"
          className="block text-sm font-semibold text-biker-light mb-2 uppercase tracking-wider"
        >
          Volledige naam
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-biker-black border-2 border-biker-gray rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-white transition-all"
          placeholder="Jan Jansen"
        />
      </div>

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
          minLength={6}
          className="w-full px-4 py-3 bg-biker-black border-2 border-biker-gray rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-white transition-all"
          placeholder="Minimaal 6 karakters"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          loading ? 'opacity-50' : ''
        }`}
      >
        {loading ? 'Account aanmaken...' : 'Registreren'}
      </button>
    </form>
  );
}

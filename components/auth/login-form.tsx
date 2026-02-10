'use client';

import { useSearchParams } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
        pending ? 'opacity-50' : ''
      }`}
    >
      {pending ? 'Bezig met inloggen...' : 'Inloggen'}
    </button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const [state, formAction] = useFormState(login, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <input type="hidden" name="redirect" value={redirect} />

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
        >
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
          placeholder="je@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider"
        >
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

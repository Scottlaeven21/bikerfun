'use client';

import { signup } from '@/app/actions/auth';
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
      {pending ? 'Account aanmaken...' : 'Registreren'}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useFormState(signup, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-900/20 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {state.error}
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
          name="fullName"
          type="text"
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
          minLength={6}
          className="w-full px-4 py-3 bg-biker-black border-2 border-biker-gray rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-white transition-all"
          placeholder="Minimaal 6 karakters"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

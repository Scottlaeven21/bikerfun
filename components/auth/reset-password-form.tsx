'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resetForgottenPassword } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider disabled:opacity-50"
    >
      {pending ? 'Opslaan...' : 'Nieuw wachtwoord opslaan'}
    </button>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetForgottenPassword, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Nieuw wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
          placeholder="Minimaal 8 tekens"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Herhaal wachtwoord
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

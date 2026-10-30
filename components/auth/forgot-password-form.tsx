'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { requestPasswordReset } from '@/app/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider disabled:opacity-50"
    >
      {pending ? 'Versturen...' : 'Resetlink sturen'}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordReset, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
          {state.success}
        </div>
      )}
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
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
          placeholder="je@email.com"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

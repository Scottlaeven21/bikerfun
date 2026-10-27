'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendAdmin2fa, verifyAdmin2fa } from '@/app/actions/admin-2fa';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full bg-biker-yellow text-biker-black py-4 px-4 rounded-full font-bold uppercase text-sm tracking-wider disabled:opacity-50"
    >
      {pending ? 'Controleren...' : 'Bevestigen'}
    </button>
  );
}

export function Admin2faForm({ redirectTo, emails }: { redirectTo: string; emails: string[] }) {
  const [state, formAction] = useFormState(verifyAdmin2fa, null);
  const [resend, setResend] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleResend() {
    setSending(true);
    setResend(null);
    const result = await sendAdmin2fa(true);
    setSending(false);
    setResend(result.success ? 'Nieuwe code verstuurd.' : result.error || 'Versturen mislukt.');
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {resend && (
        <div className="bg-yellow-50 border-2 border-biker-yellow text-biker-black px-4 py-3 rounded-lg text-sm">
          {resend}
        </div>
      )}

      <input type="hidden" name="redirect" value={redirectTo} />

      <p className="text-sm text-gray-600">
        We hebben een code gestuurd naar{' '}
        <strong>{emails.filter(Boolean).join(' en ') || 'je admin-mailbox'}</strong>.
        Check ook spam.
      </p>

      <div>
        <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
          Code
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          pattern="[0-9]{6}"
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-center text-2xl tracking-[0.4em] font-bold text-biker-black focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow"
          placeholder="000000"
        />
      </div>

      <SubmitButton />

      <button
        type="button"
        onClick={handleResend}
        disabled={sending}
        className="w-full text-sm font-semibold text-biker-yellow hover:underline disabled:opacity-50"
      >
        {sending ? 'Versturen...' : 'Nieuwe code sturen'}
      </button>
    </form>
  );
}

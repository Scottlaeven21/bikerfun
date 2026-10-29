'use client';

import { useState } from 'react';
import { uploadDealerSignedForm } from '@/app/actions/dealer';

export function SignedFormUpload({
  applicationId,
  hasUpload,
}: {
  applicationId: string;
  hasUpload: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const result = await uploadDealerSignedForm(applicationId, new FormData(form));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    form.reset();
    setMessage(hasUpload ? 'Nieuw formulier is geüpload.' : 'Formulier is geüpload.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        <span className="block text-sm font-semibold mb-1">
          {hasUpload ? 'Vervang het formulier' : 'Upload het getekende formulier'}
        </span>
        <input
          type="file"
          name="signed_form"
          required
          accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
          className="w-full text-sm"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-biker-yellow text-biker-black px-5 py-2.5 rounded-lg font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? 'Uploaden...' : hasUpload ? 'Opnieuw uploaden' : 'Formulier uploaden'}
      </button>
    </form>
  );
}

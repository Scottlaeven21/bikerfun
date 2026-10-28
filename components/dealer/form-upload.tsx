'use client';

import { useState } from 'react';
import { uploadDealerForm } from '@/app/actions/dealer';
import { LoadingButton } from '@/components/loading/spinner';

export function DealerFormUpload({ applicationId }: { applicationId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);
    const result = await uploadDealerForm(applicationId, new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) setError(result.error);
    else setOk(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-emerald-700">Formulier ontvangen. Jij en de klant krijgen een update.</p>}
      <input
        type="file"
        name="form_file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        required
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-bold file:bg-biker-yellow file:text-biker-black"
      />
      <LoadingButton
        type="submit"
        loading={loading}
        loadingText="UPLOADEN..."
        className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold uppercase"
      >
        Upload ingevuld formulier
      </LoadingButton>
    </form>
  );
}

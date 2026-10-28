'use client';

import { useState } from 'react';
import { setApplicationWorkflow } from '@/app/actions/admin-dealers';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  SIGNED_FORM_LABELS,
  type ApplicationStatus,
  type SignedFormStatus,
} from '@/lib/dealer/status';

export function DealerStatusForm({
  applicationId,
  status,
  signedFormStatus,
}: {
  applicationId: string;
  status: ApplicationStatus;
  signedFormStatus: SignedFormStatus;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await setApplicationWorkflow(applicationId, new FormData(e.currentTarget));
    setLoading(false);
    setMessage(result.error || 'Status opgeslagen. Dealer en klant krijgen een mail.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-semibold mb-2">Hoofdstatus</span>
        <select
          name="status"
          defaultValue={status}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
        >
          {APPLICATION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {APPLICATION_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="block text-sm font-semibold mb-2">Ondertekend formulier (kan parallel lopen)</span>
        <select
          name="signed_form_status"
          defaultValue={signedFormStatus}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
        >
          {(Object.keys(SIGNED_FORM_LABELS) as SignedFormStatus[]).map((value) => (
            <option key={value} value={value}>
              {SIGNED_FORM_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-gray-500">
        “Ingediend bij RDW” en “Omgekeurd” kan alleen als het formulier binnen is.
      </p>
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Opslaan...' : 'Status opslaan'}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}

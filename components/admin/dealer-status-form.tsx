'use client';

import { useState } from 'react';
import { setApplicationWorkflow } from '@/app/actions/admin-dealers';
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/lib/dealer/status';

export function DealerStatusForm({
  applicationId,
  status,
}: {
  applicationId: string;
  status: ApplicationStatus;
}) {
  const [selected, setSelected] = useState<ApplicationStatus>(status);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const statusChanged = selected !== status;

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
        <span className="block text-sm font-semibold mb-2">Status</span>
        <select
          name="status"
          value={selected}
          onChange={(e) => setSelected(e.target.value as ApplicationStatus)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
        >
          {APPLICATION_STATUSES.map((value) => (
            <option key={value} value={value}>
              {APPLICATION_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      {statusChanged && (
        <label className="block">
          <span className="block text-sm font-semibold mb-2">Opmerking</span>
          <textarea
            name="remark"
            rows={4}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white"
            placeholder="Deze tekst gaat mee in de statusmail naar dealer en klant."
          />
        </label>
      )}
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

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReviewSettings } from '@/types';
import { createClient } from '@/lib/supabase/client';

export function ReviewScoreForm({ settings }: { settings: ReviewSettings }) {
  const router = useRouter();
  const [score, setScore] = useState(String(settings.overall_score));
  const [count, setCount] = useState(String(settings.review_count));
  const [googleUrl, setGoogleUrl] = useState(settings.google_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const parsedScore = parseFloat(score.replace(',', '.'));
      const parsedCount = parseInt(count, 10);
      if (!Number.isFinite(parsedScore) || parsedScore < 1 || parsedScore > 5) {
        throw new Error('Score moet tussen 1.0 en 5.0 liggen.');
      }
      if (!Number.isFinite(parsedCount) || parsedCount < 0) {
        throw new Error('Aantal reviews moet 0 of hoger zijn.');
      }

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('review_settings')
        // @ts-ignore
        .upsert({
          id: 1,
          overall_score: parsedScore,
          review_count: parsedCount,
          google_url: googleUrl.trim() || null,
          updated_at: new Date().toISOString(),
        });
      if (updateError) throw updateError;
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Overall score</h2>
      <p className="text-sm text-gray-600">
        Deze score staat op de homepage en in Google-zoekgegevens.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          Score opgeslagen.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Score (1.0 – 5.0)</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="5"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Aantal reviews</label>
          <input
            type="number"
            min="0"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Google reviews-link</label>
          <input
            type="url"
            value={googleUrl}
            onChange={(e) => setGoogleUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            placeholder="https://www.google.nl/..."
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Opslaan...' : 'Score opslaan'}
      </button>
    </form>
  );
}

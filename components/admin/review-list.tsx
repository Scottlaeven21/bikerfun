'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SiteReview } from '@/types';
import { createClient } from '@/lib/supabase/client';

export function ReviewList({ reviews }: { reviews: SiteReview[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(review: SiteReview) {
    setBusyId(review.id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('site_reviews')
        // @ts-ignore
        .update({ is_active: !review.is_active, updated_at: new Date().toISOString() })
        .eq('id', review.id);
      if (updateError) throw updateError;
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bijwerken mislukt.');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(review: SiteReview) {
    if (!confirm(`Review van ${review.author} verwijderen?`)) return;
    setBusyId(review.id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from('site_reviews').delete().eq('id', review.id);
      if (deleteError) throw deleteError;
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verwijderen mislukt.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-gray-900">{review.author}</h3>
                <span className="text-sm text-yellow-600 font-semibold">{review.rating}/5</span>
                {review.is_active ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Zichtbaar</span>
                ) : (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Verborgen</span>
                )}
                {review.date_label && (
                  <span className="text-xs text-gray-500">{review.date_label}</span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{review.body}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/admin/reviews/${review.id}`}
                className="px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Bewerken
              </Link>
              <button
                type="button"
                disabled={busyId === review.id}
                onClick={() => toggleActive(review)}
                className="px-3 py-2 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {review.is_active ? 'Verbergen' : 'Tonen'}
              </button>
              <button
                type="button"
                disabled={busyId === review.id}
                onClick={() => remove(review)}
                className="px-3 py-2 text-sm font-semibold text-red-700 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

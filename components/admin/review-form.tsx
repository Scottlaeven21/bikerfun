'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteReview, SiteReviewInsert, SiteReviewUpdate } from '@/types';
import { createClient } from '@/lib/supabase/client';

export function ReviewForm({ review, isEdit = false }: { review?: SiteReview | null; isEdit?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState(review?.author || '');
  const [body, setBody] = useState(review?.body || '');
  const [rating, setRating] = useState(String(review?.rating ?? 5));
  const [dateLabel, setDateLabel] = useState(review?.date_label || '');
  const [sortOrder, setSortOrder] = useState(String(review?.sort_order ?? 0));
  const [isVerified, setIsVerified] = useState(review?.is_verified ?? true);
  const [isActive, setIsActive] = useState(review?.is_active ?? true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const parsedRating = parseInt(rating, 10);
      if (parsedRating < 1 || parsedRating > 5) {
        throw new Error('Sterren moeten tussen 1 en 5 liggen.');
      }
      const supabase = createClient();
      if (isEdit && review?.id) {
        const updateData: SiteReviewUpdate = {
          author: author.trim(),
          body: body.trim(),
          rating: parsedRating,
          date_label: dateLabel.trim() || null,
          sort_order: parseInt(sortOrder, 10) || 0,
          is_verified: isVerified,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        };
        const { error: updateError } = await supabase
          .from('site_reviews')
          // @ts-ignore
          .update(updateData)
          .eq('id', review.id);
        if (updateError) throw updateError;
      } else {
        const insertData: SiteReviewInsert = {
          author: author.trim(),
          body: body.trim(),
          rating: parsedRating,
          date_label: dateLabel.trim() || null,
          sort_order: parseInt(sortOrder, 10) || 0,
          is_verified: isVerified,
          is_active: isActive,
        };
        const { error: insertError } = await supabase
          .from('site_reviews')
          // @ts-ignore
          .insert(insertData);
        if (insertError) throw insertError;
      }
      router.push('/admin/reviews');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Naam *</label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Review *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sterren</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Datumlabel</label>
          <input
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            placeholder="3 maanden geleden"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Volgorde</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} />
        Geverifieerde aankoop
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Zichtbaar op de website
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Opslaan...' : isEdit ? 'Wijzigingen opslaan' : 'Review toevoegen'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/reviews')}
          className="px-6 py-2 rounded-lg font-semibold border border-gray-300"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}

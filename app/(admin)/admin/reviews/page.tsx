import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ReviewSettings, SiteReview } from '@/types';
import { FALLBACK_REVIEW_SETTINGS } from '@/lib/supabase/reviews';
import { ReviewScoreForm } from '@/components/admin/review-score-form';
import { ReviewList } from '@/components/admin/review-list';

export const metadata: Metadata = {
  title: 'Reviews Beheer | Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const [{ data: settingsData }, { data: reviewsData, error }] = await Promise.all([
    supabase.from('review_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('site_reviews').select('*').order('sort_order', { ascending: true }),
  ]);

  const settings = (settingsData as ReviewSettings | null) ?? FALLBACK_REVIEW_SETTINGS;
  const reviews = (reviewsData as SiteReview[] | null) ?? [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nieuwe review
        </Link>
      </div>
      <p className="text-gray-600 mb-8">
        Pas de overall score aan en beheer de reviews die op de homepage staan.
      </p>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6">
          Kon reviews niet laden. Voer eerst de SQL uit van{' '}
          <code className="font-mono text-sm">029_create_reviews.sql</code> in de Supabase SQL Editor.
        </div>
      )}

      <ReviewScoreForm settings={settings} />

      {reviews.length > 0 ? (
        <ReviewList reviews={reviews} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">Nog geen reviews. Voeg er een toe of voer de SQL-seed uit.</p>
          <Link
            href="/admin/reviews/new"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Eerste review toevoegen
          </Link>
        </div>
      )}
    </div>
  );
}

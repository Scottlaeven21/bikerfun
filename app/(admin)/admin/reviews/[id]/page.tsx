import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SiteReview } from '@/types';
import { ReviewForm } from '@/components/admin/review-form';

export const metadata: Metadata = {
  title: 'Review bewerken | Admin',
};

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('site_reviews').select('*').eq('id', id).maybeSingle();
  const review = data as SiteReview | null;
  if (!review) notFound();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Review bewerken</h1>
      <ReviewForm review={review} isEdit />
    </div>
  );
}

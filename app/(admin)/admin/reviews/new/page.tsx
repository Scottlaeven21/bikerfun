import { Metadata } from 'next';
import { ReviewForm } from '@/components/admin/review-form';

export const metadata: Metadata = {
  title: 'Nieuwe review | Admin',
};

export default function NewReviewPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nieuwe review</h1>
      <ReviewForm />
    </div>
  );
}

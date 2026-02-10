import { Metadata } from 'next';
import { OccasionForm } from '@/components/admin/occasion-form';

export const metadata: Metadata = {
  title: 'Nieuwe Occasion | Admin',
  description: 'Voeg een nieuwe occasion toe',
};

export default function NewOccasionPage() {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nieuwe Occasion Toevoegen</h1>
          <p className="text-gray-600">Vul alle gegevens in voor de nieuwe occasion</p>
        </div>

        <OccasionForm />
      </div>
    </div>
  );
}

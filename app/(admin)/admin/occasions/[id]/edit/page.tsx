import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { OccasionForm } from '@/components/admin/occasion-form';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Occasion Bewerken | Admin',
  description: 'Bewerk een occasion',
};

export default async function EditOccasionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: occasion } = await supabase
    .from('occasions')
    .select('*')
    .eq('id', params.id)
    .single();

  const occasionData = occasion as Occasion | null;

  if (!occasionData) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Occasion Bewerken
          </h1>
          <p className="text-gray-600">
            {occasionData.brand} {occasionData.model} ({occasionData.year})
          </p>
        </div>

        <OccasionForm occasion={occasionData} isEdit={true} />
      </div>
    </div>
  );
}

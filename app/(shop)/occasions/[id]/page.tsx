import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { OccasionDetailClient } from '@/components/occasions/occasion-detail-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: occasion } = await supabase
    .from('occasions')
    .select('brand, model, year, description, main_image')
    .eq('id', id)
    .single();

  const occasionData = occasion as Pick<Occasion, 'brand' | 'model' | 'year' | 'description' | 'main_image'> | null;

  if (!occasionData) {
    return {
      title: 'Occasion niet gevonden | Bikerfun',
    };
  }

  return {
    title: `${occasionData.brand} ${occasionData.model} (${occasionData.year}) | Bikerfun`,
    description: occasionData.description || `${occasionData.brand} ${occasionData.model} uit ${occasionData.year}`,
    openGraph: {
      title: `${occasionData.brand} ${occasionData.model} (${occasionData.year})`,
      description: occasionData.description || '',
      images: occasionData.main_image ? [occasionData.main_image] : [],
    },
  };
}

export default async function OccasionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: occasion } = await supabase
    .from('occasions')
    .select('*')
    .eq('id', id)
    .single();

  const occasionData = occasion as Occasion | null;

  if (!occasionData) {
    notFound();
  }

  return <OccasionDetailClient occasion={occasionData} />;
}

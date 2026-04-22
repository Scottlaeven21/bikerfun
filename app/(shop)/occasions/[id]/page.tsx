import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { OccasionDetailClient } from '@/components/occasions/occasion-detail-client';
import { OccasionStructuredData } from '@/components/seo/occasion-structured-data';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: occasion } = await supabase
    .from('occasions')
    .select('brand, model, year, description, main_image, price')
    .eq('id', id)
    .single();

  const occasionData = occasion as Pick<Occasion, 'brand' | 'model' | 'year' | 'description' | 'main_image' | 'price'> | null;

  if (!occasionData) {
    return {
      title: 'Occasion niet gevonden | Bikerfun',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  const pageUrl = `${baseUrl}/occasions/${id}`;
  const title = `${occasionData.brand} ${occasionData.model} (${occasionData.year}) | Bikerfun`;
  const description = occasionData.description || `${occasionData.brand} ${occasionData.model} uit ${occasionData.year} - Nu te koop bij Bikerfun voor €${occasionData.price?.toLocaleString('nl-NL')}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Bikerfun',
      images: occasionData.main_image ? [{
        url: occasionData.main_image,
        width: 1200,
        height: 630,
        alt: `${occasionData.brand} ${occasionData.model}`,
      }] : [],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Occasions', url: '/occasions' },
    { name: `${occasionData.brand} ${occasionData.model} (${occasionData.year})`, url: `/occasions/${id}` },
  ]);

  return (
    <>
      <OccasionStructuredData occasion={occasionData} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <OccasionDetailClient occasion={occasionData} />
    </>
  );
}

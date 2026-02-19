import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { MotorAanvraagForm } from '@/components/forms/motor-aanvraag-form';

export const metadata: Metadata = {
  title: 'Plan Bezichtiging | Bikerfun',
  description: 'Plan een bezichtiging voor deze occasion',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OccasionAanvraagPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch occasion from Supabase
  const { data: occasion } = await supabase
    .from('occasions')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!occasion) {
    notFound();
  }

  const occasionData = occasion as Occasion;
  const occasionUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/occasions/${id}`;

  return (
    <div className="min-h-screen bg-black noise-overlay text-white pt-32 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/occasions/${id}`}
          className="inline-flex items-center space-x-2 text-biker-yellow hover:text-biker-yellowHover mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold uppercase text-sm tracking-wider">Terug naar occasion</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight"
          >
            Plan <span className="text-biker-yellow">Bezichtiging</span>
          </h1>
          <p className="text-lg text-biker-light">
            Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met je op
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Occasion Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray sticky top-24">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">Geselecteerde Motor</h2>
              
              {/* Image */}
              {occasionData.main_image && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image
                    src={occasionData.main_image}
                    alt={`${occasionData.brand} ${occasionData.model}`}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="400px"
                  />
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {occasionData.brand}
                  </h3>
                  <p className="text-xl text-biker-light">{occasionData.model}</p>
                </div>
                
                <div className="flex items-baseline justify-between pt-3 border-t-2 border-biker-gray">
                  <span className="text-3xl font-bold text-biker-yellow">
                    € {occasionData.price.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-biker-light">{occasionData.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <MotorAanvraagForm
              motorDetails={{
                brand: occasionData.brand,
                model: occasionData.model,
                price: occasionData.price,
                occasionUrl,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

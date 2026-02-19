import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MotorAanvraagForm } from '@/components/forms/motor-aanvraag-form';
import { Occasion } from '@/types';

export const metadata: Metadata = {
  title: 'Plan Bezichtiging | Bikerfun',
  description: 'Plan een bezichtiging voor deze occasion',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OccasionAanvraagPage({ params }: PageProps) {
  try {
    const resolvedParams = await params;
    const occasionId = resolvedParams.id;

    const supabase = await createClient();

    // Fetch occasion from Supabase
    const { data, error } = await supabase
      .from('occasions')
      .select('*')
      .eq('id', occasionId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('Occasion not found:', error);
      notFound();
    }

    // Type assertion for Supabase data
    const occasion = data as Occasion;

    const occasionUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/occasions/${occasionId}`;

    return (
      <div className="min-h-screen bg-black noise-overlay text-white pt-32 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/occasions/${occasionId}`}
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
                {occasion.main_image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <Image
                      src={occasion.main_image}
                      alt={`${occasion.brand} ${occasion.model}`}
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
                      {occasion.brand}
                    </h3>
                    <p className="text-xl text-biker-light">{occasion.model}</p>
                  </div>
                  
                  <div className="flex items-baseline justify-between pt-3 border-t-2 border-biker-gray">
                    <span className="text-3xl font-bold text-biker-yellow">
                      € {occasion.price.toLocaleString('nl-NL')}
                    </span>
                    <span className="text-biker-light">{occasion.year}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <MotorAanvraagForm
                motorDetails={{
                  brand: occasion.brand,
                  model: occasion.model,
                  price: occasion.price,
                  occasionUrl,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading occasion aanvraag page:', error);
    notFound();
  }
}

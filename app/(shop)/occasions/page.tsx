import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { OccasionsList } from '@/components/occasions/occasions-list';

export const metadata: Metadata = {
  title: 'Occasions | Bikerfun',
  description: 'Ontdek ons aanbod aan occasions. Van sportmotoren tot tourers - wij hebben iets voor elke rijder.',
};

export default async function OccasionsPage() {
  const supabase = await createClient();

  const { data: occasions } = await supabase
    .from('occasions')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  const occasionsList = (occasions as Occasion[]) || [];

  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section with Video */}
      <section className="relative h-[60vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        >
          <source src="/Adobestock 1898255189.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-5xl md:text-6xl font-bold mb-6 text-white uppercase tracking-tight"
            >
              ONS <span className="text-biker-yellow">AANBOD</span>
            </h1>
            <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
              Ontdek onze collectie zorgvuldig geselecteerde occasions. Van sportief tot comfort - 
              wij hebben de motor voor jouw stijl.
            </p>
          </div>
        </div>
      </section>

      {/* Occasions List */}
      <OccasionsList occasions={occasionsList} />

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Niet Gevonden Wat Je <span className="text-biker-yellow">Zoekt</span>?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Wij gaan graag voor jou op zoek naar de perfecte motor. 
            Vul een aanvraag in en we nemen snel contact op!
          </p>
          <Link
            href="/motor-op-aanvraag"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            MOTOR OP AANVRAAG
          </Link>
        </div>
      </section>
    </div>
  );
}

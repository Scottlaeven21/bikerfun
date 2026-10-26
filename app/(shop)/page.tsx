import Link from 'next/link';
import Image from 'next/image';
import { TikTokGrid } from '@/components/tiktok-grid';
import { OccasionsCarousel } from '@/components/occasions-carousel';
import { HeroVideo } from '@/components/hero-video';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { BusinessStructuredData } from '@/components/seo/business-structured-data';
import { getHomeMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';
import { getWebsiteSchema } from '@/lib/seo/structured-data';
import { FAQAccordion } from '@/components/faq/faq-accordion';
import { ReviewsSection } from '@/components/home/reviews-section';
import { getActiveReviews, getReviewSettings } from '@/lib/supabase/reviews';

const homeFAQ = [
  {
    question: 'Kan ik een occasion komen bezichtigen?',
    answer: 'Ja, natuurlijk! We werken graag op afspraak om ervoor te zorgen dat we voldoende tijd voor je hebben. Bel ons op 06 15 45 21 08 of gebruik het contactformulier om een afspraak te maken.',
  },
  {
    question: 'Bieden jullie garantie op occasions?',
    answer: 'We bieden verschillende garantiemogelijkheden afhankelijk van de motor. Alle motors worden grondig gecontroleerd voordat ze te koop worden aangeboden. Vraag bij ons naar de specifieke garantievoorwaarden voor de motor waarin je geÃ¯nteresseerd bent.',
  },
  {
    question: 'Kan ik mijn huidige motor inruilen?',
    answer: "Absoluut! We kopen graag jouw huidige motor in. Stuur ons foto's en specificaties via het contactformulier of WhatsApp, dan maken we een eerlijke offerte.",
  },
  {
    question: 'Kan ik een proefrit maken?',
    answer: 'Ja, na een korte kennismaking en verificatie van je rijbewijs kun je een proefrit maken. We willen er zeker van zijn dat de motor aan je verwachtingen voldoet!',
  },
  {
    question: 'Hoe snel kan ik de motor meenemen?',
    answer: 'Als alle papieren in orde zijn, kun je de motor vaak direct meenemen. We houden je altijd op de hoogte van de verwachte levertijd.',
  },
];

const homeFAQSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: homeFAQ.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata = getHomeMetadata();

// Cache homepage for 5 minutes for better performance
export const revalidate = 300;

export default async function HomePage() {
  // Fetch occasions from Supabase - only available (not reserved/sold) for homepage
  const supabase = await createClient();
  const { data: occasions } = await supabase
    .from('occasions')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(8);

  const occasionsList = (occasions as Occasion[]) || [];
  const [reviewSettings, reviews] = await Promise.all([
    getReviewSettings(),
    getActiveReviews(),
  ]);
  return (
    <>
      <BusinessStructuredData />
      <StructuredData data={getWebsiteSchema()} />
      <StructuredData data={homeFAQSchema} />
      <div className="overflow-x-hidden">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background - Positioned Higher */}
        <HeroVideo />

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/80"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
            <div className="max-w-4xl">
              <h1 
                style={{ 
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.05em'
                }} 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white drop-shadow-2xl leading-tight uppercase"
              >
                Vrijheid begint op <span className="text-biker-yellow font-black">twee wielen</span>
              </h1>
              <p 
                style={{ fontFamily: 'var(--font-montserrat)' }}
                className="text-sm md:text-base text-white/70 mb-12 tracking-widest uppercase font-light"
              >
                Motoroccasions &amp; Accessoires Â· Susteren, Limburg
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-primary bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/omkeuren"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-secondary bg-transparent text-white px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
                >
                  OMKEUREN
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Occasions Carousel Section */}
      <section className="py-20 bg-black noise-overlay overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Ons <span className="text-biker-yellow">Aanbod</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
              Ontdek onze collectie zorgvuldig geselecteerde occasions. 
              Van sportmotoren tot tourers - wij hebben iets voor elke rijder.
            </p>
          </div>

          {/* Carousel */}
          <OccasionsCarousel occasions={occasionsList} />

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link
              href="/occasions"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              BEKIJK ALLE OCCASIONS
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-biker-dark noise-overlay border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
            Motor <span className="text-biker-yellow">Omkeuren</span>
          </h2>
          <p className="text-base md:text-lg text-biker-light max-w-2xl mx-auto mb-8">
            Motor omkeuren naar A2 / 35kW? Wij regelen het papierwerk. Ook voor motorzaken.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <p className="text-white font-bold">
              <span className="text-biker-yellow">â‚¬ 495</span>
              <span className="text-biker-light font-normal"> onder 70 kW</span>
            </p>
            <span className="hidden sm:block text-biker-gray">Â·</span>
            <p className="text-white font-bold">
              <span className="text-biker-yellow">â‚¬ 695</span>
              <span className="text-biker-light font-normal"> boven 70 kW</span>
            </p>
          </div>
          <Link
            href="/omkeuren"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-10 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300"
          >
            Meer over omkeuren
          </Link>
        </div>
      </section>

      {/* Over Ons Section */}
      <section className="py-20 bg-black text-white noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
                Over <span className="text-biker-yellow">Bikerfun</span>
              </h2>
              <div className="space-y-4 text-base md:text-lg text-biker-light">
                <p>
                  Welkom bij Bikerfun, jouw specialist in occasions en motorkleding. 
                  Met jarenlange ervaring in de motorwereld begrijpen wij als geen ander 
                  wat motorrijders zoeken.
                </p>
                <p>
                  Of je nu op zoek bent naar een betrouwbare occasion, de nieuwste motorkleding, 
                  of professioneel advies - bij Bikerfun ben je aan het juiste adres. 
                  Onze passie voor motoren en de rijderscultuur staat centraal in alles wat we doen.
                </p>
                <p className="text-biker-yellow font-semibold">
                  "Rijden met passie, adviseren met kennis."
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-primary bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 text-center"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/motor-op-aanvraag"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-secondary bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white text-center"
                >
                  MOTOR OP AANVRAAG
                </Link>
              </div>

              {/* Social Media Icons */}
              <div className="mt-8 flex items-center">
                <a
                  href="https://www.tiktok.com/@bikerfuntiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-light hover:text-biker-yellow transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - TikTok Videos Grid */}
            <TikTokGrid size="large" />
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-black noise-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
            Op zoek naar <span className="text-biker-yellow">iets anders</span>?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Indien wij de occasion die u zoekt niet aanbieden, neem contact met ons op. 
            Wij proberen op aanvraag te gaan zoeken voor een occasion die bij u past.
          </p>
          <Link
            href="/contact"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </section>

      {/* Webshop Section */}
      <section className="py-20 bg-biker-dark noise-overlay border-y border-biker-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Web<span className="text-biker-yellow">shop</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-light max-w-4xl mx-auto">
              Bij een nieuwe occasion hoort ook een nieuwe outfit. Ontdek onze collectie premium motorkleding 
              en accessoires - van veilige helmen tot stijlvolle handschoenen. Rijd niet alleen veilig, 
              maar ook met stijl. Compleet je motor ervaring vandaag nog!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {/* Helmcovers */}
            <Link
              href="/products/helmcovers"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-helmcover-white-bg-v3.jpg"
                  alt="Helmcovers"
                  fill
                  className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 md:p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-base md:text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Helmcovers
                </h3>
              </div>
            </Link>

            {/* Kentekenplaathouders */}
            <Link
              href="/products/kentekenplaathouders"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-license-plate-holder-white-bg.jpg"
                  alt="Kentekenhouder"
                  fill
                  className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 md:p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-base md:text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Kentekenhouder
                </h3>
              </div>
            </Link>

            {/* Knipperlichten */}
            <Link
              href="/products/knipperlichten"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-turn-signals-white-bg.jpg"
                  alt="Knipperlichten"
                  fill
                  className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 md:p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-base md:text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Knipperlichten
                </h3>
              </div>
            </Link>

            {/* Rugzakken */}
            <Link
              href="/products/rugzakken"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-backpack-white-bg.jpg"
                  alt="Rugzakken"
                  fill
                  className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 md:p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-base md:text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Rugzakken
                </h3>
              </div>
            </Link>

            {/* Sleutelhangers */}
            <Link
              href="/products/sleutelhangers"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-keychain-white-bg.jpg"
                  alt="Sleutelhangers"
                  fill
                  className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-3 md:p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-base md:text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Sleutelhangers
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection settings={reviewSettings} reviews={reviews} />
      {/* FAQ Section */}
      <section className="py-20 bg-biker-dark noise-overlay border-y border-biker-gray/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Veelgestelde <span className="text-biker-yellow">Vragen</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
              Heb je een vraag over onze occasions, garantie of inruil? Hier vind je snel antwoord.
            </p>
          </div>

          <FAQAccordion items={homeFAQ} />

          <div className="text-center mt-12">
            <Link
              href="/faq"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white hover:bg-white hover:text-black"
            >
              BEKIJK ALLE VRAGEN
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

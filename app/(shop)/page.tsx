import Link from 'next/link';
import Image from 'next/image';
import { TikTokGrid } from '@/components/tiktok-grid';
import { OccasionsCarousel } from '@/components/occasions-carousel';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';
import { BusinessStructuredData } from '@/components/seo/business-structured-data';
import { getHomeMetadata } from '@/lib/seo/metadata';
import { StructuredData } from '@/components/seo/structured-data';
import { getWebsiteSchema } from '@/lib/seo/structured-data';

export const metadata = getHomeMetadata();

export default async function HomePage() {
  // Fetch occasions from Supabase
  const supabase = await createClient();
  const { data: occasions } = await supabase
    .from('occasions')
    .select('*')
    .eq('is_active', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(8);

  const occasionsList = (occasions as Occasion[]) || [];
  return (
    <>
      <BusinessStructuredData />
      <StructuredData data={getWebsiteSchema()} />
      <div>
      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background - Positioned Higher */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

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
                Bikerfun
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-primary bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/contact"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="btn-secondary bg-transparent text-white px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
                >
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Occasions Carousel Section */}
      <section className="py-20 bg-black noise-overlay">
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
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              BEKIJK ALLE OCCASIONS
            </Link>
          </div>
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
                  className="btn-primary bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 text-center"
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
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </section>

      {/* Webshop Section */}
      <section className="py-20 bg-biker-dark noise-overlay border-y-2 border-biker-gray">
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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Helmen */}
            <Link
              href="/products?category=helmen"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-helmet-white-bg.jpg"
                  alt="Motorhelmen"
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Helmen
                </h3>
              </div>
            </Link>

            {/* Jassen */}
            <Link
              href="/products?category=jassen"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-jacket-white-bg.jpg"
                  alt="Motorjassen"
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Jassen
                </h3>
              </div>
            </Link>

            {/* Overige */}
            <Link
              href="/products?category=overige"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-accessories-white-bg.jpg"
                  alt="Motor Accessoires"
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Overige
                </h3>
              </div>
            </Link>

            {/* Sleutelhangers */}
            <Link
              href="/products?category=sleutelhangers"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-keychain-white-bg.jpg"
                  alt="Motor Sleutelhangers"
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Sleutelhangers
                </h3>
              </div>
            </Link>

            {/* Helmet Covers */}
            <Link
              href="/products?category=helmet-covers"
              className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-300 hover:border-biker-yellow transition-all hover:-translate-y-1 duration-300"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-helmet-cover-white-bg.jpg"
                  alt="Helmet Covers"
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-dark border-t-2 border-biker-gray">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Helmet Covers
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-black noise-overlay border-t-2 border-biker-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Wat Klanten Over <span className="text-biker-yellow">Ons Zeggen</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
              Lees de ervaringen van onze tevreden klanten. Echte reviews van Google.
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="flex text-biker-yellow">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-biker-light font-bold">5.0 uit 5 sterren</span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 - Lars Gelissen */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">3 maanden geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Lars Gelissen</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                Ik heb onlangs een Yamaha R6 uit 2002 gekocht bij Bikerfun en ben ontzettend tevreden over de service! 
                De motor kon ik voor een hele mooie prijs meenemen.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>

            {/* Review 2 - Duncan Boek */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">1 maand geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Duncan Boek</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                Afspraak maken ging makkelijk en was flexibel met zijn openingstijden. De verkoper weet echt waar hij 
                het over heeft, communiceert snel en vriendelijk. Erg tevreden!
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>

            {/* Review 3 - Kylian Bogers */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">3 maanden geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Kylian Bogers</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                3 maanden geleden hier mijn motor gekocht en ik ben op alle vlakken super tevreden. 
                Super snelle en professionele service. Een paar weken geleden iets voor motor nodig gehad en werd direct geholpen!
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>

            {/* Review 4 - Eelko ten Wolde */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">4 maanden geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Eelko ten Wolde</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                Ik kwam kijken voor een R6 voor mijn zoon en die heb ik ook gekocht 😍 De eigenaar is een ambitieuze 
                jonge man die weet waar hij het over heeft. Mooie motoren voor een realistische prijs. Die gaat het nog ver schoppen!
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>

            {/* Review 5 - Tim Wagner (Helmet Cover) */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">8 maanden geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Tim Wagner</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                Hier een helmcover besteld. Snel en netjes geholpen. Prima kwaliteit. 
                Gewoon lekker mee cruisen, krijg je veel leuke interactie. Oja gebruik de instructies de eerste keer! Het past.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>

            {/* Review 6 - Boran */}
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-biker-yellow">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-biker-muted">8 maanden geleden</span>
              </div>
              <h3 className="font-bold text-white mb-2">Boran</h3>
              <p className="text-biker-light text-sm leading-relaxed">
                Fantastische service bij BikerFun! Mijn Yamaha R6 laten omkeuren naar 35kW – alles is vlot verlopen 
                en binnen 2 weken waren de papieren in orde. Zeker aan te raden, ook super goede A2 motoren te koop!
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
              </div>
            </div>
          </div>

          {/* Google Reviews Link */}
          <div className="text-center mt-12">
            <p className="text-biker-light mb-6">
              Bekijk al onze reviews op Google
            </p>
            <a
              href="https://www.google.com/search?q=bikerfun+reviews"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
            >
              MEER REVIEWS OP GOOGLE
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

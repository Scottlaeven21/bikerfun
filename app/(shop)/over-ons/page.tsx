import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TikTokGrid } from '@/components/tiktok-grid';

export const metadata: Metadata = {
  title: 'Over Ons | Bikerfun',
  description: 'Leer meer over Bikerfun - jouw partner voor occasions en motorkleding.',
};

export default function OverOnsPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section with Video */}
      <section className="relative h-[50vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero-over-ons.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 
              style={{ 
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.05em'
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl uppercase"
            >
              Over <span className="text-biker-yellow">Bikerfun</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Passie voor motoren, oog voor kwaliteit en persoonlijke service. 
              Dat is waar Bikerfun voor staat.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                style={{ fontFamily: 'var(--font-inter)' }}
                className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
              >
                Ons Verhaal
              </h2>
              <div className="space-y-4 text-biker-light text-lg">
                <p>
                  Bikerfun is ontstaan uit pure passie voor motoren. Wat begon als een hobby, 
                  is uitgegroeid tot een professionele zaak waar kwaliteit en klanttevredenheid 
                  centraal staan.
                </p>
                <p>
                  We selecteren elke occasion met zorg, controleren de technische staat grondig 
                  en zorgen ervoor dat je met een goed gevoel wegrijdt. Of je nu op zoek bent 
                  naar je eerste motor of een ervaren rijder bent die iets nieuws zoekt - 
                  bij Bikerfun krijg je eerlijk advies.
                </p>
                <p>
                  Naast occasions bieden we ook een zorgvuldig geselecteerde collectie motorkleding 
                  en accessoires. Want veiligheid en stijl gaan bij ons hand in hand.
                </p>
              </div>
            </div>

            <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">Onze Kernwaarden</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold">Eerlijkheid</h4>
                  </div>
                  <p className="text-biker-light">
                    Transparant over de staat van onze occasions. Geen verrassingen achteraf.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold">Kwaliteit</h4>
                  </div>
                  <p className="text-biker-light">
                    Elke motor wordt technisch gekeurd. We verkopen alleen waar we zelf achter staan.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold">Passie</h4>
                  </div>
                  <p className="text-biker-light">
                    Motoren zijn geen product voor ons, het is een lifestyle die we graag delen.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold">Service</h4>
                  </div>
                  <p className="text-biker-light">
                    Persoonlijk contact, snelle reacties en altijd bereikbaar voor vragen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-biker-dark border-y-2 border-biker-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 uppercase tracking-tight"
          >
            Volg Ons Op <span className="text-biker-yellow">TikTok</span>
          </h2>
          <TikTokGrid />
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-tight"
          >
            Wat Wij <span className="text-biker-yellow">Bieden</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Occasions */}
            <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="w-16 h-16 rounded-xl bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Occasions</h3>
              <p className="text-biker-light mb-6">
                Zorgvuldig geselecteerde tweedehands motoren. Van cruisers tot sportmotoren, 
                elke categorie is vertegenwoordigd.
              </p>
              <Link
                href="/occasions"
                className="text-biker-yellow hover:underline font-bold uppercase tracking-wider"
              >
                Bekijk Aanbod →
              </Link>
            </div>

            {/* Motor op Aanvraag */}
            <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="w-16 h-16 rounded-xl bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Motor Op Aanvraag</h3>
              <p className="text-biker-light mb-6">
                Zoek je iets specifieks? Wij gaan voor jou op zoek in ons uitgebreide netwerk 
                door heel Europa.
              </p>
              <Link
                href="/motor-op-aanvraag"
                className="text-biker-yellow hover:underline font-bold uppercase tracking-wider"
              >
                Meer Info →
              </Link>
            </div>

            {/* Webshop */}
            <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray hover:border-biker-yellow transition-all">
              <div className="w-16 h-16 rounded-xl bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Motorkleding</h3>
              <p className="text-biker-light mb-6">
                Premium motorkleding en accessoires. Van helmen tot handschoenen - 
                compleet je motor ervaring.
              </p>
              <Link
                href="/products"
                className="text-biker-yellow hover:underline font-bold uppercase tracking-wider"
              >
                Shop Nu →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Kom Langs In Onze <span className="text-biker-yellow">Showroom</span>
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Wil je een occasion bekijken of gewoon even sparren over motoren? 
            Je bent altijd welkom voor een kop koffie!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              NEEM CONTACT OP
            </Link>
            <Link
              href="/occasions"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
            >
              BEKIJK OCCASIONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

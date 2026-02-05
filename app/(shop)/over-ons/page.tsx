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
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight"
          >
            Over <span className="text-biker-yellow">Bikerfun</span>
          </h1>
          <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
            Passie voor motoren, oog voor kwaliteit en persoonlijke service. 
            Dat is waar Bikerfun voor staat.
          </p>
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
                    <span className="text-3xl">🤝</span>
                    <h4 className="text-xl font-bold">Eerlijkheid</h4>
                  </div>
                  <p className="text-biker-light">
                    Transparant over de staat van onze occasions. Geen verrassingen achteraf.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">✨</span>
                    <h4 className="text-xl font-bold">Kwaliteit</h4>
                  </div>
                  <p className="text-biker-light">
                    Elke motor wordt technisch gekeurd. We verkopen alleen waar we zelf achter staan.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">❤️</span>
                    <h4 className="text-xl font-bold">Passie</h4>
                  </div>
                  <p className="text-biker-light">
                    Motoren zijn geen product voor ons, het is een lifestyle die we graag delen.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">🎯</span>
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
              <div className="text-5xl mb-4">🏍️</div>
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
              <div className="text-5xl mb-4">🔍</div>
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
              <div className="text-5xl mb-4">👕</div>
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

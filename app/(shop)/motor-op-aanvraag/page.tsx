import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { MotorAanvraagFormClient } from '@/components/forms/motor-aanvraag-form-client';

export const metadata: Metadata = {
  title: 'Motor Op Aanvraag | Bikerfun',
  description: 'Zoek je een specifieke motor? Wij gaan voor jou op zoek naar je droommoddel.',
};

export default function AanvraagPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section with Video */}
      <section className="relative overflow-hidden" style={{ height: 'calc(50vh + env(safe-area-inset-top))', minHeight: 'calc(300px + env(safe-area-inset-top))', marginTop: 'calc(-1 * env(safe-area-inset-top))' }}>
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero-aanvraag.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center" style={{ paddingTop: 'calc(7rem + env(safe-area-inset-top))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 
              style={{ 
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.05em'
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl uppercase"
            >
              Motor Op <span className="text-biker-yellow">Aanvraag</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Kunnen we je helpen met het vinden van een specifieke motor? 
              Vul het formulier in en wij gaan voor jou op zoek!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-tight"
          >
            Hoe Werkt Het?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Vertel Ons Je Wens</h3>
              <p className="text-biker-light">
                Vul het formulier in met jouw droommoddel, budget en wensen. 
                Hoe specifieker, hoe beter we kunnen zoeken!
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Wij Gaan Zoeken</h3>
              <p className="text-biker-light">
                Ons team duikt in ons netwerk en gebruikt onze expertise 
                om de perfecte motor voor jou te vinden.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Jij Rijdt Weg</h3>
              <p className="text-biker-light">
                We nemen contact op zodra we wat gevonden hebben. 
                Na goedkeuring regel wij alles tot aan de overdracht!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20 noise-overlay border-t border-biker-gray/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-biker-dark rounded-2xl p-8 lg:p-12">
            <h2 
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight text-center"
            >
              Aanvraagformulier
            </h2>
            
            <Suspense fallback={<div className="text-center py-8 text-biker-light">Formulier laden...</div>}>
              <MotorAanvraagFormClient />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Waarom <span className="text-biker-yellow">Bikerfun</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="w-16 h-16 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Groot Netwerk</h3>
              <p className="text-biker-light">
                Toegang tot honderden dealers en particuliere aanbieders in heel Europa
              </p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Kwaliteitscheck</h3>
              <p className="text-biker-light">
                Elke motor wordt door ons gekeurd voordat we hem aan jou voorstellen
              </p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Zorgeloos</h3>
              <p className="text-biker-light">
                Wij regelen transport, papierwerk en garantie - jij hoeft alleen maar te rijden!
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="/contact"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
            >
              EERST EVEN BELLEN?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

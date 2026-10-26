import Link from 'next/link';
import { OmkeurenForm } from '@/components/forms/omkeuren-form';
import { getOmkeurenMetadata } from '@/lib/seo/metadata';

export const metadata = getOmkeurenMetadata();

export default function OmkeurenPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      <section className="relative h-[32vh] min-h-[220px] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero-omkeuren.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>

        <div className="relative h-full flex items-center pt-20 md:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1
              style={{
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.05em',
              }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-2xl uppercase"
            >
              Motor <span className="text-biker-yellow">Omkeuren</span>
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-3xl mx-auto">
              Motor omkeuren naar A2 / 35kW? Wij regelen het papierwerk voor je.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 uppercase tracking-tight"
          >
            Advies<span className="text-biker-yellow">prijzen</span>
          </h2>
          <p className="text-biker-light text-center mb-12">
            Prijzen zijn inclusief papierwerk. De exacte prijs bevestigen we na je aanvraag.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="#aanvraag"
              className="bg-black rounded-2xl p-8 border-2 border-biker-gray text-center hover:border-biker-yellow hover:-translate-y-1 transition-all"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-biker-muted mb-3">
                Minder dan 70 kW
              </p>
              <p className="text-5xl font-bold text-biker-yellow mb-2">€ 495</p>
              <p className="text-biker-light">Adviesprijs voor motoren onder 70 kW</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-wider text-biker-yellow">
                Vraag aan
              </p>
            </a>
            <a
              href="#aanvraag"
              className="bg-black rounded-2xl p-8 border-2 border-biker-yellow text-center hover:bg-biker-yellow/5 hover:-translate-y-1 transition-all"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-biker-muted mb-3">
                Meer dan 70 kW
              </p>
              <p className="text-5xl font-bold text-biker-yellow mb-2">€ 695</p>
              <p className="text-biker-light">Adviesprijs voor motoren boven 70 kW</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-wider text-biker-yellow">
                Vraag aan
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-tight"
          >
            Hoe Werkt Het?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Vul het formulier in</h3>
              <p className="text-biker-light">
                Geef merk, model en bouwjaar door. Hoe meer gegevens, hoe sneller we kunnen kijken.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Wij regelen het</h3>
              <p className="text-biker-light">
                Van aanvraag tot papieren: wij nemen het omkeuren naar 35kW voor je uit handen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Rijden</h3>
              <p className="text-biker-light">
                Als de papieren rond zijn, kun je met een gerust hart de weg op.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OmkeurenForm />

      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Liever <span className="text-biker-yellow">Direct</span> Bellen?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            We werken op afspraak. Bel of app ons, dan plannen we het omkeuren in.
          </p>
          <Link
            href="tel:+31615452108"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            06 15 45 21 08
          </Link>
        </div>
      </section>
    </div>
  );
}

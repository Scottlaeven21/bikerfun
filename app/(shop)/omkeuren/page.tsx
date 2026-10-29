import Link from 'next/link';
import { OmkeurenForm } from '@/components/forms/omkeuren-form';
import { FAQAccordion } from '@/components/faq/faq-accordion';
import { StructuredData } from '@/components/seo/structured-data';
import { getOmkeurenMetadata } from '@/lib/seo/metadata';
import { omkeurenFaq } from '@/lib/seo/omkeuren';
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getOmkeurenServiceSchema,
} from '@/lib/seo/structured-data';

export const metadata = getOmkeurenMetadata();

export default function OmkeurenPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      <StructuredData id="omkeuren-service" data={getOmkeurenServiceSchema()} />
      <StructuredData id="omkeuren-faq" data={getFaqSchema(omkeurenFaq)} />
      <StructuredData
        id="omkeuren-breadcrumb"
        data={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Motor omkeuren', url: '/omkeuren' },
        ])}
      />
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
              Omkeuren naar A2 / 35kW of terug naar origineel vermogen? Vaak op afstand, meestal 5 tot 10 werkdagen.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-6 md:pt-10 pb-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-biker-muted mb-6 md:mb-8" aria-label="Broodkruimel">
            <Link href="/" className="hover:text-biker-yellow">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Motor omkeuren</span>
          </nav>
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tight"
          >
            Wat is motor <span className="text-biker-yellow">omkeuren</span>?
          </h2>
          <div className="space-y-4 text-biker-light text-lg leading-relaxed">
            <p>
              Met een A2-rijbewijs mag je een motor tot 35kW rijden. Heeft jouw motor meer vermogen,
              dan kun je hem laten <strong className="text-white">omkeuren naar A2 / 35kW</strong>.
              Moet hij later weer terug? Dat kan ook: we keuren hem weer{' '}
              <strong className="text-white">terug naar origineel / vol vermogen</strong>.
              Bikerfun in Susteren (Limburg) regelt het papierwerk voor je.
            </p>
            <p className="hidden md:block">
              Dat doen we voor particulieren én voor motorzaken. Het duurt meestal 5 tot 10
              werkdagen. Vaak kan het ook op afstand — je hoeft de motor dus niet altijd langs
              te brengen. Vul het formulier in of neem contact op, dan denken we met je mee.
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
            Wat bepaalt de <span className="text-biker-yellow">prijs</span>?
          </h2>
          <p className="text-biker-light text-center mb-12 max-w-2xl mx-auto">
            Geen vaste adviesprijs — het hangt af van je situatie. Neem contact op voor een
            gerichte prijs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mb-10">
            {[
              { title: 'NL of Belgisch kenteken', text: 'Nederlands of Belgisch kenteken maakt uit voor de afhandeling en de prijs.' },
              { title: 'Omkeuren naar 35kW', text: 'Beperken naar A2 / 35kW, zodat je ermee mag rijden op A2-rijbewijs.' },
              { title: 'Terugkeuren naar vol vermogen', text: 'Weer terug naar het originele / volle vermogen van de motor.' },
              { title: 'Kan per motor licht verschillen', text: 'Merk, model en papieren kunnen de prijs een beetje beïnvloeden.' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-black rounded-2xl p-5 md:p-7 border-2 border-biker-gray"
              >
                <p className="text-sm md:text-base font-bold uppercase tracking-wider text-biker-yellow mb-2">
                  {item.title}
                </p>
                <p className="text-sm md:text-base text-biker-light leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href="#aanvraag"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              Contact opnemen
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
                Van aanvraag tot papieren, vaak op afstand. Meestal klaar binnen 5 tot 10 werkdagen.
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
          <div className="mt-12 text-center md:hidden">
            <a
              href="#aanvraag"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-primary inline-block w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              Omkeuring aanvragen
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 bg-biker-dark/40 border-y border-biker-gray/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-3xl md:text-4xl font-bold mb-10 uppercase tracking-tight text-center"
          >
            Veelgestelde vragen over <span className="text-biker-yellow">omkeuren</span>
          </h2>
          <FAQAccordion items={omkeurenFaq} />
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
            Vragen? Bel of app ons. Omkeuren kan vaak op afstand — je hoeft de motor niet altijd langs te brengen.
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

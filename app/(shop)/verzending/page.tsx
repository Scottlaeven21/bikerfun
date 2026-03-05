import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verzending & Levering | Bikerfun',
  description: 'Informatie over verzending, levertijden en track & trace bij Bikerfun.',
};

export default function VerzendingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight"
          >
            Verzending & <span className="text-biker-yellow">Levering</span>
          </h1>
          <p className="text-lg text-biker-light max-w-3xl mx-auto">
            Alles wat je moet weten over verzending, levertijden en track & trace.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            
            {/* Verzendpartners */}
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-biker-yellow">
                Onze Verzendpartners
              </h2>
              <div className="space-y-4 text-biker-light text-lg">
                <p>
                  Bestellingen worden geleverd door <strong className="text-white">PostNL</strong> en{' '}
                  <strong className="text-white">DHL</strong>. Dit zijn betrouwbare partners waarmee 
                  wij al jaren samenwerken voor snelle en veilige levering.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-biker-black rounded-lg p-6 border border-biker-gray">
                  <div className="w-12 h-12 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Brievenbuspakket</h3>
                  <p className="text-biker-light">
                    Compacte items zoals sleutelhangers en kleine accessoires. 
                    Wordt bezorgd in je brievenbus.
                  </p>
                  <p className="text-biker-yellow font-bold mt-3">✓ Track & Trace beschikbaar</p>
                </div>

                <div className="bg-biker-black rounded-lg p-6 border border-biker-gray">
                  <div className="w-12 h-12 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Briefpost</h3>
                  <p className="text-biker-light">
                    Extra kleine items zoals losse sleutelhangers worden verstuurd als brief.
                  </p>
                  <p className="text-biker-muted mt-3">✗ Geen Track & Trace</p>
                </div>

                <div className="bg-biker-black rounded-lg p-6 border border-biker-gray md:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Standaard Pakket</h3>
                  <p className="text-biker-light">
                    Grotere items zoals helmen, jassen en helmet covers worden verstuurd 
                    als standaard pakket. Je ontvangt een bezorgmoment via Track & Trace.
                  </p>
                  <p className="text-biker-yellow font-bold mt-3">✓ Track & Trace beschikbaar</p>
                </div>
              </div>
            </div>

            {/* Levertijd */}
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-biker-yellow">
                Levertijden
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Voor 16:00 Besteld, Vandaag Verzonden</h3>
                    <p className="text-biker-light">
                      Bestellingen die voor 16:00 uur worden geplaatst, worden dezelfde dag 
                      nog afgegeven bij PostNL of DHL. Je ontvangt direct een Track & Trace code 
                      (indien van toepassing).
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Bezorging Binnen 1-3 Werkdagen</h3>
                    <p className="text-biker-light">
                      Standaard pakketten worden binnen 1-3 werkdagen bezorgd in Nederland. 
                      Brievenbuspakketten vaak al de volgende dag.
                    </p>
                  </div>
                </div>

                <div className="bg-biker-black rounded-lg p-6 border border-biker-gray">
                  <p className="text-biker-light">
                    <strong className="text-white">Let op:</strong> Bestellingen geplaatst in het weekend 
                    of op feestdagen worden de eerstvolgende werkdag verwerkt.
                  </p>
                </div>
              </div>
            </div>

            {/* Verzendkosten */}
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-biker-yellow">
                Verzendkosten
              </h2>
              <div className="space-y-6">
                <div className="bg-biker-black rounded-lg p-6 border-2 border-biker-yellow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-biker-yellow/20 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-biker-yellow">
                      Nederland: ALTIJD Gratis Verzending
                    </p>
                  </div>
                  <p className="text-biker-light text-lg">
                    Voor alle bestellingen binnen Nederland zijn de verzendkosten <strong className="text-white">volledig gratis</strong>, 
                    ongeacht het orderbedrag.
                  </p>
                </div>

                <div className="bg-biker-black rounded-lg p-6 border border-biker-gray">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-biker-yellow/10 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-white">
                      België: Verzendkosten bij Afrekenen
                    </p>
                  </div>
                  <p className="text-biker-light">
                    Voor leveringen naar België worden de verzendkosten berekend en weergegeven tijdens het afrekenproces, 
                    afhankelijk van het gewicht en de afmetingen van je bestelling.
                  </p>
                </div>
              </div>
            </div>

            {/* Track & Trace */}
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-biker-yellow">
                Track & Trace
              </h2>
              <div className="space-y-4 text-biker-light text-lg">
                <p>
                  Bij pakketten en brievenbuspakketten ontvang je automatisch een Track & Trace code per e-mail. 
                  Hiermee kun je live volgen waar je bestelling zich bevindt.
                </p>
                <p>
                  <strong className="text-white">Tip:</strong> Heb je geen Track & Trace ontvangen? 
                  Check je spam-folder of neem contact met ons op via{' '}
                  <a href="mailto:bikerfun.info@gmail.com" className="text-biker-yellow hover:underline">
                    bikerfun.info@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Belangrijke Info Helmcovers */}
            <div className="bg-gradient-to-br from-biker-yellow/10 to-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-yellow">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-biker-yellow/20 border-2 border-biker-yellow flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-tight text-biker-yellow">
                  Belangrijk: Helmcovers
                </h2>
              </div>
              <div className="space-y-4 text-biker-light text-lg">
                <p>
                  <strong className="text-white">De helmcovers verschillen in maat.</strong> Over het algemeen 
                  passen de meeste helmcovers over alle soorten helmen.
                </p>
                <p>
                  <strong className="text-biker-yellow">Belangrijke tip:</strong> Bekijk de meegeleverde 
                  instructies en probeer beide methodes een aantal keer voordat er geconcludeerd kan worden 
                  dat de helmcover niet past.
                </p>
                <p>
                  Heb je toch problemen met de pasvorm? Neem dan contact met ons op, wij helpen je graag verder!
                </p>
              </div>
            </div>

            {/* Vragen */}
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-biker-yellow">
                Vragen over je Bestelling?
              </h2>
              <div className="space-y-4 text-biker-light text-lg">
                <p>
                  Heb je vragen over je bestelling, levering of Track & Trace? 
                  Neem gerust contact met ons op!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-biker-black rounded-lg p-4 border border-biker-gray">
                    <p className="text-sm text-biker-muted mb-1">Telefoon</p>
                    <a href="tel:+31615452108" className="text-biker-yellow hover:underline font-bold">
                      06 15 45 21 08
                    </a>
                  </div>
                  <div className="bg-biker-black rounded-lg p-4 border border-biker-gray">
                    <p className="text-sm text-biker-muted mb-1">E-mail</p>
                    <a href="mailto:bikerfun.info@gmail.com" className="text-biker-yellow hover:underline font-bold">
                      bikerfun.info@gmail.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-biker-muted mt-4">
                  Bereikbaar: Ma-Vr 07:00 - 17:00 | Za 12:00 - 17:00
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/products"
                style={{ fontFamily: 'var(--font-montserrat)' }}
                className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
              >
                SHOP NU
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

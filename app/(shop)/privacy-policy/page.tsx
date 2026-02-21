import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bikerfun',
  description: 'Privacybeleid en cookieverklaring van Bikerfun. Lees hoe wij omgaan met jouw persoonlijke gegevens.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight text-center"
          >
            Privacy <span className="text-biker-yellow">Policy</span>
          </h1>
          <p className="text-lg text-biker-light text-center">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-yellow max-w-none">
            
            {/* Introductie */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                1. Introductie
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Bikerfun ("wij", "ons", "onze") hecht groot belang aan de bescherming van uw persoonsgegevens. 
                In dit privacybeleid leggen we uit welke persoonsgegevens we verzamelen, waarom we deze verzamelen, 
                hoe we deze gebruiken en wat uw rechten zijn.
              </p>
              <p className="text-biker-light leading-relaxed">
                Deze privacy policy is van toepassing op alle diensten die worden aangeboden via bikerfun.nl.
              </p>
            </div>

            {/* Contactgegevens */}
            <div className="mb-12 bg-biker-dark p-6 rounded-2xl border-2 border-biker-gray">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                2. Contactgegevens
              </h2>
              <p className="text-biker-light mb-2"><strong>Bikerfun</strong></p>
              <p className="text-biker-light mb-2">Rafaëlweg 23</p>
              <p className="text-biker-light mb-2">6114BX Susteren</p>
              <p className="text-biker-light mb-2">Telefoon: 06 15 45 21 08</p>
              <p className="text-biker-light">Email: info@bikerfun.nl</p>
            </div>

            {/* Welke gegevens */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                3. Welke Gegevens Verzamelen Wij?
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Wij verzamelen en verwerken de volgende persoonsgegevens:
              </p>
              <ul className="list-disc list-inside text-biker-light space-y-2 ml-4">
                <li>Naam en contactgegevens (email, telefoonnummer)</li>
                <li>Adresgegevens (voor levering)</li>
                <li>Betalingsgegevens (via beveiligde betalingsproviders)</li>
                <li>IP-adres en browsgegevens</li>
                <li>Communicatie via email, telefoon of contactformulier</li>
                <li>Voorkeuren en interesses (occasions, producten)</li>
              </ul>
            </div>

            {/* Doeleinden */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                4. Waarvoor Gebruiken Wij Uw Gegevens?
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Wij gebruiken uw persoonsgegevens voor de volgende doeleinden:
              </p>
              <ul className="list-disc list-inside text-biker-light space-y-2 ml-4">
                <li>Het uitvoeren van overeenkomsten (verkoop van occasions en producten)</li>
                <li>Het verwerken van uw bestellingen en betalingen</li>
                <li>Het beantwoorden van vragen en verzoeken</li>
                <li>Het versturen van orderbevestigingen en updates</li>
                <li>Het verbeteren van onze website en diensten</li>
                <li>Het voldoen aan wettelijke verplichtingen</li>
                <li>Marketing en communicatie (alleen met uw toestemming)</li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                5. Cookies
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Onze website maakt gebruik van cookies. Cookies zijn kleine tekstbestanden die op uw apparaat worden opgeslagen.
              </p>
              <h3 className="text-xl font-bold text-biker-yellow mb-3">Essentiële Cookies</h3>
              <p className="text-biker-light leading-relaxed mb-4">
                Deze cookies zijn noodzakelijk voor de werking van de website. Ze onthouden bijvoorbeeld uw 
                cookie-voorkeuren en zorgen voor een veilige verbinding.
              </p>
              <h3 className="text-xl font-bold text-biker-yellow mb-3">Analytische Cookies</h3>
              <p className="text-biker-light leading-relaxed mb-4">
                Met uw toestemming gebruiken we analytische cookies om te begrijpen hoe bezoekers onze website gebruiken. 
                Dit helpt ons de website te verbeteren.
              </p>
              <p className="text-biker-light leading-relaxed">
                U kunt uw cookie-voorkeuren op elk moment wijzigen via de instellingen in uw browser.
              </p>
            </div>

            {/* Beveiliging */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                6. Beveiliging
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen 
                tegen verlies, misbruik, ongeautoriseerde toegang en onrechtmatige verwerking.
              </p>
              <p className="text-biker-light leading-relaxed">
                Betalingsgegevens worden verwerkt via beveiligde, versleutelde verbindingen (SSL/TLS) en we slaan 
                geen volledige betaalkaartgegevens op.
              </p>
            </div>

            {/* Bewaartermijn */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                7. Bewaartermijn
              </h2>
              <p className="text-biker-light leading-relaxed">
                Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld, 
                of zolang dit wettelijk verplicht is (bijvoorbeeld voor fiscale doeleinden: 7 jaar).
              </p>
            </div>

            {/* Uw rechten */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                8. Uw Rechten
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
              </p>
              <ul className="list-disc list-inside text-biker-light space-y-2 ml-4">
                <li><strong>Recht op inzage:</strong> U kunt opvragen welke gegevens we van u hebben</li>
                <li><strong>Recht op correctie:</strong> U kunt onjuiste gegevens laten corrigeren</li>
                <li><strong>Recht op verwijdering:</strong> U kunt verzoeken om verwijdering van uw gegevens</li>
                <li><strong>Recht op beperking:</strong> U kunt verzoeken om beperking van de verwerking</li>
                <li><strong>Recht op dataportabiliteit:</strong> U kunt uw gegevens in een gestructureerd formaat opvragen</li>
                <li><strong>Recht van bezwaar:</strong> U kunt bezwaar maken tegen bepaalde verwerkingen</li>
              </ul>
              <p className="text-biker-light leading-relaxed mt-4">
                Om deze rechten uit te oefenen, kunt u contact met ons opnemen via{' '}
                <a href="mailto:info@bikerfun.nl" className="text-biker-yellow hover:text-biker-yellowHover underline">
                  info@bikerfun.nl
                </a>
              </p>
            </div>

            {/* Delen met derden */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                9. Delen Met Derden
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Wij delen uw persoonsgegevens alleen met derden wanneer dit noodzakelijk is voor de uitvoering van de overeenkomst 
                of wanneer dit wettelijk verplicht is.
              </p>
              <p className="text-biker-light leading-relaxed">
                Voorbeelden: betalingsproviders, verzendpartners, email service providers. Deze partijen verwerken gegevens 
                uitsluitend in opdracht van ons en onder strikte voorwaarden.
              </p>
            </div>

            {/* Wijzigingen */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                10. Wijzigingen in Deze Privacy Policy
              </h2>
              <p className="text-biker-light leading-relaxed">
                Wij kunnen deze privacy policy van tijd tot tijd aanpassen. De laatste versie is altijd te vinden op deze pagina. 
                Bij belangrijke wijzigingen zullen we u hiervan op de hoogte stellen.
              </p>
            </div>

            {/* Klachten */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                11. Klachten
              </h2>
              <p className="text-biker-light leading-relaxed mb-4">
                Als u een klacht heeft over de manier waarop wij uw persoonsgegevens verwerken, horen we dit graag. 
                U kunt contact met ons opnemen via de bovenstaande contactgegevens.
              </p>
              <p className="text-biker-light leading-relaxed">
                U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens:{' '}
                <a
                  href="https://autoriteitpersoonsgegevens.nl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-yellow hover:text-biker-yellowHover underline"
                >
                  autoriteitpersoonsgegevens.nl
                </a>
              </p>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center bg-biker-dark p-8 rounded-2xl border-2 border-biker-yellow">
              <h2 className="text-2xl font-bold text-white mb-4">Vragen?</h2>
              <p className="text-biker-light mb-6">
                Heeft u vragen over ons privacybeleid? Neem gerust contact met ons op.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
              >
                NEEM CONTACT OP
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Beleid | Bikerfun',
  description: 'Lees het privacy beleid van Bikerfun en hoe wij omgaan met jouw gegevens.',
  robots: { index: false, follow: false },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl'}/privacy-policy` },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight"
          >
            Privacy <span className="text-biker-yellow">Beleid</span>
          </h1>
          <p className="text-lg text-biker-light max-w-3xl mx-auto">
            Jouw privacy is belangrijk voor ons. Lees hier hoe wij omgaan met jouw gegevens.
          </p>
          <p className="text-sm text-biker-muted mt-2">
            Laatst bijgewerkt: Februari 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray space-y-8">
            
            {/* Intro */}
            <div>
              <p className="text-biker-light text-lg">
                Bikerfun respecteert de privacy van alle bezoekers van de website en klanten. 
                Wij gaan zorgvuldig om met jouw persoonlijke gegevens en houden ons aan de 
                Algemene Verordening Gegevensbescherming (AVG).
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                1. Welke Gegevens Verzamelen Wij?
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>Wij verzamelen de volgende persoonsgegevens:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Contactgegevens:</strong> Naam, adres, e-mailadres, telefoonnummer</li>
                  <li><strong>Bestelgegevens:</strong> Producten, betalingsinformatie, leveringsadres</li>
                  <li><strong>Communicatie:</strong> Berichten via contactformulieren of e-mail</li>
                  <li><strong>Technische gegevens:</strong> IP-adres, browsertype, surfgedrag (via cookies)</li>
                  <li><strong>Rijbewijsgegevens:</strong> Bij proefritten voor verificatie</li>
                </ul>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                2. Waarvoor Gebruiken Wij Jouw Gegevens?
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>Wij gebruiken jouw gegevens voor de volgende doeleinden:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verwerken van bestellingen en levering van producten</li>
                  <li>Communicatie over jouw bestelling, vragen of aanvragen</li>
                  <li>Klantenservice en aftersales</li>
                  <li>Verbeteren van onze website en dienstverlening</li>
                  <li>Marketing (alleen met jouw toestemming)</li>
                  <li>Voldoen aan wettelijke verplichtingen</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                3. Rechtmatige Grondslag
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>Wij verwerken jouw gegevens op basis van:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Uitvoering van de overeenkomst:</strong> Voor het leveren van producten of diensten</li>
                  <li><strong>Toestemming:</strong> Voor marketing en nieuwsbrieven (kan altijd ingetrokken worden)</li>
                  <li><strong>Gerechtvaardigd belang:</strong> Voor analyse en verbetering van onze diensten</li>
                  <li><strong>Wettelijke verplichting:</strong> Zoals bewaren van facturen voor de Belastingdienst</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                4. Delen van Gegevens met Derden
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Bikerfun verkoopt jouw gegevens NOOIT aan derden. Wij delen alleen gegevens met 
                  partijen die noodzakelijk zijn voor onze dienstverlening:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Verzendpartijen:</strong> Voor levering van producten (bijv. PostNL, DHL)</li>
                  <li><strong>Betaalproviders:</strong> Voor het verwerken van betalingen (bijv. Stripe, Mollie)</li>
                  <li><strong>Hosting & IT:</strong> Voor het technisch onderhouden van onze website</li>
                  <li><strong>Accountant/Belastingdienst:</strong> Voor wettelijke administratieve verplichtingen</li>
                </ul>
                <p className="mt-3">
                  Deze partijen mogen jouw gegevens alleen gebruiken voor het doel waarvoor ze zijn 
                  verstrekt en zijn contractueel verplicht deze vertrouwelijk te behandelen.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                5. Bewaartermijn
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>Wij bewaren jouw gegevens niet langer dan noodzakelijk:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Bestelgegevens:</strong> 7 jaar (fiscale wetgeving)</li>
                  <li><strong>Accountgegevens:</strong> Tot 2 jaar na laatste activiteit, tenzij je om verwijdering verzoekt</li>
                  <li><strong>Marketing toestemming:</strong> Tot je je uitschrijft of 3 jaar na laatste interactie</li>
                  <li><strong>Contactformulieren:</strong> 1 jaar na afhandeling</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                6. Cookies
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Bikerfun maakt gebruik van cookies om de website goed te laten functioneren en 
                  jouw ervaring te verbeteren.
                </p>
                <p><strong>Functionele cookies:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Onthouden van winkelwagen</li>
                  <li>Inloggegevens onthouden</li>
                  <li>Taalvoorkeur</li>
                </ul>
                <p className="mt-3"><strong>Analytische cookies:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Google Analytics (geanonimiseerd) voor bezoekersstatistieken</li>
                </ul>
                <p className="mt-3">
                  Je kunt cookies uitschakelen via je browserinstellingen, maar dit kan de werking 
                  van de website beïnvloeden.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                7. Jouw Rechten
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>Je hebt de volgende rechten met betrekking tot jouw persoonsgegevens:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Recht op inzage:</strong> Je kunt opvragen welke gegevens wij van jou bewaren</li>
                  <li><strong>Recht op correctie:</strong> Je kunt onjuiste gegevens laten aanpassen</li>
                  <li><strong>Recht op verwijdering:</strong> Je kunt verzoeken jouw gegevens te verwijderen</li>
                  <li><strong>Recht op beperking:</strong> Je kunt verzoeken de verwerking te beperken</li>
                  <li><strong>Recht op dataportabiliteit:</strong> Je kunt jouw gegevens in een leesbaar formaat opvragen</li>
                  <li><strong>Recht van bezwaar:</strong> Je kunt bezwaar maken tegen bepaalde verwerkingen</li>
                  <li><strong>Toestemming intrekken:</strong> Je kunt toestemming voor marketing altijd intrekken</li>
                </ul>
                <p className="mt-4">
                  Om gebruik te maken van deze rechten, kun je contact met ons opnemen via 
                  <strong> info@bikerfun.nl</strong>. Wij reageren binnen 30 dagen.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                8. Beveiliging
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Wij nemen passende technische en organisatorische maatregelen om jouw gegevens 
                  te beschermen tegen ongeautoriseerde toegang, verlies of misbruik:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL-certificaat (HTTPS) voor veilige verbinding</li>
                  <li>Beveiligde servers en regelmatige backups</li>
                  <li>Toegang tot gegevens alleen voor geautoriseerd personeel</li>
                  <li>Sterke wachtwoordbeveiliging</li>
                </ul>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                9. Wijzigingen in Dit Privacy Beleid
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Wij behouden ons het recht voor dit privacy beleid aan te passen. 
                  De meest actuele versie vind je altijd op deze pagina. Controleer daarom 
                  regelmatig deze pagina voor eventuele wijzigingen.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                10. Vragen of Klachten?
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Heb je vragen over ons privacy beleid of wil je gebruik maken van je rechten? 
                  Neem dan contact met ons op:
                </p>
                <div className="bg-biker-black rounded-lg p-4 mt-4">
                  <p><strong>E-mail:</strong> info@bikerfun.nl</p>
                  <p><strong>Telefoon:</strong> 06 15 45 21 08</p>
                  <p><strong>Adres:</strong> Rafaëlweg 23, 6114BX Susteren</p>
                  <p><strong>Openingstijden:</strong> Ma-Vr: 07:00 - 17:00, Za: 12:00 - 17:00</p>
                </div>
                <p className="mt-4">
                  Als je niet tevreden bent over hoe wij met jouw gegevens omgaan, heb je het recht 
                  om een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP): 
                  <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-biker-yellow hover:underline ml-1">
                    www.autoriteitpersoonsgegevens.nl
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

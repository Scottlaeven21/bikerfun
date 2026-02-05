import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden | Bikerfun',
  description: 'Lees de algemene voorwaarden van Bikerfun.',
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight"
          >
            Algemene <span className="text-biker-yellow">Voorwaarden</span>
          </h1>
          <p className="text-lg text-biker-light max-w-3xl mx-auto">
            Laatst bijgewerkt: Februari 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray space-y-8">
            
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                1. Toepasselijkheid
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen en 
                  overeenkomsten tussen Bikerfun en de klant, tenzij uitdrukkelijk schriftelijk anders 
                  is overeengekomen.
                </p>
                <p>
                  Door het plaatsen van een bestelling of het aangaan van een overeenkomst verklaart 
                  de klant zich akkoord met deze algemene voorwaarden.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                2. Aanbiedingen en Prijzen
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Alle aanbiedingen zijn vrijblijvend, tenzij anders vermeld. Prijzen zijn inclusief 
                  BTW, tenzij anders aangegeven. Bikerfun behoudt zich het recht voor prijzen te wijzigen.
                </p>
                <p>
                  De prijzen van occasions zijn inclusief BTW en gelden zolang de motor beschikbaar is. 
                  Bij verkoop van een occasion aan een zakelijke klant (BTW-verlegd) wordt dit vooraf 
                  gecommuniceerd.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                3. Totstandkoming Overeenkomst
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Een overeenkomst komt tot stand op het moment dat Bikerfun de bestelling schriftelijk 
                  (per e-mail of fysiek document) bevestigt, of op het moment van levering.
                </p>
                <p>
                  Voor occasions geldt: een aanbetaling van minimaal 10% van de aankoopprijs is vereist 
                  om de motor te reserveren. De resterende betaling dient te geschieden voor of op het 
                  moment van overdracht.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                4. Levering en Levertijd
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  <strong>Occasions:</strong> Levering vindt plaats na volledige betaling en kan direct 
                  plaatsvinden indien de motor aanwezig is in onze showroom. Transport kan tegen 
                  meerprijs geregeld worden.
                </p>
                <p>
                  <strong>Webshop artikelen:</strong> Levertijd is doorgaans 3-5 werkdagen binnen Nederland. 
                  Bij artikelen die op bestelling worden ingekocht, wordt de levertijd vooraf gecommuniceerd.
                </p>
                <p>
                  Vertraging in levering geeft de klant geen recht op schadevergoeding of ontbinding van 
                  de overeenkomst, tenzij de vertraging meer dan 30 dagen bedraagt.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                5. Betaling
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Betaling dient te geschieden volgens de op de factuur vermelde betalingsvoorwaarden. 
                  Standaard is dit contant, via pin of bankoverschrijving voorafgaand aan levering.
                </p>
                <p>
                  Bij te late betaling is de klant van rechtswege in verzuim. Bikerfun behoudt zich het 
                  recht voor om wettelijke rente en incassokosten in rekening te brengen.
                </p>
              </div>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                6. Herroepingsrecht (Consumenten)
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Voor webshop artikelen geldt een herroepingstermijn van 14 dagen na ontvangst. 
                  Retourneren kan alleen in ongebruikte staat, in de originele verpakking, met bewijs 
                  van aankoop.
                </p>
                <p>
                  <strong>Let op:</strong> Het herroepingsrecht is NIET van toepassing op de aankoop 
                  van occasions (motoren), aangezien dit maatwerk betreft en/of grote aanschafwaarden.
                </p>
                <p>
                  Voor hygiënische redenen kunnen bepaalde artikelen zoals helmen en handschoenen niet 
                  geretourneerd worden na het verbreken van de verzegeling.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                7. Garantie
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  <strong>Occasions:</strong> Tenzij anders vermeld, wordt op gebruikte motoren 
                  een garantie van 3 maanden op de motor (technische gebreken) gegeven. Slijtage-onderdelen 
                  vallen hier niet onder. Garantie geldt alleen bij normaal gebruik.
                </p>
                <p>
                  <strong>Nieuwe artikelen uit de webshop:</strong> Hierop is de fabrieksgarantie van 
                  toepassing zoals vermeld door de fabrikant.
                </p>
                <p>
                  Garantie geldt niet bij schade door onoordeelkundig gebruik, verwaarlozing, ongevallen 
                  of aanpassingen door derden.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                8. Aansprakelijkheid
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Bikerfun is niet aansprakelijk voor indirecte schade, gevolgschade of bedrijfsschade, 
                  tenzij er sprake is van opzet of grove schuld.
                </p>
                <p>
                  De aansprakelijkheid van Bikerfun is in alle gevallen beperkt tot het factuurbedrag 
                  van de betreffende overeenkomst.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                9. Eigendomsvoorbehoud
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Alle geleverde goederen blijven eigendom van Bikerfun totdat de klant alle 
                  verschuldigde bedragen volledig heeft voldaan.
                </p>
              </div>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                10. Klachten
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Klachten over geleverde producten of diensten dienen binnen 7 dagen na levering 
                  schriftelijk te worden gemeld bij Bikerfun. Klachten na deze termijn worden niet 
                  meer in behandeling genomen.
                </p>
                <p>
                  Bikerfun zal de klacht zo spoedig mogelijk, maar uiterlijk binnen 14 dagen na 
                  ontvangst, behandelen en beantwoorden.
                </p>
              </div>
            </div>

            {/* Section 11 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                11. Toepasselijk Recht
              </h2>
              <div className="space-y-3 text-biker-light">
                <p>
                  Op alle overeenkomsten tussen Bikerfun en de klant is Nederlands recht van toepassing.
                </p>
                <p>
                  Geschillen zullen bij voorkeur in onderling overleg worden opgelost. Indien dat niet 
                  mogelijk is, zijn de geschillen onderworpen aan de bevoegde rechter in het 
                  arrondissement waar Bikerfun is gevestigd.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t-2 border-biker-gray">
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight text-biker-yellow">
                Contactgegevens
              </h2>
              <div className="space-y-2 text-biker-light">
                <p><strong>Bedrijfsnaam:</strong> Bikerfun</p>
                <p><strong>Adres:</strong> Hendrik Luijtenstraat 3, 6136 CS Sittard</p>
                <p><strong>E-mail:</strong> bikerfun.info@gmail.com</p>
                <p><strong>Telefoon:</strong> 06 15 45 21 08</p>
                <p><strong>Openingstijden:</strong> Ma-Vr: 07:00 - 17:00, Za: 12:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

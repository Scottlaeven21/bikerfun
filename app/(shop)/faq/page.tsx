import { Metadata } from 'next';
import { FAQAccordion } from '@/components/faq/faq-accordion';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen (FAQ) | Bikerfun',
  description: 'Vind antwoorden op veelgestelde vragen over onze occasions, financiering, garantie en meer.',
  keywords: ['faq', 'veelgestelde vragen', 'motor kopen', 'occasions', 'garantie', 'financiering'],
};

const faqData = [
  {
    question: 'Kan ik een occasion komen bezichtigen?',
    answer: 'Ja, natuurlijk! We werken graag op afspraak om ervoor te zorgen dat we voldoende tijd voor je hebben. Bel ons op 06 15 45 21 08 of gebruik het contactformulier om een afspraak te maken.',
  },
  {
    question: 'Bieden jullie garantie op occasions?',
    answer: 'We bieden verschillende garantiemogelijkheden afhankelijk van de motor. Alle motors worden grondig gecontroleerd voordat ze te koop worden aangeboden. Vraag bij ons naar de specifieke garantievoorwaarden voor de motor waarin je geïnteresseerd bent.',
  },
  {
    question: 'Is financiering mogelijk?',
    answer: 'Ja, we kunnen je helpen met verschillende financieringsmogelijkheden. Neem contact met ons op om de opties te bespreken die het beste bij jouw situatie passen.',
  },
  {
    question: 'Kan ik mijn huidige motor inruilen?',
    answer: 'Absoluut! We kopen graag jouw huidige motor in. Stuur ons foto\'s en specificaties via het contactformulier of WhatsApp, dan maken we een eerlijke offerte.',
  },
  {
    question: 'Zijn de occasions gekeurd?',
    answer: 'Alle occasions worden door ons grondig gecontroleerd op technische staat en veiligheid. Voor sommige motors is een APK beschikbaar. Vraag ons naar de specifieke keuringsdocumenten van de motor die je interesseert.',
  },
  {
    question: 'Leveren jullie de motor bij mij thuis?',
    answer: 'In overleg kunnen we de motor bij je thuisbezorgen. De kosten hiervoor zijn afhankelijk van de afstand. Neem contact met ons op voor een offerte.',
  },
  {
    question: 'Kan ik een proefrit maken?',
    answer: 'Ja, na een korte kennismaking en verificatie van je rijbewijs kun je een proefrit maken. We willen er zeker van zijn dat de motor aan je verwachtingen voldoet!',
  },
  {
    question: 'Hoe snel kan ik de motor meenemen?',
    answer: 'Als alle papieren in orde zijn, kun je de motor vaak direct meenemen. Bij import of specifieke aanpassingen kan het iets langer duren. We houden je altijd op de hoogte van de verwachte levertijd.',
  },
  {
    question: 'Bieden jullie ook onderhoud en reparaties aan?',
    answer: 'Op dit moment richten we ons voornamelijk op de verkoop van occasions. Voor onderhoud en reparaties kunnen we je doorverwijzen naar betrouwbare partners in de regio.',
  },
  {
    question: 'Kan ik een motor op aanvraag laten zoeken?',
    answer: 'Ja! Als we niet hebben wat je zoekt, gaan we graag voor je op zoek. Vul het "Motor op aanvraag" formulier in met je wensen en budget, dan nemen we contact met je op zodra we een geschikte match hebben gevonden.',
  },
  {
    question: 'Wat gebeurt er als de motor een mankement heeft na aankoop?',
    answer: 'We staan achter de kwaliteit van onze occasions. Mocht er onverhoopt iets zijn, neem dan direct contact met ons op. We zoeken altijd naar een eerlijke oplossing.',
  },
  {
    question: 'Kan ik de motor reserveren?',
    answer: 'Ja, met een aanbetaling kunnen we een motor voor je reserveren. De reserveringsvoorwaarden bespreken we graag persoonlijk met je.',
  },
  {
    question: 'Zijn alle accessoires en onderdelen origineel?',
    answer: 'We geven altijd eerlijk aan welke onderdelen origineel zijn en welke zijn vervangen. Bij de meeste occasions leveren we ook de originele onderdelen mee indien beschikbaar.',
  },
  {
    question: 'Hoe zit het met de verzekering?',
    answer: 'We kunnen je adviseren over verzekeringen, maar je regelt de verzekering zelf bij een verzekeraar naar keuze. Zorg dat je verzekering actief is voordat je de motor meeneemt.',
  },
  {
    question: 'Kan ik online betalen?',
    answer: 'Voor aanbetaling of reservering kan vaak online worden betaald. Voor het volledige bedrag werken we graag met een bankoverschrijving of betaling bij ophalen. Bespreek de betaalmogelijkheden met ons.',
  },
];

const webshopFAQ = [
  {
    question: 'Hoe lang duurt de levering van webshop artikelen?',
    answer: 'De meeste artikelen uit onze webshop worden binnen 3-5 werkdagen geleverd. Bij speciale bestellingen kan dit iets langer duren. Je ontvangt altijd een track & trace code.',
  },
  {
    question: 'Kan ik webshop artikelen retourneren?',
    answer: 'Ja, je hebt 14 dagen bedenktijd op webshop artikelen (conform de wet). Het artikel moet ongebruikt zijn en in de originele verpakking. Neem contact op voor een retourlabel.',
  },
  {
    question: 'Bieden jullie gratis verzending?',
    answer: 'Bij bestellingen boven een bepaald bedrag bieden we gratis verzending aan. Check de webshop voor actuele verzendkosten en acties.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-biker-yellow/10 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-biker-yellow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Veelgestelde <span className="text-biker-yellow">Vragen</span>
          </h1>
          <p className="text-lg md:text-xl text-biker-light max-w-2xl mx-auto">
            Vind hier antwoorden op de meest gestelde vragen over onze occasions, 
            webshop en diensten. Staat je vraag er niet bij? Neem gerust contact met ons op!
          </p>
        </div>
      </section>

      {/* FAQ - Occasions */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-3xl font-bold mb-8 uppercase tracking-tight flex items-center"
          >
            <svg
              className="w-8 h-8 text-biker-yellow mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Occasions
          </h2>
          <FAQAccordion items={faqData} />
        </div>
      </section>

      {/* FAQ - Webshop */}
      <section className="py-16 bg-biker-dark/30 border-y border-biker-gray/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-3xl font-bold mb-8 uppercase tracking-tight flex items-center"
          >
            <svg
              className="w-8 h-8 text-biker-yellow mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Webshop
          </h2>
          <FAQAccordion items={webshopFAQ} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-3xl md:text-4xl font-bold mb-6 uppercase tracking-tight"
          >
            Vraag Niet <span className="text-biker-yellow">Beantwoord</span>?
          </h2>
          <p className="text-lg text-biker-light mb-10 max-w-2xl mx-auto">
            Geen probleem! Ons team staat klaar om je te helpen. 
            Neem contact op via telefoon, email of het contactformulier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0615452108"
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
            >
              BEL: 06 15 45 21 08
            </a>
            <Link
              href="/contact"
              className="inline-block bg-transparent hover:bg-biker-yellow/10 text-white border-2 border-white hover:border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
            >
              CONTACTFORMULIER
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

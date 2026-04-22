import { Metadata } from 'next';
import { Occasion } from '@/types';

const baseUrl  = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
const siteName = 'Bikerfun';
const defaultDescription =
  'Specialist in motoroccasions en motoraccessoires in Susteren, Limburg. Kwaliteit, service en passie voor motoren.';

// Base metadata shared by all pages
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    authors:   [{ name: siteName }],
    creator:   siteName,
    publisher: siteName,
    formatDetection: { telephone: true, email: true },
    openGraph: {
      type:     'website',
      locale:   'nl_NL',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:  true,
        follow: true,
        'max-video-preview':  -1,
        'max-image-preview':  'large',
        'max-snippet':        -1,
      },
    },
  };
}

// ── Homepage ──────────────────────────────────────────────────────────────────
export function getHomeMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: 'Bikerfun | Specialist in Motoroccasions & Accessoires Susteren',
    description: defaultDescription,
    keywords: [
      'motor occasions', 'motoroccasions', 'tweedehands motoren', 'motor dealer',
      'motor accessoires', 'bikerfun', 'motoroccasions Susteren', 'motor Limburg',
      'tweedehands motor kopen', 'motor dealer Limburg',
    ],
    alternates: { canonical: baseUrl },
    openGraph: {
      title:       'Bikerfun | Specialist in Motoroccasions & Accessoires',
      description: defaultDescription,
      url:         baseUrl,
      siteName,
      images: [{
        url:    `${baseUrl}/og-image.jpg`,
        width:  1200,
        height: 630,
        alt:    'Bikerfun - Specialist in Motoroccasions Susteren',
      }],
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Bikerfun | Specialist in Motoroccasions & Accessoires',
      description: defaultDescription,
      images:      [`${baseUrl}/og-image.jpg`],
    },
  };
}

// ── Occasions overzicht ───────────────────────────────────────────────────────
export function getOccasionsMetadata(): Metadata {
  const desc =
    'Ontdek ons aanbod motoroccasions in Susteren, Limburg. Van sportmotoren tot tourers – wij hebben iets voor elke rijder.';
  return {
    ...getBaseMetadata(),
    title: 'Occasions | Motoroccasions Susteren Limburg | Bikerfun',
    description: desc,
    keywords: [
      'motor occasions', 'tweedehands motoren', 'occasions', 'sportmotoren', 'tourers',
      'naked bikes', 'motoroccasions Susteren', 'motor kopen Limburg',
    ],
    alternates: { canonical: `${baseUrl}/occasions` },
    openGraph: {
      title:       'Occasions | Motoroccasions Susteren Limburg | Bikerfun',
      description: desc,
      url:         `${baseUrl}/occasions`,
      siteName,
      images: [{
        url:    `${baseUrl}/og-occasions.jpg`,
        width:  1200,
        height: 630,
        alt:    'Bikerfun Occasions – Motoroccasions Susteren',
      }],
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Occasions | Motoroccasions Susteren Limburg | Bikerfun',
      description: desc,
      images:      [`${baseUrl}/og-occasions.jpg`],
    },
  };
}

// ── Individuele occasion ──────────────────────────────────────────────────────
export function getOccasionMetadata(occasion: Occasion): Metadata {
  const title = `${occasion.brand} ${occasion.model} (${occasion.year}) | Bikerfun`;
  const description =
    `${occasion.brand} ${occasion.model} – ${occasion.year} – ` +
    `${occasion.mileage.toLocaleString('nl-NL')} km – €${occasion.price.toLocaleString('nl-NL')}. ` +
    `${occasion.description || 'Bekijk deze prachtige occasion bij Bikerfun in Susteren.'}`;

  return {
    ...getBaseMetadata(),
    title,
    description,
    keywords: [
      occasion.brand,
      occasion.model,
      'motor occasion',
      'tweedehands motor',
      'motoroccasion Susteren',
      'motor Limburg',
      ...(occasion.category ? [occasion.category] : []),
      occasion.fuel,
    ].filter(Boolean) as string[],
    alternates: { canonical: `${baseUrl}/occasions/${occasion.id}` },
    openGraph: {
      title,
      description,
      url:      `${baseUrl}/occasions/${occasion.id}`,
      siteName,
      images: occasion.main_image
        ? [{ url: occasion.main_image, width: 1200, height: 630, alt: `${occasion.brand} ${occasion.model}` }]
        : [],
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images: occasion.main_image ? [occasion.main_image] : [],
    },
  };
}

// ── Webshop ───────────────────────────────────────────────────────────────────
export function getWebshopMetadata(): Metadata {
  const desc =
    'Shop motoraccessoires, helmen, kleding en onderdelen. Alles voor de motorrijder bij Bikerfun in Susteren.';
  return {
    ...getBaseMetadata(),
    title: 'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
    description: desc,
    keywords: [
      'motor accessoires', 'motorkleding', 'helmen', 'motor onderdelen',
      'webshop', 'motoraccessoires Limburg',
    ],
    alternates: { canonical: `${baseUrl}/products` },
    openGraph: {
      title:       'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
      description: desc,
      url:         `${baseUrl}/products`,
      siteName,
      images: [{
        url:    `${baseUrl}/og-webshop.jpg`,
        width:  1200,
        height: 630,
        alt:    'Bikerfun Webshop – Motoraccessoires',
      }],
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
      description: desc,
      images:      [`${baseUrl}/og-webshop.jpg`],
    },
  };
}

// ── Contact ───────────────────────────────────────────────────────────────────
export function getContactMetadata(): Metadata {
  const desc =
    'Neem contact op met Bikerfun in Susteren. Bel 06 15 45 21 08, mail of stuur een WhatsApp-bericht. Rafaëlweg 23, 6114BX Susteren.';
  return {
    ...getBaseMetadata(),
    title: 'Contact | Bikerfun Susteren – 06 15 45 21 08',
    description: desc,
    keywords: [
      'contact bikerfun', 'bikerfun susteren', 'motor dealer contact',
      'rafaëlweg 23 susteren', 'motorzaak Limburg',
    ],
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
      title:       'Contact | Bikerfun Susteren',
      description: desc,
      url:         `${baseUrl}/contact`,
      siteName,
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Contact | Bikerfun Susteren',
      description: desc,
    },
  };
}

// ── Over ons ──────────────────────────────────────────────────────────────────
export function getAboutMetadata(): Metadata {
  const desc =
    'Leer Bikerfun kennen – jouw partner voor motoroccasions en accessoires in Susteren, Limburg. Passie, kwaliteit en persoonlijk advies.';
  return {
    ...getBaseMetadata(),
    title: 'Over Ons | Bikerfun – Motorspecialist Susteren',
    description: desc,
    keywords: [
      'over bikerfun', 'motor dealer Susteren', 'motorspecialist Limburg',
      'bikerfun verhaal',
    ],
    alternates: { canonical: `${baseUrl}/over-ons` },
    openGraph: {
      title:       'Over Ons | Bikerfun – Motorspecialist Susteren',
      description: desc,
      url:         `${baseUrl}/over-ons`,
      siteName,
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Over Ons | Bikerfun – Motorspecialist Susteren',
      description: desc,
    },
  };
}

// ── Motor op aanvraag ─────────────────────────────────────────────────────────
export function getAanvraagMetadata(): Metadata {
  const desc =
    'Zoek je een specifieke motor? Bikerfun in Susteren gaat voor jou op zoek naar jouw droommodel. Vul het aanvraagformulier in.';
  return {
    ...getBaseMetadata(),
    title: 'Motor Op Aanvraag | Bikerfun Susteren',
    description: desc,
    keywords: [
      'motor op aanvraag', 'specifieke motor zoeken', 'motor bestellen',
      'droommotor', 'motor dealer Limburg',
    ],
    alternates: { canonical: `${baseUrl}/motor-op-aanvraag` },
    openGraph: {
      title:       'Motor Op Aanvraag | Bikerfun Susteren',
      description: desc,
      url:         `${baseUrl}/motor-op-aanvraag`,
      siteName,
      images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: 'Motor Op Aanvraag – Bikerfun' }],
      locale: 'nl_NL',
      type:   'website',
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Motor Op Aanvraag | Bikerfun Susteren',
      description: desc,
      images:      [`${baseUrl}/og-image.jpg`],
    },
  };
}

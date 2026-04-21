import { Metadata } from 'next';
import { Occasion } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
const siteName = 'Bikerfun';
const defaultDescription = 'Specialist in motoroccasions en motoraccessoires. Kwaliteit, service en passie voor motoren.';

// Base metadata for all pages
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    applicationName: siteName,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      telephone: true,
      email: true,
    },
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bikerfun', // Vervang met echte Twitter handle als beschikbaar
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Homepage metadata
export function getHomeMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: 'Bikerfun | Specialist in Motoroccasions & Accessoires',
    description: defaultDescription,
    keywords: ['motor occasions', 'motoroccasions', 'tweedehands motoren', 'motor dealer', 'motor accessoires', 'bikerfun'],
    alternates: { canonical: baseUrl },
    openGraph: {
      title: 'Bikerfun | Specialist in Motoroccasions & Accessoires',
      description: defaultDescription,
      url: baseUrl,
      siteName,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Bikerfun - Specialist in Motoroccasions',
        },
      ],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bikerfun | Specialist in Motoroccasions & Accessoires',
      description: defaultDescription,
      images: [`${baseUrl}/og-image.jpg`],
    },
  };
}

// Occasions overview metadata
export function getOccasionsMetadata(): Metadata {
  const desc = 'Ontdek ons aanbod aan occasions. Van sportmotoren tot tourers - wij hebben iets voor elke rijder.';
  return {
    ...getBaseMetadata(),
    title: 'Occasions | Bikerfun',
    description: desc,
    keywords: ['motor occasions', 'tweedehands motoren', 'occasions', 'sportmotoren', 'tourers', 'naked bikes'],
    alternates: { canonical: `${baseUrl}/occasions` },
    openGraph: {
      title: 'Occasions | Bikerfun',
      description: desc,
      url: `${baseUrl}/occasions`,
      siteName,
      images: [
        {
          url: `${baseUrl}/og-occasions.jpg`,
          width: 1200,
          height: 630,
          alt: 'Bikerfun Occasions',
        },
      ],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Occasions | Bikerfun',
      description: desc,
      images: [`${baseUrl}/og-occasions.jpg`],
    },
  };
}

// Individual occasion metadata
export function getOccasionMetadata(occasion: Occasion): Metadata {
  const title = `${occasion.brand} ${occasion.model} (${occasion.year}) | Bikerfun`;
  const description = `${occasion.brand} ${occasion.model} - ${occasion.year} - ${occasion.mileage.toLocaleString('nl-NL')} km - ${occasion.power} pk - €${occasion.price.toLocaleString('nl-NL')}. ${occasion.description || 'Bekijk deze prachtige occasion bij Bikerfun.'}`;
  
  return {
    ...getBaseMetadata(),
    title,
    description,
    keywords: [
      occasion.brand,
      occasion.model,
      'motor occasion',
      'tweedehands motor',
      ...(occasion.category ? [occasion.category] : []),
      occasion.fuel,
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      url: `${baseUrl}/occasions/${occasion.id}`,
      siteName,
      images: occasion.main_image ? [
        {
          url: occasion.main_image,
          width: 1200,
          height: 630,
          alt: `${occasion.brand} ${occasion.model}`,
        },
      ] : [],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: occasion.main_image ? [occasion.main_image] : [],
    },
  };
}

// Webshop metadata
export function getWebshopMetadata(): Metadata {
  const desc = 'Shop motoraccessoires, helmen, kleding en onderdelen. Alles voor de motorrijder.';
  return {
    ...getBaseMetadata(),
    title: 'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
    description: desc,
    keywords: ['motor accessoires', 'motorkleding', 'helmen', 'motor onderdelen', 'webshop'],
    alternates: { canonical: `${baseUrl}/products` },
    openGraph: {
      title: 'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
      description: desc,
      url: `${baseUrl}/products`,
      siteName,
      images: [
        {
          url: `${baseUrl}/og-webshop.jpg`,
          width: 1200,
          height: 630,
          alt: 'Bikerfun Webshop',
        },
      ],
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Webshop | Motoraccessoires & Onderdelen | Bikerfun',
      description: desc,
      images: [`${baseUrl}/og-webshop.jpg`],
    },
  };
}

// Contact metadata
export function getContactMetadata(): Metadata {
  const desc = 'Neem contact op met Bikerfun voor vragen over occasions of producten. Bel 06 15 45 21 08 of stuur een bericht.';
  return {
    ...getBaseMetadata(),
    title: 'Contact | Bikerfun',
    description: desc,
    keywords: ['contact', 'bikerfun contact', 'motor dealer contact'],
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
      title: 'Contact | Bikerfun',
      description: desc,
      url: `${baseUrl}/contact`,
      siteName,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Contact | Bikerfun',
      description: desc,
    },
  };
}

// About metadata
export function getAboutMetadata(): Metadata {
  const desc = 'Leer Bikerfun kennen - jouw partner voor motoroccasions en accessoires. Passie, kwaliteit en service.';
  return {
    ...getBaseMetadata(),
    title: 'Over Ons | Bikerfun',
    description: desc,
    keywords: ['over bikerfun', 'motor dealer', 'geschiedenis'],
    alternates: { canonical: `${baseUrl}/over-ons` },
    openGraph: {
      title: 'Over Ons | Bikerfun',
      description: desc,
      url: `${baseUrl}/over-ons`,
      siteName,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Over Ons | Bikerfun',
      description: desc,
    },
  };
}

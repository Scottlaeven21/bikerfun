import { Occasion } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';

// ── Canonical business details ────────────────────────────────────────────────
const PHONE       = '+31-6-15452108';
const EMAIL       = 'info@bikerfun.nl';
const LOGO        = `${baseUrl}/bikerfun-new-logo.png`;
const TIKTOK_URL       = 'https://www.tiktok.com/@bikerfuntiktok';
const GOOGLE_MAPS_URL  = 'https://www.google.com/maps/place/Bikerfun/@51.0528,5.8669,17z';

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress:    'Rafaëlweg 23',
  postalCode:       '6114BX',
  addressLocality:  'Susteren',
  addressRegion:    'Limburg',
  addressCountry:   'NL',
};

const GEO = {
  '@type':    'GeoCoordinates',
  latitude:   51.0528,
  longitude:  5.8669,
};

const HOURS = [
  {
    '@type':    'OpeningHoursSpecification',
    dayOfWeek:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens:      '08:00',
    closes:     '21:00',
  },
];

// ── Organization Schema ───────────────────────────────────────────────────────
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bikerfun',
    url: baseUrl,
    logo: LOGO,
    image: LOGO,
    description:
      'Specialist in motoroccasions, motoraccessoires en motor omkeuren naar A2 / 35kW in Susteren, Limburg.',
    address: ADDRESS,
    contactPoint: {
      '@type':             'ContactPoint',
      telephone:           PHONE,
      email:               EMAIL,
      contactType:         'customer service',
      availableLanguage:   'Dutch',
    },
    sameAs: [TIKTOK_URL, GOOGLE_MAPS_URL],
  };
}

// ── Local Business Schema ─────────────────────────────────────────────────────
export function getLocalBusinessSchema(rating?: { ratingValue?: string | number; reviewCount?: string | number }) {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutomotiveBusiness', 'LocalBusiness'],
    name:        'Bikerfun',
    url:         baseUrl,
    logo:        LOGO,
    image:       LOGO,
    telephone:   PHONE,
    email:       EMAIL,
    address:     ADDRESS,
    geo:         GEO,
    hasMap:      GOOGLE_MAPS_URL,
    openingHoursSpecification: HOURS,
    priceRange:  '€€',
    sameAs:      [TIKTOK_URL, GOOGLE_MAPS_URL],
    aggregateRating: {
      '@type':       'AggregateRating',
      ratingValue:   String(rating?.ratingValue ?? '4.8'),
      reviewCount:   String(rating?.reviewCount ?? '6'),
      bestRating:    '5',
      worstRating:   '1',
    },
    areaServed: [
      { '@type': 'Country', name: 'Nederland' },
      { '@type': 'AdministrativeArea', name: 'Limburg' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Bikerfun diensten',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motoroccasions',
            url: `${baseUrl}/occasions`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motor omkeuren A2 / 35kW',
            url: `${baseUrl}/omkeuren`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motoraccessoires',
            url: `${baseUrl}/products`,
          },
        },
      ],
    },
  };
}

// ── Occasion / Vehicle Schema ─────────────────────────────────────────────────
export function getOccasionSchema(occasion: Occasion) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${occasion.brand} ${occasion.model}`,
    description: occasion.description || `${occasion.brand} ${occasion.model} - ${occasion.year}`,
    brand: {
      '@type': 'Brand',
      name: occasion.brand,
    },
    model:            occasion.model,
    vehicleModelDate: occasion.year,
    mileageFromOdometer: {
      '@type':    'QuantitativeValue',
      value:      occasion.mileage,
      unitCode:   'KMT',
    },
    fuelType: occasion.fuel,
    offers: {
      '@type':        'Offer',
      price:          occasion.price,
      priceCurrency:  'EUR',
      availability:
        occasion.status === 'available'
          ? 'https://schema.org/InStock'
          : occasion.status === 'reserved'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Bikerfun' },
      url: `${baseUrl}/occasions/${occasion.id}`,
    },
    image: occasion.main_image || undefined,
    url:   `${baseUrl}/occasions/${occasion.id}`,
  };
}

// ── Breadcrumb Schema ─────────────────────────────────────────────────────────
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      name:       item.name,
      item:       `${baseUrl}${item.url}`,
    })),
  };
}

// ── WebSite Schema with SearchAction ─────────────────────────────────────────
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bikerfun',
    url: baseUrl,
    description:
      'Specialist in motoroccasions, motoraccessoires en motor omkeuren naar A2 / 35kW in Susteren, Limburg.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type':       'EntryPoint',
        urlTemplate:   `${baseUrl}/occasions?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── ItemList Schema (occasions overview) ──────────────────────────────────────
export function getItemListSchema(occasions: Occasion[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: occasions.map((occasion, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      item: {
        '@type': 'Vehicle',
        name:    `${occasion.brand} ${occasion.model}`,
        url:     `${baseUrl}/occasions/${occasion.id}`,
        image:   occasion.main_image,
        offers: {
          '@type':        'Offer',
          price:          occasion.price,
          priceCurrency:  'EUR',
          availability:
            occasion.status === 'available'
              ? 'https://schema.org/InStock'
              : occasion.status === 'reserved'
              ? 'https://schema.org/LimitedAvailability'
              : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };
}

export function getFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getOmkeurenServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Motor omkeuren A2 / 35kW',
    serviceType: 'Motor omkeuren',
    description:
      'Laat je motor omkeuren naar A2 / 35kW bij Bikerfun. Vaak op afstand, meestal 5 tot 10 werkdagen. Papierwerk voor particulieren en dealers. Adviesprijs vanaf € 495.',
    url: `${baseUrl}/omkeuren`,
    provider: {
      '@type': 'AutomotiveBusiness',
      name: 'Bikerfun',
      url: baseUrl,
      telephone: PHONE,
      email: EMAIL,
      address: ADDRESS,
    },
    areaServed: [
      { '@type': 'Country', name: 'Nederland' },
      { '@type': 'AdministrativeArea', name: 'Limburg' },
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Motor omkeuren onder 70 kW',
        price: '495.00',
        priceCurrency: 'EUR',
        url: `${baseUrl}/omkeuren#aanvraag`,
      },
      {
        '@type': 'Offer',
        name: 'Motor omkeuren boven 70 kW',
        price: '695.00',
        priceCurrency: 'EUR',
        url: `${baseUrl}/omkeuren#aanvraag`,
      },
    ],
  };
}

import { Occasion } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';

// Canonical contact details — update here if they change
const PHONE = '+31-6-15452108';        // 06 15 45 21 08
const EMAIL = 'bikerfun.info@gmail.com';
const LOGO  = `${baseUrl}/bikerfun-new-logo.png`;

// Organization Schema
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bikerfun',
    url: baseUrl,
    logo: LOGO,
    image: LOGO,
    description: 'Specialist in motoren, occasions en motoraccessoires',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nederland',
      addressCountry: 'NL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: PHONE,
      email: EMAIL,
      contactType: 'customer service',
      availableLanguage: 'Dutch',
    },
    sameAs: [],
  };
}

// Local Business Schema
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: 'Bikerfun',
    url: baseUrl,
    logo: LOGO,
    image: LOGO,
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nederland',
      addressCountry: 'NL',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '€€',
  };
}

// Product Schema (Occasion)
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
    model: occasion.model,
    vehicleModelDate: occasion.year,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: occasion.mileage,
      unitCode: 'KMT',
    },
    fuelType: occasion.fuel,
    offers: {
      '@type': 'Offer',
      price: occasion.price,
      priceCurrency: 'EUR',
      availability: occasion.status === 'available'
        ? 'https://schema.org/InStock'
        : occasion.status === 'reserved'
        ? 'https://schema.org/LimitedAvailability'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Bikerfun',
      },
    },
    image: occasion.main_image || undefined,
    url: `${baseUrl}/occasions/${occasion.id}`,
  };
}

// Breadcrumb Schema
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

// WebSite Schema with Search
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bikerfun',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/occasions?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ItemList Schema (for occasions overview)
export function getItemListSchema(occasions: Occasion[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: occasions.map((occasion, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Vehicle',
        name: `${occasion.brand} ${occasion.model}`,
        url: `${baseUrl}/occasions/${occasion.id}`,
        image: occasion.main_image,
        offers: {
          '@type': 'Offer',
          price: occasion.price,
          priceCurrency: 'EUR',
          availability: occasion.status === 'available'
            ? 'https://schema.org/InStock'
            : occasion.status === 'reserved'
            ? 'https://schema.org/LimitedAvailability'
            : 'https://schema.org/OutOfStock',
        },
      },
    })),
  };
}

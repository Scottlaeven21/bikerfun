export function BusinessStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MotorcycleDealer',
    name: 'Bikerfun',
    description: 'Premium motordealer gespecialiseerd in occasions, onderdelen en accessoires voor motorrijders.',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    telephone: '+31616298684',
    email: 'info@bikerfun.nl',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
      addressLocality: 'Nederland',
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
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    priceRange: '€€-€€€',
    sameAs: [
      // Social media links kunnen hier toegevoegd worden
      // 'https://www.facebook.com/bikerfun',
      // 'https://www.instagram.com/bikerfun',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Motorcycles',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Occasions',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Tweedehands Motoren',
              },
            },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Webshop',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Motoronderdelen & Accessoires',
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

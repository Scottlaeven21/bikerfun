import { Occasion } from '@/types';

interface OccasionStructuredDataProps {
  occasion: Occasion;
}

export function OccasionStructuredData({ occasion }: OccasionStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${occasion.brand} ${occasion.model}`,
    description: occasion.description || `${occasion.brand} ${occasion.model} - ${occasion.year} - ${occasion.mileage} km`,
    image: occasion.main_image ? [occasion.main_image] : undefined,
    brand: {
      '@type': 'Brand',
      name: occasion.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/occasions/${occasion.id}`,
      priceCurrency: 'EUR',
      price: occasion.price,
      priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Bikerfun',
        url: baseUrl,
      },
    },
    sku: occasion.id.toString(),
    category: occasion.category || 'Motorcycle',
    vehicleEngine: {
      '@type': 'EngineSpecification',
      enginePower: occasion.power ? `${occasion.power} PK` : undefined,
      fuelType: occasion.fuel,
    },
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: occasion.mileage,
      unitCode: 'KMT',
    },
    productionDate: occasion.year?.toString(),
    vehicleTransmission: occasion.transmission,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

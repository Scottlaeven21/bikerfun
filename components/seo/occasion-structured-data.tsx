import { Occasion } from '@/types';

interface OccasionStructuredDataProps {
  occasion: Occasion;
}

export function OccasionStructuredData({ occasion }: OccasionStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  const availabilityMap: Record<string, string> = {
    available: 'https://schema.org/InStock',
    reserved: 'https://schema.org/LimitedAvailability',
    sold: 'https://schema.org/OutOfStock',
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: `${occasion.brand} ${occasion.model} (${occasion.year})`,
    description: occasion.description || `${occasion.brand} ${occasion.model} - ${occasion.year} - ${occasion.mileage?.toLocaleString('nl-NL')} km`,
    image: occasion.main_image ? [occasion.main_image] : undefined,
    brand: {
      '@type': 'Brand',
      name: occasion.brand,
    },
    model: occasion.model,
    vehicleModelDate: occasion.year?.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: occasion.mileage,
      unitCode: 'KMT',
    },
    fuelType: occasion.fuel,
    vehicleTransmission: occasion.transmission,
    color: occasion.color || undefined,
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/occasions/${occasion.id}`,
      priceCurrency: 'EUR',
      price: occasion.price,
      priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/UsedCondition',
      availability: availabilityMap[occasion.status] ?? 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Bikerfun',
        url: baseUrl,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

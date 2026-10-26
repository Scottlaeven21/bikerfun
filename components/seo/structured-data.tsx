import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps & { id?: string }) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

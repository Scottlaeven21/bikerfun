import { Metadata } from 'next';
import { BannerForm } from '@/components/admin/banner-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nieuwe Banner | Admin',
  description: 'Voeg een nieuwe meldingsbanner toe',
};

export default function NewBannerPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/banners"
            className="text-red-600 hover:text-red-800 font-semibold mb-4 inline-block"
          >
            ← Terug naar banners
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nieuwe banner</h1>
          <p className="text-gray-600">Vul de gegevens in voor de nieuwe melding</p>
        </div>
        <BannerForm isEdit={false} />
      </div>
    </div>
  );
}

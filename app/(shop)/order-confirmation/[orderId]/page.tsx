import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bestelling Bevestigd | Bikerfun',
  description: 'Je bestelling is succesvol geplaatst',
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-biker-yellow text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-biker-black mb-4 uppercase tracking-tight"
          >
            Bedankt voor je <span className="text-biker-yellow">Bestelling</span>!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Je bestelling is succesvol geplaatst en wordt zo snel mogelijk verwerkt.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-biker-black mb-4">Wat gebeurt er nu?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Je ontvangt binnen enkele minuten een bevestigingsmail</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We verwerken je bestelling en bereiden deze voor verzending voor</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Je ontvangt een track & trace code zodra je pakket onderweg is</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t-2 border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">
              Heb je vragen over je bestelling?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Contact Opnemen
              </Link>
              <Link
                href="/products"
                className="bg-white border-2 border-biker-black hover:bg-gray-50 text-biker-black font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Verder Winkelen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

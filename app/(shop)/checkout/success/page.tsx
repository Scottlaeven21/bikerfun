'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      // Clear cart after successful payment
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bestelling Geplaatst!
        </h1>

        <p className="text-gray-600 mb-6">
          Bedankt voor je bestelling! Je ontvangt een bevestiging per e-mail met je
          order details en trackinginformatie zodra je pakket is verzonden.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Bekijk mijn bestellingen
          </Link>
          <Link
            href="/products"
            className="block w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Verder winkelen
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Bestelling Gelukt!
        </h1>
        <p className="text-gray-600 mb-8">
          Bedankt voor je bestelling! Je ontvangt een bevestigingsmail met alle details.
        </p>
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Bekijk Mijn Bestellingen
          </Link>
          <Link
            href="/products"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Verder Shoppen
          </Link>
        </div>
      </div>
    </div>
  );
}

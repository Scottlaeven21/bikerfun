'use client';

import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';

export default function CartPage() {
  const { items, getSubtotal, getShippingCost, getTax, getTotal } = useCart();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const tax = getTax();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Je winkelwagen is leeg
            </h1>
            <p className="text-gray-600 mb-8">
              Ontdek onze producten en voeg items toe aan je winkelwagen
            </p>
            <Link
              href="/products"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold btn-shimmer btn-3d"
            >
              Verder Shoppen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Winkelwagen</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/products"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                ← Verder shoppen
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Bestelling Overzicht
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotaal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Verzending</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>BTW (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Totaal</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {shipping === 0 && subtotal >= 75 && (
                <p className="text-sm text-green-600 mb-4">
                  🎉 Je hebt gratis verzending!
                </p>
              )}

              {subtotal < 75 && (
                <p className="text-sm text-gray-600 mb-4">
                  Nog {formatPrice(75 - subtotal)} tot gratis verzending
                </p>
              )}

              <Link
                href="/checkout"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center px-8 py-4 rounded-lg font-semibold btn-shimmer btn-glow btn-pulse btn-3d"
              >
                Afrekenen
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Veilig betalen met:
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Stripe - Veilige betalingen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

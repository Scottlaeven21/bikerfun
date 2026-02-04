'use client';

import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/cart-item';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';

export default function CartPage() {
  const { items, getTotalItems, getSubtotal, getShippingCost, getTax, getTotal } = useCart();

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const tax = getTax();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Je winkelwagen is leeg
          </h1>
          <p className="text-gray-600 mb-8">
            Voeg producten toe om te beginnen met winkelen.
          </p>
          <Link
            href="/products"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Verder winkelen
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Winkelwagen ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}

            <div className="mt-6">
              <Link
                href="/products"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                ← Verder winkelen
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Samenvatting
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotaal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Verzending</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-sm text-green-600">
                    ✓ Je komt in aanmerking voor gratis verzending!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-sm text-gray-500">
                    Nog {formatPrice(75 - subtotal)} tot gratis verzending
                  </p>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>BTW (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Totaal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center px-6 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Naar afrekenen
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Veilig betalen via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

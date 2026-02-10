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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Je winkelwagen is <span className="text-biker-yellow">leeg</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ontdek onze producten en voeg items toe aan je winkelwagen
            </p>
            <Link
              href="/products"
              className="btn-primary inline-block bg-biker-yellow text-biker-black px-12 py-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
            >
              Verder Shoppen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-8 uppercase tracking-tight">
          Winkel<span className="text-biker-yellow">wagen</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.product_id} item={item} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/products"
                className="text-biker-yellow hover:text-biker-yellowHover font-semibold uppercase text-sm tracking-wider inline-flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Verder shoppen</span>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 sticky top-32">
              <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-biker-black mb-6 uppercase tracking-tight">
                Overzicht
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotaal</span>
                  <span className="font-semibold text-biker-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Verzending (NL)</span>
                  <span className="font-semibold text-biker-yellow">Gratis</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>BTW (21%)</span>
                  <span className="font-semibold text-biker-black">{formatPrice(tax)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold text-biker-black">
                  <span>Totaal</span>
                  <span className="text-biker-yellow">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-biker-yellow/10 border-2 border-biker-yellow/30 rounded-xl p-4 mb-4">
                <p className="text-biker-yellow font-bold text-sm">
                  ✓ Gratis verzending binnen Nederland!
                </p>
              </div>
              <p className="text-xs text-gray-500 mb-6">
                België: Verzendkosten worden berekend bij afrekenen
              </p>

              <Link
                href="/checkout"
                className="btn-primary block w-full bg-biker-yellow text-biker-black text-center px-8 py-4 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
              >
                Afrekenen
              </Link>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h3 className="font-semibold text-biker-black mb-3 uppercase text-sm tracking-wider">
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

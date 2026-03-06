'use client';

import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';
import Image from 'next/image';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';

const SHIPPING_COST = 7.50;
const FREE_SHIPPING_THRESHOLD = 75;
const TAX_RATE = 0.21;

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total: cartTotal } = useCart();

  const subtotal = cart.reduce((sum, item) => {
    const price = parseFloat(item.product.price || '0');
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <WhiteBackgroundWrapper>
      <div className="min-h-screen bg-white pt-32 pb-20">
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
              className="btn-primary inline-block bg-biker-yellow text-biker-black border-2 border-biker-yellow px-12 py-4 rounded-full font-bold uppercase text-sm tracking-wider text-center"
            >
              Verder Shoppen
            </Link>
          </div>
        </div>
      </div>
      </WhiteBackgroundWrapper>
    );
  }

  return (
    <WhiteBackgroundWrapper>
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-8 uppercase tracking-tight">
          Winkel<span className="text-biker-yellow">wagen</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => {
                  const itemPrice = parseFloat(item.product.price || '0');
                  const itemTotal = itemPrice * item.quantity;
                  const imageUrl = item.product.images?.[0]?.src;
                  
                  return (
                    <div key={item.product.id} className="p-6 flex gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <span className="text-3xl">📦</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-biker-black mb-2 text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {formatPrice(itemPrice)} per stuk
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border-2 border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-biker-black">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                  <span className="font-semibold text-biker-black">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Verzending (NL)</span>
                  <span className="font-semibold text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>BTW (21%)</span>
                  <span className="font-semibold text-biker-black">€{tax.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-bold text-biker-black">
                  <span>Totaal</span>
                  <span className="text-biker-yellow">€{total.toFixed(2)}</span>
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
                className="btn-primary block w-full bg-biker-yellow text-biker-black border-2 border-biker-yellow text-center px-8 py-4 rounded-full font-bold uppercase text-sm tracking-wider"
              >
                Afrekenen
              </Link>

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <h3 className="font-semibold text-biker-black mb-3 uppercase text-sm tracking-wider">
                  Veilig betalen met:
                </h3>
                <div className="flex items-center space-x-3">
                  <svg width="80" height="32" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100.2 21.7h7.8v23.1h-7.8V21.7zm32.1 0v23.1h-7.2v-2.8c-1.6 2.2-4.4 3.5-7.6 3.5-6.6 0-11.9-5.4-11.9-12.3s5.3-12.3 11.9-12.3c3.2 0 6 1.3 7.6 3.5v-2.7h7.2zm-18.9 11.5c0 3.4 2.7 6.2 6.2 6.2s6.2-2.8 6.2-6.2-2.7-6.2-6.2-6.2-6.2 2.8-6.2 6.2zm-28.3-11.5c3.2 0 6 1.3 7.6 3.5v-2.7h7.2v23.1h-7.2v-2.8c-1.6 2.2-4.4 3.5-7.6 3.5-6.6 0-11.9-5.4-11.9-12.3s5.3-12.3 11.9-12.3zm.9 18.5c3.5 0 6.2-2.8 6.2-6.2s-2.7-6.2-6.2-6.2-6.2 2.8-6.2 6.2 2.8 6.2 6.2 6.2zm-24.5-18.5c3.2 0 6 1.3 7.6 3.5v-2.7h7.2v23.1h-7.2v-2.8c-1.6 2.2-4.4 3.5-7.6 3.5-6.6 0-11.9-5.4-11.9-12.3s5.3-12.3 11.9-12.3zm.9 18.5c3.5 0 6.2-2.8 6.2-6.2s-2.7-6.2-6.2-6.2-6.2 2.8-6.2 6.2 2.8 6.2 6.2 6.2zM36.8 21.7c6.6 0 11.9 5.4 11.9 12.3 0 6.9-5.3 12.3-11.9 12.3-3.2 0-6-1.3-7.6-3.5v11.8h-7.2V21.7h7.2v2.8c1.6-2.3 4.4-3.5 7.6-3.5zm-.9 18.5c3.5 0 6.2-2.8 6.2-6.2s-2.7-6.2-6.2-6.2-6.2 2.8-6.2 6.2 2.7 6.2 6.2 6.2z" fill="#0D1B2A"/>
                    <path d="M170.8 45.5c-6.6 0-11.9-5.4-11.9-12.3s5.3-12.3 11.9-12.3c3.2 0 6 1.3 7.6 3.5v-2.7h7.2v23.1h-7.2v-2.8c-1.6 2.2-4.4 3.5-7.6 3.5zm.9-6.3c3.5 0 6.2-2.8 6.2-6.2s-2.7-6.2-6.2-6.2-6.2 2.8-6.2 6.2 2.8 6.2 6.2 6.2zM145.9 21.7v23.1h-7.8V21.7h7.8z" fill="#0D1B2A"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </WhiteBackgroundWrapper>
  );
}

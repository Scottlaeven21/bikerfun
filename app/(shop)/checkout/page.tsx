'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils/format';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product_id,
            name: item.product_name,
            price: item.unit_price,
            quantity: item.quantity,
          })),
          customerInfo: formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Checkout failed');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Er ging iets mis bij het afrekenen');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Je winkelwagen is <span className="text-biker-yellow">leeg</span>
            </h1>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-8 uppercase tracking-tight">
          Afre<span className="text-biker-yellow">kenen</span>
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Contact Informatie
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                  placeholder="je@email.com"
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Volledige Naam *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                  placeholder="Jouw naam"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Verzendadres
            </h2>
            <div className="mb-4 p-3 bg-biker-yellow/10 border border-biker-yellow rounded-lg">
              <p className="text-sm text-biker-yellow font-semibold">
                🚚 Nederland: Altijd gratis verzending | België: Verzendkosten worden berekend
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Adres *
                </label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                  placeholder="Straat en huisnummer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                    placeholder="1234 AB"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Stad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                    placeholder="Amsterdam"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Land *
                </label>
                <select
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black transition-all"
                >
                  <option value="Nederland">Nederland</option>
                  <option value="België">België</option>
                  <option value="Duitsland">Duitsland</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Bestelling Samenvatting
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-gray-600">
                  <span>
                    {item.product_name} <span className="text-biker-yellow font-semibold">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-biker-black">{formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-biker-black">
                <span>Totaal</span>
                <span className="text-biker-yellow">{formatPrice(getTotal())}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full bg-biker-yellow hover:bg-biker-yellowHover disabled:bg-biker-gray disabled:cursor-not-allowed text-biker-black px-8 py-4 rounded-full text-lg font-bold uppercase tracking-wider transition-all duration-300 ${
              loading ? 'opacity-50' : ''
            }`}
          >
            {loading ? 'Bezig met laden...' : 'Doorgaan naar Betaling'}
          </button>
        </form>
      </div>
    </div>
  );
}

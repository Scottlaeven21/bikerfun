'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ButtonDemoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎨 Button Animaties Demo
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Alle moderne button animaties van de BikerFun website
          </p>
          <Link
            href="/"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Terug naar home
          </Link>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          
          {/* 1. Shimmer Effect */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                1. Shimmer Effect
              </h2>
              <p className="text-gray-600">
                Een glinsterend lichteffect dat over de button beweegt bij hover.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-shimmer
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-shimmer bg-red-600 text-white px-8 py-4 rounded-lg font-semibold">
                Hover over mij
              </button>
              <button className="btn-shimmer bg-biker-yellow text-biker-black px-8 py-4 rounded-lg font-semibold">
                BikerFun Geel
              </button>
              <button className="btn-shimmer bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold">
                Donkere Variant
              </button>
            </div>
          </section>

          {/* 2. Ripple Effect */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                2. Ripple Effect
              </h2>
              <p className="text-gray-600">
                Een golf-effect dat verschijnt wanneer je op de button klikt.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-ripple
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-ripple bg-red-600 text-white px-8 py-4 rounded-lg font-semibold">
                Klik op mij
              </button>
              <button className="btn-ripple px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-100">
                Quantity +
              </button>
              <button className="btn-ripple bg-green-600 text-white px-8 py-4 rounded-full font-semibold">
                Ronde Button
              </button>
            </div>
          </section>

          {/* 3. 3D Effect */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                3. 3D Button Effect
              </h2>
              <p className="text-gray-600">
                Een diepte-effect met schaduw die beweegt bij hover en drukken.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-3d
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-3d bg-red-600 text-white px-8 py-4 rounded-lg font-semibold">
                3D Effect
              </button>
              <button className="btn-3d bg-biker-yellow text-biker-black px-8 py-4 rounded-lg font-semibold">
                BikerFun Style
              </button>
              <button className="btn-3d bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold">
                Premium
              </button>
            </div>
          </section>

          {/* 4. Glow Effect */}
          <section className="bg-gray-900 rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                4. Glow Effect
              </h2>
              <p className="text-gray-300">
                Een gloeiend licht effect rondom de button bij hover.
              </p>
              <code className="text-sm bg-gray-800 text-white px-2 py-1 rounded mt-2 inline-block">
                .btn-glow
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-glow bg-biker-yellow text-biker-black px-8 py-4 rounded-lg font-semibold">
                Glow Effect
              </button>
              <button className="btn-glow bg-red-600 text-white px-8 py-4 rounded-full font-semibold">
                Ronde Glow
              </button>
              <button className="btn-glow bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold">
                Blauwe Glow
              </button>
            </div>
          </section>

          {/* 5. Pulse Animation */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                5. Pulse Animation
              </h2>
              <p className="text-gray-600">
                Een zachte pulserende animatie die constant loopt. ⚠️ Gebruik spaarzaam!
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-pulse
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-pulse bg-red-600 text-white px-8 py-4 rounded-lg font-semibold">
                Urgente Actie
              </button>
              <button className="btn-pulse bg-biker-yellow text-biker-black px-8 py-4 rounded-full font-semibold">
                Limited Offer
              </button>
            </div>
          </section>

          {/* 6. Loading Animation */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                6. Loading Animation
              </h2>
              <p className="text-gray-600">
                Een draaiende spinner voor loading states.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-loading
              </code>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                onClick={handleLoadingDemo}
                disabled={loading}
                className={`bg-red-600 text-white px-8 py-4 rounded-lg font-semibold ${
                  loading ? 'btn-loading' : ''
                }`}
              >
                {loading ? 'Laden...' : 'Klik voor demo'}
              </button>
              <button className="btn-loading bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold">
                Altijd Loading
              </button>
            </div>
          </section>

          {/* 7. Success Animation */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                7. Success Animation
              </h2>
              <p className="text-gray-600">
                Een korte scale animatie voor success feedback.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-success
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                className={`bg-green-600 text-white px-8 py-4 rounded-lg font-semibold ${
                  success ? 'btn-success' : ''
                }`}
              >
                {success ? '✓ Succesvol!' : 'Wacht op loading demo'}
              </button>
            </div>
          </section>

          {/* 8. Primary & Secondary Buttons */}
          <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                8. Primary & Secondary
              </h2>
              <p className="text-gray-300">
                De standaard button styles met geavanceerde hover effects.
              </p>
              <code className="text-sm bg-gray-700 text-white px-2 py-1 rounded mt-2 inline-block mr-2">
                .btn-primary
              </code>
              <code className="text-sm bg-gray-700 text-white px-2 py-1 rounded mt-2 inline-block">
                .btn-secondary
              </code>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary bg-biker-yellow text-biker-black px-10 py-4 rounded-full font-bold uppercase">
                Primary Button
              </button>
              <button className="btn-secondary bg-transparent text-white px-10 py-4 rounded-full font-bold uppercase border-2 border-white">
                Secondary Button
              </button>
            </div>
          </section>

          {/* 9. Combination Effects */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                9. Combinatie Effecten 🎉
              </h2>
              <p className="text-gray-600">
                Meerdere effecten gecombineerd voor een premium ervaring.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Shimmer + Ripple + 3D
                </p>
                <button className="btn-shimmer btn-ripple btn-3d bg-red-600 text-white px-8 py-4 rounded-lg font-semibold">
                  Product Button
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Shimmer + Glow + 3D
                </p>
                <button className="btn-shimmer btn-glow btn-3d bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold">
                  Premium Button
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2 font-semibold">
                  Shimmer + Glow + Pulse + 3D (Ultimate)
                </p>
                <button className="btn-shimmer btn-glow btn-pulse btn-3d bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg">
                  🔥 Checkout Button
                </button>
              </div>
            </div>
          </section>

          {/* 10. Form Button */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                10. Form Button
              </h2>
              <p className="text-gray-600">
                Een subtle scale effect voor form submit buttons.
              </p>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                .btn-form
              </code>
            </div>
            <div className="max-w-md">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Email adres"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="btn-form w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Verzenden
                </button>
              </form>
            </div>
          </section>

          {/* Real-world Examples */}
          <section className="bg-gradient-to-r from-biker-black to-biker-dark rounded-xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                💡 Real-World Voorbeelden
              </h2>
              <p className="text-gray-300 text-lg">
                Zo worden de animaties gebruikt in de echte BikerFun website.
              </p>
            </div>

            <div className="space-y-8">
              {/* Product Card Example */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Product Page Buttons
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg btn-shimmer btn-ripple btn-3d">
                    Toevoegen aan winkelwagen
                  </button>
                  <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold text-lg btn-shimmer btn-glow btn-3d">
                    Direct kopen
                  </button>
                </div>
              </div>

              {/* Checkout Example */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Checkout Button (Met Pulse!)
                </h3>
                <Link
                  href="/cart"
                  className="block w-full bg-red-600 hover:bg-red-700 text-white text-center px-8 py-4 rounded-lg font-semibold btn-shimmer btn-glow btn-pulse btn-3d"
                >
                  🛒 Afrekenen
                </Link>
              </div>

              {/* Hero CTA */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Hero CTA Buttons
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/occasions"
                    className="btn-primary bg-biker-yellow text-biker-black px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider text-center"
                  >
                    BEKIJK AANBOD
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-secondary bg-transparent text-gray-900 px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider border-2 border-gray-900 text-center"
                  >
                    CONTACT
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-biker-yellow rounded-xl shadow-lg p-8">
            <h3 className="text-3xl font-bold text-biker-black mb-4">
              🏍️ BikerFun Button Animaties
            </h3>
            <p className="text-biker-black text-lg mb-6">
              Vrijheid begint op twee wielen - en met geweldige UX!
            </p>
            <Link
              href="/"
              className="btn-shimmer btn-3d inline-block bg-biker-black text-biker-yellow px-8 py-4 rounded-full font-bold uppercase"
            >
              Terug naar Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

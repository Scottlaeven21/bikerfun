import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact | Bikerfun',
  description: 'Neem contact op met Bikerfun voor vragen over occasions, motorkleding of service.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight"
          >
            Neem <span className="text-biker-yellow">Contact</span> Op
          </h1>
          <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
            Vragen over een occasion? Interesse in motorkleding? Of gewoon even sparren over je volgende rit? 
            We helpen je graag verder!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
              <h2 
                style={{ fontFamily: 'var(--font-inter)' }}
                className="text-3xl font-bold mb-6 uppercase tracking-tight"
              >
                Stuur een bericht
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Naam *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                    placeholder="Je volledige naam"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                    placeholder="je@email.nl"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                    placeholder="06 12345678"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Onderwerp *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                  >
                    <option value="">Selecteer een onderwerp</option>
                    <option value="occasion">Vraag over een occasion</option>
                    <option value="aanvraag">Motor op aanvraag</option>
                    <option value="webshop">Motorkleding & accessoires</option>
                    <option value="service">Service & onderhoud</option>
                    <option value="anders">Anders</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Bericht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors resize-none"
                    placeholder="Vertel ons waar we je mee kunnen helpen..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                >
                  VERSTUUR BERICHT
                </button>

                <p className="text-xs text-biker-light">
                  * Verplichte velden. We behandelen je gegevens vertrouwelijk volgens ons{' '}
                  <Link href="/privacy" className="text-biker-yellow hover:underline">
                    privacybeleid
                  </Link>
                  .
                </p>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Address */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Bezoekadres</h3>
                    <p className="text-biker-light">
                      Bikerfun<br />
                      Hendrik Luijtenstraat 3<br />
                      6136 CS Sittard
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Telefoon</h3>
                    <p className="text-biker-light">
                      <a href="tel:+31615452108" className="hover:text-biker-yellow transition-colors">
                        06 15 45 21 08
                      </a>
                    </p>
                    <p className="text-sm text-biker-muted mt-1">
                      Ma-Vr: 07:00 - 17:00<br />
                      Za: 12:00 - 17:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-biker-yellow rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-biker-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">E-mail</h3>
                    <p className="text-biker-light">
                      <a href="mailto:bikerfun.info@gmail.com" className="hover:text-biker-yellow transition-colors">
                        bikerfun.info@gmail.com
                      </a>
                    </p>
                    <p className="text-sm text-biker-muted mt-1">
                      We reageren binnen 24 uur
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">Volg Ons</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/bikerfun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-biker-black rounded-full flex items-center justify-center hover:bg-biker-yellow hover:text-biker-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/bikerfun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-biker-black rounded-full flex items-center justify-center hover:bg-biker-yellow hover:text-biker-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com/@bikerfun"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-biker-black rounded-full flex items-center justify-center hover:bg-biker-yellow hover:text-biker-black transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Liever <span className="text-biker-yellow">Persoonlijk</span> Contact?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Kom gerust langs in onze showroom! Bekijk onze occasions, pas motorkleding 
            en drink een bakkie koffie terwijl we je adviseren.
          </p>
          <Link
            href="/occasions"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            BEKIJK OCCASIONS
          </Link>
        </div>
      </section>
    </div>
  );
}

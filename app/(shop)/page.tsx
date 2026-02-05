import Link from 'next/link';
import Image from 'next/image';
import { TikTokGrid } from '@/components/tiktok-grid';
import { OccasionsCarousel } from '@/components/occasions-carousel';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background - Positioned Higher */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/80"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
            <div className="max-w-4xl">
              <h1 
                style={{ 
                  fontFamily: 'var(--font-inter)',
                  letterSpacing: '0.05em'
                }} 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white drop-shadow-2xl leading-tight uppercase"
              >
                Vrijheid begint op <span className="text-biker-yellow font-black">twee wielen</span>
              </h1>
              <p 
                style={{ fontFamily: 'var(--font-montserrat)' }}
                className="text-sm md:text-base text-white/70 mb-12 tracking-widest uppercase font-light"
              >
                Bikerfun
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(245,200,13,0.5)] hover:scale-105 active:scale-95"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/contact"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="bg-biker-black hover:bg-biker-dark text-white px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] border border-white/30 hover:border-white/60 hover:scale-105 active:scale-95"
                >
                  CONTACT
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Occasions Carousel Section */}
      <section className="py-20 bg-black noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
              Ons <span className="text-biker-yellow">Aanbod</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
              Ontdek onze collectie zorgvuldig geselecteerde occasions. 
              Van sportmotoren tot tourers - wij hebben iets voor elke rijder.
            </p>
          </div>

          {/* Carousel */}
          <OccasionsCarousel />

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link
              href="/occasions"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(245,200,13,0.5)] hover:scale-105 active:scale-95"
            >
              BEKIJK ALLE OCCASIONS
            </Link>
          </div>
        </div>
      </section>

      {/* Over Ons Section */}
      <section className="py-20 bg-black text-white noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-tight">
                Over <span className="text-biker-yellow">Bikerfun</span>
              </h2>
              <div className="space-y-4 text-base md:text-lg text-biker-light">
                <p>
                  Welkom bij Bikerfun, jouw specialist in occasions en motorkleding. 
                  Met jarenlange ervaring in de motorwereld begrijpen wij als geen ander 
                  wat motorrijders zoeken.
                </p>
                <p>
                  Of je nu op zoek bent naar een betrouwbare occasion, de nieuwste motorkleding, 
                  of professioneel advies - bij Bikerfun ben je aan het juiste adres. 
                  Onze passie voor motoren en de rijderscultuur staat centraal in alles wat we doen.
                </p>
                <p className="text-biker-yellow font-semibold">
                  "Rijden met passie, adviseren met kennis."
                </p>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(245,200,13,0.5)] hover:scale-105 active:scale-95 text-center"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/motor-op-aanvraag"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                  className="bg-biker-black hover:bg-biker-dark text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] border border-white/30 hover:border-white/60 hover:scale-105 active:scale-95 text-center"
                >
                  MOTOR OP AANVRAAG
                </Link>
              </div>

              {/* Social Media Icons */}
              <div className="mt-8 flex items-center space-x-4">
                <a
                  href="https://instagram.com/bikerfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-light hover:text-biker-yellow transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/bikerfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-light hover:text-biker-yellow transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@bikerfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-light hover:text-biker-yellow transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@bikerfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-biker-light hover:text-biker-yellow transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right - TikTok Videos Grid */}
            <TikTokGrid />
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-black border-y-4 border-biker-yellow/30 noise-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
            Op zoek naar <span className="text-biker-yellow">iets anders</span>?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Indien wij de occasion die u zoekt niet aanbieden, neem contact met ons op. 
            Wij proberen op aanvraag te gaan zoeken voor een occasion die bij u past.
          </p>
          <Link
            href="/contact"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(245,200,13,0.5)] hover:scale-105 active:scale-95"
          >
            NEEM CONTACT OP
          </Link>
        </div>
      </section>

      {/* Webshop Section */}
      <section className="py-20 bg-gradient-to-b from-biker-light via-white to-biker-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight">
              Onze <span className="text-biker-yellow">Webshop</span>
            </h2>
            <p className="text-lg md:text-xl text-biker-gray max-w-4xl mx-auto">
              Bij een nieuwe occasion hoort ook een nieuwe outfit. Ontdek onze collectie premium motorkleding 
              en accessoires - van veilige helmen tot stijlvolle handschoenen. Rijd niet alleen veilig, 
              maar ook met stijl. Compleet je motor ervaring vandaag nog!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Helmen */}
            <Link
              href="/products?category=helmen"
              className="group bg-biker-light rounded-2xl overflow-hidden border-2 border-transparent hover:border-biker-yellow transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-helmet.jpg"
                  alt="Motorhelmen"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-black">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Helmen
                </h3>
              </div>
            </Link>

            {/* Jassen */}
            <Link
              href="/products?category=jassen"
              className="group bg-biker-light rounded-2xl overflow-hidden border-2 border-transparent hover:border-biker-yellow transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-jacket.jpg"
                  alt="Motorjassen"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-black">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Jassen
                </h3>
              </div>
            </Link>

            {/* Handschoenen */}
            <Link
              href="/products?category=handschoenen"
              className="group bg-biker-light rounded-2xl overflow-hidden border-2 border-transparent hover:border-biker-yellow transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-gloves.jpg"
                  alt="Motorhandschoenen"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-black">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Handschoenen
                </h3>
              </div>
            </Link>

            {/* Sleutelhangers */}
            <Link
              href="/products?category=sleutelhangers"
              className="group bg-biker-light rounded-2xl overflow-hidden border-2 border-transparent hover:border-biker-yellow transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src="/product-keychain.jpg"
                  alt="Motor Sleutelhangers"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
              <div className="p-6 text-center bg-biker-black">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Sleutelhangers
                </h3>
              </div>
            </Link>

            {/* Helmet Covers */}
            <Link
              href="/products?category=helmet-covers"
              className="group bg-biker-light rounded-2xl overflow-hidden border-2 border-transparent hover:border-biker-yellow transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-biker-gray to-biker-dark flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">🎨</div>
                  <div className="text-white font-bold text-sm">FOTO VOLGT</div>
                </div>
              </div>
              <div className="p-6 text-center bg-biker-black">
                <h3 style={{ fontFamily: 'var(--font-inter)' }} className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors uppercase tracking-tight">
                  Helmet Covers
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

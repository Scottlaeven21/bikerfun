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
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              Welkom bij <span className="text-biker-yellow">Bikerfun</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Jouw specialist in occasions en motor accessoires. 
              Van droommotor tot beschermende kleding - alles onder één dak.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/occasions"
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all shadow-2xl hover:shadow-xl"
              >
                BEKIJK AANBOD
              </Link>
              <Link
                href="/contact"
                className="bg-biker-black hover:bg-biker-dark text-white px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all shadow-2xl border border-white/30"
              >
                CONTACT
              </Link>
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
      <section className="py-20 bg-gradient-to-b from-biker-black via-biker-dark to-biker-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ons <span className="text-biker-yellow">Aanbod</span>
            </h2>
            <p className="text-xl text-biker-light max-w-3xl mx-auto">
              Ontdek onze collectie zorgvuldig geselecteerde occasions. 
              Van sportmotoren tot tourers - wij hebben iets voor elke rijder.
            </p>
          </div>

          {/* Carousel */}
          <OccasionsCarousel />

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/occasions"
              className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl"
            >
              BEKIJK ALLE OCCASIONS
            </Link>
          </div>
        </div>
      </section>

      {/* Over Ons Section */}
      <section className="py-20 bg-biker-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Over <span className="text-biker-yellow">Bikerfun</span>
              </h2>
              <div className="space-y-4 text-lg text-biker-light">
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/occasions"
                  className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl text-center"
                >
                  BEKIJK AANBOD
                </Link>
                <Link
                  href="/motor-op-aanvraag"
                  className="bg-biker-black hover:bg-biker-dark text-white px-10 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all shadow-lg border border-white/30 text-center"
                >
                  MOTOR OP AANVRAAG
                </Link>
              </div>
            </div>

            {/* Right - TikTok Videos Grid */}
            <TikTokGrid />
          </div>
        </div>
      </section>

      {/* Webshop Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-biker-black mb-4">
              Onze <span className="text-biker-yellow">Webshop</span>
            </h2>
            <p className="text-xl text-biker-gray">
              Premium motorkleding en accessoires voor elke rijder
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
                <h3 className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors">
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
                <h3 className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors">
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
                <h3 className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors">
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
                <h3 className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors">
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
                <h3 className="font-bold text-xl text-white group-hover:text-biker-yellow transition-colors">
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

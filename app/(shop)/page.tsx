import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { Product } from '@/types';

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const featuredProducts = data as Product[] | null;

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
          style={{ objectPosition: 'center 30%' }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/80"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
              Welcome to <span className="text-biker-yellow">Bikerfun</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Premium motor gear en lifestyle producten voor echte motorliefhebbers.
              Veiligheid, stijl en kwaliteit in één shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/occasions"
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-lg text-lg font-bold transition-all transform hover:scale-105 shadow-2xl"
              >
                Bekijk Aanbod
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-biker-yellow hover:bg-biker-yellow hover:text-biker-black text-white px-8 py-4 rounded-lg text-lg font-bold transition-all backdrop-blur-sm"
              >
                Contact
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
                  href="/over-ons"
                  className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg text-center"
                >
                  Lees Meer Over Ons
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-biker-yellow hover:bg-biker-yellow hover:text-biker-black text-biker-yellow px-8 py-4 rounded-lg font-bold transition-all text-center"
                >
                  Neem Contact Op
                </Link>
              </div>
            </div>

            {/* Right Stats/Features */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray hover:border-biker-yellow transition-all">
                <div className="text-4xl font-bold text-biker-yellow mb-2">15+</div>
                <div className="text-biker-light">Jaar Ervaring</div>
              </div>
              <div className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray hover:border-biker-yellow transition-all">
                <div className="text-4xl font-bold text-biker-yellow mb-2">500+</div>
                <div className="text-biker-light">Tevreden Klanten</div>
              </div>
              <div className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray hover:border-biker-yellow transition-all">
                <div className="text-4xl font-bold text-biker-yellow mb-2">100%</div>
                <div className="text-biker-light">Kwaliteitsgarantie</div>
              </div>
              <div className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray hover:border-biker-yellow transition-all">
                <div className="text-4xl font-bold text-biker-yellow mb-2">24/7</div>
                <div className="text-biker-light">Service & Advies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-biker-light transition-all">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2 text-biker-black">Gratis Verzending</h3>
              <p className="text-biker-gray">
                Bij bestellingen boven €75
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-biker-light transition-all">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2 text-biker-black">Veilig Betalen</h3>
              <p className="text-biker-gray">
                100% veilige checkout via Stripe
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:bg-biker-light transition-all">
              <div className="text-5xl mb-4">↩️</div>
              <h3 className="text-xl font-bold mb-2 text-biker-black">14 Dagen Retour</h3>
              <p className="text-biker-gray">
                Niet tevreden? Geld terug garantie
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-biker-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-biker-yellow">Categorieën</span>
            </h2>
            <p className="text-lg text-biker-light">
              Browse onze collectie per categorie
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Helmen', 'Jassen', 'Handschoenen', 'Laarzen', 'Accessoires'].map(
              (category) => (
                <Link
                  key={category}
                  href={`/products?category=${category.toLowerCase()}`}
                  className="bg-biker-dark p-6 rounded-lg border-2 border-biker-gray hover:border-biker-yellow transition-all text-center group"
                >
                  <h3 className="font-bold text-white group-hover:text-biker-yellow transition-colors">{category}</h3>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

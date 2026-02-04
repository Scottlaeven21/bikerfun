import Link from 'next/link';
import Image from 'next/image';
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
      {/* Hero Section */}
      <section className="bg-biker-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-biker-dark via-biker-black to-biker-dark opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src="/bikerfun-logo.png"
                  alt="Bikerfun Logo"
                  fill
                  className="object-contain animate-pulse"
                  priority
                />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-biker-yellow">Bikerfun</span>
            </h1>
            <p className="text-xl md:text-2xl text-biker-light mb-8 max-w-3xl mx-auto">
              Premium motor gear en lifestyle producten voor echte motorliefhebbers.
              Veiligheid, stijl en kwaliteit in één shop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-lg text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Nu
              </Link>
              <Link
                href="/products?featured=true"
                className="bg-transparent border-2 border-biker-yellow hover:bg-biker-yellow hover:text-biker-black text-biker-yellow px-8 py-4 rounded-lg text-lg font-bold transition-all"
              >
                Uitgelichte Producten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-biker-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-biker-black mb-4">
                Uitgelichte <span className="text-biker-yellow">Producten</span>
              </h2>
              <p className="text-lg text-biker-gray">
                Onze meest populaire motor gear en accessoires
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/products"
                className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
              >
                Bekijk Alle Producten
              </Link>
            </div>
          </div>
        </section>
      )}

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

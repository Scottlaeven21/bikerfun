import Link from 'next/link';
import { Metadata } from 'next';
import { SupabaseProductCard } from '@/components/products/supabase-product-card';
import { getAllProducts, getProductsByCategory, getCategories, getFeaturedProducts } from '@/lib/supabase/products';

export const metadata: Metadata = {
  title: 'Webshop | Bikerfun',
  description: 'Ontdek onze premium motor gear en accessoires',
  themeColor: '#ffffff',
  appleWebApp: {
    statusBarStyle: 'default',
  },
};

export const revalidate = 300; // Cache for 5 minutes

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; featured?: string }>;
}) {
  const params = await searchParams;
  
  // Fetch categories (super fast from Supabase!)
  const allCategories = await getCategories();
  
  // Fetch products based on filters
  let products = [];
  
  if (params.featured === 'true') {
    products = await getFeaturedProducts(20);
  } else if (params.category) {
    products = await getProductsByCategory(params.category, 100);
  } else {
    // All products page - load all products (no PHP memory limit!)
    products = await getAllProducts(200);
  }
  
  console.log(`Loaded ${products.length} products from Supabase`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
          >
            {params.featured === 'true' 
              ? <>Uitgelichte <span className="text-biker-yellow">Producten</span></>
              : params.category 
              ? <><span className="text-biker-yellow">{params.category}</span></>
              : <>Onze <span className="text-biker-yellow">Webshop</span></>
            }
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek onze premium motor gear en accessoires
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/products"
              className={`px-6 py-2 rounded-full transition-all font-bold uppercase text-sm tracking-wider ${
                !params.category && params.featured !== 'true'
                  ? 'bg-biker-yellow text-biker-black hover:bg-biker-yellowHover shadow-md'
                  : 'bg-white border-2 border-gray-300 text-biker-black hover:border-biker-yellow shadow-sm'
              }`}
            >
              Alle
            </Link>
            
            {allCategories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${category}`}
                className={`px-6 py-2 rounded-full transition-all font-bold uppercase text-sm tracking-wider ${
                  params.category === category
                    ? 'bg-biker-yellow text-biker-black hover:bg-biker-yellowHover shadow-md'
                    : 'bg-white border-2 border-gray-300 text-biker-black hover:border-biker-yellow shadow-sm'
                }`}
              >
                {category}
              </Link>
            ))}
            
            <Link
              href="/products?featured=true"
              className={`px-6 py-2 rounded-full transition-all font-bold uppercase text-sm tracking-wider ${
                params.featured === 'true'
                  ? 'bg-biker-yellow text-biker-black hover:bg-biker-yellowHover shadow-md'
                  : 'bg-white border-2 border-gray-300 text-biker-black hover:border-biker-yellow shadow-sm'
              }`}
            >
              ⭐ Uitgelicht
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <SupabaseProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Toont {products.length} {products.length === 1 ? 'product' : 'producten'}
                {params.category && ` in categorie "${params.category}"`}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-biker-black mb-4">
                {params.category 
                  ? `Geen producten in categorie "${params.category}"`
                  : 'Geen producten gevonden'
                }
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Probeer een andere categorie of bekijk alle producten.
              </p>
              {params.category && (
                <Link
                  href="/products"
                  className="inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Bekijk alle producten
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

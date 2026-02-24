import Link from 'next/link';
import { Metadata } from 'next';
import { WooCommerceProductCard } from '@/components/products/woocommerce-product-card';
import { getCachedProducts, getCachedFeaturedProducts, getCachedCategories } from '@/lib/woocommerce/products';
import type { WooCommerceProduct, WooCommerceCategory } from '@/types/woocommerce';

export const metadata: Metadata = {
  title: 'Webshop | Bikerfun',
  description: 'Ontdek onze premium motor gear en accessoires',
  themeColor: '#ffffff',
  appleWebApp: {
    statusBarStyle: 'default',
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; featured?: string }>;
}) {
  const params = await searchParams;
  
  let products: WooCommerceProduct[] = [];
  let allCategories: any[] = [];
  
  // Fetch categories first (veel lichter dan producten!)
  allCategories = await getCachedCategories({ per_page: 50, hide_empty: true });
  
  // Filter categories EERST (voor gebruik in product fetching)
  const excludedCategoryNames = [
    'alle', 'alles', 'all',
    'occasion', 'occasions', 'motor', 'motoren', 'motors',
    'bike', 'bikes', 'motorcycle', 'motorcycles',
    'uncategorized', 'ongecategoriseerd'
  ];
  
  const categories = allCategories.filter(cat => {
    const catName = cat.name.toLowerCase();
    const catSlug = cat.slug.toLowerCase();
    return !excludedCategoryNames.some(excluded => 
      catName.includes(excluded) || catSlug.includes(excluded)
    );
  }).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
  
  // Fetch products - ALLEEN per specifieke categorie ivm PHP memory crisis
  try {
    if (params.featured === 'true') {
      // Featured products crashen ook - skip
      products = [];
    } else if (params.category) {
      // Fetch by category slug - DIT WERKT WEL
      const categoryData = allCategories.find(c => c.slug === params.category);
      if (categoryData) {
        products = await getCachedProducts({ 
          per_page: 100,
          category: categoryData.id.toString()
        });
      }
    } else {
      // Voor "Alle" pagina: GEEN producten ophalen ivm extreme PHP memory problemen
      // Gebruikers MOETEN een categorie kiezen
      products = [];
      console.log('Alle pagina: geen producten geladen (gebruiker moet categorie kiezen)');
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    products = [];
  }
  
  // Filter occasions uit producten
  if (products) {
    products = products.filter(product => {
      const hasOccasionCategory = product.categories.some(cat => 
        cat.name.toLowerCase().includes('occasion') || 
        cat.slug.toLowerCase().includes('occasion') ||
        cat.name.toLowerCase().includes('motor')
      );
      
      const productName = product.name.toLowerCase();
      const hasMotorBrand = [
        'yamaha', 'honda', 'suzuki', 'kawasaki', 'ducati', 
        'bmw', 'ktm', 'triumph', 'harley', 'r6', 'cbr', 'gsx', 'zx'
      ].some(brand => productName.includes(brand));
      
      return !hasOccasionCategory && !hasMotorBrand;
    });
  }

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
              ? <><span className="text-biker-yellow">{params.category.charAt(0).toUpperCase() + params.category.slice(1)}</span></>
              : <>Onze <span className="text-biker-yellow">Webshop</span></>
            }
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek onze premium motor gear en accessoires
          </p>
        </div>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-12">
            {/* Desktop: Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/products"
                className={`px-6 py-2 rounded-full transition-all font-bold uppercase text-sm tracking-wider ${
                  !params.category
                    ? 'bg-biker-yellow text-biker-black hover:bg-biker-yellowHover shadow-md'
                    : 'bg-white border-2 border-gray-300 text-biker-black hover:border-biker-yellow shadow-sm'
                }`}
              >
                Alle
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={`px-6 py-2 rounded-full transition-all font-bold uppercase text-sm tracking-wider ${
                    params.category === category.slug
                      ? 'bg-biker-yellow text-biker-black hover:bg-biker-yellowHover shadow-md'
                      : 'bg-white border-2 border-gray-300 text-biker-black hover:border-biker-yellow shadow-sm'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <WooCommerceProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            {!params.category ? (
              // "Alle" pagina - uitleg over categorieën
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-biker-black mb-4">
                  Kies een categorie om producten te bekijken
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Gebruik de categorieknoppen hierboven om de producten te ontdekken die je zoekt.
                </p>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Tip:</strong> Klik op een categorie zoals <strong>Helmcovers</strong>, <strong>Sleutelhangers</strong> of <strong>Rugzakken</strong> om onze producten te zien.
                  </p>
                </div>
              </div>
            ) : (
              // Specifieke categorie - geen producten gevonden
              <div>
                <p className="text-xl text-gray-600 mb-4">
                  Geen producten gevonden in categorie "{params.category}"
                </p>
                <Link
                  href="/products"
                  className="text-biker-yellow hover:text-biker-yellowHover font-semibold underline"
                >
                  Bekijk andere categorieën
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

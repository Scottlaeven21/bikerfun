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
  
  // HARDCODED FALLBACK CATEGORIES - altijd gebruiken ivm extreme PHP memory problemen
  // Als WooCommerce PHP memory is verhoogd, kan deze fallback verwijderd worden
  const fallbackCategories = [
    { id: 16, name: 'Helmcovers', slug: 'helmcovers' },
    { id: 17, name: 'Sleutelhangers', slug: 'sleutelhangers' },
    { id: 18, name: 'Rugzakken', slug: 'rugzakken' },
    { id: 19, name: 'Kentekenplaathouders', slug: 'kentekenplaathouders' },
    { id: 20, name: 'Knipperlichten', slug: 'knipperlichten' },
  ];
  
  // Probeer categories op te halen, maar gebruik altijd fallback bij falen
  try {
    allCategories = await getCachedCategories({ per_page: 50, hide_empty: false });
    console.log(`Fetched ${allCategories.length} categories from WooCommerce`);
    
    // Als de API een lege array returned, gebruik fallback
    if (!allCategories || allCategories.length === 0) {
      console.warn('No categories returned from API, using fallback');
      allCategories = fallbackCategories;
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    console.log('Using fallback categories due to API error');
    allCategories = fallbackCategories;
  }
  
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
  
  console.log(`After filtering: ${categories.length} categories available`);
  
  // Fetch products - ULTRA SIMPEL ivm PHP memory crisis
  if (params.category) {
    // ALLEEN per specifieke categorie - DIT WERKT
    console.log(`Fetching products for category: ${params.category}`);
    try {
      const categoryData = allCategories.find(c => c.slug === params.category);
      if (categoryData) {
        products = await getCachedProducts({ 
          per_page: 100,
          category: categoryData.id.toString()
        });
        console.log(`Fetched ${products.length} products for ${params.category}`);
      }
    } catch (error) {
      console.error(`Failed to fetch products for ${params.category}:`, error);
      products = [];
    }
  } else {
    // "Alle" pagina: GEEN producten ophalen (crasht altijd)
    console.log('Alle pagina: Geen producten geladen (gebruiker moet categorie kiezen)');
    products = [];
  }
  
  // Filter occasions uit producten (alleen als we producten hebben)
  if (products && products.length > 0) {
    try {
      products = products.filter(product => {
        const hasOccasionCategory = product.categories?.some(cat => 
          cat.name?.toLowerCase().includes('occasion') || 
          cat.slug?.toLowerCase().includes('occasion') ||
          cat.name?.toLowerCase().includes('motor')
        ) || false;
        
        const productName = product.name?.toLowerCase() || '';
        const hasMotorBrand = [
          'yamaha', 'honda', 'suzuki', 'kawasaki', 'ducati', 
          'bmw', 'ktm', 'triumph', 'harley', 'r6', 'cbr', 'gsx', 'zx'
        ].some(brand => productName.includes(brand));
        
        return !hasOccasionCategory && !hasMotorBrand;
      });
      console.log(`After filtering: ${products.length} products`);
    } catch (filterError) {
      console.error('Error filtering products:', filterError);
      // Bij filter error, behoud producten zoals ze zijn
    }
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
        <div className="mb-12">
          {categories && categories.length > 0 ? (
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
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm">Categorieën laden...</p>
            </div>
          )}
        </div>

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
              // "Alle" pagina - vriendelijke boodschap
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-biker-black mb-4">
                  Kies een categorie
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Gebruik de categorieknoppen hierboven om onze producten te bekijken.
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    💡 <strong>Tip:</strong> Elke categorie toont alle beschikbare producten!
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

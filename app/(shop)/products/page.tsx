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
  
  // Fetch products - SLIMME strategie om PHP memory te omzeilen
  try {
    if (params.featured === 'true') {
      products = await getCachedFeaturedProducts({ per_page: 5 });
    } else if (params.category) {
      // Fetch by category slug
      const categoryData = allCategories.find(c => c.slug === params.category);
      if (categoryData) {
        products = await getCachedProducts({ 
          per_page: 100,
          category: categoryData.id.toString()
        });
      }
    } else {
      // Voor "Alle" pagina: Fetch producten PER CATEGORIE en combineer
      // ZEER kleine batches ivm extreme PHP memory limit (128MB!)
      const allProducts: WooCommerceProduct[] = [];
      
      // Limiteer aantal categorieën dat we doorlopen (max 5)
      const categoriesToFetch = categories.slice(0, 5);
      
      console.log(`Fetching products from ${categoriesToFetch.length} categories`);
      
      for (const category of categoriesToFetch) {
        try {
          // Nog kleinere batch: 5 producten per categorie
          console.log(`Fetching 5 products from category: ${category.name}`);
          const categoryProducts = await getCachedProducts({
            per_page: 5,
            category: category.id.toString()
          });
          console.log(`Got ${categoryProducts.length} products from ${category.name}`);
          allProducts.push(...categoryProducts);
          
          // Stop als we al 25+ producten hebben (voorkomt overload)
          if (allProducts.length >= 25) {
            console.log(`Reached 25 products, stopping`);
            break;
          }
        } catch (error) {
          console.error(`Failed to fetch products for category ${category.name}:`, error);
          // Continue met volgende categorie bij error
          continue;
        }
      }
      
      console.log(`Total products fetched: ${allProducts.length}`);
      products = allProducts;
      
      // ULTIEME FALLBACK: Als we nog steeds geen producten hebben, probeer featured
      if (products.length === 0) {
        console.log('No products from categories, trying featured products as fallback');
        try {
          products = await getCachedFeaturedProducts({ per_page: 5 });
          console.log(`Fallback: Got ${products.length} featured products`);
        } catch (fallbackError) {
          console.error('Featured products fallback also failed:', fallbackError);
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    // LAATSTE FALLBACK: Probeer featured products
    try {
      console.log('Main fetch failed, trying featured products');
      products = await getCachedFeaturedProducts({ per_page: 5 });
    } catch (fallbackError) {
      console.error('All fallbacks failed:', fallbackError);
      products = [];
    }
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
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              {params.category 
                ? `Geen producten gevonden in categorie "${params.category}"`
                : 'Geen producten gevonden'
              }
            </p>
            {params.category && (
              <Link
                href="/products"
                className="text-biker-yellow hover:text-biker-yellowHover font-semibold underline"
              >
                Bekijk alle producten
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

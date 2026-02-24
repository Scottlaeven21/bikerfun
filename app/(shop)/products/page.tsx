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
      // Dit omzeilt het PHP memory probleem!
      const allProducts: WooCommerceProduct[] = [];
      
      for (const category of categories) {
        try {
          const categoryProducts = await getCachedProducts({
            per_page: 20,
            category: category.id.toString()
          });
          allProducts.push(...categoryProducts);
        } catch (error) {
          console.error(`Failed to fetch products for category ${category.name}:`, error);
        }
      }
      
      products = allProducts;
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
  
  // Filter categories (gebruik de direct opgehaalde categorieën!)
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

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { Product, Category } from '@/types';

export const metadata: Metadata = {
  title: 'Producten',
  description: 'Ontdek ons volledige assortiment motor gear en lifestyle producten',
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type ProductWithCategory = Product & {
  categories: { name: string; slug: string } | null;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const featured = params.featured as string | undefined;
  
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('categories.slug', category);
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: productsData, error } = await query;
  const products = productsData as ProductWithCategory[] | null;

  // Fetch all categories for filter
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  const categories = categoriesData as Category[] | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)}`
              : featured
              ? 'Uitgelichte Producten'
              : 'Alle Producten'}
          </h1>
          <p className="text-lg text-gray-600">
            {products?.length || 0} product(en) gevonden
          </p>
        </div>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <a
              href="/products"
              className={`px-4 py-2 rounded-lg transition-colors ${
                !category
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Alle
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  category === cat.slug
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Er is een fout opgetreden bij het laden van de producten.
          </div>
        )}

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Geen producten gevonden in deze categorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

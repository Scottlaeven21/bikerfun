import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/products/product-card';
import { Product, Category } from '@/types';

type ProductWithCategory = Product & {
  category: Category;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Filter by category if provided
  if (params.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', params.category)
      .single();

    const category = categoryData as { id: string } | null;
    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Filter by featured if provided
  if (params.featured === 'true') {
    query = query.eq('is_featured', true);
  }

  const { data: productsData } = await query;
  const products = productsData as ProductWithCategory[] | null;

  // Fetch all categories for filter
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  const categories = categoriesData as Category[] | null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {params.featured === 'true' 
              ? 'Uitgelichte Producten'
              : params.category 
              ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1)}`
              : 'Alle Producten'
            }
          </h1>
          <p className="text-lg text-gray-600">
            Ontdek onze premium motor gear en accessoires
          </p>
        </div>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !params.category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Alle
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    params.category === category.slug
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-4">
              Geen producten gevonden
            </p>
            <Link
              href="/products"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              Bekijk alle producten
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

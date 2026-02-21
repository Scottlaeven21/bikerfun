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
            {/* Mobile: Dropdown */}
            <div className="md:hidden">
              <select
                value={params.category || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (typeof window !== 'undefined') {
                    window.location.href = value ? `/products?category=${value}` : '/products';
                  }
                }}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 text-biker-black font-bold uppercase text-sm tracking-wider focus:border-biker-yellow focus:outline-none shadow-sm"
              >
                <option value="">Alle Categorieën</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop: Buttons */}
            <div className="hidden md:flex flex-wrap gap-3 justify-center">
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
              className="text-biker-yellow hover:text-biker-yellowHover font-semibold underline"
            >
              Bekijk alle producten
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

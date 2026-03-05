import Link from 'next/link';
import { Metadata } from 'next';
import { getAllProducts, getCategories } from '@/lib/supabase/products';
import { ProductsFilter } from '@/components/products/products-filter';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';

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
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  
  // Fetch categories
  const allCategories = await getCategories();
  
  // Fetch all products - filtering will happen client-side
  const products = await getAllProducts(200);
  
  console.log(`Loaded ${products.length} products from Supabase`);

  return (
    <WhiteBackgroundWrapper>
    <div className="min-h-screen bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
          >
            Onze <span className="text-biker-yellow">Webshop</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Ontdek onze premium motor gear en accessoires
          </p>
        </div>

        {/* Products with Search and Filters */}
        <ProductsFilter products={products} categories={allCategories} />
      </div>
    </div>
    </WhiteBackgroundWrapper>
  );
}

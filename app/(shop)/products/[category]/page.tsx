import Link from 'next/link';
import { Metadata } from 'next';
import { getAllProducts, getCategories } from '@/lib/supabase/products';
import { ProductsFilter } from '@/components/products/products-filter';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';
import { notFound } from 'next/navigation';

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const categoryName = categories.find(c => 
    c.toLowerCase().replace(/\s+/g, '-') === categorySlug
  );
  
  if (!categoryName) {
    return {
      title: 'Categorie niet gevonden | Bikerfun',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  const pageUrl = `${baseUrl}/products/${categorySlug}`;

  return {
    title: `${categoryName} | Bikerfun Webshop`,
    description: `Ontdek onze collectie ${categoryName.toLowerCase()} - Premium motor gear en accessoires`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${categoryName} | Bikerfun`,
      description: `Ontdek onze collectie ${categoryName.toLowerCase()}`,
      url: pageUrl,
      type: 'website',
    },
    themeColor: '#ffffff',
    appleWebApp: {
      statusBarStyle: 'default',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  
  // Fetch categories and find current
  const allCategories = await getCategories();
  const currentCategory = allCategories.find(c => c.toLowerCase() === categorySlug);
  
  if (!currentCategory) {
    notFound();
  }
  
  // Fetch all products
  const products = await getAllProducts(200);
  
  // Filter products by category
  const categoryProducts = products.filter(product => 
    product.categories?.includes(currentCategory)
  );

  return (
    <WhiteBackgroundWrapper>
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
            >
              <span className="text-biker-yellow">{currentCategory}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek onze collectie {currentCategory.toLowerCase()}
            </p>
            
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-biker-yellow transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-biker-yellow transition-colors">
                Webshop
              </Link>
              <span>/</span>
              <span className="text-biker-yellow font-medium">{currentCategory}</span>
            </div>
          </div>

          {/* Products with Search and Filters */}
          <ProductsFilter products={categoryProducts} categories={allCategories} />
        </div>
      </div>
    </WhiteBackgroundWrapper>
  );
}

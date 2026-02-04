import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { Product, Category } from '@/types';

type ProductWithCategory = Product & {
  category: Category;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('slug', slug)
    .single();

  const product = data as { name: string; description: string | null; image_url: string | null } | null;

  if (!product) {
    return {
      title: 'Product niet gevonden',
    };
  }

  return {
    title: `${product.name} | Bikerfun`,
    description: product.description || `Koop ${product.name} bij Bikerfun`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const product = data as ProductWithCategory | null;

  if (!product) {
    notFound();
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-red-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-red-600">
                Producten
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-red-600"
              >
                {product.category.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-9xl">📦</span>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-bold">
                  -{discountPercentage}%
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-8 py-4 rounded-lg text-xl font-bold">
                    Uitverkocht
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              <div className="mb-4">
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  {product.category.name}
                </Link>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.compare_at_price!)}
                  </span>
                )}
              </div>

              {product.stock > 0 && product.stock <= 10 && (
                <p className="text-orange-600 font-medium mb-6">
                  Nog {product.stock} op voorraad - bestel snel!
                </p>
              )}

              {product.description && (
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              {product.stock > 0 ? (
                <AddToCartButton product={product} />
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-lg text-lg font-semibold cursor-not-allowed"
                >
                  Uitverkocht
                </button>
              )}

              {/* Product Features */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Product Informatie
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Gratis verzending boven €75
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    14 dagen retourrecht
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Veilig betalen met Stripe
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Premium kwaliteit gegarandeerd
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

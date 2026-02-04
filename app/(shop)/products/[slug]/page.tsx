import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

type ProductWithCategory = Product & {
  categories: { name: string; slug: string } | null;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from('products')
    .select('name, description, image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const product = data as { name: string; description: string | null; image_url: string | null } | null;

  if (!product) {
    return {
      title: 'Product niet gevonden',
    };
  }

  return {
    title: product.name,
    description: product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const product = data as ProductWithCategory | null;

  if (error || !product) {
    notFound();
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
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
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-md text-lg font-semibold">
                  -{discountPercentage}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category */}
              {product.categories && (
                <a
                  href={`/products?category=${product.categories.slug}`}
                  className="text-sm text-red-600 hover:underline mb-2"
                >
                  {product.categories.name}
                </a>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPrice(product.compare_at_price!)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock === 0 ? (
                  <span className="text-red-600 font-semibold">
                    Uitverkocht
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="text-orange-600 font-semibold">
                    Nog {product.stock} op voorraad
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Op voorraad
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Beschrijving
                  </h2>
                  <p className="text-gray-600 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mt-auto">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

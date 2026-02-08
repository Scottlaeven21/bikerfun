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
    <div className="min-h-screen bg-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-biker-yellow transition-colors">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/products" className="hover:text-biker-yellow transition-colors">
                Producten
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-biker-yellow transition-colors"
              >
                {product.category.name}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-biker-black font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">📦</div>
                    <p className="text-gray-400">Geen afbeelding beschikbaar</p>
                  </div>
                </div>
              )}

              {hasDiscount && (
                <div className="absolute top-6 right-6 bg-biker-yellow text-biker-black px-4 py-2 rounded-full text-base font-bold shadow-lg">
                  -{discountPercentage}%
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                  <span className="bg-gray-800 text-white px-8 py-4 rounded-full text-xl font-bold uppercase tracking-wider">
                    Uitverkocht
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 bg-white">
              <div className="mb-4">
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="text-biker-yellow hover:text-biker-yellowHover font-bold uppercase text-sm tracking-wider transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>

              <h1 
                style={{ fontFamily: 'var(--font-inter)' }}
                className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
              >
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-4 mb-8">
                <span className="text-4xl font-bold text-biker-black">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compare_at_price!)}
                  </span>
                )}
              </div>

              {product.stock > 0 && product.stock <= 10 && (
                <div className="bg-biker-yellow/10 border border-biker-yellow/30 rounded-lg p-3 mb-6">
                  <p className="text-biker-yellow font-bold text-sm">
                    ⚡ Nog {product.stock} op voorraad - bestel snel!
                  </p>
                </div>
              )}

              {product.description && (
                <div className="mb-8">
                  <p className="text-gray-600 leading-relaxed text-lg">
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
                  className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-full text-base font-bold uppercase tracking-wider cursor-not-allowed"
                >
                  Uitverkocht
                </button>
              )}

              {/* Product Features */}
              <div className="mt-10 pt-8 border-t-2 border-gray-200">
                <h3 
                  style={{ fontFamily: 'var(--font-inter)' }}
                  className="font-bold text-biker-black mb-6 text-xl uppercase tracking-tight"
                >
                  Product Informatie
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-biker-yellow mr-3 text-xl">✓</span>
                    <span>Gratis verzending boven €50</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-biker-yellow mr-3 text-xl">✓</span>
                    <span>14 dagen retourrecht</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-biker-yellow mr-3 text-xl">✓</span>
                    <span>Veilig betalen met Stripe</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-biker-yellow mr-3 text-xl">✓</span>
                    <span>Premium kwaliteit gegarandeerd</span>
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

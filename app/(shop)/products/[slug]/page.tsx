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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
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

        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white border-r-2 border-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-12"
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
                <div className="absolute top-6 right-6 bg-gradient-to-br from-biker-yellow to-yellow-500 text-biker-black px-6 py-3 rounded-full text-lg font-bold shadow-xl border-2 border-yellow-600 animate-pulse">
                  -{discountPercentage}%
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-biker-black text-white px-12 py-6 rounded-full text-2xl font-bold uppercase tracking-wider shadow-2xl">
                    Uitverkocht
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 bg-white relative">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-biker-yellow/10 to-transparent rounded-bl-full"></div>
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
                <div className="bg-gradient-to-r from-biker-yellow/20 to-orange-100 border-2 border-biker-yellow rounded-xl p-5 mb-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-biker-yellow/20 rounded-full -mr-10 -mt-10"></div>
                  <p className="text-biker-yellow font-bold text-base relative z-10">
                    ⚡ Nog slechts {product.stock} op voorraad - bestel snel!
                  </p>
                </div>
              )}

              {product.description && (
                <div className="mb-8 bg-gray-50 rounded-xl p-6 border-l-4 border-biker-yellow">
                  <p className="text-gray-700 leading-relaxed text-lg">
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
                  className="w-full bg-gray-200 text-gray-400 px-8 py-4 rounded-full text-base font-bold uppercase tracking-wider cursor-not-allowed border-2 border-gray-300"
                >
                  Uitverkocht
                </button>
              )}

              {/* Product Features */}
              <div className="mt-10 pt-8 border-t-2 border-gray-100">
                <h3 
                  style={{ fontFamily: 'var(--font-inter)' }}
                  className="font-bold text-biker-black mb-6 text-xl uppercase tracking-tight flex items-center"
                >
                  <span className="w-2 h-8 bg-biker-yellow mr-3 rounded-full"></span>
                  Product Informatie
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-biker-yellow/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-biker-yellow/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-biker-yellow text-lg font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Gratis verzending binnen Nederland</span>
                  </li>
                  <li className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-biker-yellow/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-biker-yellow/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-biker-yellow text-lg font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">14 dagen retourrecht</span>
                  </li>
                  <li className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-biker-yellow/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-biker-yellow/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-biker-yellow text-lg font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Veilig betalen met Stripe</span>
                  </li>
                  <li className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg hover:from-biker-yellow/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-biker-yellow/20 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-biker-yellow text-lg font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Premium kwaliteit gegarandeerd</span>
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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/supabase/products';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { sanitizeHtmlDescription } from '@/lib/utils/sanitize-html';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product niet gevonden | Bikerfun',
    };
  }

  return {
    title: `${product.name} | Bikerfun Webshop`,
    description: product.short_description || product.description || `Koop ${product.name} bij Bikerfun`,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description || '',
      images: product.images.length > 0 ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0] || { src: '/placeholder-product.png', alt: product.name };
  const formattedPrice = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price);

  const formattedRegularPrice = product.on_sale && product.regular_price
    ? new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
      }).format(product.regular_price)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-biker-yellow transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-biker-yellow transition-colors">
            Webshop
          </Link>
          <span>/</span>
          <span className="text-biker-black font-medium">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                fill
                className="object-contain p-8"
                priority
              />
              {product.on_sale && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  SALE
                </div>
              )}
              {product.stock_status === 'outofstock' && (
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold">
                  UITVERKOCHT
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-biker-black mb-2">
                {product.name}
              </h1>
              
              {/* Categories */}
              {product.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/products?category=${category}`}
                      className="text-sm text-gray-600 hover:text-biker-yellow transition-colors"
                    >
                      #{category}
                    </Link>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-biker-black">
                  {formattedPrice}
                </span>
                {formattedRegularPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    {formattedRegularPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div className="text-gray-700 text-lg leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlDescription(product.short_description) }} />
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium">
                {product.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad'}
                {product.manage_stock && product.stock_quantity > 0 && (
                  <span className="text-gray-600"> ({product.stock_quantity} stuks)</span>
                )}
              </span>
            </div>

            {/* Add to Cart */}
            <div className="pt-4">
              <AddToCartButton
                product={product}
                disabled={product.stock_status !== 'instock'}
              />
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="text-sm text-gray-600">
                SKU: <span className="font-mono">{product.sku}</span>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600">Tags:</span>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold text-biker-black mb-6">
              Productinformatie
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlDescription(product.description) }} />
            </div>
          </div>
        )}

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-biker-yellow hover:text-biker-yellowHover font-bold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar webshop
          </Link>
        </div>
      </div>
    </div>
  );
}

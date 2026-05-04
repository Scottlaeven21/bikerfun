/**
 * Universal product/category route.
 *
 * NOTE: Next.js picks [category] over [slug] alphabetically when both exist at
 * the same level.  This file therefore handles BOTH cases:
 *   1. /products/<product-slug>  → renders product detail page
 *   2. /products/<category-slug> → renders category overview page
 */

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts, getCategories, getProductBySlug } from '@/lib/supabase/products';
import { CategoryWebshopView } from '@/components/products/category-webshop-view';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { ProductDetailSections } from '@/components/products/product-detail-sections';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';
import { sanitizeHtmlDescription } from '@/lib/utils/sanitize-html';
import { getBreadcrumbSchema } from '@/lib/seo/structured-data';

export const revalidate = 300;

// Pre-generate category pages; product pages are fully dynamic.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';

  // Check categories FIRST — same priority as the page render
  const categories = await getCategories();
  const categoryName = categories.find(
    (c) => c.toLowerCase().replace(/\s+/g, '-') === slug || c.toLowerCase() === slug
  );
  if (categoryName) {
    const pageUrl = `${baseUrl}/products/${slug}`;
    const description = `Ontdek onze collectie ${categoryName.toLowerCase()} – premium motor gear en accessoires bij Bikerfun in Susteren, Limburg.`;
    return {
      title: `${categoryName} | Bikerfun Webshop`,
      description,
      alternates: { canonical: pageUrl },
      openGraph: {
        title: `${categoryName} | Bikerfun`,
        description,
        url: pageUrl,
        siteName: 'Bikerfun',
        locale: 'nl_NL',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} | Bikerfun`,
        description,
      },
    };
  }

  // Fall back to product lookup
  const product = await getProductBySlug(slug);
  if (product) {
    const pageUrl = `${baseUrl}/products/${slug}`;
    const productImages = (product.images ?? []).filter(img => img?.src);
    const ogImages = productImages.slice(0, 3).map(img => ({
      url: img.src,
      width: 1200,
      height: 630,
      alt: product.name,
    }));
    const description = (product.short_description || product.description || `Koop ${product.name} bij Bikerfun – motor gear & accessoires`).slice(0, 160);
    const categoryKeywords = (product.categories ?? []).join(', ');
    return {
      title: `${product.name} | Bikerfun Webshop`,
      description,
      keywords: [product.name, categoryKeywords, 'motor accessoires', 'bikerfun', 'Susteren', 'Limburg', product.sku ?? ''].filter(Boolean).join(', '),
      alternates: { canonical: pageUrl },
      openGraph: {
        title: `${product.name} | Bikerfun`,
        description,
        url: pageUrl,
        siteName: 'Bikerfun',
        locale: 'nl_NL',
        type: 'website',
        images: ogImages.length ? ogImages : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Bikerfun`,
        description,
        images: productImages[0]?.src ? [productImages[0].src] : undefined,
      },
    };
  }

  return { title: 'Niet gevonden | Bikerfun' };
}

export default async function ProductOrCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;

  // ── 1. Category check FIRST ───────────────────────────────────────────────
  // Categories take priority so /products/helmcovers always shows the category
  // page, even if a product happens to have the same slug.
  const allCategoriesEarly = await getCategories();
  const matchedCategory = allCategoriesEarly.find(
    (c) => c.toLowerCase().replace(/\s+/g, '-') === slug || c.toLowerCase() === slug
  );

  if (matchedCategory) {
    const categoryBreadcrumb = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Webshop', url: '/products' },
      { name: matchedCategory, url: `/products/${slug}` },
    ]);
    // Full catalog: client filter must see all products so users can switch category pills after landing from footer
    const allProducts = await getAllProducts(500);

    return (
      <WhiteBackgroundWrapper>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumb) }}
        />
        <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryWebshopView
              key={slug}
              initialCategoryName={matchedCategory}
              products={allProducts}
              categories={allCategoriesEarly}
            />
          </div>
        </div>
      </WhiteBackgroundWrapper>
    );
  }

  // ── 2. Try to find a product with this slug ──────────────────────────────
  const product = await getProductBySlug(slug);

  if (product) {
    const images = (product.images ?? []).filter(img => img?.src);
    const categories = product.categories ?? [];
    const tags = product.tags ?? [];
    const mainImage = images[0] ?? { src: '/placeholder-product.png', alt: product.name };
    const formattedPrice = new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(product.price ?? 0);
    const formattedRegularPrice =
      product.on_sale && product.regular_price
        ? new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(
            product.regular_price
          )
        : null;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.short_description || product.description || product.name,
      image: images.map(img => img.src),
      sku: product.sku || undefined,
      brand: { '@type': 'Brand', name: 'Bikerfun' },
      offers: {
        '@type': 'Offer',
        url: `${baseUrl}/products/${slug}`,
        priceCurrency: 'EUR',
        price: product.price ?? 0,
        availability:
          product.stock_status === 'instock'
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: 'Bikerfun' },
      },
    };

    const breadcrumbJsonLd = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Webshop', url: '/products' },
      { name: product.name, url: `/products/${slug}` },
    ]);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 sm:pt-32 pb-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Broodkruimelpad"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 mb-6 sm:mb-8"
          >
            <Link href="/" className="hover:text-biker-yellow transition-colors shrink-0">
              Home
            </Link>
            <span className="text-gray-400 shrink-0" aria-hidden>
              /
            </span>
            <Link href="/products" className="hover:text-biker-yellow transition-colors shrink-0">
              Webshop
            </Link>
            <span className="text-gray-400 shrink-0" aria-hidden>
              /
            </span>
            <span className="text-biker-black font-medium min-w-0 break-words line-clamp-2 sm:line-clamp-none">
              {product.name}
            </span>
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

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || `${product.name} ${index + 2}`}
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

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/products/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm text-gray-600 hover:text-biker-yellow transition-colors"
                      >
                        #{category}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-biker-black">{formattedPrice}</span>
                  {formattedRegularPrice && (
                    <span className="text-2xl text-gray-400 line-through">{formattedRegularPrice}</span>
                  )}
                </div>
              </div>

              {product.short_description && (
                <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-5 py-4 text-lg leading-relaxed text-gray-800 shadow-sm [&_p:last-child]:mb-0 [&_p]:mb-3">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtmlDescription(product.short_description),
                    }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm font-medium">
                  {product.stock_status === 'instock' ? 'Op voorraad' : 'Niet op voorraad'}
                  {product.manage_stock && product.stock_quantity > 0 && (
                    <span className="text-gray-600"> ({product.stock_quantity} stuks)</span>
                  )}
                </span>
              </div>

              <div className="pt-4">
                <AddToCartButton product={product} disabled={product.stock_status !== 'instock'} />
              </div>
            </div>
          </div>

          <ProductDetailSections
            product={product}
            descriptionHtml={product.description ? sanitizeHtmlDescription(product.description) : ''}
            categories={categories}
            tags={tags}
          />

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-biker-yellow hover:text-biker-yellowHover font-bold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Terug naar webshop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // No category and no product found
  notFound();
}

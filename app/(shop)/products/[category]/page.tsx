/**
 * Universal product/category route.
 *
 * NOTE: Next.js picks [category] over [slug] alphabetically when both exist at
 * the same level.  This file therefore handles BOTH cases:
 *   1. /products/<product-slug>  → renders product detail page
 *   2. /products/<category-slug> → renders category overview page
 */

import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts, getCategories, getProductBySlug, getProductRecommendations } from '@/lib/supabase/products';
import { CategoryWebshopView } from '@/components/products/category-webshop-view';
import { AddToCartButton } from '@/components/products/add-to-cart-button';
import { ProductDetailSections } from '@/components/products/product-detail-sections';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { ProductDetailAccordions } from '@/components/products/product-detail-accordions';
import { ProductRecommendations } from '@/components/products/product-recommendations';
import { ProductShopTrustStrip } from '@/components/products/product-shop-trust-strip';
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
    const discountPercent =
      product.on_sale && product.regular_price > 0 && product.price < product.regular_price
        ? Math.round(((product.regular_price - product.price) / product.regular_price) * 100)
        : null;

    const descriptionSanitized = product.description ? sanitizeHtmlDescription(product.description) : '';
    const { related, crossSell } = await getProductRecommendations(product.id, categories, 4, 4);

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

    const galleryBadges = (
      <>
        {product.featured && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-biker-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-biker-black shadow-md">
            Uitgelicht
          </div>
        )}
        {product.on_sale && (
          <div
            className={`absolute ${product.featured ? 'left-4 top-14' : 'left-4 top-4'} z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md`}
          >
            Sale
          </div>
        )}
        {product.stock_status === 'outofstock' && (
          <div className="absolute right-4 top-4 z-10 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
            Uitverkocht
          </div>
        )}
      </>
    );

    return (
      <div className="min-h-screen bg-white pt-28 sm:pt-32 pb-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Broodkruimelpad"
            className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 sm:mb-8"
          >
            <Link href="/" className="shrink-0 transition-colors hover:text-biker-yellow">
              Home
            </Link>
            <span className="shrink-0 text-gray-400" aria-hidden>
              /
            </span>
            <Link href="/products" className="shrink-0 transition-colors hover:text-biker-yellow">
              Webshop
            </Link>
            <span className="shrink-0 text-gray-400" aria-hidden>
              /
            </span>
            <span className="line-clamp-2 min-w-0 break-words font-medium text-biker-black sm:line-clamp-none">
              {product.name}
            </span>
          </nav>

          <div className="overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]">
            <div className="grid items-stretch lg:grid-cols-2 lg:divide-x lg:divide-gray-100">
              <div className="bg-gray-50/40 p-6 sm:p-8 lg:p-10">
                <ProductImageGallery
                  images={images.map((img) => ({ src: img.src, alt: img.alt || product.name }))}
                  productName={product.name}
                  badges={galleryBadges}
                />
              </div>

              <div className="flex flex-col bg-white p-6 sm:p-8 lg:p-10">
                {categories.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/products/${category.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs font-semibold uppercase tracking-wide text-gray-500 transition hover:text-biker-yellow"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}

                <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight text-biker-black sm:text-3xl">
                  {product.name}
                </h1>

                <div className="mt-6 flex flex-wrap items-baseline gap-3 gap-y-2">
                  <span className="text-4xl font-bold tabular-nums text-biker-black">{formattedPrice}</span>
                  {formattedRegularPrice && (
                    <span className="text-xl text-gray-400 line-through tabular-nums">{formattedRegularPrice}</span>
                  )}
                  {discountPercent != null && discountPercent > 0 && (
                    <span className="rounded-full bg-biker-yellow px-2.5 py-1 text-sm font-bold text-biker-black">
                      {discountPercent}% voordeel
                    </span>
                  )}
                </div>

                {product.short_description ? (
                  <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm leading-relaxed text-gray-700 [&_p:last-child]:mb-0 [&_p]:mb-3">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtmlDescription(product.short_description),
                      }}
                    />
                  </div>
                ) : null}

                <div className="mt-6 flex items-center gap-2 text-sm">
                  <span
                    className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${
                      product.stock_status === 'instock'
                        ? 'bg-emerald-500'
                        : product.stock_status === 'onbackorder'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    aria-hidden
                  />
                  <span className="font-medium text-gray-700">
                    {product.stock_status === 'instock'
                      ? 'Op voorraad'
                      : product.stock_status === 'onbackorder'
                        ? 'Nabestelling mogelijk'
                        : 'Niet op voorraad'}
                    {product.manage_stock && product.stock_quantity > 0 ? (
                      <span className="text-gray-500"> ({product.stock_quantity} stuks)</span>
                    ) : null}
                  </span>
                </div>

                <div className="mt-8">
                  <AddToCartButton product={product} disabled={product.stock_status !== 'instock'} />
                </div>

                <ProductDetailAccordions
                  descriptionHtml={descriptionSanitized}
                  hasShortDescriptionAbove={Boolean(product.short_description)}
                />
              </div>
            </div>
          </div>

          <ProductDetailSections
            product={product}
            descriptionHtml=""
            categories={categories}
            tags={tags}
          />

          <ProductRecommendations related={related} crossSell={crossSell} />

          <ProductShopTrustStrip />

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-bold text-biker-yellow transition-colors hover:text-biker-yellowHover"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

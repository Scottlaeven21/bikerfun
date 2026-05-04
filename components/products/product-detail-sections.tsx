import Link from 'next/link';
import type { ReactNode } from 'react';
import type { SupabaseProduct } from '@/lib/supabase/products';

function categoryHref(name: string) {
  return `/products/${name.toLowerCase().replace(/\s+/g, '-')}`;
}

function formatDimensions(d: SupabaseProduct['dimensions']): string | null {
  if (!d || typeof d !== 'object') return null;
  const l = Number((d as { length?: number }).length);
  const w = Number((d as { width?: number }).width);
  const h = Number((d as { height?: number }).height);
  const hasAny = [l, w, h].some((n) => !Number.isNaN(n) && n > 0);
  if (!hasAny) return null;
  const fmt = (n: number) => (!Number.isNaN(n) && n > 0 ? String(n) : '—');
  return `${fmt(l)} × ${fmt(w)} × ${fmt(h)} cm`;
}

function formatWeight(w: number | null | undefined): string | null {
  if (w == null || Number.isNaN(Number(w))) return null;
  const n = Number(w);
  if (n <= 0) return null;
  return `${n % 1 === 0 ? n : n.toFixed(2)} kg`;
}

type Props = {
  product: SupabaseProduct;
  descriptionHtml: string;
  categories: string[];
  tags: string[];
};

export function ProductDetailSections({ product, descriptionHtml, categories, tags }: Props) {
  const dimStr = formatDimensions(product.dimensions ?? null);
  const weightStr = formatWeight(product.weight ?? null);
  const shipping = product.shipping_class?.trim();

  const stockLabel =
    product.stock_status === 'instock'
      ? 'Op voorraad'
      : product.stock_status === 'onbackorder'
        ? 'Nabestelling mogelijk'
        : 'Niet op voorraad';
  const stockDetail =
    product.manage_stock && product.stock_quantity > 0
      ? `${product.stock_quantity} stuks`
      : null;

  const showDescription = Boolean(descriptionHtml?.trim());

  return (
    <section className="mt-14 sm:mt-20" aria-labelledby="product-info-heading">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
        {showDescription && (
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)]">
              <div className="border-b border-gray-100 bg-gradient-to-r from-biker-black via-gray-900 to-gray-900 px-6 py-4 sm:px-8">
                <h2
                  id="product-info-heading"
                  className="flex items-center gap-3 text-lg font-bold uppercase tracking-wide text-white"
                >
                  <span className="h-8 w-1.5 shrink-0 rounded-full bg-biker-yellow" aria-hidden />
                  Productinformatie
                </h2>
                <p className="mt-1 text-sm text-gray-400">Specificaties en omschrijving van dit artikel</p>
              </div>
              <div
                className="prose prose-lg max-w-none px-6 py-8 prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-biker-black prose-p:text-gray-700 prose-a:text-biker-yellow prose-a:no-underline hover:prose-a:underline prose-strong:text-biker-black prose-ul:text-gray-700 prose-li:marker:text-biker-yellow sm:px-8"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>
          </div>
        )}

        <div className={showDescription ? 'lg:col-span-5' : 'lg:col-span-12 lg:mx-auto lg:max-w-2xl'}>
          <div className="overflow-hidden rounded-2xl border-2 border-biker-yellow/30 bg-gradient-to-b from-white to-gray-50/90 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] lg:sticky lg:top-28">
            <KenmerkenHeader />
            <dl className="divide-y divide-gray-100">
              <SpecRow label="Voorraad">
                <span className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 shrink-0 rounded-full ${
                      product.stock_status === 'instock'
                        ? 'bg-emerald-500'
                        : product.stock_status === 'onbackorder'
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                    }`}
                    aria-hidden
                  />
                  <span>
                    {stockLabel}
                    {stockDetail ? (
                      <span className="text-gray-600"> ({stockDetail})</span>
                    ) : null}
                  </span>
                </span>
              </SpecRow>

              {product.sku ? (
                <SpecRow label="Artikelnummer">
                  <span className="font-mono text-sm tabular-nums text-gray-900">{product.sku}</span>
                </SpecRow>
              ) : null}

              {categories.length > 0 ? (
                <SpecRow label="Categorieën">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <Link
                        key={c}
                        href={categoryHref(c)}
                        className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-800 transition-colors hover:border-biker-yellow/60 hover:text-biker-yellow"
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                </SpecRow>
              ) : null}

              {weightStr ? (
                <SpecRow label="Gewicht">
                  {weightStr}
                </SpecRow>
              ) : null}

              {dimStr ? (
                <SpecRow label="Afmetingen">
                  {dimStr}
                </SpecRow>
              ) : null}

              {shipping ? (
                <SpecRow label="Verzending">
                  <span className="capitalize">{shipping.replace(/-/g, ' ')}</span>
                </SpecRow>
              ) : null}

              {tags.length > 0 ? (
                <SpecRow label="Tags">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-md bg-biker-yellow/15 px-2.5 py-1 text-xs font-medium text-gray-800 ring-1 ring-biker-yellow/25"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </SpecRow>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function KenmerkenHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-biker-yellow/40 bg-gradient-to-r from-biker-yellow to-amber-300 px-6 py-3.5 sm:px-8">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-biker-black/90 text-biker-yellow shadow-md"
        aria-hidden
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </span>
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wide text-biker-black">Kenmerken</h2>
        <p className="text-xs font-medium text-gray-800/80">Overzicht op een rij</p>
      </div>
    </div>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-[minmax(7.5rem,10rem)_1fr] sm:gap-4 sm:items-start odd:bg-white/80 even:bg-gray-50/70 sm:px-6">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="min-w-0 text-sm leading-relaxed text-gray-900">{children}</dd>
    </div>
  );
}

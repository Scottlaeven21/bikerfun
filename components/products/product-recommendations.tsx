import { SupabaseProduct } from '@/lib/supabase/products';
import { SupabaseProductCard } from '@/components/products/supabase-product-card';

type Props = {
  related: SupabaseProduct[];
  crossSell: SupabaseProduct[];
};

export function ProductRecommendations({ related, crossSell }: Props) {
  const showRelated = related.length > 0;
  const showCross = crossSell.length > 0;

  if (!showRelated && !showCross) return null;

  return (
    <section className="mt-14 space-y-12 sm:mt-16" aria-label="Gerelateerde producten">
      {showRelated ? (
        <div>
          <div className="mb-6 flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-biker-black sm:text-2xl">
                Ook in deze lijn
              </h2>
              <p className="text-sm text-gray-600">Vergelijkbare artikelen uit dezelfde categorie</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <SupabaseProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      ) : null}

      {showCross ? (
        <div>
          <div className="mb-6 flex flex-col gap-2 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-biker-black sm:text-2xl">
                Aanbevolen voor jou
              </h2>
              <p className="text-sm text-gray-600">Uitgelicht in onze webshop</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {crossSell.map((p, i) => (
              <SupabaseProductCard key={p.id} product={p} priority={i < 2} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProductsFilter } from './products-filter';
import type { SupabaseProduct } from '@/lib/supabase/products';

type Props = {
  initialCategoryName: string;
  products: SupabaseProduct[];
  categories: string[];
};

/**
 * Categorie-webshop: h1/intro/breadcrumb volgen de actieve categorie-pill (ook na wisselen vanuit footer).
 */
export function CategoryWebshopView({
  initialCategoryName,
  products,
  categories,
}: Props) {
  const [headingCategory, setHeadingCategory] = useState(initialCategoryName);

  return (
    <>
      <header className="mb-12 text-center">
        <h1
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
        >
          {headingCategory ? (
            <span className="text-biker-yellow">{headingCategory}</span>
          ) : (
            <>
              Onze <span className="text-biker-yellow">Webshop</span>
            </>
          )}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          {headingCategory
            ? `Ontdek onze collectie ${headingCategory.toLowerCase()}`
            : 'Ontdek onze premium motor gear en accessoires'}
        </p>

        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 mt-6 text-sm text-gray-500">
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
          <span className="text-biker-yellow font-medium min-w-0 break-words">
            {headingCategory || 'Alle producten'}
          </span>
        </div>
      </header>

      <ProductsFilter
        products={products}
        categories={categories}
        initialSelectedCategory={initialCategoryName}
        onSelectedCategoryChange={setHeadingCategory}
      />
    </>
  );
}

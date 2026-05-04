'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { SupabaseProductCard } from './supabase-product-card';
import { SupabaseProduct } from '@/lib/supabase/products';

interface ProductsFilterProps {
  products: SupabaseProduct[];
  categories: string[];
  /** When set (e.g. on /products/helmcovers), preselect this category but keep full catalog so other pills still work */
  initialSelectedCategory?: string;
  /** Called when the user changes category via pills or reset (for dynamic page title on category routes) */
  onSelectedCategoryChange?: (category: string) => void;
}

export function ProductsFilter({
  products,
  categories,
  initialSelectedCategory = '',
  onSelectedCategoryChange,
}: ProductsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialSelectedCategory);

  const updateSelectedCategory = useCallback(
    (next: string) => {
      setSelectedCategory(next);
      onSelectedCategoryChange?.(next);
    },
    [onSelectedCategoryChange]
  );

  // Alleen syncen wanneer de URL-categorie wijzigt (navigatie). Niet op elke parent-render:
  // anders kan selectedCategory terug naar de startcategorie springen na ALLE of een andere pill.
  useEffect(() => {
    setSelectedCategory(initialSelectedCategory);
  }, [initialSelectedCategory]);

  const maxPrice = useMemo(() => {
    if (!products.length) return 500;
    const m = Math.max(0, ...products.map((p) => p.price || 0));
    return Math.max(m, 1);
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Prijs-slider moet over de volledige catalogus gaan (anders verdwijnen dure items bij "ALLE")
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [inStock, setInStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.categories?.some(cat => cat.toLowerCase().includes(query))
      );
    }

    // Category filter (case-insensitive: DB en pills kunnen qua casing verschillen)
    if (selectedCategory) {
      const sel = selectedCategory.trim().toLowerCase();
      filtered = filtered.filter((product) =>
        product.categories?.some((c) => c.trim().toLowerCase() === sel)
      );
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Stock filter
    if (inStock) {
      filtered = filtered.filter(product => product.stock_quantity > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy, inStock]);

  const resetFilters = () => {
    setSearchQuery('');
    updateSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    setInStock(false);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto w-full min-w-0">
          <input
            type="text"
            placeholder="Zoek producten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0 px-5 sm:px-6 py-3.5 sm:py-4 pl-11 sm:pl-12 text-base sm:text-lg border-2 border-gray-300 rounded-full focus:border-biker-yellow focus:outline-none focus:ring-2 focus:ring-biker-yellow/20 transition-all"
          />
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-biker-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-8 grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center justify-center gap-2 md:gap-3 px-0 sm:px-2">
        <button
          type="button"
          onClick={() => updateSelectedCategory('')}
          className={`px-3 sm:px-4 py-2.5 min-h-[44px] rounded-full font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-all text-center leading-tight break-words hyphens-auto ${
            selectedCategory === ''
              ? 'bg-biker-yellow text-biker-black'
              : 'bg-white text-biker-black border-2 border-gray-300 hover:border-biker-yellow'
          }`}
        >
          ALLE
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => updateSelectedCategory(category)}
            className={`px-3 sm:px-4 py-2.5 min-h-[44px] rounded-full font-bold uppercase text-[10px] sm:text-xs tracking-wider transition-all text-center leading-tight break-words hyphens-auto ${
              selectedCategory === category
                ? 'bg-biker-yellow text-biker-black'
                : 'bg-white text-biker-black border-2 border-gray-300 hover:border-biker-yellow'
            }`}
          >
            <span className="hidden md:inline">{category}</span>
            <span className="md:hidden">{category === 'Kentekenplaathouders' ? 'Kentekenhouders' : category}</span>
          </button>
        ))}
      </div>

      {/* Filter Button */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 min-h-[44px] w-full sm:w-auto bg-white border-2 border-gray-300 rounded-lg hover:border-biker-yellow transition-all shadow-sm touch-manipulation"
        >
          <svg className="w-4 h-4 text-biker-black shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-bold text-biker-black uppercase text-xs tracking-wider text-left">
            Filters & sortering
          </span>
          <svg 
            className={`w-5 h-5 text-biker-black transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <p className="text-sm text-gray-600 text-center sm:text-right sm:ml-4 shrink-0">
          <span className="font-bold text-biker-yellow">{filteredProducts.length}</span>{' '}
          {filteredProducts.length === 1 ? 'product' : 'producten'} gevonden
        </p>
      </div>

      {/* Filter Bar - Collapsible */}
      {isFilterOpen && (
        <div className="mb-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Sorteer op
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              >
                <option value="name">Naam (A-Z)</option>
                <option value="price-low">Prijs (Laag - Hoog)</option>
                <option value="price-high">Prijs (Hoog - Laag)</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Prijs: €{priceRange[0]} - €{priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max={Math.max(maxPrice, priceRange[1])}
                step="10"
                value={Math.min(priceRange[1], maxPrice)}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
                className="w-full accent-biker-yellow"
              />
            </div>

            {/* Stock Filter */}
            <div className="flex items-end">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-5 h-5 accent-biker-yellow rounded"
                />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Alleen op voorraad
                </span>
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-center justify-start pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="text-sm text-biker-yellow hover:text-biker-yellowHover font-bold uppercase tracking-wider"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <SupabaseProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-biker-black mb-2">Geen producten gevonden</h3>
          <p className="text-gray-600 mb-6">
            Probeer je zoekopdracht of filters aan te passen
          </p>
          <button
            onClick={resetFilters}
            className="btn-primary bg-biker-yellow text-biker-black px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

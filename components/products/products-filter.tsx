'use client';

import { useState, useMemo } from 'react';
import { SupabaseProductCard } from './supabase-product-card';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  category_name?: string;
  [key: string]: any;
}

interface ProductsFilterProps {
  products: Product[];
  categories: string[];
}

export function ProductsFilter({ products, categories }: ProductsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [inStock, setInStock] = useState(false);

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price || 0), 500);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category_name?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category_name === selectedCategory
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
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setSortBy('name');
    setInStock(false);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Zoek producten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-12 text-lg border-2 border-gray-300 rounded-full focus:border-biker-yellow focus:outline-none focus:ring-2 focus:ring-biker-yellow/20 transition-all"
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

      {/* Filter Bar */}
      <div className="mb-8 bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-biker-black uppercase tracking-tight">
            Filters & Sortering
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden text-biker-yellow font-bold"
          >
            {showFilters ? 'Verberg' : 'Toon'}
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                Categorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-biker-yellow focus:outline-none"
              >
                <option value="">Alle categorieën</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

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
                max={maxPrice}
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
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

          {/* Reset & Results */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="text-sm text-biker-yellow hover:text-biker-yellowHover font-bold uppercase tracking-wider"
            >
              Reset filters
            </button>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-biker-yellow">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'producten'} gevonden
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <SupabaseProductCard key={product.id} product={product} />
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

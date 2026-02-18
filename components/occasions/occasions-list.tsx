// Component Version: 2.0.0 - Complete rebuild with new card layout
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Occasion } from '@/types';

const categories = [
  { id: 'all', label: 'Alle Motors' },
  { id: 'Cruiser', label: 'Cruiser' },
  { id: 'Naked', label: 'Naked' },
  { id: 'Sport', label: 'Sport' },
  { id: 'Adventure', label: 'Adventure' },
  { id: 'Sport Touring', label: 'Sport Touring' },
  { id: 'Touring', label: 'Touring' },
  { id: 'Custom', label: 'Custom' },
  { id: 'Enduro', label: 'Enduro' },
];

interface OccasionsListProps {
  occasions: Occasion[];
}

export function OccasionsList({ occasions }: OccasionsListProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredOccasions = occasions
    .filter(occ => selectedCategory === 'all' || occ.category === selectedCategory)
    .filter(occ => occ.price >= priceRange.min && occ.price <= priceRange.max)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'year-new': return b.year - a.year;
        case 'year-old': return a.year - b.year;
        case 'mileage-low': return a.mileage - b.mileage;
        default: return b.year - a.year;
      }
    });

  return (
    <div className="py-12 md:py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: COLLECTIE left, Filter + Sort right */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
              COLLECTIE
            </h2>
            <p className="text-biker-yellow text-sm md:text-base font-medium mt-1">
              {filteredOccasions.length} occasions op voorraad
            </p>
          </div>
          <div className="flex flex-nowrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-biker-gray border border-white text-white px-5 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors shrink-0"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              FILTEREN
            </button>
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-biker-gray border border-white text-white pl-5 pr-10 py-2.5 rounded-full font-bold uppercase tracking-wider text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-biker-yellow min-w-[200px]"
              >
                <option value="newest">NIEUWSTE EERST</option>
                <option value="price-low">PRIJS: LAAG - HOOG</option>
                <option value="price-high">PRIJS: HOOG - LAAG</option>
                <option value="year-new">BOUWJAAR: NIEUW - OUD</option>
                <option value="year-old">BOUWJAAR: OUD - NIEUW</option>
                <option value="mileage-low">KM-STAND: LAAG - HOOG</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-biker-yellow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Filter Panel (Collapsible) */}
        {showFilters && (
          <div className="bg-biker-gray/80 rounded-2xl p-6 border border-white/20 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-white font-bold mb-3 uppercase text-sm tracking-wider">Categorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-black text-white border-2 border-biker-gray px-4 py-3 rounded-lg focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-white font-bold mb-3 uppercase text-sm tracking-wider">
                  Prijs: € {priceRange.min.toLocaleString('nl-NL')} - € {priceRange.max.toLocaleString('nl-NL')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full accent-biker-yellow"
                />
              </div>

              {/* Reset */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setPriceRange({ min: 0, max: 50000 });
                  }}
                  className="w-full bg-transparent border-2 border-biker-yellow text-biker-yellow px-4 py-3 rounded-lg font-bold uppercase text-sm tracking-wider hover:bg-biker-yellow hover:text-black transition-all"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Occasions Grid - 2 columns, design from reference */}
        {filteredOccasions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOccasions.map((occasion) => (
              <div
                key={occasion.id}
                className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/10 hover:border-biker-yellow/50 transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="relative w-full h-[280px] bg-black overflow-hidden">
                  {occasion.main_image ? (
                    <Image
                      src={occasion.main_image}
                      alt={`${occasion.brand} ${occasion.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      quality={100}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6" cy="17" r="2" />
                            <circle cx="18" cy="17" r="2" />
                            <path d="M6 15h2v-4H4v2c0 1.1.9 2 2 2z" />
                            <path d="M18 15h2c1.1 0 2-.9 2-2v-2h-4v4z" />
                            <path d="M6 11l3-4h6l3 4" />
                            <path d="M12 7V4" />
                          </svg>
                        </div>
                        <div className="text-white font-semibold text-base">FOTO'S VOLGEN</div>
                        <div className="text-biker-yellow font-bold text-sm mt-0.5">BINNENKORT</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Brand, Model & Year row */}
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <p className="text-white font-bold text-base">
                        {occasion.brand}
                      </p>
                      <p className="text-white text-base">
                        {occasion.model}
                      </p>
                    </div>
                    <span className="text-white/80 text-sm font-medium whitespace-nowrap">{occasion.year}</span>
                  </div>

                  {/* Price - prominent yellow */}
                  <div className="text-biker-yellow font-bold text-2xl mb-4">
                    € {occasion.price.toLocaleString('nl-NL')}
                  </div>

                  {/* Specs: red icons mileage/fuel/power, gray transmission */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <span>{occasion.fuel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{occasion.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{occasion.power}</span>
                    </div>
                  </div>

                  {/* Feature tags - dark gray bg, white text */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {occasion.features.slice(0, 4).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-biker-gray text-white rounded border border-white/10"
                      >
                        {feature}
                      </span>
                    ))}
                    {occasion.features.length > 4 && (
                      <span className="text-xs text-biker-yellow">+{occasion.features.length - 4}</span>
                    )}
                  </div>

                  {/* CTA - yellow background, black text */}
                  <Link
                    href={`/occasions/${occasion.id}`}
                    className="block w-full text-center bg-biker-yellow hover:bg-biker-yellowHover text-black font-bold py-3 rounded-lg uppercase tracking-wider transition-colors"
                  >
                    BEKIJK DETAILS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-full bg-biker-yellow/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-biker-muted text-xl mb-4">Geen occasions gevonden met deze filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange({ min: 0, max: 50000 });
              }}
              className="text-biker-yellow hover:text-biker-yellowHover font-semibold"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

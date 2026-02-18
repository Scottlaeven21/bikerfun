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
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
            COLLECTIE
          </h2>
          <p className="text-biker-yellow text-sm font-medium">
            {filteredOccasions.length} occasions op voorraad
          </p>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>FILTEREN</span>
            </button>
          </div>

          <div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-biker-dark text-white border-2 border-biker-gray px-6 py-3 rounded-lg focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow outline-none font-medium uppercase text-sm tracking-wider"
            >
              <option value="newest">NIEUWSTE EERST</option>
              <option value="price-low">PRIJS: LAAG - HOOG</option>
              <option value="price-high">PRIJS: HOOG - LAAG</option>
              <option value="year-new">BOUWJAAR: NIEUW - OUD</option>
              <option value="year-old">BOUWJAAR: OUD - NIEUW</option>
              <option value="mileage-low">KM-STAND: LAAG - HOOG</option>
            </select>
          </div>
        </div>

        {/* Filter Panel (Collapsible) */}
        {showFilters && (
          <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray mb-8">
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

        {/* Occasions Grid */}
        {filteredOccasions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOccasions.map((occasion) => (
              <Link
                key={occasion.id}
                href={`/occasions/${occasion.id}`}
                className="group bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-[4/3] md:aspect-square bg-biker-black overflow-hidden">
                    {occasion.main_image ? (
                      <Image
                        src={occasion.main_image}
                        alt={`${occasion.brand} ${occasion.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        quality={100}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 rounded-full bg-biker-yellow/10 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="text-white font-bold text-lg">FOTO'S VOLGEN</div>
                          <div className="text-biker-yellow text-sm">BINNENKORT</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      {/* Brand & Model */}
                      <div className="mb-4">
                        <p className="text-biker-yellow font-bold text-sm uppercase tracking-wider mb-1">
                          {occasion.brand}
                        </p>
                        <h3 className="text-white font-bold text-2xl mb-2">
                          {occasion.model}
                        </h3>
                        {occasion.color && (
                          <p className="text-biker-muted text-sm">{occasion.color}</p>
                        )}
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{occasion.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>{occasion.power}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{occasion.transmission}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {occasion.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-biker-black text-biker-light rounded border border-biker-gray"
                          >
                            {feature}
                          </span>
                        ))}
                        {occasion.features.length > 3 && (
                          <span className="text-xs px-2 py-1 text-biker-yellow">
                            +{occasion.features.length - 3} meer
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pt-4 border-t border-biker-gray">
                      <div className="text-white font-bold text-3xl">
                        € {occasion.price.toLocaleString('nl-NL')},-
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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

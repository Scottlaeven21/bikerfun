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
        {/* Filter and Sort Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {filteredOccasions.length} {filteredOccasions.length === 1 ? 'Occasion' : 'Occasions'}
            </h2>
            <p className="text-biker-muted">Vind jouw perfecte motor</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-biker-dark text-white border-2 border-biker-gray px-4 py-2 rounded-lg focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow outline-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-biker-dark text-white border-2 border-biker-gray px-4 py-2 rounded-lg focus:border-biker-yellow focus:ring-2 focus:ring-biker-yellow outline-none"
              >
                <option value="newest">Nieuwste eerst</option>
                <option value="price-low">Prijs: Laag - Hoog</option>
                <option value="price-high">Prijs: Hoog - Laag</option>
                <option value="year-new">Bouwjaar: Nieuw - Oud</option>
                <option value="year-old">Bouwjaar: Oud - Nieuw</option>
                <option value="mileage-low">Km-stand: Laag - Hoog</option>
              </select>
            </div>
          </div>
        </div>

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
                          <div className="text-6xl mb-4">🏍️</div>
                          <div className="text-white font-bold text-lg">FOTO'S VOLGEN</div>
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
                          <span className="text-biker-yellow">📅</span>
                          <span>{occasion.year}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <span className="text-biker-yellow">⚡</span>
                          <span>{occasion.power}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <span className="text-biker-yellow">🛣️</span>
                          <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light text-sm">
                          <span className="text-biker-yellow">⚙️</span>
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
            <div className="text-6xl mb-4">🔍</div>
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

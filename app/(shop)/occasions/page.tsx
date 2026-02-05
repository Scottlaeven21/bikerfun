'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - later vervangen door Supabase data
const occasions = [
  {
    id: 1,
    brand: 'Harley-Davidson',
    model: 'Street Bob 114',
    year: 2021,
    price: 18950,
    mileage: 12500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '94 pk',
    image: '/harley-street-bob.jpg',
    features: ['ABS', 'Cruise Control', 'LED Verlichting'],
    color: 'Vivid Black',
    category: 'cruiser'
  },
  {
    id: 2,
    brand: 'Yamaha',
    model: 'MT-09',
    year: 2022,
    price: 11450,
    mileage: 8200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '119 pk',
    image: '/yamaha-mt09.jpg',
    features: ['ABS', 'Traction Control', 'Quickshifter'],
    color: 'Tech Black',
    category: 'naked'
  },
  {
    id: 3,
    brand: 'Ducati',
    model: 'Scrambler Icon',
    year: 2020,
    price: 9750,
    mileage: 15800,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '73 pk',
    image: null,
    features: ['ABS', 'Aluminium Tank'],
    color: 'Ducati Red',
    category: 'scrambler'
  },
  {
    id: 4,
    brand: 'BMW',
    model: 'R1250GS',
    year: 2023,
    price: 22900,
    mileage: 5200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '136 pk',
    image: null,
    features: ['ABS Pro', 'Cruise Control', 'Heated Grips', 'Koffers'],
    color: 'Racing Blue',
    category: 'adventure'
  },
  {
    id: 5,
    brand: 'Kawasaki',
    model: 'Z900',
    year: 2021,
    price: 10200,
    mileage: 18500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '125 pk',
    image: null,
    features: ['ABS', 'Traction Control'],
    color: 'Metallic Spark Black',
    category: 'naked'
  },
  {
    id: 6,
    brand: 'Triumph',
    model: 'Bonneville T120',
    year: 2022,
    price: 13750,
    mileage: 6800,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '80 pk',
    image: null,
    features: ['ABS', 'Traction Control', 'Riding Modes'],
    color: 'Jet Black',
    category: 'classic'
  },
];

const categories = [
  { id: 'all', label: 'Alle Motors' },
  { id: 'cruiser', label: 'Cruiser' },
  { id: 'naked', label: 'Naked' },
  { id: 'sport', label: 'Sport' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'touring', label: 'Touring' },
  { id: 'scrambler', label: 'Scrambler' },
  { id: 'classic', label: 'Classic' },
];

export default function OccasionsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('newest');

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
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-biker-dark to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-center"
          >
            Ons <span className="text-biker-yellow">Aanbod</span>
          </h1>
          <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto text-center">
            Ontdek onze collectie zorgvuldig geselecteerde occasions. 
            Van sportief tot comfort - wij hebben de motor voor jouw stijl.
          </p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-1/4">
              <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray sticky top-24">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Filters</h2>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Categorie</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.id
                            ? 'bg-biker-yellow text-biker-black font-bold'
                            : 'bg-biker-black text-white hover:bg-biker-gray'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Prijs</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-biker-light">Minimum</label>
                      <select
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 bg-biker-black border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none"
                      >
                        <option value={0}>€ 0</option>
                        <option value={5000}>€ 5.000</option>
                        <option value={10000}>€ 10.000</option>
                        <option value={15000}>€ 15.000</option>
                        <option value={20000}>€ 20.000</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-biker-light">Maximum</label>
                      <select
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 bg-biker-black border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none"
                      >
                        <option value={10000}>€ 10.000</option>
                        <option value={15000}>€ 15.000</option>
                        <option value={20000}>€ 20.000</option>
                        <option value={30000}>€ 30.000</option>
                        <option value={50000}>€ 50.000+</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Sorteer Op</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-biker-black border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none"
                  >
                    <option value="newest">Nieuwste eerst</option>
                    <option value="price-low">Prijs: Laag → Hoog</option>
                    <option value="price-high">Prijs: Hoog → Laag</option>
                    <option value="year-new">Bouwjaar: Nieuw → Oud</option>
                    <option value="year-old">Bouwjaar: Oud → Nieuw</option>
                    <option value="mileage-low">KM-stand: Laag → Hoog</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Occasions Grid */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-biker-light">
                  <span className="text-white font-bold">{filteredOccasions.length}</span> occasions gevonden
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOccasions.map((occasion) => (
                  <div
                    key={occasion.id}
                    className="bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-biker-black overflow-hidden">
                      {occasion.image ? (
                        <Image
                          src={occasion.image}
                          alt={`${occasion.brand} ${occasion.model}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🏍️</div>
                            <div className="text-white font-bold text-lg mb-1">FOTO'S VOLGEN</div>
                            <div className="text-biker-yellow font-bold text-xl">BINNENKORT</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title & Price */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white group-hover:text-biker-yellow transition-colors">
                          {occasion.brand}
                        </h3>
                        <p className="text-xl text-biker-light">{occasion.model}</p>
                      </div>

                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-biker-yellow">
                            € {occasion.price.toLocaleString('nl-NL')}
                          </span>
                        </div>
                        <span className="text-sm text-biker-light">{occasion.year}</span>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center space-x-2 text-biker-light">
                          <span className="text-biker-yellow">📍</span>
                          <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light">
                          <span className="text-biker-yellow">⚙️</span>
                          <span>{occasion.transmission}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light">
                          <span className="text-biker-yellow">⛽</span>
                          <span>{occasion.fuel}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-biker-light">
                          <span className="text-biker-yellow">⚡</span>
                          <span>{occasion.power}</span>
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
                      </div>

                      {/* CTA */}
                      <Link
                        href={`/occasions/${occasion.id}`}
                        className="btn-primary block w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
                      >
                        BEKIJK DETAILS
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredOccasions.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold mb-4">Geen occasions gevonden</h3>
                  <p className="text-biker-light mb-8">
                    Probeer je filters aan te passen of{' '}
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setPriceRange({ min: 0, max: 50000 });
                      }}
                      className="text-biker-yellow hover:underline"
                    >
                      reset alle filters
                    </button>
                  </p>
                  <Link
                    href="/motor-op-aanvraag"
                    className="btn-primary inline-block bg-biker-yellow text-biker-black px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    MOTOR OP AANVRAAG
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Niet Gevonden Wat Je <span className="text-biker-yellow">Zoekt</span>?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Wij gaan graag voor jou op zoek naar de perfecte motor. 
            Vul een aanvraag in en we nemen snel contact op!
          </p>
          <Link
            href="/motor-op-aanvraag"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            MOTOR OP AANVRAAG
          </Link>
        </div>
      </section>
    </div>
  );
}

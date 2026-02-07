'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Occasion {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  pricePerMonth: number;
  mileage: number;
  transmission: 'Handgeschakeld' | 'Automaat';
  fuel: 'Benzine' | 'Elektrisch';
  power: string;
  image: string;
  features: string[];
}

const occasions: Occasion[] = [
  {
    id: 1,
    brand: 'SUZUKI',
    model: 'GSX-R 600',
    year: 2011,
    price: 6950,
    pricePerMonth: 149,
    mileage: 28500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '125 PK',
    image: '/hoofdafbeeldingbikerfun1.jpeg',
    features: ['ABS', 'Aftermarket Uitlaat', 'Carbon Tank Pad', 'LED Achterlicht'],
  },
  {
    id: 2,
    brand: 'HARLEY-DAVIDSON',
    model: 'Street Bob 114',
    year: 2023,
    price: 21995,
    pricePerMonth: 399,
    mileage: 2500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '94 PK',
    image: '/harley-street-bob.jpg',
    features: ['ABS', 'Cruise Control', 'LED Verlichting', 'Quick Shifter'],
  },
  {
    id: 3,
    brand: 'YAMAHA',
    model: 'MT-09 SP',
    year: 2024,
    price: 14995,
    pricePerMonth: 279,
    mileage: 850,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '119 PK',
    image: '/yamaha-mt09.jpg',
    features: ['Quickshifter', 'TFT Display', 'Rijmodi', 'ABS'],
  },
  {
    id: 4,
    brand: 'DUCATI',
    model: 'Monster 937',
    year: 2023,
    price: 13495,
    pricePerMonth: 249,
    mileage: 3200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '111 PK',
    image: '/ducati-monster.jpg',
    features: ['Cornering ABS', 'Traction Control', 'Keyless', 'TFT'],
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'R 1250 GS Adventure',
    year: 2022,
    price: 19995,
    pricePerMonth: 369,
    mileage: 8500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '136 PK',
    image: '/bmw-r1250gs.jpg',
    features: ['Dynamic ESA', 'Cruise Control', 'Keyless', 'GPS'],
  },
  {
    id: 6,
    brand: 'KAWASAKI',
    model: 'Ninja H2 SX',
    year: 2023,
    price: 24995,
    pricePerMonth: 449,
    mileage: 1200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '200 PK',
    image: '',
    features: ['Supercharged', 'Cornering ABS', 'Quick Shifter', 'TFT'],
  },
  {
    id: 7,
    brand: 'TRIUMPH',
    model: 'Speed Triple 1200 RS',
    year: 2024,
    price: 18995,
    pricePerMonth: 349,
    mileage: 450,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '180 PK',
    image: '',
    features: ['Öhlins Suspension', 'Brembo', 'Quick Shifter', 'Rijmodi'],
  },
];

export function OccasionsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black p-4 rounded-full shadow-xl transition-all -translate-x-24 hidden lg:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black p-4 rounded-full shadow-xl transition-all translate-x-24 hidden lg:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-8 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {occasions.map((occasion) => (
          <div
            key={occasion.id}
            className="flex-none w-[350px] bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group snap-start flex flex-col"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] bg-biker-black overflow-hidden">
              {occasion.image ? (
                <Image
                  src={occasion.image}
                  alt={`${occasion.brand} ${occasion.model}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
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
            <div className="p-6 flex flex-col flex-1">
              {/* Brand & Model */}
              <div className="mb-4">
                <h3 className="text-biker-yellow font-bold text-sm uppercase tracking-wider mb-1">
                  {occasion.brand}
                </h3>
                <h4 className="text-white font-bold text-2xl">
                  {occasion.model}
                </h4>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-biker-gray">
                <div>
                  <div className="text-white font-bold text-2xl">
                    € {occasion.price.toLocaleString('nl-NL')},-
                  </div>
                  <div className="text-biker-muted text-sm">
                    of € {occasion.pricePerMonth},- p/m
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <span className="text-biker-yellow">⚙️</span>
                  <span>{occasion.transmission}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <span className="text-biker-yellow">⛽</span>
                  <span>{occasion.fuel}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <span className="text-biker-yellow">📊</span>
                  <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <span className="text-biker-yellow">📅</span>
                  <span>{occasion.year}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm col-span-2">
                  <span className="text-biker-yellow">⚡</span>
                  <span>{occasion.power}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
                {occasion.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-biker-black text-biker-light rounded border border-biker-gray h-fit"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href={`/occasions/${occasion.id}`}
                className="btn-primary block w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 mt-auto"
              >
                BEKIJK DETAILS
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

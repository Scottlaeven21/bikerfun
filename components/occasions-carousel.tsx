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
                  quality={100}
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
              <div className="mb-4 pb-4 border-b border-biker-gray">
                <div className="text-white font-bold text-2xl">
                  € {occasion.price.toLocaleString('nl-NL')},-
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{occasion.transmission}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span>{occasion.fuel}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>{occasion.mileage.toLocaleString('nl-NL')} km</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm">
                  <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{occasion.year}</span>
                </div>
                <div className="flex items-center space-x-2 text-biker-light text-sm col-span-2">
                  <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
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

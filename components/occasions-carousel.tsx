'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Occasion } from '@/types';

interface OccasionsCarouselProps {
  occasions: Occasion[];
}

export function OccasionsCarousel({ occasions }: OccasionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [dragged, setDragged] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    setDragged(false);
    startX.current = e.clientX - scrollRef.current.getBoundingClientRect().left;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.setPointerCapture(e.pointerId);
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.clientX - scrollRef.current.getBoundingClientRect().left;
    const walk = x - startX.current;
    if (Math.abs(walk) > 5) setDragged(true);
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
      scrollRef.current.style.userSelect = '';
    }
  }, []);

  return (
    <div className="relative">
      {/* Swipe Indicator - Mobile Only */}
      <div className="flex items-center justify-center gap-2 mb-6 text-biker-yellow lg:hidden">
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <span className="text-sm font-bold uppercase tracking-wider">Swipe om te bladeren</span>
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>

      {/* Scroll Buttons - Desktop Only */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow p-4 rounded-full shadow-xl transition-all -translate-x-24 hidden lg:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow p-4 rounded-full shadow-xl transition-all translate-x-24 hidden lg:block"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 md:gap-8 pb-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {occasions.map((occasion) => (
          <div
            key={occasion.id}
            className="flex-none w-[320px] md:w-[370px] bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray hover:border-biker-yellow transition-all group snap-center flex flex-col"
          >
            {/* Image - clickable */}
            <Link
              href={`/occasions/${occasion.id}`}
              onClick={(e) => { if (dragged) e.preventDefault(); }}
              className="relative aspect-[4/3] bg-biker-black overflow-hidden block"
            >
              {occasion.images.length > 0 ? (
                <>
                  <Image
                    src={occasion.images[0]}
                    alt={`${occasion.brand} ${occasion.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    quality={100}
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
                  />
                  
                  {/* Verkocht Sticker */}
                  {occasion.status === 'sold' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="bg-red-600 text-white px-8 py-4 rounded-lg transform -rotate-12 shadow-2xl border-4 border-white">
                        <div className="text-2xl font-black uppercase tracking-wider">
                          VERKOCHT
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gereserveerd Sticker */}
                  {occasion.status === 'reserved' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                      <div className="bg-orange-500 text-white px-8 py-4 rounded-lg transform -rotate-12 shadow-2xl border-4 border-white">
                        <div className="text-2xl font-black uppercase tracking-wider">
                          GERESERVEERD
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🏍️</div>
                    <div className="text-white font-bold text-lg mb-1">FOTO&apos;S VOLGEN</div>
                    <div className="text-biker-yellow font-bold text-xl">BINNENKORT</div>
                  </div>
                </div>
              )}
            </Link>

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
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                {occasion.transmission && occasion.transmission.trim() !== '' && occasion.transmission !== '0' && (
                  <div className="flex items-center space-x-2 text-biker-light text-sm">
                    <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{occasion.transmission}</span>
                  </div>
                )}
                {occasion.fuel && occasion.fuel.trim() !== '' && occasion.fuel !== '0' && (
                  <div className="flex items-center space-x-2 text-biker-light text-sm">
                    <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="truncate">{occasion.fuel}</span>
                  </div>
                )}
                {occasion.mileage && occasion.mileage > 0 && (
                  <div className="flex items-center space-x-2 text-biker-light text-sm">
                    <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="truncate">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                  </div>
                )}
                {occasion.year && occasion.year > 1900 && (
                  <div className="flex items-center space-x-2 text-biker-light text-sm">
                    <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{occasion.year}</span>
                  </div>
                )}
                {occasion.power && occasion.power.trim() !== '' && occasion.power !== '0' && (
                  <div className="flex items-center space-x-2 text-biker-light text-sm col-span-2">
                    <svg className="w-4 h-4 text-biker-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="truncate">{occasion.power}</span>
                  </div>
                )}
              </div>

              {/* Features - max 5 */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
                {occasion.features.slice(0, 5).map((feature, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-biker-black text-biker-light rounded border border-biker-gray h-fit"
                  >
                    {feature}
                  </span>
                ))}
                {occasion.features.length > 5 && (
                  <span className="text-xs px-2 py-1 bg-biker-gray/30 text-biker-muted rounded border border-biker-gray h-fit">
                    +{occasion.features.length - 5} meer
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={`/occasions/${occasion.id}`}
                onClick={(e) => { if (dragged) e.preventDefault(); }}
                className="btn-primary block w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 mt-auto"
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

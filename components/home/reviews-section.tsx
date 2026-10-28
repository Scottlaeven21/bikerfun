'use client';

import { useRef } from 'react';
import type { ReviewSettings, SiteReview } from '@/types';

function Stars({ count, size = 'md' }: { count: number; size?: 'sm' | 'md' }) {
  const className = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
  return (
    <div className="flex text-biker-yellow">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={className}
          fill={i < count ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill={i < count ? 'currentColor' : 'none'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection({
  settings,
  reviews,
}: {
  settings: ReviewSettings;
  reviews: SiteReview[];
}) {
  const score = Number(settings.overall_score).toFixed(1);
  const googleUrl = settings.google_url || '#';
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 bg-black noise-overlay border-t-2 border-biker-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
            Wat Klanten Over <span className="text-biker-yellow">Ons Zeggen</span>
          </h2>
          <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
            Lees de ervaringen van onze tevreden klanten. Echte reviews van Google.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Stars count={Math.round(Number(settings.overall_score))} />
            <span className="text-biker-light font-bold">
              {score} uit 5 sterren
              {settings.review_count > 0 && (
                <span className="text-biker-muted font-normal"> ({settings.review_count} reviews)</span>
              )}
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-6 text-biker-yellow lg:hidden">
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wider">Swipe om te bladeren</span>
            <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>

          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Vorige reviews"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow p-4 rounded-full shadow-xl transition-all -translate-x-24 hidden lg:block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Volgende reviews"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow p-4 rounded-full shadow-xl transition-all translate-x-24 hidden lg:block"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex items-stretch overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-none w-[85%] sm:w-[380px] lg:w-[calc((100%-3rem)/3)] snap-center bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <Stars count={review.rating} size="sm" />
                  {review.date_label && (
                    <span className="text-xs text-biker-muted">{review.date_label}</span>
                  )}
                </div>
                <h3 className="font-bold text-white mb-2">{review.author}</h3>
                <p className="text-biker-light text-sm leading-relaxed flex-1">{review.body}</p>
                {review.is_verified && (
                  <div className="mt-4 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-biker-yellow" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span className="text-xs text-biker-muted">Geverifieerde aankoop</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-biker-light mb-6">Bekijk al onze reviews op Google</p>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
          >
            Meer reviews op Google
          </a>
        </div>
      </div>
    </section>
  );
}

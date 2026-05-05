'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ReactNode } from 'react';

type GalleryImage = { src: string; alt: string };

type Props = {
  images: GalleryImage[];
  productName: string;
  badges?: ReactNode;
};

export function ProductImageGallery({ images, productName, badges }: Props) {
  const list = images.length > 0 ? images : [{ src: '/placeholder-product.png', alt: productName }];
  const [active, setActive] = useState(0);
  const main = list[Math.min(active, list.length - 1)];

  const showNav = list.length > 1;

  const go = (dir: -1 | 1) => {
    setActive((i) => {
      const n = list.length;
      return (i + dir + n) % n;
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
        <Image
          src={main.src}
          alt={main.alt || productName}
          fill
          className="object-contain p-6 sm:p-8"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
        {badges}

        {showNav && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-biker-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-biker-black md:hidden"
              aria-label="Vorige afbeelding"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-biker-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-biker-black md:hidden"
              aria-label="Volgende afbeelding"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {showNav && (
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          {list.map((img, index) => {
            const isActive = index === active;
            return (
              <button
                key={`${img.src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-2 transition sm:h-20 sm:w-20 ${
                  isActive
                    ? 'ring-biker-yellow ring-offset-2 ring-offset-stone-50'
                    : 'ring-gray-200 hover:ring-gray-300'
                }`}
                aria-label={`Afbeelding ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `${productName} ${index + 1}`}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

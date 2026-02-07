'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] bg-biker-black rounded-2xl overflow-hidden border-2 border-biker-gray group">
        <Image
          src={images[selectedImage]}
          alt={`${alt} - Foto ${selectedImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority={selectedImage === 0}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-biker-black/90 backdrop-blur-sm text-white p-4 rounded-full hover:bg-biker-yellow hover:text-biker-black transition-all duration-300 shadow-2xl"
              aria-label="Vorige foto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-biker-black/90 backdrop-blur-sm text-white p-4 rounded-full hover:bg-biker-yellow hover:text-biker-black transition-all duration-300 shadow-2xl"
              aria-label="Volgende foto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter - Bottom Right */}
        <div className="absolute bottom-6 right-6 bg-biker-black/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl">
          {selectedImage + 1} / {images.length}
        </div>

        {/* Dot Indicators - Bottom Center */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`transition-all duration-300 rounded-full ${
                  selectedImage === index
                    ? 'bg-biker-yellow w-8 h-2'
                    : 'bg-white/40 hover:bg-white/60 w-2 h-2'
                }`}
                aria-label={`Ga naar foto ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

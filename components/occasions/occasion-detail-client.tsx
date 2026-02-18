'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Occasion } from '@/types';

interface OccasionDetailClientProps {
  occasion: Occasion;
}

export function OccasionDetailClient({ occasion }: OccasionDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = occasion.images.length > 0 ? occasion.images : [];

  return (
    <div className="min-h-screen bg-black noise-overlay">
      {/* Back Button */}
      <div className="bg-biker-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/occasions"
            className="inline-flex items-center text-biker-yellow hover:text-biker-yellowHover font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar overzicht
          </Link>
        </div>
      </div>

      {/* Hero Image - Static Full Width */}
      <section className="relative bg-biker-black overflow-hidden">
        {occasion.main_image ? (
          <div className="relative w-full">
            <Image
              src={occasion.main_image}
              alt={`${occasion.brand} ${occasion.model}`}
              width={1920}
              height={1080}
              className="w-full h-auto"
              quality={100}
              priority
            />
            {/* Gradient Overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        ) : (
          <div className="relative h-[50vh] bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-4">🏍️</div>
              <div className="text-white font-bold text-2xl">FOTO'S VOLGEN BINNENKORT</div>
            </div>
          </div>
        )}
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Media Gallery */}
            <div className="lg:col-span-2">
              {/* Media Section */}
              {allImages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Media</h3>
                  
                  {/* Large Current Image */}
                  <div className="relative aspect-video bg-biker-black rounded-2xl overflow-hidden mb-4 border-2 border-biker-gray">
                    <Image
                      src={allImages[currentImageIndex]}
                      alt={`${occasion.brand} ${occasion.model} - Afbeelding ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      quality={100}
                    />
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {allImages.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === idx
                            ? 'border-biker-yellow scale-105'
                            : 'border-biker-gray hover:border-biker-yellow/50'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          quality={100}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Beschrijving</h3>
                <p className="text-biker-light leading-relaxed">{occasion.description}</p>
              </div>

              {/* Technical Specifications */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h3 className="text-2xl font-bold text-white mb-6">Technische Specificaties</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Motor</div>
                      <div className="text-white font-semibold">{occasion.specs.engine || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Vermogen</div>
                      <div className="text-white font-semibold">{occasion.power}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Transmissie</div>
                      <div className="text-white font-semibold">{occasion.transmission}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Brandstof</div>
                      <div className="text-white font-semibold">{occasion.fuel}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Aandrijving</div>
                      <div className="text-white font-semibold">{occasion.specs.finalDrive || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Gewicht</div>
                      <div className="text-white font-semibold">{occasion.specs.weight || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Zithoogte</div>
                      <div className="text-white font-semibold">{occasion.specs.seatHeight || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Tankinhoud</div>
                      <div className="text-white font-semibold">{occasion.specs.tankCapacity || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Topsnelheid</div>
                      <div className="text-white font-semibold">{occasion.specs.topSpeed || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Koeling</div>
                      <div className="text-white font-semibold">{occasion.specs.cooling || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features & Extras */}
              {(occasion.features.length > 0 || occasion.extras.length > 0) && (
                <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Features & Extras</h3>
                  
                  {occasion.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-biker-yellow font-bold mb-3">Features</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {occasion.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-biker-light">
                            <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {occasion.extras.length > 0 && (
                    <div>
                      <h4 className="text-biker-yellow font-bold mb-3">Extras</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {occasion.extras.map((extra, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-biker-light">
                            <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{extra}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Details & CTA */}
            <div className="lg:col-span-1">
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-yellow sticky top-24">
                {/* Title & Price */}
                <div className="mb-8">
                  <div className="text-biker-yellow font-bold text-sm uppercase tracking-wider mb-2">
                    {occasion.brand}
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">
                    {occasion.model}
                  </h1>
                  <div className="text-4xl font-bold text-biker-yellow">
                    € {occasion.price.toLocaleString('nl-NL')},-
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 pb-8 mb-8 border-b border-biker-gray">
                  <div className="flex justify-between items-center">
                    <span className="text-biker-muted">Bouwjaar</span>
                    <span className="text-white font-semibold">{occasion.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-biker-muted">Km-stand</span>
                    <span className="text-white font-semibold">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-biker-muted">Transmissie</span>
                    <span className="text-white font-semibold">{occasion.transmission}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-biker-muted">Staat</span>
                    <span className="text-white font-semibold">{occasion.condition || 'Zeer goed'}</span>
                  </div>
                  {occasion.color && (
                    <div className="flex justify-between items-center">
                      <span className="text-biker-muted">Kleur</span>
                      <span className="text-white font-semibold">{occasion.color}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-biker-muted">Garantie</span>
                    <span className="text-white font-semibold">{occasion.warranty}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                  <Link
                    href={`/occasions/${occasion.id}/aanvraag`}
                    className="btn-primary block w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Plan Bezichtiging
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-secondary block w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-biker-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Stel een vraag
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="mt-8 pt-8 border-t border-biker-gray text-center">
                  <p className="text-biker-muted text-sm mb-2">Of bel direct:</p>
                  <a href="tel:0615452108" className="text-biker-yellow font-bold text-lg hover:text-biker-yellowHover">
                    06 15 45 21 08
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

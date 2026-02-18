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
      {/* Hero Image - Static with Back Button Overlay */}
      <section className="relative bg-biker-black overflow-hidden h-[60vh]">
        {occasion.main_image ? (
          <div className="relative w-full h-full">
            <Image
              src={occasion.main_image}
              alt={`${occasion.brand} ${occasion.model}`}
              fill
              className="object-cover"
              quality={100}
              priority
            />
            
            {/* Back Button Overlay - Top Left Lower */}
            <div className="absolute top-20 left-8 z-10">
              <Link
                href="/occasions"
                className="inline-flex items-center text-white hover:text-biker-yellow font-semibold transition-colors uppercase tracking-wider"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                TERUG
              </Link>
            </div>
            
            {/* Gradient Overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        ) : (
          <div className="relative h-full bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
            {/* Back Button for no image state */}
            <div className="absolute top-20 left-8 z-10">
              <Link
                href="/occasions"
                className="inline-flex items-center text-white hover:text-biker-yellow font-semibold transition-colors uppercase tracking-wider"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                TERUG
              </Link>
            </div>
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
              {/* Info Card */}
              <div className="bg-[#1a1a1a] rounded-2xl p-8 sticky top-24">
                {/* Header */}
                <h3 className="text-xl font-bold text-white mb-6">INFORMATIE</h3>

                {/* Info List */}
                <div className="space-y-0 mb-8">
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">KM-stand</span>
                    <span className="text-white font-bold">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">Bouwjaar</span>
                    <span className="text-white font-bold">{occasion.year}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">Categorie</span>
                    <span className="text-white font-bold">{occasion.category || 'Supersport'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">Staat</span>
                    <span className="text-biker-yellow font-bold">{occasion.condition || 'Zeer goed'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">Eigenaren</span>
                    <span className="text-white font-bold">{occasion.owners || '2'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-gray-800">
                    <span className="text-white">Onderhoudshistorie</span>
                    <span className="text-white font-bold">{occasion.service_history || 'Volledig'}</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-white">Garantie</span>
                    <span className="text-biker-yellow font-bold">{occasion.warranty}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-8">
                  <Link
                    href={`/occasions/${occasion.id}/aanvraag`}
                    className="block w-full bg-biker-yellow hover:bg-biker-yellowHover text-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Plan Bezichtiging
                  </Link>
                  <a
                    href="tel:0615452108"
                    className="block w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Bel Ons
                  </a>
                  <Link
                    href="/contact"
                    className="block w-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    Mail Ons
                  </Link>
                </div>

                {/* Features Checklist */}
                <div className="space-y-3 pt-6 border-t border-gray-800">
                  <div className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Proefrit mogelijk</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Inruil mogelijk</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Financiering beschikbaar</span>
                  </div>
                  <div className="flex items-center space-x-3 text-white">
                    <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Altijd gestald</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Occasion } from '@/types';
import { useOccasionView } from '@/hooks/use-analytics';

interface OccasionDetailClientProps {
  occasion: Occasion;
}

export function OccasionDetailClient({ occasion }: OccasionDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Track occasion view
  useOccasionView(occasion.id);

  const allImages = occasion.images.length > 0 ? occasion.images : [];

  return (
    <div className="min-h-screen bg-black noise-overlay">
      {/* Hero Image - Static with Back Button Overlay */}
      <section className="relative bg-biker-black overflow-hidden h-[45vh] md:h-[50vh]">
        {occasion.main_image ? (
          <div className="relative w-full h-full">
            <img
              src={occasion.main_image}
              alt={`${occasion.brand} ${occasion.model}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="sync"
            />
            
            {/* Verkocht Overlay */}
            {occasion.status === 'sold' && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-red-600 text-white px-16 py-10 rounded-2xl transform -rotate-6 shadow-2xl border-8 border-white">
                  <div className="text-6xl font-black uppercase tracking-wider text-center">
                    VERKOCHT
                  </div>
                </div>
              </div>
            )}
            
            {/* Back Button - onder navbar voor volledige klikbaarheid */}
            <div className="absolute top-32 left-8 z-20">
              <Link
                href="/occasions"
                className="inline-flex items-center gap-2 text-white font-bold transition-all bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-biker-yellow hover:text-biker-black min-h-[48px]"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {/* Back Button - onder navbar voor volledige klikbaarheid */}
            <div className="absolute top-32 left-8 z-20">
              <Link
                href="/occasions"
                className="inline-flex items-center gap-2 text-white font-bold transition-all bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-biker-yellow hover:text-biker-black min-h-[48px]"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 66vw"
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
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Beschrijving</h3>
                <div className="text-biker-light leading-relaxed whitespace-pre-line">
                  {occasion.description
                    ?.replace(/\\n/g, '\n') // Convert \n to actual line breaks
                    .replace(/<[^>]*>/g, '') // Strip HTML tags
                    .replace(/&amp;/g, '&')
                    .replace(/&nbsp;/g, ' ')
                    .trim()}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h3 className="text-2xl font-bold text-white mb-6">Technische Specificaties</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {occasion.specs?.engine && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Motor</div>
                        <div className="text-white font-semibold">{occasion.specs.engine}</div>
                      </div>
                    )}
                    {occasion.power && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Vermogen</div>
                        <div className="text-white font-semibold">{occasion.power}</div>
                      </div>
                    )}
                    {occasion.transmission && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Transmissie</div>
                        <div className="text-white font-semibold">{occasion.transmission}</div>
                      </div>
                    )}
                    {occasion.fuel && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Brandstof</div>
                        <div className="text-white font-semibold">{occasion.fuel}</div>
                      </div>
                    )}
                    {occasion.specs?.finalDrive && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Aandrijving</div>
                        <div className="text-white font-semibold">{occasion.specs.finalDrive}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {occasion.specs?.weight && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Gewicht</div>
                        <div className="text-white font-semibold">{occasion.specs.weight}</div>
                      </div>
                    )}
                    {occasion.specs?.seatHeight && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Zithoogte</div>
                        <div className="text-white font-semibold">{occasion.specs.seatHeight}</div>
                      </div>
                    )}
                    {occasion.specs?.tankCapacity && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Tankinhoud</div>
                        <div className="text-white font-semibold">{occasion.specs.tankCapacity}</div>
                      </div>
                    )}
                    {occasion.specs?.topSpeed && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Topsnelheid</div>
                        <div className="text-white font-semibold">{occasion.specs.topSpeed}</div>
                      </div>
                    )}
                    {occasion.specs?.cooling && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Koeling</div>
                        <div className="text-white font-semibold">{occasion.specs.cooling}</div>
                      </div>
                    )}
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
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border-2 border-biker-gray sticky top-24">
                {/* Header */}
                <h3 className="text-xl font-bold text-white mb-6">INFORMATIE</h3>

                {/* Info List */}
                <div className="space-y-0 mb-8">
                  {occasion.mileage && occasion.mileage > 0 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">KM-stand</span>
                      <span className="text-white font-bold">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                    </div>
                  )}
                  {occasion.year && occasion.year > 1900 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Bouwjaar</span>
                      <span className="text-white font-bold">{occasion.year}</span>
                    </div>
                  )}
                  {occasion.category && occasion.category.trim() !== '' && occasion.category !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Categorie</span>
                      <span className="text-white font-bold">{occasion.category}</span>
                    </div>
                  )}
                  {occasion.condition && occasion.condition.trim() !== '' && occasion.condition !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Staat</span>
                      <span className="text-biker-yellow font-bold">{occasion.condition}</span>
                    </div>
                  )}
                  {occasion.owners && occasion.owners > 0 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Eigenaren</span>
                      <span className="text-white font-bold">{occasion.owners}</span>
                    </div>
                  )}
                  {occasion.service_history && occasion.service_history.trim() !== '' && occasion.service_history !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Onderhoudshistorie</span>
                      <span className="text-white font-bold">{occasion.service_history}</span>
                    </div>
                  )}
                  {occasion.warranty && occasion.warranty.trim() !== '' && occasion.warranty !== '0' && (
                    <div className="flex justify-between items-center py-4">
                      <span className="text-white">Garantie</span>
                      <span className="text-biker-yellow font-bold">{occasion.warranty}</span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons - Conditional based on sold status */}
                {occasion.status === 'sold' ? (
                  <div className="mb-8">
                    <div className="bg-red-600/10 border-2 border-red-600 rounded-2xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="text-red-600 font-black text-xl uppercase">Deze motor is verkocht</h4>
                        </div>
                      </div>
                      <p className="text-white/90 leading-relaxed mb-4">
                        Deze occasion is helaas al verkocht, maar geen zorgen!
                      </p>
                      <p className="text-biker-yellow font-bold leading-relaxed">
                        Op zoek naar een soortgelijke motor? Vraag deze aan via onderstaande knop en wij gaan voor u op zoek naar een vergelijkbare motor.
                      </p>
                    </div>
                    
                    <Link
                      href={`/motor-op-aanvraag?brand=${encodeURIComponent(occasion.brand)}&model=${encodeURIComponent(occasion.model)}&year=${occasion.year}&message=${encodeURIComponent(`Ik ben geïnteresseerd in de ${occasion.brand} ${occasion.model} uit ${occasion.year}, maar deze is helaas al verkocht. Kunnen jullie voor mij op zoek gaan naar een soortgelijke motor?`)}`}
                      className="block w-full bg-biker-yellow hover:bg-biker-yellowHover text-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Motor Op Aanvraag
                    </Link>
                  </div>
                ) : (
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
                )}

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

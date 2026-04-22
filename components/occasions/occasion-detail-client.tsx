'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Occasion } from '@/types';
import { useOccasionView } from '@/hooks/use-analytics';

function ReservedContactForm({ occasion }: { occasion: Occasion }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject: `Wachtlijst: ${occasion.brand} ${occasion.model} (${occasion.year})`,
          message: `${message}\n\n[Motor: ${occasion.brand} ${occasion.model} ${occasion.year} – GERESERVEERD]`,
          type: 'waitlist',
        }),
      });
      if (!res.ok) throw new Error('Versturen mislukt');
      setSent(true);
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw of bel ons direct.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-green-600/10 border-2 border-green-600 rounded-2xl p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <h4 className="text-green-400 font-bold text-lg mb-1">Aanmelding ontvangen!</h4>
        <p className="text-white/80 text-sm">We nemen contact met u op zodra deze motor beschikbaar is.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Uw naam *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 text-sm"
      />
      <input
        type="email"
        placeholder="E-mailadres *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 text-sm"
      />
      <input
        type="tel"
        placeholder="Telefoonnummer"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 text-sm"
      />
      <textarea
        placeholder="Optionele opmerking..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 text-sm resize-none"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-2 border-orange-500 text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300 disabled:opacity-50"
      >
        {sending ? 'Versturen...' : 'Aanmelden voor wachtlijst'}
      </button>
    </form>
  );
}

interface OccasionDetailClientProps {
  occasion: Occasion;
}

export function OccasionDetailClient({ occasion }: OccasionDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Track occasion view
  useOccasionView(occasion.id);

  const allImages = occasion.images.length > 0 ? occasion.images : [];

  // Section visibility settings (default all visible)
  const vis = occasion.specs?.visible_sections as Record<string, boolean> | undefined;
  const show = (key: string) => vis === undefined || vis[key] !== false;

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

            {/* Gereserveerd Overlay */}
            {occasion.status === 'reserved' && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="bg-orange-500 text-white px-16 py-10 rounded-2xl transform -rotate-6 shadow-2xl border-8 border-white">
                  <div className="text-5xl font-black uppercase tracking-wider text-center">
                    GERESERVEERD
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
              {show('description') && (
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Beschrijving</h3>
                <div className="text-biker-light leading-relaxed whitespace-pre-line">
                  {occasion.description
                    ?.replace(/\\n/g, '\n')
                    .replace(/<[^>]*>/g, '')
                    .replace(/&amp;/g, '&')
                    .replace(/&nbsp;/g, ' ')
                    .trim()}
                </div>
              </div>
              )}

              {/* Technical Specifications - only show if at least one spec is visible */}
              {(show('engine') || show('power') || show('transmission') || show('fuel') ||
                show('finalDrive') || show('weight') || show('seatHeight') ||
                show('tankCapacity') || show('topSpeed') || show('cooling') || show('cylinders') || show('gears')) && (
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h3 className="text-2xl font-bold text-white mb-6">Technische Specificaties</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {show('engine') && occasion.specs?.engine && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Motor</div>
                        <div className="text-white font-semibold">{occasion.specs.engine}</div>
                      </div>
                    )}
                    {show('cylinders') && occasion.specs?.cylinders && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Cilinders</div>
                        <div className="text-white font-semibold">{occasion.specs.cylinders}</div>
                      </div>
                    )}
                    {show('power') && occasion.power && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Vermogen</div>
                        <div className="text-white font-semibold">{occasion.power}</div>
                      </div>
                    )}
                    {show('transmission') && occasion.transmission && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Transmissie</div>
                        <div className="text-white font-semibold">{occasion.transmission}</div>
                      </div>
                    )}
                    {show('fuel') && occasion.fuel && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Brandstof</div>
                        <div className="text-white font-semibold">{occasion.fuel}</div>
                      </div>
                    )}
                    {show('gears') && occasion.specs?.gears && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Versnellingen</div>
                        <div className="text-white font-semibold">{occasion.specs.gears}</div>
                      </div>
                    )}
                    {show('finalDrive') && occasion.specs?.finalDrive && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Aandrijving</div>
                        <div className="text-white font-semibold">{occasion.specs.finalDrive}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {show('weight') && occasion.specs?.weight && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Gewicht</div>
                        <div className="text-white font-semibold">{occasion.specs.weight}</div>
                      </div>
                    )}
                    {show('seatHeight') && occasion.specs?.seatHeight && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Zithoogte</div>
                        <div className="text-white font-semibold">{occasion.specs.seatHeight}</div>
                      </div>
                    )}
                    {show('tankCapacity') && occasion.specs?.tankCapacity && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Tankinhoud</div>
                        <div className="text-white font-semibold">{occasion.specs.tankCapacity}</div>
                      </div>
                    )}
                    {show('topSpeed') && occasion.specs?.topSpeed && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Topsnelheid</div>
                        <div className="text-white font-semibold">{occasion.specs.topSpeed}</div>
                      </div>
                    )}
                    {show('cooling') && occasion.specs?.cooling && (
                      <div>
                        <div className="text-biker-muted text-sm uppercase tracking-wider mb-1">Koeling</div>
                        <div className="text-white font-semibold">{occasion.specs.cooling}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Features & Extras */}
              {(show('features') && occasion.features.length > 0) || (show('extras') && occasion.extras.length > 0) ? (
                <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray mt-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Features &amp; Extras</h3>
                  
                  {show('features') && occasion.features.length > 0 && (
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

                  {show('extras') && occasion.extras.length > 0 && (
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
              ) : null}
            </div>

            {/* Right Column - Details & CTA */}
            <div className="lg:col-span-1">
              {/* Info Card */}
              <div className="bg-[#1a1a1a] rounded-2xl border-2 border-biker-gray sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col overflow-hidden">
                {/* ── Scrollable top section: title + specs ── */}
                <div className="flex-1 overflow-y-auto p-8 pb-4 scrollbar-hide">
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-tight">
                  {occasion.brand} <span className="text-biker-yellow">{occasion.model}</span>
                </h1>
                
                {/* Year Badge */}
                {occasion.year && occasion.year > 1900 && (
                  <div className="inline-block bg-biker-yellow text-biker-black px-4 py-1 rounded-full text-sm font-bold mb-4">
                    {occasion.year}
                  </div>
                )}

                {/* Price */}
                <div className="mb-6 mt-2">
                  {occasion.price > 0 ? (
                    <div className="text-3xl font-black text-biker-yellow tracking-tight">
                      € {occasion.price.toLocaleString('nl-NL')}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-biker-yellow">
                      Prijs op aanvraag
                    </div>
                  )}
                </div>
                
                {/* Header */}
                <h2 className="text-xl font-bold text-white mb-6">INFORMATIE</h2>

                {/* Info List */}
                <div className="space-y-0 mb-8">
                  {show('mileage') && occasion.mileage && occasion.mileage > 0 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">KM-stand</span>
                      <span className="text-white font-bold">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                    </div>
                  )}
                  {show('year') && occasion.year && occasion.year > 1900 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Bouwjaar</span>
                      <span className="text-white font-bold">{occasion.year}</span>
                    </div>
                  )}
                  {show('category') && occasion.category && occasion.category.trim() !== '' && occasion.category !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Categorie</span>
                      <span className="text-white font-bold">{occasion.category}</span>
                    </div>
                  )}
                  {show('condition') && occasion.condition && occasion.condition.trim() !== '' && occasion.condition !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Staat</span>
                      <span className="text-biker-yellow font-bold">{occasion.condition}</span>
                    </div>
                  )}
                  {show('owners') && occasion.owners && occasion.owners > 0 && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Eigenaren</span>
                      <span className="text-white font-bold">{occasion.owners}</span>
                    </div>
                  )}
                  {show('service_history') && occasion.service_history && occasion.service_history.trim() !== '' && occasion.service_history !== '0' && (
                    <div className="flex justify-between items-center py-4 border-b border-gray-800">
                      <span className="text-white">Onderhoudshistorie</span>
                      <span className="text-white font-bold">{occasion.service_history}</span>
                    </div>
                  )}
                  {show('warranty') && occasion.warranty && occasion.warranty.trim() !== '' && occasion.warranty !== '0' && (
                    <div className="flex justify-between items-center py-4">
                      <span className="text-white">Garantie</span>
                      <span className="text-biker-yellow font-bold">{occasion.warranty}</span>
                    </div>
                  )}
                </div>

                </div>{/* end scrollable section */}

                {/* ── Fixed bottom section: buttons + checklist (always visible) ── */}
                <div className="flex-shrink-0 px-8 pb-8 pt-4 border-t border-gray-800">
                {/* CTA Buttons - Conditional based on status */}
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
                      className="block w-full bg-biker-yellow hover:bg-biker-black text-black hover:text-biker-yellow border-2 border-biker-yellow text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Motor Op Aanvraag
                    </Link>
                  </div>
                ) : occasion.status === 'reserved' ? (
                  <div className="mb-8">
                    <div className="bg-orange-500/10 border-2 border-orange-500 rounded-2xl p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-8 h-8 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <h4 className="text-orange-400 font-black text-xl uppercase">Gereserveerd – In de wacht</h4>
                      </div>
                      <p className="text-white/90 leading-relaxed text-sm mb-3">
                        Deze motor is momenteel gereserveerd en staat in de wacht. U kunt zich hieronder aanmelden voor de wachtlijst.
                      </p>
                      <p className="text-orange-400 font-bold text-sm">
                        Zodra de reservering vervalt, nemen wij direct contact met u op.
                      </p>
                    </div>
                    <ReservedContactForm occasion={occasion} />
                  </div>
                ) : (
                  <div className="space-y-3 mb-8">
                    <Link
                      href={`/occasions/${occasion.id}/aanvraag`}
                      className="block w-full bg-biker-yellow hover:bg-biker-black text-black hover:text-biker-yellow border-2 border-biker-yellow text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
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
                </div>{/* end fixed bottom section */}
              </div>{/* end card */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

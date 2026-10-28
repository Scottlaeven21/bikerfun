'use client';

import { useEffect, useRef, useState } from 'react';
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

function OccasionChecklist({ className = 'pt-6 border-t border-gray-800' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {['Proefrit mogelijk', 'Inruil mogelijk', 'Altijd gestald'].map((label) => (
        <div key={label} className="flex items-center space-x-3 text-white">
          <svg className="w-5 h-5 text-biker-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function OccasionActionButtons({ occasion, compact = false }: { occasion: Occasion; compact?: boolean }) {
  const btn = compact
    ? 'py-2.5 text-xs'
    : 'py-4';
  const btnClass = `block w-full ${btn} rounded-full font-bold uppercase tracking-wider text-center transition-all duration-300`;

  if (occasion.status === 'sold') {
    return (
      <div>
        {!compact && (
          <div className="bg-red-600/10 border-2 border-red-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h4 className="text-red-600 font-black text-xl uppercase">Deze motor is verkocht</h4>
            </div>
            <p className="text-white/90 leading-relaxed mb-4">
              Deze occasion is helaas al verkocht, maar geen zorgen!
            </p>
            <p className="text-biker-yellow font-bold leading-relaxed">
              Op zoek naar een soortgelijke motor? Vraag deze aan via onderstaande knop en wij gaan voor u op zoek naar een vergelijkbare motor.
            </p>
          </div>
        )}
        <Link
          href={`/motor-op-aanvraag?brand=${encodeURIComponent(occasion.brand)}&model=${encodeURIComponent(occasion.model)}&year=${occasion.year}&message=${encodeURIComponent(`Ik ben geïnteresseerd in de ${occasion.brand} ${occasion.model} uit ${occasion.year}, maar deze is helaas al verkocht. Kunnen jullie voor mij op zoek gaan naar een soortgelijke motor?`)}`}
          className={`${btnClass} bg-biker-yellow hover:bg-biker-black text-black hover:text-biker-yellow border-2 border-biker-yellow shadow-lg hover:shadow-xl`}
        >
          Motor Op Aanvraag
        </Link>
      </div>
    );
  }

  if (occasion.status === 'reserved') {
    return (
      <div>
        {!compact && (
          <>
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
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link
        href={`/occasions/${occasion.id}/aanvraag`}
        className={`${btnClass} bg-biker-yellow hover:bg-biker-black text-black hover:text-biker-yellow border-2 border-biker-yellow`}
      >
        Plan Bezichtiging
      </Link>
      <a
        href="tel:0615452108"
        className={`${btnClass} bg-transparent border-2 border-white text-white hover:bg-white hover:text-black`}
      >
        Bel Ons
      </a>
      <Link
        href="/contact"
        className={`${btnClass} bg-transparent border-2 border-white text-white hover:bg-white hover:text-black`}
      >
        Mail Ons
      </Link>
      <a
        href={`https://wa.me/31615452108?text=${encodeURIComponent(`Hallo, ik heb interesse in de ${occasion.brand} ${occasion.model} (${occasion.year}). Kunnen jullie mij meer informatie geven?`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full ${btn} rounded-full font-bold uppercase tracking-wider bg-[#25D366] hover:bg-[#1ebe5d] text-white border-2 border-[#25D366] transition-all duration-300`}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp Ons
      </a>
    </div>
  );
}

interface OccasionDetailClientProps {
  occasion: Occasion;
}

export function OccasionDetailClient({ occasion }: OccasionDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(0);

  useOccasionView(occasion.id);

  const allImages = occasion.images.length > 0
    ? occasion.images
    : occasion.main_image
      ? [occasion.main_image]
      : [];

  const vis = occasion.specs?.visible_sections as Record<string, boolean> | undefined;
  const show = (key: string) => vis === undefined || vis[key] !== false;

  const goPrev = () => {
    if (allImages.length < 2) return;
    setCurrentImageIndex((index) => (index - 1 + allImages.length) % allImages.length);
  };
  const goNext = () => {
    if (allImages.length < 2) return;
    setCurrentImageIndex((index) => (index + 1) % allImages.length);
  };

  const onSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40 || allImages.length < 2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') goPrev();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen, allImages.length]);

  const statusBadge =
    occasion.status === 'sold' ? (
      <div className="absolute top-3 right-3 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
        Verkocht
      </div>
    ) : occasion.status === 'reserved' ? (
      <div className="absolute top-3 right-3 z-10 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
        Gereserveerd
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-black noise-overlay">
      <section className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-1 text-white text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full hover:bg-biker-yellow hover:text-biker-black mb-5"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug
          </Link>

          {allImages.length > 0 ? (
            <div className="mb-8">
              <div
                className="relative aspect-[4/3] md:aspect-[16/10] bg-biker-black rounded-2xl overflow-hidden border-2 border-biker-gray"
                onTouchStart={onSwipeStart}
                onTouchEnd={onSwipeEnd}
              >
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 z-0 cursor-zoom-in"
                  aria-label="Foto fullscreen openen"
                >
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={`${occasion.brand} ${occasion.model} - Afbeelding ${currentImageIndex + 1}`}
                    fill
                    className="object-contain object-center"
                    quality={100}
                    unoptimized
                    sizes="100vw"
                    priority
                  />
                </button>
                {statusBadge}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-biker-yellow text-white hover:text-biker-black rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm"
                      aria-label="Vorige afbeelding"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-biker-yellow text-white hover:text-biker-black rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center backdrop-blur-sm"
                      aria-label="Volgende afbeelding"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <p className="mt-2 text-center text-xs font-bold uppercase tracking-wider text-biker-yellow">
                  Swipe of tik voor meer foto&apos;s
                </p>
              )}

              {allImages.length > 1 && (
                <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative aspect-square rounded-md overflow-hidden border transition-all ${
                        currentImageIndex === idx
                          ? 'border-biker-yellow'
                          : 'border-biker-gray hover:border-biker-yellow/50'
                      }`}
                      aria-label={`Foto ${idx + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${occasion.brand} ${occasion.model} thumbnail ${idx + 1}`}
                        fill
                        className="object-contain object-center bg-biker-black"
                        quality={70}
                        unoptimized
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8 aspect-[4/3] bg-gradient-to-br from-biker-gray/50 to-biker-black rounded-2xl border-2 border-biker-gray flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-3">🏍️</div>
                <div className="text-white font-bold text-lg">FOTO&apos;S VOLGEN BINNENKORT</div>
              </div>
            </div>
          )}

          <div className="bg-[#1a1a1a] rounded-2xl border-2 border-biker-gray p-6 md:p-8 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 uppercase tracking-tight">
              {occasion.brand} <span className="text-biker-yellow">{occasion.model}</span>
            </h1>
            {occasion.year && occasion.year > 1900 && (
              <div className="inline-block bg-biker-yellow text-biker-black px-4 py-1 rounded-full text-sm font-bold mb-4">
                {occasion.year}
              </div>
            )}
            <div className="mb-6">
              {occasion.price > 0 ? (
                <div className="text-3xl font-black text-biker-yellow tracking-tight">
                  € {occasion.price.toLocaleString('nl-NL')}
                </div>
              ) : (
                <div className="text-xl font-bold text-biker-yellow">Prijs op aanvraag</div>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mb-2">INFORMATIE</h2>
            <div className="space-y-0">
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
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border-2 border-biker-gray p-6 md:p-8 mb-6">
            <OccasionActionButtons occasion={occasion} />
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border-2 border-biker-gray p-6 md:p-8 mb-6">
            <OccasionChecklist className="" />
          </div>

          {(show('engine') || show('power') || show('transmission') || show('fuel') ||
            show('finalDrive') || show('weight') || show('seatHeight') ||
            show('tankCapacity') || show('topSpeed') || show('cooling') || show('cylinders') || show('gears')) && (
            <div className="bg-biker-dark rounded-2xl p-6 md:p-8 border-2 border-biker-gray mb-6">
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

          {(show('features') && occasion.features.length > 0) || (show('extras') && occasion.extras.length > 0) ? (
            <div className="bg-biker-dark rounded-2xl p-6 md:p-8 border-2 border-biker-gray mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Features &amp; Extras</h3>
              {show('features') && occasion.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-biker-yellow font-bold mb-3">Features</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {show('description') && occasion.description && (
            <div className="bg-biker-dark rounded-2xl p-6 md:p-8 border-2 border-biker-gray">
              <h3 className="text-2xl font-bold text-white mb-4">Beschrijving</h3>
              <div className="text-biker-light leading-relaxed whitespace-pre-line">
                {occasion.description
                  ?.replace(/\\n/g, '\n')
                  .replace(/<br\s*\/?>/gi, '\n')
                  .replace(/<\/p>/gi, '\n\n')
                  .replace(/<\/(li|div|h[1-6])>/gi, '\n')
                  .replace(/<[^>]*>/g, '')
                  .replace(/&amp;/g, '&')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/\n{3,}/g, '\n\n')
                  .trim()}
              </div>
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[80] bg-black/95 flex flex-col"
          onTouchStart={onSwipeStart}
          onTouchEnd={onSwipeEnd}
        >
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-white text-sm font-bold">
              {currentImageIndex + 1} / {allImages.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="text-white bg-white/10 hover:bg-biker-yellow hover:text-biker-black rounded-full w-10 h-10 flex items-center justify-center"
              aria-label="Sluiten"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1 min-h-0">
            <Image
              src={allImages[currentImageIndex]}
              alt={`${occasion.brand} ${occasion.model} - Afbeelding ${currentImageIndex + 1}`}
              fill
              className="object-contain object-center"
              quality={100}
              unoptimized
              sizes="100vw"
            />
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-biker-yellow text-white hover:text-biker-black rounded-full w-11 h-11 flex items-center justify-center"
                  aria-label="Vorige afbeelding"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-biker-yellow text-white hover:text-biker-black rounded-full w-11 h-11 flex items-center justify-center"
                  aria-label="Volgende afbeelding"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="px-3 py-3 overflow-x-auto">
              <div className="flex gap-1.5 min-w-min justify-center">
                {allImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 shrink-0 rounded-md overflow-hidden border ${
                      currentImageIndex === idx ? 'border-biker-yellow' : 'border-white/20'
                    }`}
                    aria-label={`Ga naar foto ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-contain object-center bg-black"
                      quality={60}
                      unoptimized
                      sizes="56px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

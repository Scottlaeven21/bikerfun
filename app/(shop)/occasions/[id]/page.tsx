'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ImageGallery } from '@/components/image-gallery';

// Mock data - later vervangen door Supabase data
const occasionsData: Record<string, any> = {
  '1': {
    id: 1,
    brand: 'Suzuki',
    model: 'GSX-R 600',
    year: 2011,
    price: 6950,
    mileage: 28500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '125 pk',
    image: '/suzuki-gsxr-1.jpg',
    images: [
      '/suzuki-gsxr-1.jpg',
      '/suzuki-gsxr-2.jpg',
      '/suzuki-gsxr-3.jpg',
      '/suzuki-gsxr-4.jpg',
      '/suzuki-gsxr-5.jpg',
      '/suzuki-gsxr-6.jpg'
    ],
    features: ['ABS', 'Aftermarket Uitlaat', 'Zwart Uitgevoerd', 'Carbon Tank Pad', 'Spiegels'],
    color: 'Mat Zwart',
    category: 'Supersport',
    description: 'Deze Suzuki GSX-R 600 uit 2011 is een echte supersport in perfecte staat! Volledig zwart uitgevoerd met carbon accenten. De motor is technisch uitstekend onderhouden, rijdt perfect en is direct inzetbaar. Complete onderhoudshistorie aanwezig. Ideaal voor zowel de liefhebber als de serieuze rijder die op zoek is naar pure performance.',
    specs: {
      engine: '599cc 4-cilinder',
      cylinders: '4',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Ketting',
      weight: '196 kg',
      seatHeight: '810 mm',
      tankCapacity: '17 liter',
      topSpeed: '260 km/u'
    },
    condition: 'Zeer goed',
    owners: 2,
    serviceHistory: 'Volledig',
    warranty: '3 maanden dealer garantie',
    extras: ['Aftermarket uitlaatsysteem', 'Carbon tank pad', 'Geanodiseerde remhendels', 'LED achterlicht', 'Zwart gespoten velgen']
  },
  '2': {
    id: 2,
    brand: 'Harley-Davidson',
    model: 'Street Bob 114',
    year: 2021,
    price: 18950,
    mileage: 12500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '94 pk',
    image: '/harley-street-bob.jpg',
    features: ['ABS', 'Cruise Control', 'LED Verlichting', 'Sissybar', 'Wegklapbare Passagiersvoetsteunen'],
    color: 'Vivid Black',
    category: 'Cruiser',
    description: 'Deze Harley-Davidson Street Bob 114 uit 2021 is een echte eye-catcher. Met zijn minimalistische bobber-stijl en krachtige Milwaukee-Eight 114 motor levert hij puur rijplezier. De motor is in uitstekende staat, technisch perfect onderhouden en direct rijklaar. Kom hem proefrijden!',
    specs: {
      engine: '1868cc V-Twin',
      cylinders: '2',
      cooling: 'Luchtgekoeld',
      gears: '6',
      finalDrive: 'Riem',
      weight: '296 kg',
      seatHeight: '675 mm',
      tankCapacity: '13.2 liter',
      topSpeed: '180 km/u'
    },
    condition: 'Uitstekend',
    owners: 1,
    serviceHistory: 'Volledig',
    warranty: '6 maanden dealer garantie',
    extras: ['Custom uitlaat', 'Vance & Hines slip-ons', 'Zwart uitgevoerd', 'Nieuw achterband']
  },
  '3': {
    id: 3,
    brand: 'Yamaha',
    model: 'MT-09',
    year: 2022,
    price: 11450,
    mileage: 8200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '119 pk',
    image: '/yamaha-mt09.jpg',
    features: ['ABS', 'Traction Control', 'Quickshifter', 'TFT Display', 'Riding Modes'],
    color: 'Tech Black',
    category: 'Naked',
    description: 'De Yamaha MT-09 uit 2022 in showroomstaat! Deze naked bike combineert comfort met sportieve prestaties. De krachtige 890cc driecilinder motor levert soepel vermogen over het hele toerentalbereik. Perfect onderhouden, originele staat en altijd gestald.',
    specs: {
      engine: '890cc 3-cilinder',
      cylinders: '3',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Ketting',
      weight: '193 kg',
      seatHeight: '825 mm',
      tankCapacity: '14 liter',
      topSpeed: '220 km/u'
    },
    condition: 'Als nieuw',
    owners: 1,
    serviceHistory: 'Volledig bij Yamaha dealer',
    warranty: '12 maanden fabrieksgarantie',
    extras: ['Quickshifter', 'TFT kleurenscherm', 'LED verlichting', 'Riding modes']
  },
  '4': {
    id: 4,
    brand: 'Ducati',
    model: 'Monster 937',
    year: 2023,
    price: 13495,
    mileage: 3200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '111 pk',
    image: '/ducati-monster.jpg',
    features: ['Cornering ABS', 'Traction Control', 'Keyless', 'TFT Display'],
    color: 'Ducati Red',
    category: 'Naked',
    description: 'Deze Ducati Monster 937 uit 2023 is een moderne interpretatie van een iconisch model. Met zijn Testastretta 11° L-twin motor en minimalistisch Italiaans design is dit een pure rijmachine. Technisch perfect, weinig kilometers, en klaar voor nieuwe avonturen.',
    specs: {
      engine: '937cc L-Twin',
      cylinders: '2',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Ketting',
      weight: '188 kg',
      seatHeight: '820 mm',
      tankCapacity: '14 liter',
      topSpeed: '210 km/u'
    },
    condition: 'Uitstekend',
    owners: 1,
    serviceHistory: 'Volledig bij Ducati dealer',
    warranty: '18 maanden fabrieksgarantie',
    extras: ['Keyless systeem', 'TFT display', 'Cornering ABS', 'LED verlichting']
  },
  '5': {
    id: 5,
    brand: 'BMW',
    model: 'R 1250 GS Adventure',
    year: 2022,
    price: 19995,
    mileage: 8500,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '136 pk',
    image: '/bmw-r1250gs.jpg',
    features: ['Dynamic ESA', 'Cruise Control', 'Keyless', 'GPS Navigation'],
    color: 'Triple Black',
    category: 'Adventure',
    description: 'De ultieme adventure bike! Deze BMW R 1250 GS Adventure uit 2022 is gebouwd voor lange afstanden en elk terrein. Met Dynamic ESA, cruise control, GPS navigatie en koffers is hij klaar voor jouw volgende avontuur. Zeer goed onderhouden met volledige servicehistorie.',
    specs: {
      engine: '1254cc Boxer Twin',
      cylinders: '2',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Cardan',
      weight: '249 kg',
      seatHeight: '890 mm',
      tankCapacity: '30 liter',
      topSpeed: '200 km/u'
    },
    condition: 'Zeer goed',
    owners: 1,
    serviceHistory: 'Volledig bij BMW Motorrad',
    warranty: '12 maanden dealer garantie',
    extras: ['GPS navigatie', 'Dynamic ESA', 'Koffers', 'Cruise control', 'Keyless', 'Verwarmde handvaten']
  },
  '6': {
    id: 6,
    brand: 'Kawasaki',
    model: 'Ninja H2 SX',
    year: 2023,
    price: 24995,
    mileage: 1200,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '200 pk',
    image: '',
    features: ['Supercharged', 'Cornering ABS', 'Quick Shifter', 'TFT Display'],
    color: 'Emerald Blazed Green',
    category: 'Sport Touring',
    description: 'Unieke kans! Kawasaki Ninja H2 SX met supercharged motor. Deze sport-tourer combineert extreme prestaties met touring comfort. Met slechts 1200 km vrijwel nieuw. De supercharged 998cc motor levert 200 pk en een ervaring die je nergens anders vindt.',
    specs: {
      engine: '998cc Supercharged Inline-4',
      cylinders: '4',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Ketting',
      weight: '260 kg',
      seatHeight: '835 mm',
      tankCapacity: '19 liter',
      topSpeed: '299 km/u'
    },
    condition: 'Als nieuw',
    owners: 1,
    serviceHistory: 'Eerste service gedaan',
    warranty: '24 maanden fabrieksgarantie',
    extras: ['Supercharger', 'Cornering ABS', 'Quick shifter', 'Koffers', 'TFT display', 'Cruise control']
  },
  '7': {
    id: 7,
    brand: 'Triumph',
    model: 'Speed Triple 1200 RS',
    year: 2024,
    price: 18995,
    mileage: 450,
    transmission: 'Handgeschakeld',
    fuel: 'Benzine',
    power: '180 pk',
    image: '',
    features: ['Öhlins Suspension', 'Brembo Brakes', 'Quick Shifter', 'Riding Modes'],
    color: 'Storm Grey',
    category: 'Naked',
    description: 'De nieuwe Triumph Speed Triple 1200 RS uit 2024, vrijwel ongebruikt! Met Öhlins semi-actieve suspension, Brembo Stylema remmen en 180 pk uit de 1160cc triple motor is dit de ultieme naked bike. Premium afwerking, alle opties, en in perfecte staat.',
    specs: {
      engine: '1160cc Triple',
      cylinders: '3',
      cooling: 'Vloeistofgekoeld',
      gears: '6',
      finalDrive: 'Ketting',
      weight: '199 kg',
      seatHeight: '830 mm',
      tankCapacity: '15.5 liter',
      topSpeed: '240 km/u'
    },
    condition: 'Als nieuw',
    owners: 1,
    serviceHistory: 'Eerste service bij Triumph dealer',
    warranty: '24 maanden fabrieksgarantie',
    extras: ['Öhlins Smart EC 2.0', 'Brembo Stylema', 'Carbon details', 'Quick shifter', 'TFT display', 'Rijmodi']
  },
};

export default function OccasionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const occasion = occasionsData[id];

  if (!occasion) {
    return (
      <div className="min-h-screen bg-black noise-overlay text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏍️</div>
          <h1 className="text-4xl font-bold mb-4">Occasion niet gevonden</h1>
          <Link href="/occasions" className="text-biker-yellow hover:underline">
            Terug naar overzicht
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Image */}
      <section className="relative h-[70vh] bg-biker-black">
        {occasion.image ? (
          <Image
            src={occasion.image}
            alt={`${occasion.brand} ${occasion.model}`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-biker-gray/50 to-biker-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6">🏍️</div>
              <div className="text-white font-bold text-2xl mb-2">FOTO'S VOLGEN</div>
              <div className="text-biker-yellow font-bold text-3xl">BINNENKORT</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        
        {/* Back Button */}
        <div className="absolute top-32 left-8">
          <Link
            href="/occasions"
            className="bg-biker-dark/80 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-biker-yellow hover:text-biker-black transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>TERUG</span>
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              {occasion.images && occasion.images.length > 0 ? (
                <ImageGallery 
                  images={occasion.images} 
                  alt={`${occasion.brand} ${occasion.model}`}
                />
              ) : occasion.image ? (
                <div className="relative aspect-[4/3] bg-biker-black rounded-2xl overflow-hidden border-2 border-biker-gray">
                  <Image
                    src={occasion.image}
                    alt={`${occasion.brand} ${occasion.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] bg-gradient-to-br from-biker-gray/50 to-biker-black rounded-2xl flex items-center justify-center border-2 border-biker-gray">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🏍️</div>
                    <div className="text-white font-bold text-2xl mb-2">FOTO'S VOLGEN</div>
                    <div className="text-biker-yellow font-bold text-3xl">BINNENKORT</div>
                  </div>
                </div>
              )}

              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 
                      style={{ fontFamily: 'var(--font-inter)' }}
                      className="text-4xl md:text-5xl font-bold mb-2 uppercase tracking-tight"
                    >
                      {occasion.brand}
                    </h1>
                    <p className="text-2xl md:text-3xl text-biker-light">{occasion.model}</p>
                  </div>
                  <span className="bg-biker-yellow text-biker-black px-4 py-2 rounded-lg font-bold text-lg">
                    {occasion.year}
                  </span>
                </div>
                <div className="flex items-baseline space-x-4">
                  <span className="text-5xl font-bold text-biker-yellow">
                    € {occasion.price.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-biker-light">incl. BTW</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight">Omschrijving</h2>
                <p className="text-biker-light leading-relaxed">{occasion.description}</p>
              </div>

              {/* Specifications */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Specificaties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Motor</span>
                    <span className="font-bold">{occasion.specs.engine}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Vermogen</span>
                    <span className="font-bold">{occasion.power}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Cilinders</span>
                    <span className="font-bold">{occasion.specs.cylinders}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Koeling</span>
                    <span className="font-bold">{occasion.specs.cooling}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Transmissie</span>
                    <span className="font-bold">{occasion.transmission}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Versnellingen</span>
                    <span className="font-bold">{occasion.specs.gears}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Aandrijving</span>
                    <span className="font-bold">{occasion.specs.finalDrive}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Gewicht</span>
                    <span className="font-bold">{occasion.specs.weight}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Zithoogte</span>
                    <span className="font-bold">{occasion.specs.seatHeight}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Tankinhoud</span>
                    <span className="font-bold">{occasion.specs.tankCapacity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Topsnelheid</span>
                    <span className="font-bold">{occasion.specs.topSpeed}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Kleur</span>
                    <span className="font-bold">{occasion.color}</span>
                  </div>
                </div>
              </div>

              {/* Features & Extras */}
              <div className="bg-biker-dark rounded-2xl p-8 border-2 border-biker-gray">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-tight">Extra's & Opties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...occasion.features, ...occasion.extras].map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <span className="text-biker-yellow text-xl">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray sticky top-24">
                <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Informatie</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">KM-stand</span>
                    <span className="font-bold">{occasion.mileage.toLocaleString('nl-NL')} km</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Bouwjaar</span>
                    <span className="font-bold">{occasion.year}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Categorie</span>
                    <span className="font-bold">{occasion.category}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Staat</span>
                    <span className="font-bold text-biker-yellow">{occasion.condition}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Eigenaren</span>
                    <span className="font-bold">{occasion.owners}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-biker-gray">
                    <span className="text-biker-light">Onderhoudshistorie</span>
                    <span className="font-bold">{occasion.serviceHistory}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-biker-light">Garantie</span>
                    <span className="font-bold text-biker-yellow">{occasion.warranty}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 space-y-3">
                  <Link
                    href="/contact"
                    className="btn-primary block w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    PLAN BEZICHTIGING
                  </Link>
                  <a
                    href="tel:+31615452108"
                    className="btn-secondary block w-full bg-transparent text-white text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
                  >
                    BEL ONS
                  </a>
                  <a
                    href="mailto:bikerfun.info@gmail.com"
                    className="block w-full bg-biker-dark hover:bg-biker-gray text-white text-center py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 border-2 border-biker-gray"
                  >
                    MAIL ONS
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t-2 border-biker-gray space-y-3 text-sm">
                  <div className="flex items-center space-x-3 text-biker-light">
                    <span className="text-biker-yellow text-xl">✓</span>
                    <span>Proefrit mogelijk</span>
                  </div>
                  <div className="flex items-center space-x-3 text-biker-light">
                    <span className="text-biker-yellow text-xl">✓</span>
                    <span>Inruil mogelijk</span>
                  </div>
                  <div className="flex items-center space-x-3 text-biker-light">
                    <span className="text-biker-yellow text-xl">✓</span>
                    <span>Financiering beschikbaar</span>
                  </div>
                  <div className="flex items-center space-x-3 text-biker-light">
                    <span className="text-biker-yellow text-xl">✓</span>
                    <span>Altijd gestald</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Occasions */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 uppercase tracking-tight"
          >
            Meer <span className="text-biker-yellow">Occasions</span>
          </h2>
          <div className="text-center">
            <Link
              href="/occasions"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-primary inline-block bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
            >
              BEKIJK ALLE OCCASIONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

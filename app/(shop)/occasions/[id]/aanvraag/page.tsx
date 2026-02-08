'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Mock data - later vervangen door Supabase data
const occasionsData: Record<string, any> = {
  '1': {
    id: 1,
    brand: 'Suzuki',
    model: 'GSX-R 600',
    year: 2011,
    price: 6950,
    image: '/suzuki-hero-v2.png',
  },
  '2': {
    id: 2,
    brand: 'Harley-Davidson',
    model: 'Street Bob 114',
    year: 2021,
    price: 18950,
    image: '/harley-street-bob.jpg',
  },
  '3': {
    id: 3,
    brand: 'Yamaha',
    model: 'MT-09',
    year: 2022,
    price: 11450,
    image: '/yamaha-mt09.jpg',
  },
  '4': {
    id: 4,
    brand: 'Ducati',
    model: 'Monster 937',
    year: 2023,
    price: 13495,
    image: '/ducati-monster.jpg',
  },
  '5': {
    id: 5,
    brand: 'BMW',
    model: 'R 1250 GS Adventure',
    year: 2022,
    price: 19995,
    image: '/bmw-r1250gs.jpg',
  },
  '6': {
    id: 6,
    brand: 'Kawasaki',
    model: 'Ninja H2 SX',
    year: 2023,
    price: 24995,
    image: '',
  },
  '7': {
    id: 7,
    brand: 'Triumph',
    model: 'Speed Triple 1200 RS',
    year: 2024,
    price: 18995,
    image: '',
  },
};

export default function OccasionAanvraagPage() {
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
    <div className="min-h-screen bg-black noise-overlay text-white pt-32 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/occasions/${id}`}
          className="inline-flex items-center space-x-2 text-biker-yellow hover:text-biker-yellowHover mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold uppercase text-sm tracking-wider">Terug naar occasion</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight"
          >
            Plan <span className="text-biker-yellow">Bezichtiging</span>
          </h1>
          <p className="text-lg text-biker-light">
            Vul onderstaand formulier in en wij nemen zo snel mogelijk contact met je op
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Occasion Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-biker-dark rounded-2xl p-6 border-2 border-biker-gray sticky top-24">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">Geselecteerde Motor</h2>
              
              {/* Image */}
              {occasion.image && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <Image
                    src={occasion.image}
                    alt={`${occasion.brand} ${occasion.model}`}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="400px"
                  />
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {occasion.brand}
                  </h3>
                  <p className="text-xl text-biker-light">{occasion.model}</p>
                </div>
                
                <div className="flex items-baseline justify-between pt-3 border-t-2 border-biker-gray">
                  <span className="text-3xl font-bold text-biker-yellow">
                    € {occasion.price.toLocaleString('nl-NL')}
                  </span>
                  <span className="text-biker-light">{occasion.year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
              <form className="space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">
                    Jouw Gegevens
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        Naam *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                        placeholder="Je volledige naam"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                        placeholder="je@email.nl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        Telefoon *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                        placeholder="06 12345678"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        Woonplaats
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                        placeholder="Bijv. Amsterdam"
                      />
                    </div>
                  </div>
                </div>

                {/* Occasion Details (Read-only) */}
                <div className="border-t-2 border-biker-gray pt-6">
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">
                    Occasion Details
                  </h3>

                  <div className="bg-biker-black rounded-lg p-4 border-2 border-biker-gray">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-biker-light">Merk & Model:</span>
                        <p className="font-bold text-white">{occasion.brand} {occasion.model}</p>
                      </div>
                      <div>
                        <span className="text-biker-light">Bouwjaar:</span>
                        <p className="font-bold text-white">{occasion.year}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-biker-light">Vraagprijs:</span>
                        <p className="font-bold text-biker-yellow text-lg">€ {occasion.price.toLocaleString('nl-NL')},-</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="border-t-2 border-biker-gray pt-6">
                  <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">
                    Bezichtiging
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        Gewenste Datum *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        required
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                        Gewenste Tijd
                      </label>
                      <select
                        id="time"
                        name="time"
                        className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      >
                        <option value="">Selecteer een tijd</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="test_ride" className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id="test_ride"
                        name="test_ride"
                        className="w-5 h-5 bg-biker-black border-2 border-biker-gray rounded focus:ring-2 focus:ring-biker-yellow"
                      />
                      <span className="text-white font-bold">Ik wil graag een proefrit maken</span>
                    </label>
                    <p className="text-sm text-biker-light mt-2 ml-8">
                      Een geldig rijbewijs is verplicht voor een proefrit
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t-2 border-biker-gray pt-6">
                  <label htmlFor="message" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Aanvullende Opmerkingen
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors resize-none"
                    placeholder="Vertel ons meer over je interesse, vragen of specifieke wensen..."
                  />
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="btn-primary w-full bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
                  >
                    VERSTUUR AANVRAAG
                  </button>

                  <p className="text-xs text-biker-light mt-4 text-center">
                    * Verplichte velden. We nemen binnen 24 uur contact met je op om de bezichtiging te bevestigen.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

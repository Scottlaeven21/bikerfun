import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Motor Op Aanvraag | Bikerfun',
  description: 'Zoek je een specifieke motor? Wij gaan voor jou op zoek naar je droommoddel.',
};

export default function AanvraagPage() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Hero Section with Video */}
      <section className="relative h-[50vh] overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero-aanvraag.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-biker-black/70 via-biker-black/50 to-biker-black/90"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 
              style={{ 
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.05em'
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl uppercase"
            >
              Motor Op <span className="text-biker-yellow">Aanvraag</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Kunnen we je helpen met het vinden van een specifieke motor? 
              Vul het formulier in en wij gaan voor jou op zoek!
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-biker-dark border-y-2 border-biker-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 uppercase tracking-tight"
          >
            Hoe Werkt Het?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Vertel Ons Je Wens</h3>
              <p className="text-biker-light">
                Vul het formulier in met jouw droommoddel, budget en wensen. 
                Hoe specifieker, hoe beter we kunnen zoeken!
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Wij Gaan Zoeken</h3>
              <p className="text-biker-light">
                Ons team duikt in ons netwerk en gebruikt onze expertise 
                om de perfecte motor voor jou te vinden.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-biker-yellow text-biker-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Jij Rijdt Weg</h3>
              <p className="text-biker-light">
                We nemen contact op zodra we wat gevonden hebben. 
                Na goedkeuring regel wij alles tot aan de overdracht!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
            <h2 
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-3xl md:text-4xl font-bold mb-8 uppercase tracking-tight text-center"
            >
              Aanvraagformulier
            </h2>
            
            <form className="space-y-6">
              {/* Personal Info */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Motorcycle Details */}
              <div className="border-t-2 border-biker-gray pt-6 mt-8">
                <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">
                  Motor Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Merk *
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      required
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="Bijv. Harley-Davidson, BMW"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Model *
                    </label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      required
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="Bijv. Street Bob, R1250GS"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="year_from" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Bouwjaar Vanaf
                    </label>
                    <input
                      type="number"
                      id="year_from"
                      name="year_from"
                      min="1900"
                      max="2030"
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label htmlFor="year_to" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Bouwjaar Tot
                    </label>
                    <input
                      type="number"
                      id="year_to"
                      name="year_to"
                      min="1900"
                      max="2030"
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label htmlFor="mileage_max" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Max. KM-Stand
                    </label>
                    <input
                      type="number"
                      id="mileage_max"
                      name="mileage_max"
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Budget (max) *
                    </label>
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      required
                      className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                      placeholder="€ 15000"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="color" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Kleurvoorkeur
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                    placeholder="Bijv. Zwart, Zilver, Mat Grijs"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t-2 border-biker-gray pt-6 mt-8">
                <label htmlFor="additional_info" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Extra Wensen / Opmerkingen
                </label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  rows={6}
                  className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors resize-none"
                  placeholder="Vertel ons meer over wat je zoekt: specifieke uitvoeringen, opties, dealbreakers, etc."
                />
              </div>

              {/* Urgency */}
              <div>
                <label htmlFor="urgency" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Hoe Snel Wil Je Een Motor? *
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  required
                  className="w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors"
                >
                  <option value="">Selecteer een optie</option>
                  <option value="asap">Zo snel mogelijk</option>
                  <option value="1-month">Binnen 1 maand</option>
                  <option value="3-months">Binnen 3 maanden</option>
                  <option value="flexible">Geen haast, perfecte match belangrijker</option>
                </select>
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
                  * Verplichte velden. We nemen binnen 24 uur contact met je op.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-biker-dark border-t-2 border-biker-gray">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Waarom <span className="text-biker-yellow">Bikerfun</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Groot Netwerk</h3>
              <p className="text-biker-light">
                Toegang tot honderden dealers en particuliere aanbieders in heel Europa
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Kwaliteitscheck</h3>
              <p className="text-biker-light">
                Elke motor wordt door ons gekeurd voordat we hem aan jou voorstellen
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Zorgeloos</h3>
              <p className="text-biker-light">
                Wij regelen transport, papierwerk en garantie - jij hoeft alleen maar te rijden!
              </p>
            </div>
          </div>

          <div className="mt-16">
            <Link
              href="/contact"
              style={{ fontFamily: 'var(--font-montserrat)' }}
              className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
            >
              EERST EVEN BELLEN?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

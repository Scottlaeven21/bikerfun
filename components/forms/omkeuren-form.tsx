'use client';

import { useState } from 'react';
import { submitOmkeurenForm } from '@/app/actions/email';
import { LoadingButton } from '@/components/loading/spinner';
import { trackEvent } from '@/app/actions/analytics';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  brand: '',
  model: '',
  generation: '',
  licensePlate: '',
  typeApproval: '',
  year: '',
  vin: '',
  message: '',
};

const inputClass =
  'w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50';

export function OmkeurenForm() {
  const [isDealer, setIsDealer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function chooseDealer() {
    setIsDealer(true);
    document.getElementById('aanvraag')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);

    const result = await submitOmkeurenForm({
      ...formData,
      isDealer,
    });

    setIsLoading(false);
    if (result.success) {
      setStatus({ type: 'success', text: result.message || 'Aanvraag verzonden!' });
      setFormData(emptyForm);
      await trackEvent('omkeuren_submit', {
        type: isDealer ? 'dealer' : 'particulier',
        brand: formData.brand,
        model: formData.model,
      });
    } else {
      setStatus({ type: 'error', text: result.error || 'Er ging iets mis.' });
    }
  }

  return (
    <>
      <section className="py-20 bg-biker-dark border-y border-biker-gray/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight"
          >
            Motorzaak of <span className="text-biker-yellow">Dealer</span>?
          </h2>
          <p className="text-lg md:text-xl text-biker-light mb-10 max-w-3xl mx-auto">
            Ben jij een motorzaak en wil jij motoren omkeuren voor jouw klanten?
            Meld je dan aan als dealer. Vul je gegevens in, dan nemen wij contact met je op.
          </p>
          <button
            type="button"
            onClick={chooseDealer}
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-primary inline-block bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300"
          >
            Meld je aan als dealer
          </button>
        </div>
      </section>

      <section id="aanvraag" className="py-20 scroll-mt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-biker-dark rounded-2xl p-8 lg:p-12 border-2 border-biker-gray">
            <h2
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-2xl md:text-3xl font-bold mb-2 uppercase tracking-tight"
            >
              {isDealer ? 'Dealer aanmelden' : 'Omkeur-aanvraag'}
            </h2>
            <p className="text-biker-light mb-8">
              {isDealer
                ? 'Vul je gegevens in, dan nemen wij contact met je op.'
                : 'Vul je gegevens en motorgegevens in. We nemen zo snel mogelijk contact met je op.'}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <button
                type="button"
                onClick={() => setIsDealer(false)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border-2 transition-colors ${
                  !isDealer
                    ? 'bg-biker-yellow text-biker-black border-biker-yellow'
                    : 'bg-transparent text-white border-biker-gray hover:border-biker-yellow'
                }`}
              >
                Particulier
              </button>
              <button
                type="button"
                onClick={() => setIsDealer(true)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider border-2 transition-colors ${
                  isDealer
                    ? 'bg-biker-yellow text-biker-black border-biker-yellow'
                    : 'bg-transparent text-white border-biker-gray hover:border-biker-yellow'
                }`}
              >
                Dealer
              </button>
            </div>

            {status && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-100'
                    : 'bg-red-500/20 border-2 border-red-500 text-red-100'
                }`}
              >
                <p className="text-sm font-medium">{status.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold uppercase tracking-tight">Jouw gegevens</h3>

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
                    disabled={isLoading}
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Je volledige naam"
                  />
                </div>
                {isDealer && (
                  <div>
                    <label htmlFor="company" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Bedrijfsnaam *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required={isDealer}
                      disabled={isLoading}
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Naam van je motorzaak"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="je@email.nl"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                    Telefoon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    disabled={isLoading}
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="06 12345678"
                  />
                </div>
              </div>

              {!isDealer && (
              <div className="border-t-2 border-biker-gray pt-6 mt-2">
                <h3 className="text-xl font-bold mb-6 uppercase tracking-tight">Motorgegevens</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Merk *
                    </label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      required={!isDealer}
                      disabled={isLoading}
                      value={formData.brand}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Bijv. Yamaha"
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
                      required={!isDealer}
                      disabled={isLoading}
                      value={formData.model}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Bijv. R6"
                    />
                  </div>
                  <div>
                    <label htmlFor="generation" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Generatie
                    </label>
                    <input
                      type="text"
                      id="generation"
                      name="generation"
                      disabled={isLoading}
                      value={formData.generation}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="Bijv. RJ11 of RJ15"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Bouwjaar *
                    </label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      required
                      min="1900"
                      max="2030"
                      disabled={isLoading}
                      value={formData.year}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="2006"
                    />
                  </div>
                  <div>
                    <label htmlFor="licensePlate" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Kenteken
                    </label>
                    <input
                      type="text"
                      id="licensePlate"
                      name="licensePlate"
                      disabled={isLoading}
                      value={formData.licensePlate}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="XX-XX-XX"
                    />
                  </div>
                  <div>
                    <label htmlFor="typeApproval" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Typegoedkeuring
                    </label>
                    <input
                      type="text"
                      id="typeApproval"
                      name="typeApproval"
                      disabled={isLoading}
                      value={formData.typeApproval}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="e4*2002/24*0123"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="vin" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                      Framenummer
                    </label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      disabled={isLoading}
                      value={formData.vin}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="VIN / chassisnummer"
                    />
                  </div>
                </div>
              </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2 uppercase tracking-wider">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  disabled={isLoading}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  placeholder={
                    isDealer
                      ? 'Vertel kort iets over je zaak, of laat leeg. Wij nemen contact met je op.'
                      : 'Bijvoorbeeld het vermogen, of extra toelichting'
                  }
                />
              </div>

              <LoadingButton
                type="submit"
                loading={isLoading}
                loadingText="VERSTUREN..."
                className="btn-primary w-full bg-biker-yellow text-biker-black border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider text-center"
              >
                {isDealer ? 'MELD JE AAN ALS DEALER' : 'VERSTUUR AANVRAAG'}
              </LoadingButton>
              <p className="text-xs text-biker-light text-center">
                * Verplichte velden. We nemen zo snel mogelijk contact met je op.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

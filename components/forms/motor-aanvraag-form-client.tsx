'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function MotorAanvraagFormClient() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get pre-filled data from URL params
  const prefillBrand = searchParams.get('brand') || '';
  const prefillModel = searchParams.get('model') || '';
  const prefillYear = searchParams.get('year') || '';
  const prefillMessage = searchParams.get('message') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    brand: prefillBrand,
    model: prefillModel,
    year_from: prefillYear,
    year_to: '',
    mileage_max: '',
    budget: '',
    color: '',
    additional_info: prefillMessage,
    urgency: '',
  });

  // Update form when URL params change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      brand: prefillBrand,
      model: prefillModel,
      year_from: prefillYear,
      additional_info: prefillMessage,
    }));
  }, [prefillBrand, prefillModel, prefillYear, prefillMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here you would send the form data
    console.log('Form submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Bedankt voor je aanvraag! We nemen zo snel mogelijk contact met je op.');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            value={formData.name}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.phone}
            onChange={handleChange}
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
            value={formData.location}
            onChange={handleChange}
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
              value={formData.brand}
              onChange={handleChange}
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
              value={formData.model}
              onChange={handleChange}
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
              value={formData.year_from}
              onChange={handleChange}
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
              value={formData.year_to}
              onChange={handleChange}
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
              value={formData.mileage_max}
              onChange={handleChange}
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
              value={formData.budget}
              onChange={handleChange}
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
            value={formData.color}
            onChange={handleChange}
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
          value={formData.additional_info}
          onChange={handleChange}
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
          value={formData.urgency}
          onChange={handleChange}
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
          disabled={isLoading}
          className="btn-primary w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow px-8 py-4 rounded-full font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'VERSTUREN...' : 'VERSTUUR AANVRAAG'}
        </button>

        <p className="text-xs text-biker-light mt-4 text-center">
          * Verplichte velden. We nemen binnen 24 uur contact met je op.
        </p>
      </div>
    </form>
  );
}

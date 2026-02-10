'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Occasion, OccasionInsert } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface OccasionFormProps {
  occasion?: Occasion;
  isEdit?: boolean;
}

export function OccasionForm({ occasion, isEdit = false }: OccasionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic Info
  const [brand, setBrand] = useState(occasion?.brand || '');
  const [model, setModel] = useState(occasion?.model || '');
  const [year, setYear] = useState(occasion?.year || new Date().getFullYear());
  const [price, setPrice] = useState(occasion?.price || 0);
  const [status, setStatus] = useState<'available' | 'reserved' | 'sold'>(occasion?.status || 'available');
  const [isActive, setIsActive] = useState(occasion?.is_active ?? true);

  // Technical Details
  const [mileage, setMileage] = useState(occasion?.mileage || 0);
  const [transmission, setTransmission] = useState(occasion?.transmission || 'Handgeschakeld');
  const [fuel, setFuel] = useState(occasion?.fuel || 'Benzine');
  const [power, setPower] = useState(occasion?.power || '');
  const [color, setColor] = useState(occasion?.color || '');
  const [category, setCategory] = useState(occasion?.category || '');

  // Condition & History
  const [condition, setCondition] = useState(occasion?.condition || '');
  const [owners, setOwners] = useState(occasion?.owners || 1);
  const [serviceHistory, setServiceHistory] = useState(occasion?.service_history || '');
  const [warranty, setWarranty] = useState(occasion?.warranty || '3 maanden volledige garantie');

  // Description
  const [description, setDescription] = useState(occasion?.description || '');

  // Features & Extras
  const [features, setFeatures] = useState<string[]>(occasion?.features || []);
  const [featureInput, setFeatureInput] = useState('');
  const [extras, setExtras] = useState<string[]>(occasion?.extras || []);
  const [extraInput, setExtraInput] = useState('');

  // Detailed Specs
  const [engine, setEngine] = useState(occasion?.specs?.engine || '');
  const [cylinders, setCylinders] = useState(occasion?.specs?.cylinders || '');
  const [cooling, setCooling] = useState(occasion?.specs?.cooling || 'Vloeistofgekoeld');
  const [gears, setGears] = useState(occasion?.specs?.gears || '6');
  const [finalDrive, setFinalDrive] = useState(occasion?.specs?.finalDrive || 'Ketting');
  const [weight, setWeight] = useState(occasion?.specs?.weight || '');
  const [seatHeight, setSeatHeight] = useState(occasion?.specs?.seatHeight || '');
  const [tankCapacity, setTankCapacity] = useState(occasion?.specs?.tankCapacity || '');
  const [topSpeed, setTopSpeed] = useState(occasion?.specs?.topSpeed || '');

  // Images
  const [mainImage, setMainImage] = useState(occasion?.main_image || '');
  const [images, setImages] = useState<string[]>(occasion?.images || []);
  const [imageInput, setImageInput] = useState('');

  // Helper function to generate slug
  const generateSlug = () => {
    return `${brand}-${model}-${year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addExtra = () => {
    if (extraInput.trim()) {
      setExtras([...extras, extraInput.trim()]);
      setExtraInput('');
    }
  };

  const removeExtra = (index: number) => {
    setExtras(extras.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Niet ingelogd');
      }

      const slug = generateSlug();

      const occasionData: OccasionInsert = {
        brand,
        model,
        year,
        price,
        status,
        is_active: isActive,
        mileage,
        transmission,
        fuel,
        power,
        color,
        category,
        condition,
        owners,
        service_history: serviceHistory,
        warranty,
        description,
        features,
        extras,
        images,
        main_image: mainImage,
        slug,
        specs: {
          engine,
          cylinders,
          cooling,
          gears,
          finalDrive,
          weight,
          seatHeight,
          tankCapacity,
          topSpeed,
        },
        created_by: user.id,
        updated_by: user.id,
      };

      if (isEdit && occasion) {
        // Update existing occasion
        const { error: updateError } = await (supabase as any)
          .from('occasions')
          .update(occasionData)
          .eq('id', occasion.id);

        if (updateError) throw updateError;
      } else {
        // Insert new occasion
        const { error: insertError } = await (supabase as any)
          .from('occasions')
          .insert(occasionData);

        if (insertError) throw insertError;
      }

      router.push('/admin/occasions');
      router.refresh();
    } catch (err) {
      console.error('Error saving occasion:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Basisinformatie
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Merk *
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. Suzuki"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Model *
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. GSX-R 600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jaar *
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prijs (€) *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="">Selecteer categorie</option>
              <option value="Sport">Sport</option>
              <option value="Naked">Naked</option>
              <option value="Cruiser">Cruiser</option>
              <option value="Adventure">Adventure</option>
              <option value="Sport Touring">Sport Touring</option>
              <option value="Touring">Touring</option>
              <option value="Enduro">Enduro</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kleur
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. Mat Zwart"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'available' | 'reserved' | 'sold')}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="available">Beschikbaar</option>
              <option value="reserved">Gereserveerd</option>
              <option value="sold">Verkocht</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 text-biker-yellow focus:ring-biker-yellow border-gray-300 rounded"
              />
              <span className="ml-3 text-sm font-semibold text-gray-700">
                Actief op website
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Technische Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Km-stand *
            </label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              required
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transmissie *
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="Handgeschakeld">Handgeschakeld</option>
              <option value="Automaat">Automaat</option>
              <option value="Semi-automaat">Semi-automaat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Brandstof *
            </label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="Benzine">Benzine</option>
              <option value="Diesel">Diesel</option>
              <option value="Elektrisch">Elektrisch</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vermogen *
            </label>
            <input
              type="text"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 125 pk"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motor
            </label>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 599cc 4-cilinder"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cilinders
            </label>
            <input
              type="text"
              value={cylinders}
              onChange={(e) => setCylinders(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 4"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Koeling
            </label>
            <select
              value={cooling}
              onChange={(e) => setCooling(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="Vloeistofgekoeld">Vloeistofgekoeld</option>
              <option value="Luchtgekoeld">Luchtgekoeld</option>
              <option value="Olie/luchtgekoeld">Olie/luchtgekoeld</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Versnellingen
            </label>
            <input
              type="text"
              value={gears}
              onChange={(e) => setGears(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 6"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aandrijving
            </label>
            <select
              value={finalDrive}
              onChange={(e) => setFinalDrive(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="Ketting">Ketting</option>
              <option value="Riem">Riem</option>
              <option value="Cardan">Cardan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gewicht
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 196 kg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Zithoogte
            </label>
            <input
              type="text"
              value={seatHeight}
              onChange={(e) => setSeatHeight(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 810 mm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tankinhoud
            </label>
            <input
              type="text"
              value={tankCapacity}
              onChange={(e) => setTankCapacity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 17 liter"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topsnelheid
            </label>
            <input
              type="text"
              value={topSpeed}
              onChange={(e) => setTopSpeed(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 260 km/u"
            />
          </div>
        </div>
      </div>

      {/* Condition & History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Staat & Historie
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Staat
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="">Selecteer staat</option>
              <option value="Als nieuw">Als nieuw</option>
              <option value="Uitstekend">Uitstekend</option>
              <option value="Zeer goed">Zeer goed</option>
              <option value="Goed">Goed</option>
              <option value="Redelijk">Redelijk</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aantal eigenaren
            </label>
            <input
              type="number"
              value={owners}
              onChange={(e) => setOwners(Number(e.target.value))}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Onderhoudshistorie
            </label>
            <select
              value={serviceHistory}
              onChange={(e) => setServiceHistory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="">Selecteer onderhoudshistorie</option>
              <option value="Volledig">Volledig</option>
              <option value="Volledig bij merk dealer">Volledig bij merk dealer</option>
              <option value="Gedeeltelijk">Gedeeltelijk</option>
              <option value="Geen">Geen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Garantie
            </label>
            <select
              value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            >
              <option value="3 maanden volledige garantie">3 maanden volledige garantie</option>
              <option value="6 maanden volledige garantie">6 maanden volledige garantie</option>
              <option value="12 maanden volledige garantie">12 maanden volledige garantie</option>
              <option value="24 maanden fabrieksgarantie">24 maanden fabrieksgarantie</option>
              <option value="Geen garantie">Geen garantie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Beschrijving
        </h2>
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
          placeholder="Volledige beschrijving van de occasion..."
        />
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Features & Specificaties
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Voeg feature toe
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. ABS"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold rounded-lg transition-colors"
            >
              + Toevoegen
            </button>
          </div>
        </div>

        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full"
              >
                <span className="text-sm font-semibold text-gray-900">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Voeg extra toe
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExtra())}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. Aftermarket uitlaatsysteem"
            />
            <button
              type="button"
              onClick={addExtra}
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold rounded-lg transition-colors"
            >
              + Toevoegen
            </button>
          </div>
        </div>

        {extras.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {extras.map((extra, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full"
              >
                <span className="text-sm font-semibold text-gray-900">{extra}</span>
                <button
                  type="button"
                  onClick={() => removeExtra(index)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Afbeeldingen
        </h2>
        
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Hoofdafbeelding URL
          </label>
          <input
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            placeholder="/suzuki-hero-v2.png"
          />
          {mainImage && (
            <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={mainImage}
                alt="Hoofdafbeelding preview"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Extra afbeeldingen
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="/suzuki-gsxr-1.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold rounded-lg transition-colors"
            >
              + Toevoegen
            </button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image}
                      alt={`Afbeelding ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full font-bold hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold uppercase text-sm tracking-wider hover:bg-gray-50 transition-colors"
        >
          Annuleren
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Opslaan...' : isEdit ? 'Occasion Bijwerken' : 'Occasion Toevoegen'}
        </button>
      </div>
    </form>
  );
}

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
  const [status, setStatus] = useState<'available' | 'reserved' | 'sold'>(occasion?.status ?? 'available');
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

  // Field-level visibility (stored per field key)
  const defaultVisibility: Record<string, boolean> = {
    year: true, category: true, color: true,
    mileage: true, transmission: true, fuel: true, power: true,
    engine: true, cylinders: true, cooling: true, gears: true,
    finalDrive: true, weight: true, seatHeight: true, tankCapacity: true, topSpeed: true,
    condition: true, owners: true, service_history: true, warranty: true,
    description: true, features: true, extras: true,
  };
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>(
    occasion?.specs?.visible_sections
      ? { ...defaultVisibility, ...occasion.specs.visible_sections }
      : defaultVisibility
  );
  const toggleSection = (key: string) => {
    setVisibleSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Inline eye-toggle component (defined inside render, uses closure over state)
  const EyeToggle = ({ fieldKey }: { fieldKey: string }) => {
    const visible = visibleSections[fieldKey] !== false;
    return (
      <button
        type="button"
        onClick={() => toggleSection(fieldKey)}
        title={visible ? 'Klik om te verbergen op de detailpagina' : 'Klik om zichtbaar te maken op de detailpagina'}
        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-all ${
          visible
            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
            : 'text-gray-400 bg-gray-100 border-gray-200 hover:bg-gray-200'
        }`}
      >
        {visible ? (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
          </svg>
        )}
        {visible ? 'Zichtbaar' : 'Verborgen'}
      </button>
    );
  };

  // Images
  const [mainImage, setMainImage] = useState(occasion?.main_image || '');
  const [images, setImages] = useState<string[]>(occasion?.images || []);
  const [imageInput, setImageInput] = useState('');
  const [uploading, setUploading] = useState(false);

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

  const uploadMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `occasions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setMainImage(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Fout bij uploaden afbeelding');
    } finally {
      setUploading(false);
    }
  };

  const uploadExtraImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `occasions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setImages([...images, publicUrl]);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Fout bij uploaden afbeelding');
    } finally {
      setUploading(false);
    }
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
          visible_sections: visibleSections,
        },
        created_by: user.id,
        updated_by: user.id,
      };

      if (isEdit && occasion) {
        // Update existing occasion
        // Track which fields have been manually changed
        const fieldsToTrack = [
          'brand', 'model', 'year', 'price', 'mileage', 'transmission', 
          'fuel', 'power', 'color', 'category', 'condition', 'owners',
          'service_history', 'warranty', 'description', 'features', 'extras'
        ];
        
        const changedFields: string[] = [];
        fieldsToTrack.forEach(field => {
          const originalValue = occasion[field as keyof typeof occasion];
          const newValue = occasionData[field as keyof typeof occasionData];
          
          // Compare values (handle arrays and objects)
          let hasChanged = false;
          if (Array.isArray(originalValue) && Array.isArray(newValue)) {
            hasChanged = JSON.stringify(originalValue) !== JSON.stringify(newValue);
          } else if (typeof originalValue === 'object' && typeof newValue === 'object') {
            hasChanged = JSON.stringify(originalValue) !== JSON.stringify(newValue);
          } else {
            hasChanged = originalValue !== newValue;
          }
          
          if (hasChanged) {
            changedFields.push(field);
          }
        });
        
        // Get current manual overrides and add new changed fields
        const currentOverrides = (occasion as any).manual_overrides || [];
        const newOverrides = Array.from(new Set([...currentOverrides, ...changedFields]));
        
        // Update occasion with manual_overrides tracking
        const { error: updateError } = await (supabase as any)
          .from('occasions')
          .update({
            ...occasionData,
            manual_overrides: newOverrides,
          })
          .eq('id', occasion.id);

        if (updateError) throw updateError;
        
        // Log audit event
        await fetch('/api/audit/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            resourceType: 'occasion',
            resourceId: occasion.id,
            details: { 
              brand, 
              model, 
              year, 
              changedFields,
              manualOverrides: newOverrides 
            },
          }),
        });
        
        if (changedFields.length > 0) {
          console.log('🔒 Marked fields as manually overridden:', changedFields);
        }
      } else {
        // Insert new occasion
        const { data: newOccasion, error: insertError } = await (supabase as any)
          .from('occasions')
          .insert(occasionData)
          .select()
          .single();

        if (insertError) throw insertError;
        
        // Log audit event
        await fetch('/api/audit/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            resourceType: 'occasion',
            resourceId: newOccasion?.id,
            details: { brand, model, year },
          }),
        });
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

  const handleDelete = async () => {
    if (!isEdit || !occasion) return;
    
    const confirmed = confirm(
      `Weet je zeker dat je "${occasion.brand} ${occasion.model}" wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`
    );
    
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      const { error: deleteError } = await (supabase as any)
        .from('occasions')
        .delete()
        .eq('id', occasion.id);

      if (deleteError) throw deleteError;

      // Log audit event
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          resourceType: 'occasion',
          resourceId: occasion.id,
          details: { brand: occasion.brand, model: occasion.model, year: occasion.year },
        }),
      });

      router.push('/admin/occasions');
      router.refresh();
    } catch (err) {
      console.error('Error deleting occasion:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het verwijderen');
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

          <div className={visibleSections['year'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Jaar *</label>
              <EyeToggle fieldKey="year" />
            </div>
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

          <div className={visibleSections['category'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Categorie</label>
              <EyeToggle fieldKey="category" />
            </div>
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

          <div className={visibleSections['color'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Kleur</label>
              <EyeToggle fieldKey="color" />
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. Mat Zwart"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-8 pt-2">
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

            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-700">Status</span>
              <div className="flex gap-3 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="occasion-status"
                    value="available"
                    checked={status === 'available'}
                    onChange={() => setStatus('available')}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-green-700">Beschikbaar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="occasion-status"
                    value="reserved"
                    checked={status === 'reserved'}
                    onChange={() => setStatus('reserved')}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-sm font-medium text-orange-600">Gereserveerd</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="occasion-status"
                    value="sold"
                    checked={status === 'sold'}
                    onChange={() => setStatus('sold')}
                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-red-600">Verkocht</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-biker-yellow">
          Technische Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={visibleSections['mileage'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Km-stand *</label>
              <EyeToggle fieldKey="mileage" />
            </div>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              required
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div className={visibleSections['transmission'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Transmissie *</label>
              <EyeToggle fieldKey="transmission" />
            </div>
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

          <div className={visibleSections['fuel'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Brandstof *</label>
              <EyeToggle fieldKey="fuel" />
            </div>
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

          <div className={visibleSections['power'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Vermogen *</label>
              <EyeToggle fieldKey="power" />
            </div>
            <input
              type="text"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 125 pk"
            />
          </div>

          <div className={visibleSections['engine'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Motor</label>
              <EyeToggle fieldKey="engine" />
            </div>
            <input
              type="text"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 599cc 4-cilinder"
            />
          </div>

          <div className={visibleSections['cylinders'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Cilinders</label>
              <EyeToggle fieldKey="cylinders" />
            </div>
            <input
              type="text"
              value={cylinders}
              onChange={(e) => setCylinders(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 4"
            />
          </div>

          <div className={visibleSections['cooling'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Koeling</label>
              <EyeToggle fieldKey="cooling" />
            </div>
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

          <div className={visibleSections['gears'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Versnellingen</label>
              <EyeToggle fieldKey="gears" />
            </div>
            <input
              type="text"
              value={gears}
              onChange={(e) => setGears(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 6"
            />
          </div>

          <div className={visibleSections['finalDrive'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Aandrijving</label>
              <EyeToggle fieldKey="finalDrive" />
            </div>
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

          <div className={visibleSections['weight'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Gewicht</label>
              <EyeToggle fieldKey="weight" />
            </div>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 196 kg"
            />
          </div>

          <div className={visibleSections['seatHeight'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Zithoogte</label>
              <EyeToggle fieldKey="seatHeight" />
            </div>
            <input
              type="text"
              value={seatHeight}
              onChange={(e) => setSeatHeight(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 810 mm"
            />
          </div>

          <div className={visibleSections['tankCapacity'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Tankinhoud</label>
              <EyeToggle fieldKey="tankCapacity" />
            </div>
            <input
              type="text"
              value={tankCapacity}
              onChange={(e) => setTankCapacity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Bijv. 17 liter"
            />
          </div>

          <div className={visibleSections['topSpeed'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Topsnelheid</label>
              <EyeToggle fieldKey="topSpeed" />
            </div>
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
          <div className={visibleSections['condition'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Staat</label>
              <EyeToggle fieldKey="condition" />
            </div>
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

          <div className={visibleSections['owners'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Aantal eigenaren</label>
              <EyeToggle fieldKey="owners" />
            </div>
            <input
              type="number"
              value={owners}
              onChange={(e) => setOwners(Number(e.target.value))}
              min="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            />
          </div>

          <div className={visibleSections['service_history'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Onderhoudshistorie</label>
              <EyeToggle fieldKey="service_history" />
            </div>
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

          <div className={visibleSections['warranty'] !== false ? '' : 'opacity-50'}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Garantie</label>
              <EyeToggle fieldKey="warranty" />
            </div>
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
      <div className={`bg-white rounded-lg shadow-md p-6 ${visibleSections['description'] !== false ? '' : 'opacity-60'}`}>
        <div className="flex items-center justify-between pb-3 border-b-2 border-biker-yellow mb-6">
          <h2 className="text-xl font-bold text-gray-900">Beschrijving</h2>
          <EyeToggle fieldKey="description" />
        </div>
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
          Features &amp; Specificaties
        </h2>

        <div className={`mb-4 ${visibleSections['features'] !== false ? '' : 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Voeg feature toe</label>
            <EyeToggle fieldKey="features" />
          </div>
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
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold rounded-lg transition-colors"
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

        <div className={`mb-4 ${visibleSections['extras'] !== false ? '' : 'opacity-60'}`}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Voeg extra toe</label>
            <EyeToggle fieldKey="extras" />
          </div>
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
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold rounded-lg transition-colors"
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
            Hoofdafbeelding
          </label>
          
          <div className="flex gap-3 mb-3">
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={uploadMainImage}
                disabled={uploading}
                className="hidden"
              />
              <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-center cursor-pointer transition-colors disabled:opacity-50">
                {uploading ? 'Uploaden...' : '📁 Upload van computer'}
              </div>
            </label>
          </div>

          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 px-3 text-gray-400 text-sm">OF</span>
            <div className="border-t border-gray-300 my-4"></div>
          </div>

          <input
            type="text"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
            placeholder="Of plak URL: /suzuki-hero-v2.png"
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
          
          <div className="flex gap-3 mb-3">
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={uploadExtraImage}
                disabled={uploading}
                className="hidden"
              />
              <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-center cursor-pointer transition-colors disabled:opacity-50">
                {uploading ? 'Uploaden...' : '📁 Upload van computer'}
              </div>
            </label>
          </div>

          <div className="relative mb-4">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 px-3 text-gray-400 text-sm">OF</span>
            <div className="border-t border-gray-300 my-4"></div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-biker-yellow focus:border-biker-yellow text-biker-black"
              placeholder="Of plak URL: /suzuki-gsxr-1.jpg"
            />
            <button
              type="button"
              onClick={addImage}
              className="px-6 py-3 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold rounded-lg transition-colors"
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
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold uppercase text-sm tracking-wider hover:bg-gray-50 transition-colors"
          >
            Annuleren
          </button>
          
          {isEdit && occasion && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verwijderen...' : 'Verwijderen'}
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow rounded-lg font-bold uppercase text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Opslaan...' : isEdit ? 'Occasion Bijwerken' : 'Occasion Toevoegen'}
        </button>
      </div>
    </form>
  );
}

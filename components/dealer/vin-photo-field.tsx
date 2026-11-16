'use client';

import { useState } from 'react';
import { extractVinFromOcrText } from '@/lib/dealer/vin';

const ACCEPT = 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

export function VinPhotoField({
  vinName = 'vin',
  fileName = 'vin_image',
  vinValue,
  onVinChange,
  onHasPhotoChange,
  variant = 'light',
  disabled,
}: {
  vinName?: string;
  fileName?: string;
  vinValue?: string;
  onVinChange?: (vin: string) => void;
  onHasPhotoChange?: (hasPhoto: boolean) => void;
  variant?: 'light' | 'dark';
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const dark = variant === 'dark';
  const inputClass = dark
    ? 'w-full px-4 py-3 bg-biker-black text-white border-2 border-biker-gray rounded-lg focus:border-biker-yellow focus:outline-none transition-colors disabled:opacity-50'
    : 'w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-biker-black focus:border-biker-yellow focus:outline-none';

  async function handleFile(file: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      setPreview(null);
      setStatus(null);
      onHasPhotoChange?.(false);
      return;
    }
    onHasPhotoChange?.(true);
    setPreview(URL.createObjectURL(file));
    setReading(true);
    setStatus('Framenummer wordt van de foto gelezen…');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const vin = extractVinFromOcrText(data.text || '');
      if (vin) {
        onVinChange?.(vin);
        setStatus(`Framenummer gevonden: ${vin}. Controleer of het klopt.`);
      } else {
        setStatus('Geen framenummer herkend. De foto gaat wel mee; je kunt het nummer ook zelf invullen.');
      }
    } catch (error) {
      console.error('VIN OCR failed:', error);
      setStatus('Foto is toegevoegd. Het nummer zelf invullen is niet nodig, wij lezen het uit de foto.');
    } finally {
      setReading(false);
    }
  }

  return (
    <div className="md:col-span-2 space-y-3">
      <label className="block">
        <span className="block text-sm font-bold uppercase tracking-wider mb-2">
          Framenummer *
        </span>
        <input
          name={onVinChange ? undefined : vinName}
          value={vinValue ?? ''}
          onChange={onVinChange ? (e) => onVinChange(e.target.value.toUpperCase()) : undefined}
          className={inputClass}
          placeholder="VIN / chassisnummer"
          disabled={disabled || reading}
          autoComplete="off"
        />
        {onVinChange && <input type="hidden" name={vinName} value={vinValue || ''} />}
      </label>
      <label
        className={`block rounded-xl border-2 border-dashed px-4 py-4 ${
          dark ? 'border-biker-gray' : 'border-gray-300'
        }`}
      >
        <span className="block text-sm font-bold uppercase tracking-wider mb-2">
          Of foto van kentekenbewijs / frame *
        </span>
        <input
          type="file"
          name={fileName}
          accept={ACCEPT}
          disabled={disabled || reading}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className={`w-full text-sm ${dark ? 'text-biker-light' : 'text-gray-700'}`}
        />
        <span className={`mt-2 block text-sm ${dark ? 'text-biker-light' : 'text-gray-600'}`}>
          Eén van de twee is verplicht: het nummer typen, of een scherpe foto van kentekenbewijs
          of frame. Allebei mag ook. Op je telefoon kun je de camera of de galerij gebruiken.
        </span>
      </label>
      {preview && (
        <img
          src={preview}
          alt="Voorbeeld VIN-foto"
          className="max-h-40 rounded-lg border border-gray-300 object-contain bg-black/20"
        />
      )}
      {status && (
        <p className={`text-sm ${dark ? 'text-biker-yellow' : 'text-gray-700'}`}>{status}</p>
      )}
    </div>
  );
}

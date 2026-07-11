'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteBanner, SiteBannerInsert, SiteBannerUpdate } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface BannerFormProps {
  banner?: SiteBanner | null;
  isEdit?: boolean;
}

export function BannerForm({ banner, isEdit = false }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(banner?.title || '');
  const [message, setMessage] = useState(banner?.message || '');
  const [variant, setVariant] = useState<SiteBanner['variant']>(banner?.variant || 'info');
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [startDate, setStartDate] = useState(banner?.start_date || '');
  const [endDate, setEndDate] = useState(banner?.end_date || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (endDate && startDate && endDate < startDate) {
        throw new Error('De einddatum mag niet vóór de startdatum liggen.');
      }

      const supabase = createClient();

      if (isEdit && banner?.id) {
        const updateData: SiteBannerUpdate = {
          title: title.trim() || null,
          message: message.trim(),
          variant,
          is_active: isActive,
          start_date: startDate || null,
          end_date: endDate || null,
          updated_at: new Date().toISOString(),
        };
        const { error: updateError } = await supabase
          .from('site_banners')
          // @ts-ignore - Supabase client can infer never for this table
          .update(updateData)
          .eq('id', banner.id);
        if (updateError) throw updateError;
      } else {
        const insertData: SiteBannerInsert = {
          title: title.trim() || null,
          message: message.trim(),
          variant,
          is_active: isActive,
          start_date: startDate || null,
          end_date: endDate || null,
        };
        const { error: insertError } = await supabase
          .from('site_banners')
          // @ts-ignore - Supabase client can infer never for this table
          .insert(insertData);
        if (insertError) throw insertError;
      }

      router.push('/admin/banners');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Titel (optioneel)</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bijv. We zijn op vakantie"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <p className="text-xs text-gray-500 mt-1">Wordt vetgedrukt vóór het bericht getoond.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Bericht *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          placeholder="Vertel je bezoekers wat er aan de hand is..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Stijl</label>
        <select
          value={variant}
          onChange={(e) => setVariant(e.target.value as SiteBanner['variant'])}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
        >
          <option value="info">Informatie (geel/zwart)</option>
          <option value="warning">Let op (oranje)</option>
          <option value="success">Positief (groen)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Startdatum (optioneel)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Einddatum (t/m, optioneel)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Laat leeg om zonder datumgrens te tonen. De banner is zichtbaar t/m de einddatum.
      </p>

      <div className="flex items-center gap-3 pt-2">
        <input
          id="is_active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
          Actief (banner tonen op de website)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Opslaan...' : isEdit ? 'Opslaan' : 'Toevoegen'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/banners')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Annuleren
        </button>
      </div>
    </form>
  );
}

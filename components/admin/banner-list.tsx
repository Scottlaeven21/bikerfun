'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SiteBanner } from '@/types';
import { createClient } from '@/lib/supabase/client';

const VARIANT_LABELS: Record<SiteBanner['variant'], string> = {
  info: 'Informatie',
  warning: 'Let op',
  success: 'Positief',
};

function formatDate(value: string | null): string {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

export function BannerList({ banners }: { banners: SiteBanner[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleActive = async (banner: SiteBanner) => {
    setBusyId(banner.id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('site_banners')
        // @ts-ignore - Supabase client can infer never for this table
        .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
        .eq('id', banner.id);
      if (updateError) throw updateError;
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bijwerken mislukt.');
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (banner: SiteBanner) => {
    if (!confirm('Weet je zeker dat je deze banner wilt verwijderen?')) return;
    setBusyId(banner.id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('site_banners')
        .delete()
        .eq('id', banner.id);
      if (deleteError) throw deleteError;
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verwijderen mislukt.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {banners.map((banner) => (
        <div
          key={banner.id}
          className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {banner.is_active ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  Actief
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                  Inactief
                </span>
              )}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {VARIANT_LABELS[banner.variant]}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(banner.start_date)} t/m {formatDate(banner.end_date)}
              </span>
            </div>
            {banner.title && (
              <h3 className="text-lg font-semibold text-gray-900 truncate">{banner.title}</h3>
            )}
            <p className="text-gray-600 line-clamp-2">{banner.message}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleActive(banner)}
              disabled={busyId === banner.id}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
                banner.is_active
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {banner.is_active ? 'Deactiveren' : 'Activeren'}
            </button>
            <Link
              href={`/admin/banners/${banner.id}`}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Bewerken
            </Link>
            <button
              type="button"
              onClick={() => remove(banner)}
              disabled={busyId === banner.id}
              className="px-4 py-2 rounded-lg font-semibold text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
            >
              Verwijderen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

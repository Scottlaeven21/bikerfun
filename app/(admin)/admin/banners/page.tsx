import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { SiteBanner } from '@/types';
import { BannerList } from '@/components/admin/banner-list';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Banners Beheer | Admin',
  description: 'Beheer de meldingsbanner bovenaan de website',
};

export default async function AdminBannersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_banners')
    .select('*')
    .order('created_at', { ascending: false });

  const banners = (data as SiteBanner[] | null) ?? [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
        <Link
          href="/admin/banners/new"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Nieuwe banner
        </Link>
      </div>
      <p className="text-gray-600 mb-8">
        Toon een melding bovenaan de hele website (bijv. vakantie of vertraagde verzending).
        Alleen actieve banners binnen hun datumperiode worden getoond.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Er is een fout opgetreden bij het laden van de banners.
        </div>
      )}

      {banners.length > 0 ? (
        <BannerList banners={banners} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">Nog geen banners aangemaakt.</p>
          <Link
            href="/admin/banners/new"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Maak je eerste banner
          </Link>
        </div>
      )}
    </div>
  );
}

import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { SiteBanner } from '@/types';
import { BannerForm } from '@/components/admin/banner-form';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Banner Bewerken | Admin',
  description: 'Bewerk een meldingsbanner',
};

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: banner } = await supabase
    .from('site_banners')
    .select('*')
    .eq('id', id)
    .single();

  const bannerData = banner as SiteBanner | null;

  if (!bannerData) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/admin/banners"
            className="text-red-600 hover:text-red-800 font-semibold mb-4 inline-block"
          >
            ← Terug naar banners
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner bewerken</h1>
          <p className="text-gray-600">{bannerData.title || bannerData.message}</p>
        </div>
        <BannerForm banner={bannerData} isEdit={true} />
      </div>
    </div>
  );
}

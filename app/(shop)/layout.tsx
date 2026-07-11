import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/cookie-consent';
import { PageTracker } from '@/components/analytics/page-tracker';
import { AnnouncementBanner } from '@/components/layout/announcement-banner';
import { createClient } from '@/lib/supabase/server';
import type { SiteBanner } from '@/types';

async function getActiveBanner(): Promise<SiteBanner | null> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().slice(0, 10);

    const { data } = await supabase
      .from('site_banners')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`)
      .order('created_at', { ascending: false })
      .limit(1);

    return (data?.[0] as SiteBanner | undefined) ?? null;
  } catch {
    return null;
  }
}

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const banner = await getActiveBanner();

  return (
    <div className="min-h-screen flex flex-col">
      <PageTracker />
      {banner && <AnnouncementBanner banner={banner} />}
      <div className="relative flex-1 flex flex-col">
        <NavbarClient user={null} isAdmin={false} />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
}

import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/cookie-consent';
import { PageTracker } from '@/components/analytics/page-tracker';
import { AnnouncementBanner } from '@/components/layout/announcement-banner';
import { getActiveBanner } from '@/lib/supabase/banners';

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

import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/cookie-consent';
import { PageTracker } from '@/components/analytics/page-tracker';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PageTracker />
      <NavbarClient user={null} isAdmin={false} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

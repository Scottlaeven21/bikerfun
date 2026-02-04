import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarClient user={null} isAdmin={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

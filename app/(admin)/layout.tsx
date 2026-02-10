import { NavbarClient } from '@/components/layout/navbar-client';
import { Footer } from '@/components/layout/footer';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin: boolean } | null;

  if (!profile?.is_admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarClient user={user} isAdmin={true} />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/occasions"
                className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                🏍️ Occasions
              </Link>
              <Link
                href="/admin/products"
                className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                📦 Producten
              </Link>
              <Link
                href="/admin/categories"
                className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                🏷️ Categorieën
              </Link>
              <Link
                href="/admin/orders"
                className="block px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                🛒 Bestellingen
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

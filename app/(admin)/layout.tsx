import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';

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
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single();

  const profile = profileData as { is_admin: boolean; full_name: string | null; email: string } | null;

  if (!profile?.is_admin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header */}
      <AdminHeader 
        userName={profile.full_name || profile.email} 
        userEmail={profile.email}
      />
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white min-h-full border-r-2 border-biker-yellow/30 noise-overlay">
          <div className="p-6 relative z-10">
            <h2 className="text-xl font-bold mb-6 text-biker-yellow font-['Inter']">Admin Panel</h2>
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Dashboard</span>
              </Link>
              <Link
                href="/admin/occasions"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Occasions</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Producten</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Categorieën</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Bestellingen</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

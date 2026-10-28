import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-header';
import { isAdmin2faVerified, setAdmin2faCookie, shouldSkipAdmin2fa } from '@/lib/auth/admin-2fa';
import { passwordChangePath } from '@/lib/auth/must-change-password';

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

  const { data: profileData } = await (supabase as any)
    .from('profiles')
    .select('is_admin, full_name, email, must_change_password')
    .eq('id', user.id)
    .single();

  const profile = profileData as {
    is_admin: boolean;
    full_name: string | null;
    email: string;
    must_change_password?: boolean;
  } | null;

  if (!profile?.is_admin) {
    redirect('/');
  }

  if (profile.must_change_password) {
    redirect(passwordChangePath('/admin'));
  }

  if (!(await isAdmin2faVerified(user.id))) {
    if (shouldSkipAdmin2fa()) {
      await setAdmin2faCookie(user.id);
    } else {
      redirect('/login/verify?redirect=/admin');
    }
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
                href="/admin/statistics"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Statistieken</span>
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
              <Link
                href="/admin/dealers"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Dealers</span>
              </Link>
              <Link
                href="/admin/omkeuren"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Omkeuren</span>
              </Link>
              <Link
                href="/admin/inzendingen"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Inzendingen</span>
              </Link>
              <Link
                href="/admin/banners"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Banners</span>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Reviews</span>
              </Link>
              <Link
                href="/admin/sync"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">WooCommerce Sync</span>
              </Link>
              <Link
                href="/admin/audit"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-biker-yellow/20 transition-all group relative"
              >
                <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium group-hover:text-biker-yellow transition-colors">Audit Logs</span>
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

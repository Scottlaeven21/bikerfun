import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mijn Account - Bikerfun',
  description: 'Beheer je Bikerfun account',
};

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/account');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-tight">
          Mijn <span className="text-biker-yellow">Account</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-biker-dark rounded-2xl border-2 border-biker-gray p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-biker-yellow rounded-full flex items-center justify-center text-biker-black text-2xl font-bold uppercase">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-xl font-bold text-white uppercase tracking-tight">
                    {profile?.full_name || 'Gebruiker'}
                  </h2>
                  <p className="text-sm text-biker-light">{user.email}</p>
                </div>
              </div>

              <Link
                href="/api/auth/signout"
                className="btn-secondary block w-full bg-transparent border-2 border-white text-white text-center py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
              >
                Uitloggen
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="bg-biker-dark rounded-2xl border-2 border-biker-gray p-6">
              <h3 style={{ fontFamily: 'var(--font-inter)' }} className="text-lg font-bold text-white mb-4 uppercase tracking-tight">
                Statistieken
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-biker-light">Totaal bestellingen</span>
                  <span className="text-biker-yellow font-bold">{orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-biker-light">Account sinds</span>
                  <span className="text-white font-semibold">
                    {new Date(user.created_at).toLocaleDateString('nl-NL', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders Section */}
            <div className="bg-biker-dark rounded-2xl border-2 border-biker-gray p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-white uppercase tracking-tight">
                  Bestel<span className="text-biker-yellow">geschie</span>denis
                </h2>
                <Link
                  href="/products"
                  className="btn-primary inline-block bg-biker-yellow text-biker-black px-6 py-2 rounded-full font-bold uppercase text-xs tracking-wider transition-all duration-300"
                >
                  Shop Nu
                </Link>
              </div>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-biker-black rounded-xl border border-biker-gray p-5 hover:border-biker-yellow transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm text-biker-light mb-1">
                            Bestelling #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-biker-muted">
                            {new Date(order.created_at).toLocaleDateString('nl-NL', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-biker-yellow">
                            €{order.total.toFixed(2)}
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'completed' 
                              ? 'bg-green-900/30 text-green-400' 
                              : order.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-biker-gray text-biker-light'
                          }`}>
                            {order.status === 'completed' ? 'Voltooid' : 
                             order.status === 'pending' ? 'In behandeling' : order.status}
                          </span>
                        </div>
                      </div>

                      {order.order_items && order.order_items.length > 0 && (
                        <div className="space-y-2">
                          {order.order_items.map((item: any) => (
                            <div key={item.id} className="text-sm text-biker-light">
                              • {item.product?.name || 'Product'} <span className="text-biker-yellow">×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-biker-light mb-6">Je hebt nog geen bestellingen geplaatst</p>
                  <Link
                    href="/products"
                    className="btn-primary inline-block bg-biker-yellow text-biker-black px-8 py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all duration-300"
                  >
                    Start met shoppen
                  </Link>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-biker-dark rounded-2xl border-2 border-biker-gray p-6">
              <h3 style={{ fontFamily: 'var(--font-inter)' }} className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">
                Account <span className="text-biker-yellow">Info</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-biker-light mb-1 uppercase tracking-wider">
                    Naam
                  </label>
                  <p className="text-white">{profile?.full_name || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-biker-light mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-white">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-biker-light mb-1 uppercase tracking-wider">
                    Account type
                  </label>
                  <p className="text-white">
                    {profile?.is_admin ? (
                      <span className="text-biker-yellow">Administrator</span>
                    ) : (
                      'Klant'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

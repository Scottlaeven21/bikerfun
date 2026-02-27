import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import { Order } from '@/types';
import Link from 'next/link';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin overzicht',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalCategories },
    { count: totalOccasions },
    recentOrdersResponse,
  ] = await Promise.all([
    supabase.from('webshop_products').select('*', { count: 'exact', head: true }),
    supabase.from('webshop_orders').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('occasions').select('*', { count: 'exact', head: true }),
    supabase
      .from('webshop_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const recentOrders = recentOrdersResponse.data as Order[] | null;

  // Calculate total revenue from webshop orders
  const { data: paidOrders } = await supabase
    .from('webshop_orders')
    .select('total')
    .eq('payment_status', 'paid');

  const totalRevenue = (paidOrders as Array<{ total: number }> | null)?.reduce((sum, order) => sum + order.total, 0) || 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-['Inter']">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overzicht van je Bikerfun webshop</p>
      </div>

      {/* Analytics Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 text-biker-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Website Statistieken
        </h2>
        <AnalyticsDashboard />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border border-green-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Totale Omzet</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Occasions - Featured */}
        <div className="bg-gradient-to-br from-biker-yellow/10 to-white rounded-xl shadow-lg p-6 border-2 border-biker-yellow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Occasions</p>
              <p className="text-2xl font-bold text-gray-900">{totalOccasions || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-biker-yellow to-yellow-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Bestellingen</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Producten</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1 font-medium">Categorieën</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories || 0}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-biker-yellow/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-biker-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Inter']">Recente Bestellingen</h2>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center space-x-2 text-biker-yellow hover:text-yellow-600 font-semibold transition-colors group"
          >
            <span>Bekijk alles</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="pb-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="pb-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Klant</th>
                  <th className="pb-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Items</th>
                  <th className="pb-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Totaal</th>
                  <th className="pb-3 text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-biker-yellow hover:text-yellow-600 font-semibold hover:underline"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                      <td className="py-4 text-sm font-medium text-gray-900">{order.full_name}</td>
                      <td className="py-4 text-sm text-gray-600">-</td>
                      <td className="py-4 text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 font-medium">Nog geen bestellingen.</p>
          </div>
        )}
      </div>
    </div>
  );
}

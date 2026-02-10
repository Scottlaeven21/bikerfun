import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils/format';
import { Order } from '@/types';
import Link from 'next/link';

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
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('occasions').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const recentOrders = recentOrdersResponse.data as Order[] | null;

  // Calculate total revenue
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('total')
    .eq('payment_status', 'paid');

  const totalRevenue = (paidOrders as Array<{ total: number }> | null)?.reduce((sum, order) => sum + order.total, 0) || 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totale Omzet</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-biker-yellow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Occasions</p>
              <p className="text-2xl font-bold text-gray-900">{totalOccasions || 0}</p>
            </div>
            <div className="text-4xl">🏍️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bestellingen</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders || 0}</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Producten</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts || 0}</p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Categorieën</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories || 0}</p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recente Bestellingen</h2>
          <Link
            href="/admin/orders"
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Bekijk alles →
          </Link>
        </div>

        {recentOrders && recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Klant</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Items</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Totaal</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100">
                    <td className="py-4 text-sm">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-red-600 hover:underline"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                      <td className="py-4 text-sm">{order.full_name}</td>
                      <td className="py-4 text-sm">-</td>
                      <td className="py-4 text-sm font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
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
          <p className="text-gray-600">Nog geen bestellingen.</p>
        )}
      </div>
    </div>
  );
}

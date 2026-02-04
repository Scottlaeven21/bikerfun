import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDate } from '@/lib/utils/format';
import { Order, OrderItem } from '@/types';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Bekijk je bestellingen en account gegevens',
};

type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user orders
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  const orders = data as OrderWithItems[] | null;

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'fulfilled':
        return 'text-indigo-600 bg-indigo-50';
      case 'unfulfilled':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const statusTranslations: Record<string, string> = {
    paid: 'Betaald',
    pending: 'In behandeling',
    failed: 'Mislukt',
    refunded: 'Terugbetaald',
    unfulfilled: 'Nog te verzenden',
    fulfilled: 'Klaar voor verzending',
    shipped: 'Verzonden',
    delivered: 'Afgeleverd',
    cancelled: 'Geannuleerd',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mijn Dashboard</h1>
          <p className="text-gray-600">Welkom terug, {user!.email}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Accountgegevens</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">E-mailadres:</span>
              <span className="font-semibold">{user!.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Totaal bestellingen:</span>
              <span className="font-semibold">{orders?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Mijn Bestellingen</h2>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Bestelling #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(
                          order.payment_status
                        )}`}
                      >
                        {statusTranslations[order.payment_status]}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getFulfillmentStatusColor(
                          order.fulfillment_status
                        )}`}
                      >
                        {statusTranslations[order.fulfillment_status]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.total_price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-lg">Totaal</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  {order.tracking_number && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Track & Trace</p>
                      {order.tracking_url ? (
                        <a
                          href={order.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          {order.tracking_number}
                        </a>
                      ) : (
                        <p className="font-semibold">{order.tracking_number}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Je hebt nog geen bestellingen geplaatst.</p>
              <Link
                href="/products"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start met winkelen
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

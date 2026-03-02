import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bestellingen Beheer',
  description: 'Beheer bestellingen',
};

interface WebshopOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total: number;
  status: string;
  payment_status: string;
  woo_order_id: number | null;
  created_at: string;
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('webshop_orders')
    .select('*')
    .order('created_at', { ascending: false });

  const orders = data as WebshopOrder[] | null;

  const statusTranslations: Record<string, string> = {
    pending: 'In behandeling',
    processing: 'Wordt verwerkt',
    completed: 'Voltooid',
    failed: 'Mislukt',
    cancelled: 'Geannuleerd',
    refunded: 'Terugbetaald',
  };

  const paymentStatusTranslations: Record<string, string> = {
    open: 'Open',
    pending: 'Wacht op betaling',
    paid: 'Betaald',
    failed: 'Mislukt',
    canceled: 'Geannuleerd',
    expired: 'Verlopen',
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Webshop Bestellingen</h1>
        <p className="text-gray-600 mt-2">
          {orders?.length || 0} bestellingen via Mollie checkout
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Er is een fout opgetreden bij het laden van bestellingen.
        </div>
      )}

      {orders && orders.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Bestelnr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Klant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Totaal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Betaling
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    WooCommerce
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('nl-NL', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      €{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : order.payment_status === 'pending' || order.payment_status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {paymentStatusTranslations[order.payment_status] || order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.woo_order_id ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${order.woo_order_id}&action=edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          #{order.woo_order_id} →
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">Niet gesynchroniseerd</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/order-confirmation/${order.id}`}
                        target="_blank"
                        className="text-biker-yellow hover:text-biker-yellowHover font-semibold"
                      >
                        Bekijken
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">Nog geen bestellingen.</p>
        </div>
      )}
    </div>
  );
}

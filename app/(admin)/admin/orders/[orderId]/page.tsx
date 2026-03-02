import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Bestelling Details',
  description: 'Bekijk bestelling details',
};

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_phone: string | null;
  billing_first_name: string;
  billing_last_name: string;
  billing_company: string | null;
  billing_address_1: string;
  billing_address_2: string | null;
  billing_city: string;
  billing_postcode: string;
  billing_country: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_company: string | null;
  shipping_address_1: string;
  shipping_address_2: string | null;
  shipping_city: string;
  shipping_postcode: string;
  shipping_country: string;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  mollie_payment_id: string | null;
  woo_order_id: number | null;
  created_at: string;
  items: OrderItem[];
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('webshop_orders')
    .select(`
      *,
      items:webshop_order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  const orderData = order as unknown as Order;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="text-biker-yellow hover:text-yellow-600 font-semibold"
        >
          ← Terug naar bestellingen
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bestelling #{orderData.order_number}
        </h1>
        <p className="text-gray-600 mt-2">
          {new Date(orderData.created_at).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Producten</h2>
            <div className="divide-y">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="py-4 flex justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Prijs per stuk: €{item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-bold text-gray-900">€{item.subtotal.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 py-4">Geen producten gevonden</p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t-2 border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotaal</span>
                <span>€{orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Verzendkosten</span>
                <span>
                  {orderData.shipping_total === 0
                    ? 'GRATIS'
                    : `€${orderData.shipping_total.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Totaal</span>
                <span>€{orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verzendadres</h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">
                {orderData.shipping_first_name} {orderData.shipping_last_name}
              </p>
              {orderData.shipping_company && (
                <p className="text-gray-600">{orderData.shipping_company}</p>
              )}
              <p>{orderData.shipping_address_1}</p>
              {orderData.shipping_address_2 && <p>{orderData.shipping_address_2}</p>}
              <p>
                {orderData.shipping_postcode} {orderData.shipping_city}
              </p>
              <p>{orderData.shipping_country}</p>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Factuuradres</h2>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">
                {orderData.billing_first_name} {orderData.billing_last_name}
              </p>
              {orderData.billing_company && (
                <p className="text-gray-600">{orderData.billing_company}</p>
              )}
              <p>{orderData.billing_address_1}</p>
              {orderData.billing_address_2 && <p>{orderData.billing_address_2}</p>}
              <p>
                {orderData.billing_postcode} {orderData.billing_city}
              </p>
              <p>{orderData.billing_country}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Betaalstatus</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    orderData.payment_status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {orderData.payment_status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Orderstatus</p>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  {orderData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Klantgegevens</h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{orderData.customer_email}</p>
              </div>
              {orderData.customer_phone && (
                <div>
                  <p className="text-sm text-gray-600">Telefoon</p>
                  <p className="font-medium">{orderData.customer_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Betaling</h2>
            <div className="space-y-2 text-gray-700">
              <div>
                <p className="text-sm text-gray-600">Methode</p>
                <p className="font-medium capitalize">{orderData.payment_method}</p>
              </div>
              {orderData.mollie_payment_id && (
                <div>
                  <p className="text-sm text-gray-600">Mollie Payment ID</p>
                  <p className="font-mono text-xs">{orderData.mollie_payment_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* WooCommerce Sync */}
          {orderData.woo_order_id && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">WooCommerce</h2>
              <a
                href={`${process.env.NEXT_PUBLIC_WOOCOMMERCE_URL}/wp-admin/post.php?post=${orderData.woo_order_id}&action=edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Bekijk in WooCommerce #{orderData.woo_order_id} →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

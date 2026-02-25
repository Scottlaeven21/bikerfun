'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  status: string;
  payment_status: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (response.ok) {
          const { order: orderData } = await response.json();
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <p className="text-gray-600">Laden...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-biker-yellow text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1
            style={{ fontFamily: 'var(--font-inter)' }}
            className="text-4xl md:text-5xl font-bold text-biker-black mb-4 uppercase tracking-tight"
          >
            Bedankt voor je <span className="text-biker-yellow">Bestelling</span>!
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            Je bestelling is succesvol geplaatst en wordt zo snel mogelijk verwerkt.
          </p>
          
          {order && (
            <p className="text-2xl font-bold text-biker-black mb-8">
              Bestelnummer: <span className="text-biker-yellow">#{order.order_number}</span>
            </p>
          )}

          {/* Order Summary */}
          {order && order.items && order.items.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-bold text-biker-black mb-4">Jouw Bestelling</h2>
              <div className="space-y-4 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    {item.product_image && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-biker-black">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-biker-black">
                      €{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotaal</span>
                  <span>€{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Verzendkosten</span>
                  <span>{order.shipping_cost === 0 ? 'GRATIS' : `€${order.shipping_cost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-biker-black pt-2 border-t-2 border-gray-300">
                  <span>Totaal</span>
                  <span>€{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-bold text-biker-black mb-4">Wat gebeurt er nu?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Je ontvangt binnen enkele minuten een bevestigingsmail op <strong>{order?.customer_email}</strong></span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We verwerken je bestelling en bereiden deze voor verzending voor</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-biker-yellow mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Je ontvangt een track & trace code zodra je pakket onderweg is</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="border-t-2 border-gray-200 pt-6">
            <p className="text-gray-600 mb-4">
              Heb je vragen over je bestelling?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Contact Opnemen
              </Link>
              <Link
                href="/products"
                className="bg-white border-2 border-biker-black hover:bg-gray-50 text-biker-black font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Verder Winkelen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { restoreCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    let attempts = 0;

    const checkPaymentStatus = async () => {
      const orderIdParam = searchParams.get('order');
      
      if (!orderIdParam) {
        setStatus('failed');
        return;
      }

      setOrderId(orderIdParam);

      try {
        const response = await fetch(`/api/orders/${orderIdParam}`);
        
        if (!response.ok) {
          setStatus('failed');
          tryRestoreCart();
          return;
        }

        const { order } = await response.json();
        setOrderNumber(order.order_number);

        if (order.payment_status === 'paid') {
          // Payment confirmed — clear the backup and go to confirmation
          sessionStorage.removeItem('bikerfun_cart_backup');
          sessionStorage.removeItem('bikerfun_pending_order');
          setStatus('success');
        } else if (
          order.payment_status === 'failed' ||
          order.payment_status === 'canceled' ||
          order.payment_status === 'expired'
        ) {
          tryRestoreCart();
          setStatus('failed');
        } else {
          // Still pending — poll up to 10 times (20 s)
          attempts++;
          if (attempts < 10) {
            setTimeout(checkPaymentStatus, 2000);
          } else {
            setStatus('failed');
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('failed');
      }
    };

    checkPaymentStatus();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore cart from sessionStorage backup after a failed/cancelled payment
  const tryRestoreCart = () => {
    try {
      const backup = sessionStorage.getItem('bikerfun_cart_backup');
      if (backup) {
        const items = JSON.parse(backup);
        if (typeof restoreCart === 'function') restoreCart(items);
        sessionStorage.removeItem('bikerfun_cart_backup');
        sessionStorage.removeItem('bikerfun_pending_order');
      }
    } catch {
      // ignore
    }
  };

  // Redirect to order confirmation once status is confirmed as success
  useEffect(() => {
    if (status === 'success' && orderId) {
      router.push(`/order-confirmation/${orderId}`);
    }
  }, [status, orderId, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-12 h-12 text-blue-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
            <h1
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-3xl md:text-4xl font-bold text-biker-black mb-4 uppercase"
            >
              Betaling <span className="text-biker-yellow">Verwerken</span>...
            </h1>
            <p className="text-lg text-gray-600">
              Even geduld, we controleren je betaling
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-red-300 text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h1
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-3xl md:text-4xl font-bold text-biker-black mb-4 uppercase"
            >
              Betaling <span className="text-red-600">Mislukt</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Er is iets misgegaan met je betaling. Probeer het opnieuw of neem contact met ons op.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/checkout"
                className="bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Opnieuw Proberen
              </Link>
              <Link
                href="/contact"
                className="bg-white border-2 border-biker-black hover:bg-gray-50 text-biker-black font-bold py-3 px-8 rounded-full uppercase tracking-wider transition-all"
              >
                Contact Opnemen
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

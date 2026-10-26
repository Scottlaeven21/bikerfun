'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import {
  NL_FREE_SHIPPING_MIN,
  SLEUTELHANGERS_PATH,
  formatEuro,
  remainingToFreeNlShipping,
} from '@/lib/shipping/nl-free';

function formatCost(cost: number | null): string {
  if (cost === null) return 'wordt berekend bij afrekenen';
  if (cost === 0) return 'gratis';
  return formatEuro(cost);
}

export function ShippingNote() {
  const { cart, total } = useCart();
  const [nl, setNl] = useState<number | null>(null);
  const [be, setBe] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart.length === 0) return;

    const items = cart.map((item) => ({ id: item.product.id, quantity: item.quantity }));
    const quote = (country: string) =>
      fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal: total, country, items }),
      }).then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.shipping_cost === 'number' ? data.shipping_cost : null;
      });

    setLoading(true);
    Promise.all([quote('NL'), quote('BE')])
      .then(([nlCost, beCost]) => {
        setNl(nlCost);
        setBe(beCost);
      })
      .catch(() => {
        setNl(null);
        setBe(null);
      })
      .finally(() => setLoading(false));
  }, [cart, total]);

  const remaining = remainingToFreeNlShipping(total);
  const showUpsell = !loading && nl !== null && nl > 0 && remaining > 0;

  return (
    <>
      <div className="bg-biker-yellow/10 border-2 border-biker-yellow/30 rounded-xl p-4 mb-4">
        <p className="text-biker-yellow font-bold text-sm">
          {loading
            ? 'Verzendkosten worden berekend…'
            : `Nederland: ${formatCost(nl)}`}
        </p>
        {!loading && remaining <= 0 && (
          <p className="text-sm text-biker-black mt-1 font-semibold">
            Gratis verzending binnen Nederland vanaf {formatEuro(NL_FREE_SHIPPING_MIN)}.
          </p>
        )}
        {showUpsell && (
          <p className="text-sm text-biker-black mt-2 leading-relaxed">
            Nog {formatEuro(remaining)} tot gratis verzending in Nederland
            (vanaf {formatEuro(NL_FREE_SHIPPING_MIN)}).{' '}
            <Link
              href={SLEUTELHANGERS_PATH}
              className="font-bold underline underline-offset-2 hover:text-biker-yellow"
            >
              Gooi er een sleutelhanger bij
            </Link>
            .
          </p>
        )}
        {!loading && !showUpsell && remaining > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            Vanaf {formatEuro(NL_FREE_SHIPPING_MIN)} geen verzendkosten binnen Nederland.
          </p>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-6">
        België: {loading ? 'wordt berekend…' : formatCost(be)}
      </p>
    </>
  );
}

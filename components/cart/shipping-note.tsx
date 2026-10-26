'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/cart-context';

function formatCost(cost: number | null): string {
  if (cost === null) return 'wordt berekend bij afrekenen';
  if (cost === 0) return 'gratis';
  return `€ ${cost.toFixed(2)}`;
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

  return (
    <>
      <div className="bg-biker-yellow/10 border-2 border-biker-yellow/30 rounded-xl p-4 mb-4">
        <p className="text-biker-yellow font-bold text-sm">
          {loading
            ? 'Verzendkosten worden berekend…'
            : `Nederland: ${formatCost(nl)}`}
        </p>
      </div>
      <p className="text-xs text-gray-500 mb-6">
        België: {loading ? 'wordt berekend…' : formatCost(be)}
      </p>
    </>
  );
}

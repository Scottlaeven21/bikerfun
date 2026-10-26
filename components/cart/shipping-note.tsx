'use client';

import { useEffect, useState } from 'react';

interface ShippingLabel {
  alwaysFree?: boolean;
  label: string;
}

export function ShippingNote() {
  const [nl, setNl] = useState<ShippingLabel | null>(null);
  const [be, setBe] = useState<ShippingLabel | null>(null);

  useEffect(() => {
    fetch('/api/shipping/info')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setNl(data.NL);
        setBe(data.BE);
      })
      .catch(() => {
        // Keep fallback copy
      });
  }, []);

  return (
    <>
      <div className="bg-biker-yellow/10 border-2 border-biker-yellow/30 rounded-xl p-4 mb-4">
        <p className="text-biker-yellow font-bold text-sm">
          {nl?.alwaysFree || nl?.label === 'Gratis verzending'
            ? '✓ Gratis verzending binnen Nederland!'
            : `✓ Nederland: ${nl?.label || 'verzending bij afrekenen'}`}
        </p>
      </div>
      <p className="text-xs text-gray-500 mb-6">
        België: {be?.label || 'verzendkosten worden berekend bij afrekenen'}
      </p>
    </>
  );
}

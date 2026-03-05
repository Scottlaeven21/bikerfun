'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartToastProps {
  show: boolean;
  productName: string;
  onClose: () => void;
}

export function CartToast({ show, productName, onClose }: CartToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl border-2 border-biker-yellow p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-biker-black mb-1">
              ✓ Toegevoegd aan winkelwagen!
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
              {productName}
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-full transition-colors"
              >
                Verder winkelen
              </button>
              <Link
                href="/cart"
                className="flex-1 text-xs bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold py-2 px-3 rounded-full transition-all text-center shadow-lg hover:shadow-xl"
              >
                Naar winkelwagen →
              </Link>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

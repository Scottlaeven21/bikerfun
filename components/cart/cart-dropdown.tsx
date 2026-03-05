'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { redirectToCheckout } from '@/lib/woocommerce/cart';

export function CartDropdown() {
  const { cart, itemCount, total, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Je winkelwagen is leeg');
      return;
    }
    
    // Redirect to our checkout page
    window.location.href = '/checkout';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 hover:bg-biker-gray/10 rounded-full transition-colors"
        aria-label="Winkelwagen"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-biker-yellow text-biker-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed md:absolute left-1/2 md:left-auto right-auto md:right-0 -translate-x-1/2 md:translate-x-0 top-20 md:top-auto mt-0 md:mt-2 w-[calc(100%-2rem)] max-w-md md:w-80 bg-white rounded-lg shadow-2xl z-50 border-2 border-gray-200">
          <div className="p-4 border-b-2 border-gray-100">
            <h3 className="font-bold text-lg text-biker-black">
              Winkelwagen ({itemCount})
            </h3>
          </div>

          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Je winkelwagen is leeg</p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="text-biker-yellow hover:text-biker-yellowHover font-semibold"
              >
                Naar webshop
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded border border-gray-200">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0].src}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-biker-black truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-biker-yellow font-bold mt-1">
                          € {parseFloat(item.product.price).toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            Verwijder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="p-4 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-biker-black">Totaal:</span>
                  <span className="font-bold text-xl text-biker-yellow">
                    € {(total || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold py-3 rounded-full uppercase tracking-wider transition-all text-center"
                >
                  Naar Checkout
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Verzendkosten worden berekend bij checkout
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

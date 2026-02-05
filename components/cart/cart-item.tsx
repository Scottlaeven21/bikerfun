'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/hooks/use-cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Product Image */}
      <Link
        href={`/products/${item.product_slug}`}
        className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
      >
        {item.product_image_url ? (
          <Image
            src={item.product_image_url}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">📦</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <Link
            href={`/products/${item.product_slug}`}
            className="font-semibold text-gray-900 hover:text-red-600 transition-colors"
          >
            {item.product_name}
          </Link>
          <p className="text-gray-600 mt-1">{formatPrice(item.unit_price)}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100 transition-all btn-ripple hover:scale-110"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300 min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition-all btn-ripple hover:scale-110"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="min-w-[6rem] text-right font-semibold">
            {formatPrice(item.unit_price * item.quantity)}
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.product_id)}
            className="text-red-600 hover:text-red-800 transition-all hover:scale-110 btn-ripple"
            title="Verwijderen"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

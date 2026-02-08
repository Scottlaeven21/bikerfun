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
    <div className="flex gap-6 p-6">
      {/* Product Image */}
      <Link
        href={`/products/${item.product_slug}`}
        className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white border-2 border-biker-gray hover:border-biker-yellow transition-all"
      >
        {item.product_image_url ? (
          <Image
            src={item.product_image_url}
            alt={item.product_name}
            fill
            className="object-contain p-2"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">📦</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex-1">
          <Link
            href={`/products/${item.product_slug}`}
            className="font-bold text-lg text-white hover:text-biker-yellow transition-colors block mb-2"
          >
            {item.product_name}
          </Link>
          <p className="text-biker-yellow font-bold text-xl">{formatPrice(item.unit_price)}</p>
        </div>

        {/* Quantity Controls & Actions */}
        <div className="flex items-center gap-6">
          {/* Quantity Controls */}
          <div className="flex items-center bg-biker-black rounded-full border-2 border-biker-gray overflow-hidden">
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
              className="px-4 py-2 text-white hover:bg-biker-gray hover:text-biker-yellow transition-all font-bold text-lg"
            >
              -
            </button>
            <span className="px-6 py-2 text-white font-bold text-lg min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
              className="px-4 py-2 text-white hover:bg-biker-gray hover:text-biker-yellow transition-all font-bold text-lg"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="min-w-[7rem] text-right">
            <p className="text-white font-bold text-xl">
              {formatPrice(item.unit_price * item.quantity)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeItem(item.product_id)}
            className="bg-biker-dark hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border-2 border-biker-gray hover:border-red-600 group"
            title="Verwijderen"
          >
            <svg
              className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
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

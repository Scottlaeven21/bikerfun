'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { SupabaseProduct } from '@/lib/supabase/products';

interface AddToCartButtonProps {
  product: SupabaseProduct;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled = false }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Convert Supabase product to WooCommerce format for cart
    const wooProduct = {
      id: product.woo_product_id || 0,
      name: product.name,
      price: product.price.toString(),
      images: product.images,
      stock_status: product.stock_status,
    };
    
    addToCart(wooProduct, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Aantal:</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={disabled || quantity <= 1}
          >
            -
          </button>
          <span className="px-6 py-2 font-semibold min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
            ? 'bg-green-600 text-white'
            : 'bg-biker-yellow hover:bg-biker-yellowHover text-biker-black shadow-lg hover:shadow-xl'
        }`}
      >
        {disabled ? (
          'Niet op voorraad'
        ) : isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Toegevoegd!
          </span>
        ) : (
          <>In winkelwagen</>
        )}
      </button>
    </div>
  );
}

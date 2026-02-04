'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image_url: product.image_url,
      unit_price: product.price,
      quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="font-semibold text-gray-900">
            Aantal:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))
              }
              className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          {added ? '✓ Toegevoegd!' : product.stock === 0 ? 'Uitverkocht' : 'Toevoegen aan winkelwagen'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          Direct kopen
        </button>
      </div>
    </div>
  );
}

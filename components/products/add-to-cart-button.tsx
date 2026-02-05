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
    <div className="space-y-6">
      {/* Quantity Selector */}
      {product.stock > 0 && (
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="font-bold text-white uppercase text-sm tracking-wider">
            Aantal:
          </label>
          <div className="flex items-center border-2 border-biker-gray bg-biker-black rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 text-white hover:bg-biker-gray transition-colors font-bold"
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
              className="w-16 text-center border-x-2 border-biker-gray py-2 bg-biker-black text-white font-bold focus:outline-none focus:ring-2 focus:ring-biker-yellow"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="px-4 py-2 text-white hover:bg-biker-gray transition-colors font-bold"
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
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className={`btn-secondary flex-1 bg-transparent text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? 'bg-biker-yellow text-biker-black border-biker-yellow' : ''
          }`}
        >
          {added ? '✓ Toegevoegd!' : product.stock === 0 ? 'Uitverkocht' : 'Toevoegen'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className="btn-primary flex-1 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Direct kopen
        </button>
      </div>
    </div>
  );
}

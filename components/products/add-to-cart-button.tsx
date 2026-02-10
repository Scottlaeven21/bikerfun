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
          <label htmlFor="quantity" className="font-bold text-biker-black uppercase text-sm tracking-wider">
            Aantal:
          </label>
          <div className="flex items-center border-2 border-gray-300 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn-ripple px-5 py-3 text-biker-black hover:bg-biker-yellow hover:scale-110 transition-all font-bold text-lg"
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
              className="w-16 text-center border-x-2 border-gray-300 py-3 bg-white text-biker-black font-bold focus:outline-none focus:ring-2 focus:ring-biker-yellow transition-all"
            />
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="btn-ripple px-5 py-3 text-biker-black hover:bg-biker-yellow hover:scale-110 transition-all font-bold text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className={`btn-secondary btn-shimmer btn-ripple btn-3d flex-1 bg-transparent text-biker-black px-8 py-4 rounded-full font-bold text-base uppercase tracking-wider transition-all duration-300 border-2 border-biker-black hover:bg-biker-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md ${
            added ? 'bg-green-500 text-white border-green-500 btn-success' : ''
          }`}
        >
          {added ? '✓ Toegevoegd!' : product.stock === 0 ? 'Uitverkocht' : 'Toevoegen aan winkelwagen'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          style={{ fontFamily: 'var(--font-montserrat)' }}
          className="btn-primary btn-shimmer btn-glow btn-3d flex-1 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black px-8 py-4 rounded-full font-bold text-base uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          Direct kopen
        </button>
      </div>
    </div>
  );
}

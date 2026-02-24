'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCart } from '@/contexts/cart-context';

interface WooCommerceProductCardProps {
  product: WooCommerceProduct;
}

export function WooCommerceProductCard({ product }: WooCommerceProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const hasDiscount = product.on_sale && product.sale_price && product.regular_price;
  const discountPercentage = hasDiscount
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  const displayPrice = product.price ? parseFloat(product.price) : 0;
  const isOutOfStock = product.stock_status === 'outofstock';

  // Use first image or placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].src 
    : null;

  const handleViewProduct = () => {
    // Redirect to WooCommerce product page
    window.location.href = product.permalink;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-biker-yellow shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-biker-yellow text-biker-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <span className="bg-biker-black text-white px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t-2 border-gray-100 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-biker-black mb-3 line-clamp-2 text-base">
            {product.name}
          </h3>

          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-biker-black">
              € {displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                € {parseFloat(product.regular_price).toFixed(2)}
              </span>
            )}
          </div>

          {product.stock_quantity && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <p className="text-xs text-biker-yellow font-semibold bg-biker-yellow/10 px-2 py-1 rounded-md inline-block mb-3">
              ⚡ Nog {product.stock_quantity} op voorraad
            </p>
          )}

          {product.stock_status === 'instock' && !product.stock_quantity && (
            <p className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md inline-block mb-3">
              ✓ Op voorraad
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleViewProduct}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-biker-black font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Bekijken
          </button>
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-biker-yellow hover:bg-biker-yellowHover text-biker-black font-bold py-2 px-4 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? '✓ Toegevoegd' : 'Toevoegen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SupabaseProduct } from '@/lib/supabase/products';
import { useCart } from '@/contexts/cart-context';

interface SupabaseProductCardProps {
  product: SupabaseProduct;
}

export function SupabaseProductCard({ product }: SupabaseProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const hasDiscount = product.on_sale && product.sale_price && product.regular_price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.regular_price - product.sale_price!) / product.regular_price) * 100)
    : 0;

  const displayPrice = product.price;
  const isOutOfStock = product.stock_status === 'outofstock';

  // Use first image or placeholder
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].src 
    : null;
  
  if (!imageUrl) {
    console.warn(`Product "${product.name}" (ID: ${product.id}) has no image`);
  }
  
  const showPlaceholder = !imageUrl || imageError;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    // Convert Supabase product to cart format
    const cartProduct = {
      id: product.woo_product_id || parseInt(product.id.substring(0, 8), 16),
      name: product.name,
      price: product.price.toString(),
      images: product.images,
      permalink: `/products/${product.slug}`,
      stock_status: product.stock_status,
      stock_quantity: product.stock_quantity,
    };
    
    addToCart(cartProduct as any, 1);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');

  // If out of stock, show special card
  if (isOutOfStock) {
    return (
      <div className="group bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-300 shadow-lg flex flex-col relative">
        <div className="relative aspect-square overflow-hidden bg-gray-200">
          {showPlaceholder ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-6xl">📦</span>
            </div>
          ) : (
            <Image
              src={imageUrl!}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-6 opacity-40 filter grayscale"
              loading="lazy"
              unoptimized={true}
              onError={() => setImageError(true)}
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
            <div className="text-center">
              <span className="bg-biker-black text-white px-8 py-4 rounded-full font-bold uppercase text-lg tracking-wider shadow-2xl inline-block">
                Uitverkocht
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gray-50 border-t-2 border-gray-200 flex flex-col flex-1">
          <Link href={`/products/${productSlug}`}>
            <h3 className="font-bold text-gray-600 mb-3 line-clamp-2 text-base hover:text-biker-yellow transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          
          <Link
            href={`/products/${productSlug}`}
            className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-4 rounded-full text-center transition-all hover:bg-gray-400 mt-auto"
          >
            Meer Informatie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden border-2 border-gray-200 hover:border-biker-yellow shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      <Link href={`/products/${productSlug}`} className="relative aspect-square overflow-hidden bg-white block">
        {showPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-6xl">📦</span>
          </div>
        ) : (
          <Image
            src={imageUrl!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            unoptimized={true}
            onError={() => {
              console.error('Failed to load image:', imageUrl);
              setImageError(true);
            }}
          />
        )}
        
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-biker-yellow text-biker-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}
      </Link>

      <div className="p-5 bg-white border-t-2 border-gray-100 flex flex-col flex-1">
        <div className="flex-1">
          <Link href={`/products/${productSlug}`}>
            <h3 className="font-bold text-biker-black mb-3 line-clamp-2 text-base hover:text-biker-yellow transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline space-x-2 mb-3">
            <span className="text-2xl font-bold text-biker-black">
              € {displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                € {product.regular_price.toFixed(2)}
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

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow font-bold py-3 px-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide shadow-lg hover:shadow-xl"
        >
          {isAdding ? '✓ Toegevoegd' : 'Toevoegen'}
        </button>
      </div>
    </div>
  );
}

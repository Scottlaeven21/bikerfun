import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden border-2 border-biker-yellow/20 hover:border-biker-yellow shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(245,200,13,0.4)] transition-all transform hover:scale-[1.03] duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {product.image_url ? (
          <Image
            src={product.image_url}
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

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <span className="bg-biker-black text-white px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t-2 border-gray-100">
        <h3 className="font-bold text-biker-black mb-3 line-clamp-2 group-hover:text-biker-yellow transition-colors text-base">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-2xl font-bold text-biker-black">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-biker-yellow font-semibold bg-biker-yellow/10 px-2 py-1 rounded-md inline-block">
            ⚡ Nog {product.stock} op voorraad
          </p>
        )}
      </div>
    </Link>
  );
}

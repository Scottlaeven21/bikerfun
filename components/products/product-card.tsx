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
      className="group bg-white rounded-lg overflow-hidden border-2 border-gray-200 hover:border-biker-yellow hover:shadow-lg transition-all transform hover:scale-[1.02]"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-6xl">📦</span>
          </div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-biker-yellow text-biker-black px-3 py-1 rounded-md text-sm font-bold shadow-lg">
            -{discountPercentage}%
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-white">
        <h3 className="font-bold text-biker-black mb-2 line-clamp-2 group-hover:text-biker-yellow transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-biker-black">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-sm text-biker-yellow mt-2 font-semibold">
            Nog {product.stock} op voorraad
          </p>
        )}
      </div>
    </Link>
  );
}

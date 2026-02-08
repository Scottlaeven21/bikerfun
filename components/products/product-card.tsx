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
      className="group bg-biker-black rounded-lg overflow-hidden hover:ring-2 hover:ring-biker-yellow transition-all transform hover:scale-[1.02]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
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
          <div className="absolute inset-0 bg-biker-black bg-opacity-80 flex items-center justify-center">
            <span className="bg-biker-yellow text-biker-black px-4 py-2 rounded-lg font-bold">
              Uitverkocht
            </span>
          </div>
        )}
      </div>

      <div className="p-4 bg-biker-black">
        <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-biker-yellow transition-colors">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2">
          <span className="text-xl font-bold text-biker-yellow">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-biker-muted line-through">
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

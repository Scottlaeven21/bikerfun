'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { SupabaseProduct } from '@/lib/supabase/products';
import { WooCommerceProduct } from '@/types/woocommerce';

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
    const wooProduct: WooCommerceProduct = {
      id: product.woo_product_id || 0,
      name: product.name,
      slug: product.slug || '',
      permalink: `/products/${product.slug}`,
      type: 'simple',
      status: product.status as 'publish' | 'draft' | 'pending' | 'private',
      featured: product.featured,
      catalog_visibility: 'visible',
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku || '',
      price: product.price.toString(),
      regular_price: product.regular_price.toString(),
      sale_price: product.sale_price?.toString() || '',
      on_sale: product.on_sale,
      purchasable: true,
      total_sales: 0,
      virtual: false,
      downloadable: false,
      downloads: [],
      download_limit: -1,
      download_expiry: -1,
      external_url: '',
      button_text: '',
      tax_status: 'taxable',
      tax_class: '',
      manage_stock: product.manage_stock,
      stock_quantity: product.stock_quantity,
      stock_status: product.stock_status,
      backorders: 'no',
      backorders_allowed: false,
      backordered: false,
      sold_individually: false,
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      shipping_required: true,
      shipping_taxable: true,
      shipping_class: '',
      shipping_class_id: 0,
      reviews_allowed: true,
      average_rating: '0',
      rating_count: 0,
      related_ids: [],
      upsell_ids: [],
      cross_sell_ids: [],
      parent_id: 0,
      categories: product.categories.map(cat => ({ id: 0, name: cat, slug: cat })),
      tags: product.tags.map(tag => ({ id: 0, name: tag, slug: tag })),
      images: product.images.map((img, idx) => ({
        id: idx,
        src: img.src,
        name: img.alt,
        alt: img.alt
      })),
      attributes: [],
      default_attributes: [],
      variations: [],
      grouped_products: [],
      menu_order: 0,
      meta_data: [],
      date_created: product.created_at,
      date_created_gmt: product.created_at,
      date_modified: product.updated_at,
      date_modified_gmt: product.updated_at,
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
        className={`btn-primary w-full py-4 rounded-lg font-bold text-lg transition-all ${
          disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isAdding
            ? 'bg-green-600 text-white'
            : 'bg-biker-yellow hover:bg-biker-black text-biker-black hover:text-biker-yellow border-2 border-biker-yellow shadow-lg hover:shadow-xl'
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

// WooCommerce utility functions

import type { WooCommerceProduct } from '@/types/woocommerce';

/**
 * Note: We don't convert WooCommerce products to Supabase Product type
 * because they are fetched directly from WooCommerce API and displayed.
 * WooCommerce is the source of truth for shop products.
 */

/**
 * Format price in Dutch currency format
 */
export function formatWooPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(numPrice);
}

/**
 * Check if product is in stock
 */
export function isInStock(product: WooCommerceProduct): boolean {
  if (!product.manage_stock) {
    return product.stock_status === 'instock';
  }
  return (product.stock_quantity || 0) > 0;
}

/**
 * Get product main image URL with fallback
 */
export function getProductImage(
  product: WooCommerceProduct,
  size: 'thumbnail' | 'medium' | 'large' | 'full' = 'large'
): string {
  if (product.images.length === 0) {
    return '/images/placeholder-product.jpg';
  }
  return product.images[0].src;
}

/**
 * Get all product images
 */
export function getProductImages(product: WooCommerceProduct): string[] {
  return product.images.map(img => img.src);
}

/**
 * Get product category names
 */
export function getProductCategories(product: WooCommerceProduct): string[] {
  return product.categories.map(cat => cat.name);
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(product: WooCommerceProduct): number | null {
  if (!product.on_sale || !product.regular_price || !product.sale_price) {
    return null;
  }

  const regular = parseFloat(product.regular_price);
  const sale = parseFloat(product.sale_price);

  if (regular <= 0 || sale >= regular) {
    return null;
  }

  return Math.round(((regular - sale) / regular) * 100);
}

/**
 * Check if product is on sale
 */
export function isOnSale(product: WooCommerceProduct): boolean {
  return product.on_sale && !!product.sale_price;
}

/**
 * Get stock status label in Dutch
 */
export function getStockStatusLabel(product: WooCommerceProduct): string {
  if (!product.manage_stock) {
    switch (product.stock_status) {
      case 'instock':
        return 'Op voorraad';
      case 'outofstock':
        return 'Uitverkocht';
      case 'onbackorder':
        return 'Nabestelling mogelijk';
      default:
        return 'Onbekend';
    }
  }

  const quantity = product.stock_quantity || 0;
  if (quantity === 0) {
    return 'Uitverkocht';
  } else if (quantity <= 5) {
    return `Nog ${quantity} op voorraad`;
  } else {
    return 'Op voorraad';
  }
}

/**
 * Build "Add to Cart" URL for WooCommerce
 */
export function getAddToCartUrl(
  wooBaseUrl: string,
  productId: number,
  quantity: number = 1
): string {
  const params = new URLSearchParams({
    'add-to-cart': productId.toString(),
    quantity: quantity.toString(),
  });

  return `${wooBaseUrl}?${params.toString()}`;
}

/**
 * Extract numeric value from price string
 */
export function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.-]+/g, ''));
}

/**
 * Sort products by price
 */
export function sortProductsByPrice(
  products: WooCommerceProduct[],
  order: 'asc' | 'desc' = 'asc'
): WooCommerceProduct[] {
  return [...products].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);
    return order === 'asc' ? priceA - priceB : priceB - priceA;
  });
}

/**
 * Filter products by price range
 */
export function filterProductsByPriceRange(
  products: WooCommerceProduct[],
  minPrice: number,
  maxPrice: number
): WooCommerceProduct[] {
  return products.filter(product => {
    const price = parsePrice(product.price);
    return price >= minPrice && price <= maxPrice;
  });
}

/**
 * Get unique categories from products
 */
export function getUniqueCategories(products: WooCommerceProduct[]): string[] {
  const categories = new Set<string>();
  products.forEach(product => {
    product.categories.forEach(cat => categories.add(cat.name));
  });
  return Array.from(categories).sort();
}

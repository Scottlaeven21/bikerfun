// Product fetching functions with caching
// These are used in Server Components for optimal performance

import { unstable_cache } from 'next/cache';
import { wooCommerce } from './client';
import type { WooCommerceProduct, WooCommerceListParams } from '@/types/woocommerce';

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300;

/**
 * Get all products with caching
 */
export const getCachedProducts = unstable_cache(
  async (params?: WooCommerceListParams) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return [];
      }
      return await wooCommerce.getProducts(params);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },
  ['woocommerce-products'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'products'],
  }
);

/**
 * Get single product with caching
 */
export const getCachedProduct = unstable_cache(
  async (id: number) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return null;
      }
      return await wooCommerce.getProduct(id);
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      return null;
    }
  },
  ['woocommerce-product'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'product'],
  }
);

/**
 * Get product by slug with caching
 */
export const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return null;
      }
      return await wooCommerce.getProductBySlug(slug);
    } catch (error) {
      console.error(`Failed to fetch product by slug ${slug}:`, error);
      return null;
    }
  },
  ['woocommerce-product-by-slug'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'product'],
  }
);

/**
 * Get products by category with caching
 */
export const getCachedProductsByCategory = unstable_cache(
  async (categorySlug: string, params?: WooCommerceListParams) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return [];
      }
      return await wooCommerce.getProductsByCategory(categorySlug, params);
    } catch (error) {
      console.error(`Failed to fetch products for category ${categorySlug}:`, error);
      return [];
    }
  },
  ['woocommerce-products-by-category'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'products', 'category'],
  }
);

/**
 * Get featured products with caching
 */
export const getCachedFeaturedProducts = unstable_cache(
  async (params?: WooCommerceListParams) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return [];
      }
      return await wooCommerce.getFeaturedProducts(params);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      return [];
    }
  },
  ['woocommerce-featured-products'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'products', 'featured'],
  }
);

/**
 * Get sale products with caching
 */
export const getCachedSaleProducts = unstable_cache(
  async (params?: WooCommerceListParams) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return [];
      }
      return await wooCommerce.getSaleProducts(params);
    } catch (error) {
      console.error('Failed to fetch sale products:', error);
      return [];
    }
  },
  ['woocommerce-sale-products'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'products', 'sale'],
  }
);

/**
 * Search products with caching
 */
export const searchCachedProducts = unstable_cache(
  async (query: string, params?: WooCommerceListParams) => {
    try {
      if (!wooCommerce.isConfigured()) {
        console.warn('WooCommerce is not configured');
        return [];
      }
      return await wooCommerce.searchProducts(query, params);
    } catch (error) {
      console.error(`Failed to search products with query "${query}":`, error);
      return [];
    }
  },
  ['woocommerce-search-products'],
  {
    revalidate: CACHE_DURATION,
    tags: ['woocommerce', 'products', 'search'],
  }
);

/**
 * Get categories with caching
 * Returns empty array on any error (never throws)
 */
export const getCachedCategories = async (params?: { per_page?: number; hide_empty?: boolean }) => {
  try {
    if (!wooCommerce.isConfigured()) {
      console.warn('WooCommerce is not configured');
      return [];
    }
    
    const categories = await wooCommerce.getCategories(params);
    return categories || [];
  } catch (error) {
    console.error('Failed to fetch categories from WooCommerce:', error);
    // Retourneer altijd lege array, gooi NOOIT error
    return [];
  }
};

/**
 * Helper: Check if WooCommerce is available
 */
export function isWooCommerceAvailable(): boolean {
  return wooCommerce.isConfigured();
}

/**
 * Helper: Get products with fallback to empty array
 */
export async function getProductsSafe(params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
  try {
    return await getCachedProducts(params);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Helper: Get product with fallback to null
 */
export async function getProductSafe(id: number): Promise<WooCommerceProduct | null> {
  try {
    return await getCachedProduct(id);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

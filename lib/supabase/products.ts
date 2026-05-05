/**
 * Supabase Product Queries
 * Replaces WooCommerce API with direct Supabase queries
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SupabaseProduct {
  id: string;
  woo_product_id: number | null;
  sku: string | null;
  name: string;
  slug: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  sale_price: number | null;
  regular_price: number;
  on_sale: boolean;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  manage_stock: boolean;
  categories: string[];
  tags: string[];
  images: Array<{ src: string; alt: string; id?: string }>;
  status: 'publish' | 'draft' | 'private';
  featured: boolean;
  /** Synced from WooCommerce when available */
  weight?: number | null;
  dimensions?: { length?: number; width?: number; height?: number } | null;
  shipping_class?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get all published products
 */
export async function getAllProducts(limit: number = 100): Promise<SupabaseProduct[]> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('status', 'publish')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  // Filter out occasions/motors (high price products)
  const filtered = data?.filter(product => {
    const isOccasion = product.price > 1000;
    const hasMotorCategory = product.categories?.some((cat: string) => 
      ['Motoren', 'Motors', 'Occasions', 'Bikes'].includes(cat)
    );
    return !isOccasion && !hasMotorCategory;
  }) || [];
  
  return filtered;
}

/**
 * Get a single product by slug, name-derived slug, or UUID.
 * Tries multiple strategies so products with null slugs still work.
 */
export async function getProductBySlug(slug: string): Promise<SupabaseProduct | null> {
  // 1. Exact slug match
  const { data: exact } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .limit(1);
  if (exact && exact.length > 0) return exact[0];

  // 2. Case-insensitive slug match
  const { data: ilike } = await supabase
    .from('webshop_products')
    .select('*')
    .ilike('slug', slug)
    .eq('status', 'publish')
    .limit(1);
  if (ilike && ilike.length > 0) return ilike[0];

  // 3. Name-based match (for products where slug is null in DB)
  //    The card generates: name.toLowerCase().replace(/\s+/g, '-')
  //    We reverse: replace - with space and do a fuzzy match
  const namePattern = `%${slug.replace(/-/g, '%')}%`;
  const { data: byName } = await supabase
    .from('webshop_products')
    .select('*')
    .ilike('name', namePattern)
    .eq('status', 'publish')
    .limit(1);
  if (byName && byName.length > 0) return byName[0];

  // 4. UUID match (if the card used product.id as fallback)
  if (/^[0-9a-f-]{36}$/i.test(slug)) {
    const { data: byId } = await supabase
      .from('webshop_products')
      .select('*')
      .eq('id', slug)
      .eq('status', 'publish')
      .limit(1);
    if (byId && byId.length > 0) return byId[0];
  }

  return null;
}

/**
 * Get products by category (excluding occasions/motors)
 */
export async function getProductsByCategory(category: string, limit: number = 100): Promise<SupabaseProduct[]> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('status', 'publish')
    .contains('categories', [category])
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
  
  // Filter out occasions/motors
  const filtered = data?.filter(product => {
    const isOccasion = product.price > 1000;
    const hasMotorCategory = product.categories?.some((cat: string) => 
      ['Motoren', 'Motors', 'Occasions', 'Bikes'].includes(cat)
    );
    return !isOccasion && !hasMotorCategory;
  }) || [];
  
  return filtered;
}

/**
 * Get featured products (excluding occasions/motors)
 */
export async function getFeaturedProducts(limit: number = 8): Promise<SupabaseProduct[]> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('status', 'publish')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  // Filter out occasions/motors
  const filtered = data?.filter(product => {
    const isOccasion = product.price > 1000;
    const hasMotorCategory = product.categories?.some((cat: string) => 
      ['Motoren', 'Motors', 'Occasions', 'Bikes'].includes(cat)
    );
    return !isOccasion && !hasMotorCategory;
  }) || [];
  
  return filtered;
}

/**
 * Get all unique categories from products
 */
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('categories')
    .eq('status', 'publish');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  // Extract unique categories (filter out occasions/motors)
  const excludedCategories = ['Alles', 'All', 'Motoren', 'Motors', 'Occasions', 'Bikes'];
  const allCategories = new Set<string>();
  
  data?.forEach(product => {
    product.categories?.forEach((cat: string) => {
      if (cat && !excludedCategories.includes(cat)) {
        allCategories.add(cat);
      }
    });
  });
  
  return Array.from(allCategories).sort();
}

/**
 * Search products by name/description
 */
export async function searchProducts(query: string, limit: number = 50): Promise<SupabaseProduct[]> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('status', 'publish')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error searching products:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Get product count
 */
export async function getProductCount(): Promise<number> {
  const { count, error } = await supabase
    .from('webshop_products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'publish');
  
  if (error) {
    console.error('Error counting products:', error);
    return 0;
  }
  
  return count || 0;
}

function filterShopProducts(products: SupabaseProduct[]): SupabaseProduct[] {
  return products.filter((product) => {
    const isOccasion = product.price > 1000;
    const hasMotorCategory = product.categories?.some((cat: string) =>
      ['Motoren', 'Motors', 'Occasions', 'Bikes'].includes(cat)
    );
    return !isOccasion && !hasMotorCategory;
  });
}

/**
 * Related products (same categories) + cross-sell pool (featured), excluding current product.
 */
export async function getProductRecommendations(
  excludeProductId: string,
  categories: string[],
  relatedLimit = 4,
  crossSellLimit = 4
): Promise<{ related: SupabaseProduct[]; crossSell: SupabaseProduct[] }> {
  const pool = filterShopProducts(await getAllProducts(400));

  const others = pool.filter((p) => p.id !== excludeProductId);

  const scored = others
    .map((p) => ({
      product: p,
      score: p.categories.filter((c) => categories.includes(c)).length,
    }))
    .sort((a, b) => b.score - a.score || (b.product.featured ? 1 : 0) - (a.product.featured ? 1 : 0));

  const related: SupabaseProduct[] = [];
  const seen = new Set<string>();

  for (const { product } of scored) {
    if (related.length >= relatedLimit) break;
    if (seen.has(product.id)) continue;
    related.push(product);
    seen.add(product.id);
  }

  const featuredPool = others.filter((p) => p.featured && !seen.has(p.id));
  const crossSell: SupabaseProduct[] = [];
  for (const p of featuredPool) {
    if (crossSell.length >= crossSellLimit) break;
    crossSell.push(p);
    seen.add(p.id);
  }

  if (crossSell.length < crossSellLimit) {
    for (const { product } of scored) {
      if (crossSell.length >= crossSellLimit) break;
      if (seen.has(product.id)) continue;
      crossSell.push(product);
      seen.add(product.id);
    }
  }

  return { related, crossSell };
}

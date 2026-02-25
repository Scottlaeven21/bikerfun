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
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<SupabaseProduct | null> {
  const { data, error } = await supabase
    .from('webshop_products')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'publish')
    .single();
  
  if (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
  
  return data;
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

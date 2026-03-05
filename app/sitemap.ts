import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  const supabase = await createClient();
  
  // Fetch all occasions for dynamic URLs
  const { data: occasions } = await supabase
    .from('occasions')
    .select('id, updated_at')
    .eq('status', 'available')
    .order('updated_at', { ascending: false });

  const occasionsData = (occasions as Pick<Occasion, 'id' | 'updated_at'>[]) || [];

  // Fetch all products for dynamic URLs
  const { data: products } = await supabase
    .from('webshop_products')
    .select('slug, updated_at')
    .eq('status', 'publish')
    .order('updated_at', { ascending: false });

  const productsData = (products as { slug: string; updated_at: string }[]) || [];

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('name', { ascending: true });

  const categoriesData = (categories as { slug: string; updated_at: string }[]) || [];

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/occasions`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/verzending`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/voorwaarden`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic occasion pages
  const occasionPages: MetadataRoute.Sitemap = occasionsData.map((occasion) => ({
    url: `${baseUrl}/occasions/${occasion.id}`,
    lastModified: new Date(occasion.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic product pages
  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages (as query parameters)
  const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category.slug)}`,
    lastModified: new Date(category.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...occasionPages, ...productPages, ...categoryPages];
}

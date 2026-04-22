import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  const supabase = await createClient();
  
  // Fetch all occasions for dynamic URLs (available + reserved have public pages)
  const { data: occasions } = await supabase
    .from('occasions')
    .select('id, updated_at, status')
    .in('status', ['available', 'reserved'])
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  const occasionsData = (occasions as Pick<Occasion, 'id' | 'updated_at'>[]) || [];

  // Fetch all products for dynamic URLs
  const { data: products } = await supabase
    .from('webshop_products')
    .select('slug, updated_at')
    .eq('status', 'publish')
    .order('updated_at', { ascending: false });

  const productsData = (products as { slug: string; updated_at: string }[]) || [];

  // Fetch all products to get unique categories
  const { data: productsForCategories } = await supabase
    .from('webshop_products')
    .select('categories, updated_at')
    .eq('status', 'publish');

  const productsForCategoriesData = (productsForCategories as { categories: string[]; updated_at: string }[]) || [];

  // Extract unique categories
  const excludedCategories = ['Alles', 'All', 'Motoren', 'Motors', 'Occasions', 'Bikes'];
  const categorySet = new Map<string, string>();
  
  productsForCategoriesData.forEach(product => {
    product.categories?.forEach((cat: string) => {
      if (cat && !excludedCategories.includes(cat)) {
        const slug = cat.toLowerCase().replace(/\s+/g, '-');
        if (!categorySet.has(slug) || product.updated_at > categorySet.get(slug)!) {
          categorySet.set(slug, product.updated_at);
        }
      }
    });
  });

  const categoriesData = Array.from(categorySet.entries()).map(([slug, updated_at]) => ({
    slug,
    updated_at,
  }));

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
    {
      url: `${baseUrl}/motor-op-aanvraag`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic occasion pages
  const occasionPages: MetadataRoute.Sitemap = occasionsData.map((occasion) => ({
    url: `${baseUrl}/occasions/${occasion.id}`,
    lastModified: new Date(occasion.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic product pages — exclude slugs that are also category slugs (category takes priority in routing)
  const categorySlugs = new Set(categoriesData.map((c) => c.slug));
  const productPages: MetadataRoute.Sitemap = productsData
    .filter((product) => product.slug && product.slug.trim() !== '' && !categorySlugs.has(product.slug))
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Category pages (as dedicated URLs)
  const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: new Date(category.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...occasionPages, ...productPages, ...categoryPages];
}

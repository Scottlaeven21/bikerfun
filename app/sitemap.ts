import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Occasion } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bikerfun.nl';
  
  // Fetch all occasions for dynamic URLs
  const supabase = await createClient();
  const { data: occasions } = await supabase
    .from('occasions')
    .select('id, updated_at')
    .eq('status', 'available')
    .order('updated_at', { ascending: false });

  const occasionsData = (occasions as Pick<Occasion, 'id' | 'updated_at'>[]) || [];

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
      url: `${baseUrl}/webshop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
  ];

  // Dynamic occasion pages
  const occasionPages: MetadataRoute.Sitemap = occasionsData.map((occasion) => ({
    url: `${baseUrl}/occasions/${occasion.id}`,
    lastModified: new Date(occasion.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...occasionPages];
}

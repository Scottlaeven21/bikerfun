/**
 * Public site banner query.
 *
 * Uses the anon Supabase client (NOT the cookie-based server client) so that
 * pages using it are not forced into per-request dynamic rendering. The result
 * is cached to avoid hitting the database on every page view, and a short
 * timeout guarantees page rendering is never blocked by a slow/unreachable DB.
 */

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { SiteBanner } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const publicClient = createClient(supabaseUrl, supabaseKey);

export const SITE_BANNER_CACHE_TAG = 'site-banner';

async function fetchActiveBanner(): Promise<SiteBanner | null> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await publicClient
    .from('site_banners')
    .select('*')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return null;
  return (data?.[0] as SiteBanner | undefined) ?? null;
}

export const getActiveBanner = unstable_cache(
  async (): Promise<SiteBanner | null> => {
    try {
      return await Promise.race([
        fetchActiveBanner(),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
      ]);
    } catch {
      return null;
    }
  },
  ['active-site-banner'],
  { revalidate: 60, tags: [SITE_BANNER_CACHE_TAG] }
);

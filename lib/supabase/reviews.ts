import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import type { ReviewSettings, SiteReview } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const publicClient = createClient(supabaseUrl, supabaseKey);

export const REVIEWS_CACHE_TAG = 'site-reviews';

const DEFAULT_GOOGLE_URL =
  'https://www.google.nl/search?q=bikerfun&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_8gyC0rTtSmLJNjwf_0P8Zgv-oK4ZO2iIPyAWdfc7vGBuzmS2kjxSKeonGahwLRn4sRgIqs%3D&uds=AJ5uw1-CsN_VmOWvV4nQCD6b3IOKEoAIaIAYgoXXwOoqSRP6Qe-Vwn507Kk-kQ8kzV7WWE_fjN6hbQI9Ju4wJhmSX57fw0RtAXvWLjTWH4NTUJZjxHxlR5U&sa=X';

export const FALLBACK_REVIEW_SETTINGS: ReviewSettings = {
  id: 1,
  overall_score: 4.8,
  review_count: 6,
  google_url: DEFAULT_GOOGLE_URL,
  updated_at: new Date().toISOString(),
};

export const FALLBACK_REVIEWS: SiteReview[] = [
  {
    id: 'fallback-1',
    author: 'Lars Gelissen',
    body: 'Ik heb onlangs een Yamaha R6 uit 2002 gekocht bij Bikerfun en ben ontzettend tevreden over de service! De motor kon ik voor een hele mooie prijs meenemen.',
    rating: 5,
    date_label: '3 maanden geleden',
    is_verified: true,
    is_active: true,
    sort_order: 1,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-2',
    author: 'Duncan Boek',
    body: 'Afspraak maken ging makkelijk en was flexibel met zijn openingstijden. De verkoper weet echt waar hij het over heeft, communiceert snel en vriendelijk. Erg tevreden!',
    rating: 5,
    date_label: '1 maand geleden',
    is_verified: true,
    is_active: true,
    sort_order: 2,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-3',
    author: 'Kylian Bogers',
    body: '3 maanden geleden hier mijn motor gekocht en ik ben op alle vlakken super tevreden. Super snelle en professionele service. Een paar weken geleden iets voor motor nodig gehad en werd direct geholpen!',
    rating: 5,
    date_label: '3 maanden geleden',
    is_verified: true,
    is_active: true,
    sort_order: 3,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-4',
    author: 'Eelko ten Wolde',
    body: 'Ik kwam kijken voor een R6 voor mijn zoon en die heb ik ook gekocht. De eigenaar is een ambitieuze jonge man die weet waar hij het over heeft. Mooie motoren voor een realistische prijs. Die gaat het nog ver schoppen!',
    rating: 5,
    date_label: '4 maanden geleden',
    is_verified: true,
    is_active: true,
    sort_order: 4,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-5',
    author: 'Tim Wagner',
    body: 'Hier een helmcover besteld. Snel en netjes geholpen. Prima kwaliteit. Gewoon lekker mee cruisen, krijg je veel leuke interactie. Oja gebruik de instructies de eerste keer! Het past.',
    rating: 5,
    date_label: '8 maanden geleden',
    is_verified: true,
    is_active: true,
    sort_order: 5,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'fallback-6',
    author: 'Boran',
    body: 'Fantastische service bij BikerFun! Mijn Yamaha R6 laten omkeuren naar 35kW – alles is vlot verlopen en binnen 2 weken waren de papieren in orde. Zeker aan te raden, ook super goede A2 motoren te koop!',
    rating: 5,
    date_label: '8 maanden geleden',
    is_verified: true,
    is_active: true,
    sort_order: 6,
    created_at: '',
    updated_at: '',
  },
];

async function fetchReviewSettings(): Promise<ReviewSettings> {
  const { data, error } = await publicClient
    .from('review_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();
  if (error || !data) return FALLBACK_REVIEW_SETTINGS;
  return data as ReviewSettings;
}

async function fetchActiveReviews(): Promise<SiteReview[]> {
  const { data, error } = await publicClient
    .from('site_reviews')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_REVIEWS;
  return data as SiteReview[];
}

export const getReviewSettings = unstable_cache(
  async (): Promise<ReviewSettings> => {
    try {
      return await Promise.race([
        fetchReviewSettings(),
        new Promise<ReviewSettings>((resolve) =>
          setTimeout(() => resolve(FALLBACK_REVIEW_SETTINGS), 2500)
        ),
      ]);
    } catch {
      return FALLBACK_REVIEW_SETTINGS;
    }
  },
  ['review-settings'],
  { revalidate: 60, tags: [REVIEWS_CACHE_TAG] }
);

export const getActiveReviews = unstable_cache(
  async (): Promise<SiteReview[]> => {
    try {
      return await Promise.race([
        fetchActiveReviews(),
        new Promise<SiteReview[]>((resolve) =>
          setTimeout(() => resolve(FALLBACK_REVIEWS), 2500)
        ),
      ]);
    } catch {
      return FALLBACK_REVIEWS;
    }
  },
  ['active-site-reviews'],
  { revalidate: 60, tags: [REVIEWS_CACHE_TAG] }
);

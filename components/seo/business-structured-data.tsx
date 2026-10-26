import { getOrganizationSchema, getLocalBusinessSchema } from '@/lib/seo/structured-data';
import { getReviewSettings } from '@/lib/supabase/reviews';

export async function BusinessStructuredData() {
  const settings = await getReviewSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getLocalBusinessSchema({
              ratingValue: settings.overall_score,
              reviewCount: settings.review_count,
            })
          ),
        }}
      />
    </>
  );
}

import type { ReviewSettings, SiteReview } from '@/types';

function Stars({ count, size = 'md' }: { count: number; size?: 'sm' | 'md' }) {
  const className = size === 'sm' ? 'w-3.5 h-3.5 md:w-5 md:h-5' : 'w-6 h-6';
  return (
    <div className="flex text-biker-yellow">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={className}
          fill={i < count ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill={i < count ? 'currentColor' : 'none'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsSection({
  settings,
  reviews,
}: {
  settings: ReviewSettings;
  reviews: SiteReview[];
}) {
  const score = Number(settings.overall_score).toFixed(1);
  const googleUrl = settings.google_url || '#';

  return (
    <section className="py-20 bg-black noise-overlay border-t-2 border-biker-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 style={{ fontFamily: 'var(--font-inter)' }} className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
            Wat Klanten Over <span className="text-biker-yellow">Ons Zeggen</span>
          </h2>
          <p className="text-lg md:text-xl text-biker-light max-w-3xl mx-auto">
            Lees de ervaringen van onze tevreden klanten. Echte reviews van Google.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Stars count={Math.round(Number(settings.overall_score))} />
            <span className="text-biker-light font-bold">
              {score} uit 5 sterren
              {settings.review_count > 0 && (
                <span className="text-biker-muted font-normal"> ({settings.review_count} reviews)</span>
              )}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-biker-dark rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-biker-gray hover:border-biker-yellow transition-all"
            >
              <div className="flex items-center justify-between gap-1 mb-2 md:mb-4">
                <Stars count={review.rating} size="sm" />
                {review.date_label && (
                  <span className="text-[10px] md:text-xs text-biker-muted shrink-0">{review.date_label}</span>
                )}
              </div>
              <h3 className="font-bold text-white text-sm md:text-base mb-1.5 md:mb-2">{review.author}</h3>
              <p className="text-biker-light text-xs md:text-sm leading-relaxed">{review.body}</p>
              {review.is_verified && (
                <div className="mt-2 md:mt-4 flex items-center space-x-1.5 md:space-x-2">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-biker-yellow shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className="text-[10px] md:text-xs text-biker-muted">Geverifieerde aankoop</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-biker-light mb-6">Bekijk al onze reviews op Google</p>
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className="btn-secondary inline-block bg-transparent text-white px-12 py-4 rounded-full text-base font-bold uppercase tracking-wider transition-all duration-300 border-2 border-white"
          >
            Meer reviews op Google
          </a>
        </div>
      </div>
    </section>
  );
}

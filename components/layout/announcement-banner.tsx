import type { SiteBanner } from '@/types';

const VARIANT_STYLES: Record<SiteBanner['variant'], string> = {
  info: 'bg-biker-yellow text-biker-black',
  warning: 'bg-orange-500 text-white',
  success: 'bg-green-600 text-white',
};

export function AnnouncementBanner({ banner }: { banner: SiteBanner }) {
  return (
    <div
      role="status"
      className={`relative z-[60] w-full ${VARIANT_STYLES[banner.variant]}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-center text-sm sm:text-base">
        {banner.title && (
          <span className="font-bold">{banner.title}</span>
        )}
        {banner.title && <span className="mx-2 hidden sm:inline">·</span>}
        <span className={banner.title ? 'block sm:inline mt-0.5 sm:mt-0' : ''}>
          {banner.message}
        </span>
      </div>
    </div>
  );
}

import { SkeletonOccasionsGrid } from '@/components/loading/skeleton-occasion-card';

export default function OccasionsLoading() {
  return (
    <div className="min-h-screen bg-black text-white noise-overlay">
      {/* Hero Section (Static) */}
      <section className="relative isolate h-[48vh] min-h-[280px] overflow-hidden bg-biker-dark">
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white uppercase tracking-tight drop-shadow-lg animate-pulse">
              ONS <span className="text-biker-yellow">AANBOD</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
              Laden...
            </p>
          </div>
        </div>
      </section>

      {/* Occasions List Skeleton */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-biker-gray/30 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-6 bg-biker-gray/30 rounded w-48 animate-pulse"></div>
          </div>

          {/* Filter Controls Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-4">
            <div className="h-12 bg-biker-gray/30 rounded-full w-40 animate-pulse"></div>
            <div className="h-12 bg-biker-gray/30 rounded-lg w-60 animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <SkeletonOccasionsGrid count={6} />
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-biker-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 bg-biker-gray/30 rounded w-96 mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 bg-biker-gray/30 rounded w-full max-w-2xl mx-auto mb-10 animate-pulse"></div>
          <div className="h-14 bg-biker-gray/30 rounded-full w-64 mx-auto animate-pulse"></div>
        </div>
      </section>
    </div>
  );
}

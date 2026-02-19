export function SkeletonOccasionCard() {
  return (
    <div className="bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-[300px] bg-biker-gray/30"></div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Brand & Model */}
        <div className="mb-4">
          <div className="h-3 bg-biker-gray/30 rounded w-20 mb-2"></div>
          <div className="h-7 bg-biker-gray/30 rounded w-3/4"></div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="h-8 bg-biker-gray/30 rounded w-32"></div>
        </div>

        {/* Specs Grid - 2x3 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-biker-gray/30 rounded"></div>
              <div className="h-4 bg-biker-gray/30 rounded flex-1"></div>
            </div>
          ))}
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-biker-gray/30 rounded-full w-20"></div>
          ))}
        </div>

        {/* Button */}
        <div className="h-12 bg-biker-gray/30 rounded-full w-full"></div>
      </div>
    </div>
  );
}

export function SkeletonOccasionsGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonOccasionCard key={i} />
      ))}
    </div>
  );
}

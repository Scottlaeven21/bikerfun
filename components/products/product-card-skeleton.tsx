export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        
        {/* Categories */}
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Price */}
        <div className="h-8 bg-gray-200 rounded w-24"></div>

        {/* Button */}
        <div className="h-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

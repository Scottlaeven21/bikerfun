import { ProductGridSkeleton } from './product-card-skeleton';

export function ProductsLoading() {
  return (
    <div className="space-y-8">
      {/* Search Bar Skeleton */}
      <div className="max-w-2xl mx-auto">
        <div className="h-14 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      {/* Category Pills Skeleton */}
      <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-2 md:gap-3 px-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full animate-pulse w-full md:w-32"></div>
        ))}
      </div>

      {/* Filter Button Skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Products Grid Skeleton */}
      <ProductGridSkeleton count={8} />
    </div>
  );
}

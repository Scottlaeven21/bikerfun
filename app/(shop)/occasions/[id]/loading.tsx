export default function OccasionDetailLoading() {
  return (
    <div className="min-h-screen bg-black noise-overlay text-white">
      {/* Back Button Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="h-12 bg-biker-gray/30 rounded-full w-32 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery Skeleton */}
          <div>
            <div className="relative w-full h-[500px] bg-biker-gray/30 rounded-2xl overflow-hidden animate-pulse mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative w-full h-24 bg-biker-gray/30 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div>
            {/* Title */}
            <div className="h-4 bg-biker-gray/30 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-10 bg-biker-gray/30 rounded w-3/4 mb-8 animate-pulse"></div>

            {/* Price */}
            <div className="h-12 bg-biker-gray/30 rounded w-48 mb-8 animate-pulse"></div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-biker-dark rounded-xl p-4 border-2 border-biker-gray">
                  <div className="h-4 bg-biker-gray/30 rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-biker-gray/30 rounded w-24 animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="h-6 bg-biker-gray/30 rounded w-32 mb-4 animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-biker-gray/30 rounded-full w-24 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="h-6 bg-biker-gray/30 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-biker-gray/30 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-biker-gray/30 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-biker-gray/30 rounded w-4/6 animate-pulse"></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-14 bg-biker-gray/30 rounded-full flex-1 animate-pulse"></div>
              <div className="h-14 bg-biker-gray/30 rounded-full flex-1 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-black noise-overlay">
      {/* Hero Skeleton */}
      <section className="relative h-screen bg-biker-dark animate-pulse">
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
            <div className="max-w-4xl">
              <div className="h-16 bg-biker-gray/30 rounded w-3/4 mb-8"></div>
              <div className="h-6 bg-biker-gray/30 rounded w-1/2 mb-12"></div>
              <div className="flex gap-4">
                <div className="h-14 bg-biker-gray/30 rounded-full w-48"></div>
                <div className="h-14 bg-biker-gray/30 rounded-full w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Occasions Section Skeleton */}
      <section className="py-20 bg-black">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-12 bg-biker-gray/30 rounded w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-biker-gray/30 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
          </div>
          
          {/* Carousel Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-biker-dark rounded-2xl overflow-hidden border-2 border-biker-gray animate-pulse">
                <div className="relative w-full h-64 bg-biker-gray/30"></div>
                <div className="p-6">
                  <div className="h-4 bg-biker-gray/30 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-biker-gray/30 rounded w-full mb-4"></div>
                  <div className="h-8 bg-biker-gray/30 rounded w-32 mb-4"></div>
                  <div className="h-12 bg-biker-gray/30 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

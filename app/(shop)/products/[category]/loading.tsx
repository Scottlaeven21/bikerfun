import { ProductsLoading } from '@/components/products/products-loading';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';

export default function CategoryLoadingPage() {
  return (
    <WhiteBackgroundWrapper>
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-full max-w-3xl mx-auto animate-pulse"></div>
            
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              <span className="text-gray-300">/</span>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <span className="text-gray-300">/</span>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Products Loading */}
          <ProductsLoading />
        </div>
      </div>
    </WhiteBackgroundWrapper>
  );
}

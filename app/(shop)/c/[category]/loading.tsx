import { ProductsLoading } from '@/components/products/products-loading';
import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';

export default function Loading() {
  return (
    <WhiteBackgroundWrapper>
      <div className="min-h-screen bg-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse mb-6" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse" />
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <span className="text-gray-300">/</span>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <span className="text-gray-300">/</span>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <ProductsLoading />
        </div>
      </div>
    </WhiteBackgroundWrapper>
  );
}

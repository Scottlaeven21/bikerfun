import { WhiteBackgroundWrapper } from '@/components/white-background-wrapper';
import { ProductsLoading } from '@/components/products/products-loading';

export default function Loading() {
  return (
    <WhiteBackgroundWrapper>
      <div className="min-h-screen bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 
              style={{ fontFamily: 'var(--font-inter)' }}
              className="text-4xl md:text-5xl font-bold text-biker-black mb-6 uppercase tracking-tight"
            >
              Onze <span className="text-biker-yellow">Webshop</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Ontdek onze premium motor gear en accessoires
            </p>
          </div>

          {/* Loading Skeleton */}
          <ProductsLoading />
        </div>
      </div>
    </WhiteBackgroundWrapper>
  );
}

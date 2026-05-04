import { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export const metadata: Metadata = {
  title: 'Checkout | Bikerfun',
  description: 'Rond je bestelling af',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white pt-28 sm:pt-32 pb-12 px-1 sm:px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          style={{ fontFamily: 'var(--font-inter)' }}
          className="text-4xl md:text-5xl font-bold text-biker-black mb-8 uppercase tracking-tight text-center"
        >
          <span className="text-biker-yellow">Checkout</span>
        </h1>
        
        <CheckoutForm />
      </div>
    </div>
  );
}

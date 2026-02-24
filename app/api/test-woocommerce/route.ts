import { NextResponse } from 'next/server';
import { wooCommerce } from '@/lib/woocommerce/client';

export async function GET() {
  try {
    // Test if WooCommerce is configured
    const isConfigured = wooCommerce.isConfigured();
    
    if (!isConfigured) {
      return NextResponse.json({
        success: false,
        error: 'WooCommerce is not configured. Check environment variables.',
        config: {
          url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'NOT SET',
          hasConsumerKey: !!process.env.WOOCOMMERCE_CONSUMER_KEY,
          hasConsumerSecret: !!process.env.WOOCOMMERCE_CONSUMER_SECRET,
        }
      }, { status: 500 });
    }

    // Try to fetch products
    const products = await wooCommerce.getProducts({ per_page: 5 });
    
    return NextResponse.json({
      success: true,
      message: 'WooCommerce API is working!',
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        status: p.status,
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}

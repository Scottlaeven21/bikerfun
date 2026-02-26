import { NextResponse } from 'next/server';
import { wooClient } from '@/lib/woocommerce/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Test WooCommerce API Connection
 * 
 * This endpoint tests if:
 * - WooCommerce API credentials are configured
 * - admin.bikerfun.nl is accessible
 * - API authentication works
 * - Products can be fetched
 */
export async function GET() {
  try {
    console.log('🧪 Testing WooCommerce API connection...');

    // Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
    const hasKey = !!process.env.WOOCOMMERCE_CONSUMER_KEY;
    const hasSecret = !!process.env.WOOCOMMERCE_CONSUMER_SECRET;

    if (!hasUrl || !hasKey || !hasSecret) {
      return NextResponse.json({
        success: false,
        error: 'Missing WooCommerce environment variables',
        config: {
          NEXT_PUBLIC_WOOCOMMERCE_URL: hasUrl ? '✅' : '❌',
          WOOCOMMERCE_CONSUMER_KEY: hasKey ? '✅' : '❌',
          WOOCOMMERCE_CONSUMER_SECRET: hasSecret ? '✅' : '❌',
        }
      }, { status: 500 });
    }

    // Test API by fetching products
    console.log('📦 Fetching products from WooCommerce...');
    const products = await wooClient.getProducts({
      per_page: 5,
      status: 'publish',
    });

    console.log(`✅ Successfully fetched ${products.length} products`);

    // Get sample product data
    const sampleProducts = products.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock_status: p.stock_status,
      images: p.images?.length || 0,
    }));

    return NextResponse.json({
      success: true,
      message: 'WooCommerce API is working! ✅',
      timestamp: new Date().toISOString(),
      config: {
        url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL,
        api_version: 'wc/v3',
      },
      stats: {
        total_products_fetched: products.length,
        sample_products: sampleProducts,
      }
    });

  } catch (error: any) {
    console.error('❌ WooCommerce API test failed:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: {
        name: error.name,
        code: error.code,
        response: error.response?.data,
      },
      config: {
        url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'NOT_SET',
      }
    }, { status: 500 });
  }
}

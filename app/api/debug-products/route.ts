import { NextResponse } from 'next/server';
import { wooCommerce } from '@/lib/woocommerce/client';

export async function GET() {
  try {
    // Fetch first 20 products to see what we're working with
    const products = await wooCommerce.getProducts({ per_page: 20, status: 'publish' });
    
    // Group by categories
    const byCategory: Record<string, any[]> = {};
    
    products.forEach(product => {
      product.categories.forEach(cat => {
        if (!byCategory[cat.name]) {
          byCategory[cat.name] = [];
        }
        byCategory[cat.name].push({
          id: product.id,
          name: product.name,
          price: product.price,
          categories: product.categories.map(c => c.name),
        });
      });
    });
    
    return NextResponse.json({
      total: products.length,
      categories: Object.keys(byCategory).sort(),
      byCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

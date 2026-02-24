import { NextResponse } from 'next/server';
import { wooCommerce } from '@/lib/woocommerce/client';

export async function GET() {
  try {
    // Fetch all products with 'any' status to see everything
    const products = await wooCommerce.getProducts({ per_page: 100, status: 'any' });
    
    // Group by categories
    const byCategory: Record<string, any[]> = {};
    const byStatus: Record<string, number> = {};
    
    products.forEach(product => {
      // Count by status
      byStatus[product.status] = (byStatus[product.status] || 0) + 1;
      
      // Group by category
      product.categories.forEach(cat => {
        if (!byCategory[cat.name]) {
          byCategory[cat.name] = [];
        }
        byCategory[cat.name].push({
          id: product.id,
          name: product.name,
          price: product.price,
          status: product.status,
          categories: product.categories.map(c => c.name),
        });
      });
    });
    
    return NextResponse.json({
      total: products.length,
      byStatus,
      categories: Object.keys(byCategory).sort(),
      categoryCount: Object.keys(byCategory).length,
      byCategory,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      details: 'Check WooCommerce PHP memory limit'
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { wooCommerce } from '@/lib/woocommerce/client';
import { syncOrderToWooCommerce } from '@/lib/woocommerce/sync';

/**
 * Vercel Cron Job: Sync WooCommerce data
 * Runs every night at 03:00 AM
 * 
 * Schedule: 0 3 * * * (03:00 daily)
 */

interface SyncResult {
  success: boolean;
  occasions?: {
    imported: number;
    updated: number;
    deleted: number;
    failed: number;
  };
  products?: {
    imported: number;
    updated: number;
    deleted: number;
    failed: number;
  };
  orders?: {
    synced: number;
    failed: number;
  };
  errors?: string[];
}

/**
 * Extract year from product name
 */
function extractYear(name: string): number {
  const yearMatch = name.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear() - 10;
}

/**
 * Extract brand from product name
 */
function extractBrand(name: string): string {
  const brands = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Triumph', 'Harley'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Onbekend';
}

/**
 * Extract model from product name
 */
function extractModel(name: string, brand: string): string {
  let model = name.replace(new RegExp(brand, 'gi'), '').trim();
  const modelMatch = model.match(/^([A-Z0-9\-]+)/);
  return modelMatch ? modelMatch[1] : model.split('|')[0].trim();
}

/**
 * Generate slug
 */
function generateSlug(text: string, id?: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return id ? `${slug}-${id}` : slug;
}

/**
 * Sync Occasions from WooCommerce to Supabase
 */
async function syncOccasions(supabase: any): Promise<SyncResult['occasions']> {
  console.log('🏍️ Syncing occasions from WooCommerce...');
  
  const result = {
    imported: 0,
    updated: 0,
    deleted: 0,
    failed: 0,
  };

  try {
    const wcProducts = await wooCommerce.getProducts({
      per_page: 20,
      orderby: 'date',
      order: 'desc',
    });

    const occasions = wcProducts.filter(p => {
      return p.categories?.some((cat: any) => cat.slug === 'motoren');
    });

    console.log(`Found ${occasions.length} occasions in WooCommerce (category: Motoren)`);

    const { data: existingOccasions } = await supabase
      .from('occasions')
      .select('id, slug, updated_at');

    const existingSlugs = new Set(existingOccasions?.map((o: any) => o.slug) || []);

    for (const product of occasions) {
      try {
        const brand = extractBrand(product.name);
        const year = extractYear(product.name);
        const model = extractModel(product.name, brand);
        const slug = generateSlug(`${brand}-${model}-${year}`, product.id);

        const mainImage = product.images?.[0]?.src || null;
        const images = product.images?.map((img: any) => img.src) || [];

        let status: 'available' | 'sold' = 'available';
        if (product.status === 'private' || product.stock_status === 'outofstock') {
          status = 'sold';
        }

        const occasionData = {
          brand,
          model,
          year,
          price: parseFloat(product.price || '0'),
          status,
          is_active: product.status === 'publish',
          mileage: 0,
          transmission: 'Handgeschakeld',
          fuel: 'Benzine',
          power: product.name.match(/(\d+kw)/i)?.[1] || '35kw',
          color: null,
          category: 'Sportmotor',
          condition: 'Gebruikt',
          owners: null,
          service_history: null,
          warranty: '3 maanden garantie',
          description: product.description || product.short_description || null,
          features: [],
          extras: [],
          images,
          main_image: mainImage,
          slug,
          specs: {},
          woo_product_id: product.id,
        };

        if (existingSlugs.has(slug)) {
          const { error } = await supabase
            .from('occasions')
            .update(occasionData)
            .eq('slug', slug);

          if (error) {
            console.error(`Failed to update ${product.name}:`, error.message);
            result.failed++;
          } else {
            result.updated++;
          }
        } else {
          const { error } = await supabase
            .from('occasions')
            .insert(occasionData);

          if (error) {
            console.error(`Failed to import ${product.name}:`, error.message);
            result.failed++;
          } else {
            result.imported++;
          }
        }
      } catch (err: any) {
        console.error(`Error processing occasion ${product.name}:`, err.message);
        result.failed++;
      }
    }

    console.log(`✅ Occasions sync complete: ${result.imported} imported, ${result.updated} updated`);
  } catch (error: any) {
    console.error('❌ Occasions sync failed:', error.message);
    
    // Check if it's a WordPress memory error
    if (error.message && error.message.includes('500')) {
      throw new Error('WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB');
    }
    
    throw error;
  }

  return result;
}

/**
 * Sync Products from WooCommerce to Supabase
 */
async function syncProducts(supabase: any): Promise<SyncResult['products']> {
  console.log('🛍️ Syncing products from WooCommerce...');
  
  const result = {
    imported: 0,
    updated: 0,
    deleted: 0,
    failed: 0,
  };

  try {
    const wcProducts = await wooCommerce.getProducts({
      per_page: 20,
      orderby: 'date',
      order: 'desc',
    });

    const products = wcProducts.filter(p => {
      const price = parseFloat(p.price || '0');
      const isMotor = p.categories?.some((cat: any) => cat.slug === 'motoren');
      return price > 0 && !isMotor;
    });

    console.log(`Found ${products.length} products in WooCommerce (excluding Motoren category)`);

    const { data: existingProducts } = await supabase
      .from('webshop_products')
      .select('woo_product_id');

    const existingIds = new Set(existingProducts?.map((p: any) => p.woo_product_id) || []);

    for (const product of products) {
      try {
        const regularPrice = parseFloat(product.regular_price || '0');
        const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
        const price = salePrice || regularPrice;

        const productData = {
          woo_product_id: product.id,
          sku: product.sku || null,
          name: product.name,
          slug: generateSlug(product.name, product.id),
          description: product.description || null,
          short_description: product.short_description || null,
          price,
          sale_price: salePrice,
          regular_price: regularPrice,
          on_sale: !!salePrice && salePrice < regularPrice,
          stock_quantity: product.stock_quantity || 0,
          stock_status: product.stock_status || 'instock',
          manage_stock: product.manage_stock || false,
          categories: product.categories?.map((c: any) => c.name) || [],
          tags: product.tags?.map((t: any) => t.name) || [],
          images: product.images?.map((img: any) => ({
            src: img.src,
            alt: img.alt || product.name,
            id: img.id.toString(),
          })) || [],
          status: product.status || 'draft',
          featured: product.featured || false,
          catalog_visibility: product.catalog_visibility || 'visible',
          weight: product.weight ? parseFloat(product.weight) : null,
        };

        if (existingIds.has(product.id)) {
          const { error } = await supabase
            .from('webshop_products')
            .update(productData)
            .eq('woo_product_id', product.id);

          if (error) {
            console.error(`Failed to update ${product.name}:`, error.message);
            result.failed++;
          } else {
            result.updated++;
          }
        } else {
          const { error } = await supabase
            .from('webshop_products')
            .insert(productData);

          if (error) {
            console.error(`Failed to import ${product.name}:`, error.message);
            result.failed++;
          } else {
            result.imported++;
          }
        }
      } catch (err: any) {
        console.error(`Error processing product ${product.name}:`, err.message);
        result.failed++;
      }
    }

    console.log(`✅ Products sync complete: ${result.imported} imported, ${result.updated} updated`);
  } catch (error: any) {
    console.error('❌ Products sync failed:', error.message);
    
    // Check if it's a WordPress memory error
    if (error.message && error.message.includes('500')) {
      throw new Error('WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB');
    }
    
    throw error;
  }

  return result;
}

/**
 * Sync Orders from Supabase to WooCommerce
 */
async function syncOrders(supabase: any): Promise<SyncResult['orders']> {
  console.log('📦 Syncing orders to WooCommerce...');
  
  const result = {
    synced: 0,
    failed: 0,
  };

  try {
    const { data: orders, error } = await supabase
      .from('webshop_orders')
      .select('*')
      .eq('synced_to_woo', false)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    if (!orders || orders.length === 0) {
      console.log('No orders to sync');
      return result;
    }

    console.log(`Found ${orders.length} orders to sync`);

    for (const order of orders) {
      try {
        // Fetch order items separately
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        const items = (orderItems || []).map((item: any) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        }));

        const orderData = { ...order, items };
        const wooOrderId = await syncOrderToWooCommerce(orderData);

        const { error: updateError } = await (supabase as any)
          .from('webshop_orders')
          .update({ woo_order_id: wooOrderId, synced_to_woo: true })
          .eq('id', order.id);

        if (updateError) {
          throw new Error(`Failed to update order: ${updateError.message}`);
        }

        result.synced++;
        console.log(`✅ Synced order ${order.order_number} → WooCommerce #${wooOrderId}`);
      } catch (err: any) {
        console.error(`❌ Failed to sync order ${order.order_number}:`, err.message);
        result.failed++;
      }
    }

    console.log(`✅ Orders sync complete: ${result.synced} synced`);
  } catch (error: any) {
    console.error('❌ Orders sync failed:', error.message);
    throw error;
  }

  return result;
}

/**
 * Cron endpoint - protected by CRON_SECRET
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: 'CRON_SECRET not configured' },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const errors: string[] = [];
    const result: SyncResult = {
      success: true,
    };

    console.log('🔄 [CRON] Starting WooCommerce sync...\n');

    // Sync Occasions
    try {
      result.occasions = await syncOccasions(supabase);
    } catch (error: any) {
      errors.push(`Occasions sync failed: ${error.message}`);
    }

    // Sync Products
    try {
      result.products = await syncProducts(supabase);
    } catch (error: any) {
      errors.push(`Products sync failed: ${error.message}`);
    }

    // Sync Orders
    try {
      result.orders = await syncOrders(supabase);
    } catch (error: any) {
      errors.push(`Orders sync failed: ${error.message}`);
    }

    result.success = errors.length === 0;
    if (errors.length > 0) {
      result.errors = errors;
    }

    console.log('\n✅ [CRON] Sync completed!');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ [CRON] Sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

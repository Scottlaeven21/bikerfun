import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { wooCommerce } from '@/lib/woocommerce/client';
import { syncOrderToWooCommerce } from '@/lib/woocommerce/sync';

/**
 * Sync everything between WooCommerce and Supabase
 * 
 * Direction:
 * - WooCommerce → Supabase: Occasions & Products
 * - Supabase → WooCommerce: Orders
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
    // Fetch occasions from WooCommerce (category "Motoren" only)
    // Query directly by category ID (87) to reduce memory usage
    const occasions = await wooCommerce.getProducts({
      per_page: 50,
      category: '87', // Motoren category ID
      orderby: 'date',
      order: 'desc',
    });

    console.log(`Found ${occasions.length} occasions in WooCommerce (category: Motoren)`);

    // Get existing occasions from Supabase
    const { data: existingOccasions } = await supabase
      .from('occasions')
      .select('id, woo_product_id');

    const existingWooIds = new Set(existingOccasions?.map((o: any) => o.woo_product_id) || []);

    // Sync each occasion
    for (const product of occasions) {
      try {
        const brand = extractBrand(product.name);
        const year = extractYear(product.name);
        const model = extractModel(product.name, brand);
        // Always include WooCommerce ID in slug to ensure uniqueness
        const slug = `${generateSlug(`${brand}-${model}-${year}`)}-${product.id}`;

        const mainImage = product.images?.[0]?.src || null;
        const images = product.images?.map((img: any) => img.src) || [];

        // Determine status
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

        // Check if exists (by woo_product_id, not slug)
        if (existingWooIds.has(product.id)) {
          // Update existing
          const { error } = await supabase
            .from('occasions')
            .update(occasionData)
            .eq('woo_product_id', product.id);

          if (error) {
            console.error(`Failed to update ${product.name}:`, error.message);
            console.error('Error details:', error);
            result.failed++;
          } else {
            result.updated++;
          }
        } else {
          // Insert new
          const { error } = await supabase
            .from('occasions')
            .insert(occasionData);

          if (error) {
            console.error(`Failed to import ${product.name}:`, error.message);
            console.error('Error details:', error);
            console.error('Occasion data:', JSON.stringify(occasionData, null, 2));
            result.failed++;
          } else {
            result.imported++;
          }
        }
      } catch (err: any) {
        console.error(`Error processing occasion ${product.name}:`, err.message);
        console.error('Error stack:', err);
        result.failed++;
      }
    }

    console.log(`✅ Occasions sync complete: ${result.imported} imported, ${result.updated} updated`);
  } catch (error: any) {
    console.error('❌ Occasions sync failed:', error.message);
    
    // Check if it's a WordPress memory error
    if (error.message && error.message.includes('500')) {
      throw new Error('WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB. See URGENT_VOOR_ITER_2_MAART.md');
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
    // Fetch products from WooCommerce (excluding Motoren category)
    // Query each category separately to reduce memory usage
    const allProducts: any[] = [];
    
    // Get all categories except Motoren (ID: 87)
    const categories = [16, 48, 78, 72, 69, 47]; // Alles, Helmcovers, Kentekenplaathouders, Knipperlichten, Rugzakken, Sleutelhangers
    
    for (const categoryId of categories) {
      try {
        const categoryProducts = await wooCommerce.getProducts({
          per_page: 50,
          category: categoryId.toString(),
          orderby: 'date',
          order: 'desc',
        });
        allProducts.push(...categoryProducts);
      } catch (err) {
        console.warn(`Failed to fetch category ${categoryId}:`, err);
      }
    }
    
    // Filter for valid products with price > 0
    const products = allProducts.filter(p => {
      const price = parseFloat(p.price || '0');
      return price > 0;
    });

    console.log(`Found ${products.length} products in WooCommerce (excluding Motoren category)`);

    // Get existing products from Supabase
    const { data: existingProducts } = await supabase
      .from('webshop_products')
      .select('woo_product_id');

    const existingIds = new Set(existingProducts?.map((p: any) => p.woo_product_id) || []);

    // Sync each product
    for (const product of products) {
      try {
        const regularPrice = parseFloat(product.regular_price || '0');
        const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
        const price = salePrice || regularPrice;

        const productData = {
          woo_product_id: product.id,
          sku: product.sku || null,
          name: product.name,
          slug: `${generateSlug(product.name)}-${product.id}`,
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

        // Check if exists
        if (existingIds.has(product.id)) {
          // Update existing
          const { error } = await supabase
            .from('webshop_products')
            .update(productData)
            .eq('woo_product_id', product.id);

          if (error) {
            console.error(`Failed to update product ${product.name}:`, error.message);
            console.error('Error details:', error);
            result.failed++;
          } else {
            result.updated++;
          }
        } else {
          // Insert new
          const { error } = await supabase
            .from('webshop_products')
            .insert(productData);

          if (error) {
            console.error(`Failed to import product ${product.name}:`, error.message);
            console.error('Error details:', error);
            console.error('Product data:', JSON.stringify(productData, null, 2));
            result.failed++;
          } else {
            result.imported++;
          }
        }
      } catch (err: any) {
        console.error(`Error processing product ${product.name}:`, err.message);
        console.error('Error stack:', err);
        result.failed++;
      }
    }

    console.log(`✅ Products sync complete: ${result.imported} imported, ${result.updated} updated`);
  } catch (error: any) {
    console.error('❌ Products sync failed:', error.message);
    
    // Check if it's a WordPress memory error
    if (error.message && error.message.includes('500')) {
      throw new Error('WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB. See URGENT_VOOR_ITER_2_MAART.md');
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
    // Fetch unsynced paid orders
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

    // Sync each order
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

        // Update Supabase
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
 * Main sync endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Use admin client to bypass RLS for sync operations
    const supabase = createAdminClient();
    const errors: string[] = [];
    const result: SyncResult = {
      success: true,
    };

    console.log('🔄 Starting WooCommerce sync...\n');

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

    // Build response
    result.success = errors.length === 0;
    if (errors.length > 0) {
      result.errors = errors;
    }

    console.log('\n✅ Sync completed!');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('❌ Sync failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

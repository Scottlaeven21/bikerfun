/**
 * Shared WooCommerce ↔ Supabase full sync (occasions, webshop products, orders).
 * Used by admin API, cron API, and local CLI script (no serverless timeout).
 */

import { wooCommerce } from '@/lib/woocommerce/client';
import { syncOrderToWooCommerce } from '@/lib/woocommerce/sync';

export interface WooCommerceFullSyncResult {
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

function extractYear(name: string): number {
  const yearMatch = name.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear() - 10;
}

function extractBrand(name: string): string {
  const brands = ['Yamaha', 'Honda', 'Suzuki', 'Kawasaki', 'Ducati', 'BMW', 'KTM', 'Triumph', 'Harley'];
  for (const brand of brands) {
    if (name.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Onbekend';
}

function extractModel(name: string, brand: string): string {
  let model = name.replace(new RegExp(brand, 'gi'), '').trim();
  const modelMatch = model.match(/^([A-Z0-9\-]+)/);
  return modelMatch ? modelMatch[1] : model.split('|')[0].trim();
}

function generateSlug(text: string, id?: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return id ? `${slug}-${id}` : slug;
}

function getAttribute(product: any, attributeName: string): string | null {
  const attr = product.attributes?.find(
    (a: any) =>
      a.name.toLowerCase() === attributeName.toLowerCase() ||
      a.name.toLowerCase().includes(attributeName.toLowerCase())
  );
  return attr?.option || null;
}

function getMetaData(product: any, key: string): any {
  const meta = product.meta_data?.find((m: any) => m.key === key);
  return meta?.value || null;
}

export async function syncOccasions(supabase: any): Promise<WooCommerceFullSyncResult['occasions']> {
  console.log('🏍️ Syncing occasions from WooCommerce...');

  const result = {
    imported: 0,
    updated: 0,
    deleted: 0,
    failed: 0,
  };

  try {
    console.log('🔄 Fetching occasions from WooCommerce with pagination...');
    const allOccasions: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const occasions = await wooCommerce.getProducts({
        per_page: 10,
        page,
        category: '87',
        orderby: 'date',
        order: 'desc',
      });

      allOccasions.push(...occasions);
      console.log(`  📄 Page ${page}: ${occasions.length} occasions`);

      hasMore = occasions.length === 10;
      page++;
    }

    const occasions = allOccasions;
    console.log(`✅ Total found: ${occasions.length} occasions in WooCommerce (category: Motoren)`);

    const { data: existingOccasions } = await supabase.from('occasions').select('id, woo_product_id');

    const existingWooIds = new Set(existingOccasions?.map((o: any) => o.woo_product_id) || []);

    for (const product of occasions) {
      try {
        const brand = extractBrand(product.name);
        const year = extractYear(product.name);
        const model = extractModel(product.name, brand);
        const slug = `${generateSlug(`${brand}-${model}-${year}`)}-${product.id}`;

        const mainImage = product.images?.[0]?.src || null;
        const images = product.images?.map((img: any) => img.src) || [];

        let status: 'available' | 'sold' = 'available';
        if (product.status === 'private' || product.stock_status === 'outofstock') {
          status = 'sold';
        }

        const mileage = parseInt(
          getAttribute(product, 'km-stand') ||
            getAttribute(product, 'mileage') ||
            getMetaData(product, '_km_stand') ||
            '0'
        );
        const transmission =
          getAttribute(product, 'transmissie') ||
          getAttribute(product, 'transmission') ||
          getMetaData(product, '_transmissie') ||
          'Handgeschakeld';
        const fuel =
          getAttribute(product, 'brandstof') ||
          getAttribute(product, 'fuel') ||
          getMetaData(product, '_brandstof') ||
          'Benzine';
        const power =
          getAttribute(product, 'vermogen') ||
          getAttribute(product, 'power') ||
          getMetaData(product, '_vermogen') ||
          product.name.match(/(\d+\s*kw)/i)?.[1] ||
          '35kw';
        const color =
          getAttribute(product, 'kleur') ||
          getAttribute(product, 'color') ||
          getMetaData(product, '_kleur') ||
          null;
        const category =
          getAttribute(product, 'categorie') ||
          getAttribute(product, 'category') ||
          getMetaData(product, '_motor_category') ||
          'Sportmotor';
        const condition =
          getAttribute(product, 'staat') ||
          getAttribute(product, 'condition') ||
          getMetaData(product, '_staat') ||
          'Gebruikt';
        const owners =
          parseInt(
            getAttribute(product, 'eigenaren') ||
              getAttribute(product, 'owners') ||
              getMetaData(product, '_eigenaren') ||
              '0'
          ) || null;
        const serviceHistory =
          getAttribute(product, 'onderhoudshistorie') ||
          getAttribute(product, 'service_history') ||
          getMetaData(product, '_onderhoudshistorie') ||
          null;
        const warranty =
          getAttribute(product, 'garantie') ||
          getAttribute(product, 'warranty') ||
          getMetaData(product, '_garantie') ||
          '3 maanden garantie';

        const features: string[] = [];
        const extras: string[] = [];

        product.attributes?.forEach((attr: any) => {
          const name = attr.name.toLowerCase();
          if (
            ![
              'km-stand',
              'mileage',
              'transmissie',
              'transmission',
              'brandstof',
              'fuel',
              'vermogen',
              'power',
              'kleur',
              'color',
              'categorie',
              'category',
              'staat',
              'condition',
              'eigenaren',
              'owners',
              'onderhoudshistorie',
              'service_history',
              'garantie',
              'warranty',
            ].includes(name)
          ) {
            if (attr.option && attr.option.trim() !== '') {
              features.push(`${attr.name}: ${attr.option}`);
            }
          }
        });

        const occasionData = {
          brand,
          model,
          year,
          price: parseFloat(product.price || '0'),
          status,
          is_active: product.status === 'publish',
          mileage,
          transmission,
          fuel,
          power,
          color,
          category,
          condition,
          owners,
          service_history: serviceHistory,
          warranty,
          description: product.description || product.short_description || null,
          features,
          extras,
          images,
          main_image: mainImage,
          slug,
          specs: {},
          woo_product_id: product.id,
        };

        if (existingWooIds.has(product.id)) {
          const { data: existingRecord } = await supabase
            .from('occasions')
            .select('manual_overrides')
            .eq('woo_product_id', product.id)
            .single();

          const manualOverrides = existingRecord?.manual_overrides || [];

          const updateData: any = {};
          Object.keys(occasionData).forEach((key) => {
            if (!manualOverrides.includes(key)) {
              updateData[key] = (occasionData as any)[key];
            }
          });

          if (Object.keys(updateData).length > 0) {
            const { error } = await supabase.from('occasions').update(updateData).eq('woo_product_id', product.id);

            if (error) {
              console.error(`Failed to update ${product.name}:`, error.message);
              result.failed++;
            } else {
              result.updated++;
              if (manualOverrides.length > 0) {
                console.log(`  ⚠️  Skipped ${manualOverrides.length} manually overridden fields:`, manualOverrides);
              }
            }
          } else {
            console.log(`  ⏭️  All fields manually overridden, skipping update for ${product.name}`);
          }
        } else {
          const { error } = await supabase.from('occasions').insert(occasionData);

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
    if (error.message && error.message.includes('500')) {
      throw new Error(
        'WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB. See URGENT_VOOR_ITER_2_MAART.md'
      );
    }
    throw error;
  }

  return result;
}

export async function syncProducts(supabase: any): Promise<WooCommerceFullSyncResult['products']> {
  console.log('🛍️ Syncing products from WooCommerce...');

  const result = {
    imported: 0,
    updated: 0,
    deleted: 0,
    failed: 0,
  };

  try {
    console.log('🔄 Fetching products from WooCommerce with pagination...');
    const allProducts: any[] = [];

    const categories = [16, 48, 78, 72, 69, 47];

    for (const categoryId of categories) {
      try {
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const categoryProducts = await wooCommerce.getProducts({
            per_page: 10,
            page,
            category: categoryId.toString(),
            orderby: 'date',
            order: 'desc',
          });

          allProducts.push(...categoryProducts);
          console.log(`  📄 Category ${categoryId}, Page ${page}: ${categoryProducts.length} products`);

          hasMore = categoryProducts.length === 10;
          page++;
        }
      } catch (err) {
        console.warn(`Failed to fetch category ${categoryId}:`, err);
      }
    }

    const products = allProducts.filter((p) => {
      const price = parseFloat(p.price || '0');
      return price > 0;
    });

    console.log(`Found ${products.length} products in WooCommerce (excluding Motoren category)`);

    const { data: existingProducts } = await supabase.from('webshop_products').select('woo_product_id');

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
          images:
            product.images?.map((img: any) => ({
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
          const { data: existingRecord } = await supabase
            .from('webshop_products')
            .select('manual_overrides')
            .eq('woo_product_id', product.id)
            .single();

          const manualOverrides = existingRecord?.manual_overrides || [];

          const updateData: any = {};
          Object.keys(productData).forEach((key) => {
            if (!manualOverrides.includes(key)) {
              updateData[key] = (productData as any)[key];
            }
          });

          if (Object.keys(updateData).length > 0) {
            const { error } = await supabase.from('webshop_products').update(updateData).eq('woo_product_id', product.id);

            if (error) {
              console.error(`Failed to update product ${product.name}:`, error.message);
              result.failed++;
            } else {
              result.updated++;
              if (manualOverrides.length > 0) {
                console.log(`  ⚠️  Skipped ${manualOverrides.length} manually overridden fields:`, manualOverrides);
              }
            }
          } else {
            console.log(`  ⏭️  All fields manually overridden, skipping update for ${product.name}`);
          }
        } else {
          const { error } = await supabase.from('webshop_products').insert(productData);

          if (error) {
            console.error(`Failed to import product ${product.name}:`, error.message);
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
    if (error.message && error.message.includes('500')) {
      throw new Error(
        'WordPress memory limit (128MB) exceeded. Please ask IT to increase to 512MB. See URGENT_VOOR_ITER_2_MAART.md'
      );
    }
    throw error;
  }

  return result;
}

export async function syncOrders(supabase: any): Promise<WooCommerceFullSyncResult['orders']> {
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
        const { data: orderItems } = await supabase.from('order_items').select('*').eq('order_id', order.id);

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

/** Run all three sync steps; collects errors instead of failing the whole job. */
export async function executeWooCommerceFullSync(supabase: any): Promise<WooCommerceFullSyncResult> {
  if (!wooCommerce.isConfigured()) {
    return {
      success: false,
      errors: [
        'WooCommerce is niet geconfigureerd. Zet NEXT_PUBLIC_WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY en WOOCOMMERCE_CONSUMER_SECRET (lokaal: .env.local, productie: Vercel env).',
      ],
    };
  }

  const errors: string[] = [];
  const result: WooCommerceFullSyncResult = { success: true };

  try {
    result.occasions = await syncOccasions(supabase);
  } catch (error: any) {
    errors.push(`Occasions sync failed: ${error.message}`);
  }

  try {
    result.products = await syncProducts(supabase);
  } catch (error: any) {
    errors.push(`Products sync failed: ${error.message}`);
  }

  try {
    result.orders = await syncOrders(supabase);
  } catch (error: any) {
    errors.push(`Orders sync failed: ${error.message}`);
  }

  result.success = errors.length === 0;
  if (errors.length > 0) {
    result.errors = errors;
  }

  return result;
}

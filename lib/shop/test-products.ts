/**
 * Known checkout/test products that must never appear in the public shop.
 * WooCommerce IDs come from the live slugs (…-3048, …-3069, …-4108).
 */
export const TEST_WOO_PRODUCT_IDS = new Set([3048, 3069, 4108]);

export function isTestProduct(product: {
  name?: string | null;
  slug?: string | null;
  sku?: string | null;
  woo_product_id?: number | null;
  id?: number | string;
}): boolean {
  const wooId =
    product.woo_product_id ??
    (typeof product.id === 'number' ? product.id : null);

  if (wooId != null && TEST_WOO_PRODUCT_IDS.has(Number(wooId))) {
    return true;
  }

  const hay = `${product.name ?? ''} ${product.slug ?? ''} ${product.sku ?? ''}`.toLowerCase();
  return (
    hay.includes('do not order') ||
    hay.includes('do-not-order') ||
    hay.includes('niet bestellen') ||
    hay.includes('niet-bestellen') ||
    hay.includes('testhelmetcover') ||
    hay.includes('test hanger') ||
    hay.includes('test-hanger') ||
    hay.includes('test product') ||
    hay.includes('test-product')
  );
}

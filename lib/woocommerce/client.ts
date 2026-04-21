// WooCommerce REST API Client
// Uses OAuth 1.0a authentication for secure API access

import type { 
  WooCommerceProduct, 
  WooCommerceAPIConfig, 
  WooCommerceListParams 
} from '@/types/woocommerce';

class WooCommerceClient {
  private config: WooCommerceAPIConfig;

  constructor() {
    this.config = {
      url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '',
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
      version: 'wc/v3',
    };
  }

  /**
   * Check if WooCommerce is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.url &&
      this.config.consumerKey &&
      this.config.consumerSecret
    );
  }

  /**
   * Make authenticated API request using Basic Auth over HTTPS.
   * Basic Auth avoids the long OAuth query string that Cloudflare Bot Protection
   * often flags as suspicious. Credentials are passed in the Authorization header.
   */
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce is not configured. Please add API credentials to environment variables.');
    }

    const base = `${this.config.url}/wp-json/${this.config.version}/${endpoint}`;

    // Build final URL (query params only for GET)
    let finalUrl = base;
    if (method === 'GET' && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
      ).toString();
      finalUrl = `${base}?${qs}`;
    }

    // Basic Auth: base64(consumerKey:consumerSecret)
    const credentials = Buffer.from(
      `${this.config.consumerKey}:${this.config.consumerSecret}`
    ).toString('base64');

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        // A descriptive User-Agent prevents Cloudflare from flagging the request as a headless bot
        'User-Agent': 'Bikerfun-NextJS-Sync/1.0 (+https://bikerfun.nl)',
        'Accept': 'application/json',
      },
      // Never serve a cached response for sync calls; always hit WooCommerce live
      cache: 'no-store',
    };

    if (method !== 'GET' && Object.keys(params).length > 0) {
      fetchOptions.body = JSON.stringify(params);
    }

    const response = await fetch(finalUrl, fetchOptions);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`WooCommerce API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get all products with optional filters
   */
  async getProducts(params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', params);
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: number): Promise<WooCommerceProduct> {
    return this.makeRequest<WooCommerceProduct>(`products/${id}`);
  }

  /**
   * Get single product by slug
   */
  async getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
    const products = await this.makeRequest<WooCommerceProduct[]>('products', { slug });
    return products.length > 0 ? products[0] : null;
  }

  /**
   * Get products by category slug
   */
  async getProductsByCategory(categorySlug: string, params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', {
      ...params,
      category: categorySlug,
    });
  }

  /**
   * Search products
   */
  async searchProducts(query: string, params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', {
      ...params,
      search: query,
    });
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', {
      ...params,
      featured: true,
    });
  }

  /**
   * Get product categories
   */
  async getCategories(params?: { per_page?: number; hide_empty?: boolean }): Promise<any[]> {
    return this.makeRequest<any[]>('products/categories', {
      per_page: params?.per_page || 100,
      hide_empty: params?.hide_empty !== false,
    });
  }

  /**
   * Get products on sale
   */
  async getSaleProducts(params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', {
      ...params,
      on_sale: true,
    });
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: any): Promise<any> {
    return this.makeRequest('orders', orderData, 'POST');
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: number): Promise<any> {
    return this.makeRequest(`orders/${orderId}`);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    return this.makeRequest(`orders/${orderId}`, { status }, 'PUT');
  }

  /**
   * Get checkout URL for redirect
   */
  getCheckoutUrl(): string {
    return `${this.config.url}/checkout`;
  }

  /**
   * Get cart URL for redirect
   */
  getCartUrl(): string {
    return `${this.config.url}/cart`;
  }

  /**
   * Get product permalink (redirect to WooCommerce)
   */
  getProductUrl(product: WooCommerceProduct): string {
    return product.permalink;
  }
}

// Export singleton instance
export const wooCommerce = new WooCommerceClient();

// Export for testing/custom instances
export { WooCommerceClient };

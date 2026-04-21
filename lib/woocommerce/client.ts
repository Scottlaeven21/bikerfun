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
   * Make authenticated API request.
   * Credentials are passed as query parameters (consumer_key / consumer_secret).
   * This avoids the Authorization header which Cloudflare WAF tends to block for
   * server-side requests, while still being fully supported by WooCommerce REST API.
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

    // Always include credentials as query params (WAF-safe, officially supported by WooCommerce)
    const authParams: Record<string, string> = {
      consumer_key: this.config.consumerKey,
      consumer_secret: this.config.consumerSecret,
    };

    const allQueryParams: Record<string, string> = { ...authParams };
    if (method === 'GET') {
      Object.entries(params).forEach(([k, v]) => { allQueryParams[k] = String(v); });
    }

    const qs = new URLSearchParams(allQueryParams).toString();
    const finalUrl = `${base}?${qs}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Bikerfun-NextJS-Sync/1.0 (+https://bikerfun.nl)',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    };

    if (method !== 'GET' && Object.keys(params).length > 0) {
      fetchOptions.body = JSON.stringify(params);
    }

    let response: Response;
    try {
      response = await fetch(finalUrl, fetchOptions);
    } catch (err: any) {
      // Surface the real underlying cause (DNS, SSL, ECONNREFUSED, etc.)
      const cause = err?.cause?.message ?? err?.cause ?? '';
      throw new Error(
        `WooCommerce verbindingsfout naar ${new URL(finalUrl).hostname}: ${err.message}${cause ? ` (oorzaak: ${cause})` : ''}`
      );
    }

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

// WooCommerce REST API Client
// Uses OAuth 1.0a authentication for secure API access

import crypto from 'crypto';
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
   * Generate OAuth 1.0a signature
   */
  private generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, string>
  ): string {
    const baseString = this.createSignatureBaseString(method, url, params);
    const signingKey = `${encodeURIComponent(this.config.consumerSecret)}&`;
    
    return crypto
      .createHmac('sha256', signingKey)
      .update(baseString)
      .digest('base64');
  }

  /**
   * Create OAuth base string for signature
   */
  private createSignatureBaseString(
    method: string,
    url: string,
    params: Record<string, string>
  ): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    return [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(sortedParams),
    ].join('&');
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<T> {
    if (!this.isConfigured()) {
      throw new Error('WooCommerce is not configured. Please add API credentials to environment variables.');
    }

    const url = `${this.config.url}/wp-json/${this.config.version}/${endpoint}`;
    
    // OAuth parameters
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.config.consumerKey,
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA256',
      oauth_version: '1.0',
    };

    // For POST/PUT/DELETE: body data separate from OAuth params
    // For GET: query params are part of OAuth signature
    const isWriteRequest = method !== 'GET';
    const signatureParams = isWriteRequest ? oauthParams : { ...oauthParams, ...params };
    
    // Generate signature
    const signature = this.generateOAuthSignature(
      method,
      url,
      signatureParams
    );

    // Add signature to oauth params
    oauthParams.oauth_signature = signature;

    // Build URL
    let finalUrl: string;
    if (isWriteRequest) {
      // POST/PUT/DELETE: Only OAuth params in URL
      const queryString = new URLSearchParams(oauthParams).toString();
      finalUrl = `${url}?${queryString}`;
    } else {
      // GET: OAuth params + query params in URL
      const allParams = { ...oauthParams, ...params };
      const queryString = new URLSearchParams(allParams).toString();
      finalUrl = `${url}?${queryString}`;
    }

    // Build fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    };

    // Add body for POST/PUT/DELETE requests
    if (isWriteRequest && Object.keys(params).length > 0) {
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

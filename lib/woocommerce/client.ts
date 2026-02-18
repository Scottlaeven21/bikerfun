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

    // Merge query params for signature
    const allParams = { ...oauthParams, ...params };
    
    // Generate signature
    oauthParams.oauth_signature = this.generateOAuthSignature(
      method,
      url,
      allParams
    );

    // Build final URL with query params
    const queryString = new URLSearchParams(allParams).toString();
    const finalUrl = `${url}?${queryString}`;

    const response = await fetch(finalUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

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
   * Get products on sale
   */
  async getSaleProducts(params?: WooCommerceListParams): Promise<WooCommerceProduct[]> {
    return this.makeRequest<WooCommerceProduct[]>('products', {
      ...params,
      on_sale: true,
    });
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

export * from './database';

// Cart types
export interface CartItem {
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
}

// Checkout types
export interface CheckoutFormData {
  email: string;
  full_name: string;
  phone: string;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
}

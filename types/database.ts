export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          stock: number;
          image_url: string | null;
          images: string[] | null;
          is_featured: boolean;
          is_active: boolean;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          stock?: number;
          image_url?: string | null;
          images?: string[] | null;
          is_featured?: boolean;
          is_active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          stock?: number;
          image_url?: string | null;
          images?: string[] | null;
          is_featured?: boolean;
          is_active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          full_name: string;
          phone: string | null;
          shipping_address_line1: string;
          shipping_address_line2: string | null;
          shipping_city: string;
          shipping_postal_code: string;
          shipping_country: string;
          subtotal: number;
          shipping_cost: number;
          tax: number;
          total: number;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
          fulfillment_status: 'unfulfilled' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number: string | null;
          tracking_url: string | null;
          notes: string | null;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          full_name: string;
          phone?: string | null;
          shipping_address_line1: string;
          shipping_address_line2?: string | null;
          shipping_city: string;
          shipping_postal_code: string;
          shipping_country?: string;
          subtotal: number;
          shipping_cost?: number;
          tax?: number;
          total: number;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          payment_status?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
          fulfillment_status?: 'unfulfilled' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          full_name?: string;
          phone?: string | null;
          shipping_address_line1?: string;
          shipping_address_line2?: string | null;
          shipping_city?: string;
          shipping_postal_code?: string;
          shipping_country?: string;
          subtotal?: number;
          shipping_cost?: number;
          tax?: number;
          total?: number;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          payment_status?: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
          fulfillment_status?: 'unfulfilled' | 'fulfilled' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          tracking_url?: string | null;
          notes?: string | null;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image_url: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image_url?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_image_url?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];

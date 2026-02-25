-- Webshop Orders Table
-- Orders created via Mollie checkout, then synced to WooCommerce for shipping/emails

CREATE TABLE IF NOT EXISTS public.webshop_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Order number (human readable)
  order_number TEXT UNIQUE NOT NULL,
  
  -- Payment info
  mollie_payment_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled', 'expired')),
  payment_method TEXT DEFAULT 'mollie',
  
  -- WooCommerce sync
  woo_order_id INTEGER,
  synced_to_woo BOOLEAN DEFAULT false,
  sync_error TEXT,
  
  -- Customer info
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Billing address
  billing_first_name TEXT NOT NULL,
  billing_last_name TEXT NOT NULL,
  billing_company TEXT,
  billing_address_1 TEXT NOT NULL,
  billing_address_2 TEXT,
  billing_city TEXT NOT NULL,
  billing_postcode TEXT NOT NULL,
  billing_country TEXT DEFAULT 'NL',
  
  -- Shipping address (can be same as billing)
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_company TEXT,
  shipping_address_1 TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_postcode TEXT,
  shipping_country TEXT DEFAULT 'NL',
  
  -- Order totals
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_total DECIMAL(10,2) DEFAULT 0,
  tax_total DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Customer notes
  customer_note TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Order Items (line items)
CREATE TABLE IF NOT EXISTS public.webshop_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.webshop_orders(id) ON DELETE CASCADE,
  
  -- Product reference
  product_id UUID REFERENCES public.webshop_products(id) ON DELETE SET NULL,
  woo_product_id INTEGER,
  
  -- Product snapshot (in case product is deleted later)
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  
  -- Pricing
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_webshop_orders_mollie_id ON public.webshop_orders(mollie_payment_id);
CREATE INDEX idx_webshop_orders_email ON public.webshop_orders(customer_email);
CREATE INDEX idx_webshop_orders_status ON public.webshop_orders(status);
CREATE INDEX idx_webshop_orders_payment_status ON public.webshop_orders(payment_status);
CREATE INDEX idx_webshop_orders_created ON public.webshop_orders(created_at DESC);
CREATE INDEX idx_webshop_order_items_order_id ON public.webshop_order_items(order_id);
CREATE INDEX idx_webshop_order_items_product_id ON public.webshop_order_items(product_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_webshop_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webshop_orders_updated_at
  BEFORE UPDATE ON public.webshop_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_webshop_orders_updated_at();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get count of orders today
  SELECT COUNT(*) + 1 INTO counter
  FROM public.webshop_orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Format: BF-YYYYMMDD-XXX (e.g., BF-20260225-001)
  new_number := 'BF-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 3, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE public.webshop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webshop_order_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users (admin) can view all orders
CREATE POLICY "Authenticated users can view orders"
  ON public.webshop_orders
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can manage orders
CREATE POLICY "Authenticated users can manage orders"
  ON public.webshop_orders
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Order items follow order permissions
CREATE POLICY "Authenticated users can view order items"
  ON public.webshop_order_items
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage order items"
  ON public.webshop_order_items
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Comments
COMMENT ON TABLE public.webshop_orders IS 'Orders from Mollie checkout - synced to WooCommerce for shipping/emails';
COMMENT ON TABLE public.webshop_order_items IS 'Line items for webshop orders';

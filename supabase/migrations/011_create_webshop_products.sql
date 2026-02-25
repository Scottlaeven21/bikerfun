-- Webshop Products Table
-- This will replace WooCommerce as the source of truth for products

CREATE TABLE IF NOT EXISTS public.webshop_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- WooCommerce reference (for order sync)
  woo_product_id INTEGER UNIQUE,
  
  -- Basic product info
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT,
  
  -- Descriptions
  description TEXT,
  short_description TEXT,
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  regular_price DECIMAL(10,2) NOT NULL,
  on_sale BOOLEAN DEFAULT false,
  
  -- Stock management
  stock_quantity INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'instock' CHECK (stock_status IN ('instock', 'outofstock', 'onbackorder')),
  manage_stock BOOLEAN DEFAULT true,
  backorders_allowed BOOLEAN DEFAULT false,
  
  -- Categories & Tags
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Images (JSONB array)
  images JSONB DEFAULT '[]',
  
  -- Status & Visibility
  status TEXT DEFAULT 'publish' CHECK (status IN ('publish', 'draft', 'private')),
  featured BOOLEAN DEFAULT false,
  catalog_visibility TEXT DEFAULT 'visible' CHECK (catalog_visibility IN ('visible', 'catalog', 'search', 'hidden')),
  
  -- Metadata
  weight DECIMAL(10,2),
  dimensions JSONB, -- {length: 0, width: 0, height: 0}
  shipping_class TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_webshop_products_sku ON public.webshop_products(sku);
CREATE INDEX idx_webshop_products_slug ON public.webshop_products(slug);
CREATE INDEX idx_webshop_products_status ON public.webshop_products(status);
CREATE INDEX idx_webshop_products_categories ON public.webshop_products USING GIN(categories);
CREATE INDEX idx_webshop_products_woo_id ON public.webshop_products(woo_product_id);

-- Full text search index
CREATE INDEX idx_webshop_products_search ON public.webshop_products USING GIN(
  to_tsvector('dutch', COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(short_description, ''))
);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_webshop_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webshop_products_updated_at
  BEFORE UPDATE ON public.webshop_products
  FOR EACH ROW
  EXECUTE FUNCTION update_webshop_products_updated_at();

-- RLS Policies
ALTER TABLE public.webshop_products ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "Public can view published products"
  ON public.webshop_products
  FOR SELECT
  USING (status = 'publish');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage products"
  ON public.webshop_products
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Comment
COMMENT ON TABLE public.webshop_products IS 'Webshop products - replaces WooCommerce API for product data';

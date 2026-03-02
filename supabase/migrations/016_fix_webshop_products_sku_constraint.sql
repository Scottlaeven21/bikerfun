-- Fix duplicate SKU constraint issue
-- Make SKU nullable and drop unique constraint
-- We'll use woo_product_id as the primary unique identifier instead

-- Drop the unique constraint on SKU
ALTER TABLE webshop_products 
DROP CONSTRAINT IF EXISTS webshop_products_sku_key;

-- Make SKU nullable (it may already be, but ensure it)
ALTER TABLE webshop_products 
ALTER COLUMN sku DROP NOT NULL;

-- Add unique constraint on woo_product_id instead
-- This is the real unique identifier from WooCommerce
ALTER TABLE webshop_products
DROP CONSTRAINT IF EXISTS webshop_products_woo_product_id_key;

ALTER TABLE webshop_products
ADD CONSTRAINT webshop_products_woo_product_id_key UNIQUE (woo_product_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_webshop_products_woo_product_id ON webshop_products(woo_product_id);

-- Add comment
COMMENT ON COLUMN webshop_products.woo_product_id IS 'WooCommerce product ID - unique identifier for sync';

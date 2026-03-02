-- Add woo_product_id column to occasions table for WooCommerce sync
-- This allows us to track which WooCommerce product corresponds to each occasion

ALTER TABLE occasions 
ADD COLUMN IF NOT EXISTS woo_product_id INTEGER UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_occasions_woo_product_id ON occasions(woo_product_id);

-- Add comment
COMMENT ON COLUMN occasions.woo_product_id IS 'WooCommerce product ID for sync tracking';

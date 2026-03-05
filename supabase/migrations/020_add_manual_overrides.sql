-- Add manual_overrides column to track fields that should not be overwritten by WooCommerce sync
-- This allows selective field-level control: if a field is manually edited in Bikerfun,
-- it won't be overwritten during the next WooCommerce sync

-- Add to occasions table
ALTER TABLE occasions 
ADD COLUMN IF NOT EXISTS manual_overrides JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN occasions.manual_overrides IS 'Array of field names that have been manually edited and should not be overwritten by WooCommerce sync. Example: ["description", "price", "features"]';

-- Add to webshop_products table
ALTER TABLE webshop_products 
ADD COLUMN IF NOT EXISTS manual_overrides JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN webshop_products.manual_overrides IS 'Array of field names that have been manually edited and should not be overwritten by WooCommerce sync. Example: ["description", "price", "stock_quantity"]';

-- Create indexes for better performance when checking overrides
CREATE INDEX IF NOT EXISTS idx_occasions_manual_overrides ON occasions USING gin (manual_overrides);
CREATE INDEX IF NOT EXISTS idx_webshop_products_manual_overrides ON webshop_products USING gin (manual_overrides);

-- Helper function to add a field to manual_overrides
CREATE OR REPLACE FUNCTION add_manual_override(
  table_name TEXT,
  record_id UUID,
  field_name TEXT
) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET manual_overrides = 
      CASE 
        WHEN manual_overrides ? %L THEN manual_overrides
        ELSE manual_overrides || jsonb_build_array(%L)
      END
    WHERE id = %L',
    table_name, field_name, field_name, record_id
  );
END;
$$ LANGUAGE plpgsql;

-- Helper function to remove a field from manual_overrides (reset to WooCommerce)
CREATE OR REPLACE FUNCTION remove_manual_override(
  table_name TEXT,
  record_id UUID,
  field_name TEXT
) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET manual_overrides = manual_overrides - %L
    WHERE id = %L',
    table_name, field_name, record_id
  );
END;
$$ LANGUAGE plpgsql;

-- Helper function to check if a field has manual override
CREATE OR REPLACE FUNCTION has_manual_override(
  overrides JSONB,
  field_name TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN overrides ? field_name;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

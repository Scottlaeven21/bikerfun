-- WooCommerce shipping zones/rates, synced so checkout and the site use the same NL/BE costs.

CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woo_zone_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  countries TEXT[] NOT NULL DEFAULT '{}',
  flat_rate NUMERIC(10, 2),
  free_min NUMERIC(10, 2),
  always_free BOOLEAN NOT NULL DEFAULT false,
  method_title TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_countries ON shipping_rates USING GIN (countries);

ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view shipping rates" ON shipping_rates;
CREATE POLICY "Public can view shipping rates"
  ON shipping_rates
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage shipping rates" ON shipping_rates;
CREATE POLICY "Admins can manage shipping rates"
  ON shipping_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

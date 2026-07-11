-- Site announcement banners
-- Admin-managed banner shown at the very top of the public website
-- (e.g. vacation notice, temporary closure, shipping delays).

CREATE TABLE IF NOT EXISTS site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content
  title TEXT,
  message TEXT NOT NULL,

  -- Visibility
  is_active BOOLEAN NOT NULL DEFAULT false,

  -- Optional schedule. NULL means "no bound" on that side.
  -- Both dates are inclusive (t/m end_date).
  start_date DATE,
  end_date DATE,

  -- Styling variant for the banner
  variant VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (variant IN ('info', 'warning', 'success')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_banners_is_active ON site_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_site_banners_dates ON site_banners(start_date, end_date);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_site_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_banners_updated_at ON site_banners;
CREATE TRIGGER site_banners_updated_at
  BEFORE UPDATE ON site_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_site_banners_updated_at();

-- Row Level Security
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;

-- Public can read active banners (date filtering happens in the query).
DROP POLICY IF EXISTS "Public can view active banners" ON site_banners;
CREATE POLICY "Public can view active banners"
  ON site_banners
  FOR SELECT
  USING (is_active = true);

-- Admins can read all banners (also inactive ones, for management).
DROP POLICY IF EXISTS "Admins can view all banners" ON site_banners;
CREATE POLICY "Admins can view all banners"
  ON site_banners
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can insert banners" ON site_banners;
CREATE POLICY "Admins can insert banners"
  ON site_banners
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can update banners" ON site_banners;
CREATE POLICY "Admins can update banners"
  ON site_banners
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can delete banners" ON site_banners;
CREATE POLICY "Admins can delete banners"
  ON site_banners
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Seed: vacation / closed banner, active from 2026-07-10 through 2026-07-19.
INSERT INTO site_banners (title, message, is_active, start_date, end_date, variant)
VALUES (
  'We zijn op vakantie - tijdelijk gesloten',
  'Van 10 t/m 19 juli zijn wij op vakantie en daarom gesloten. Bestellingen kunnen gewoon geplaatst worden, maar de verzending duurt langer: bestellingen worden pas na 19 juli verstuurd. Bedankt voor je geduld!',
  true,
  '2026-07-10',
  '2026-07-19',
  'info'
);

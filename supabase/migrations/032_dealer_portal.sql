-- Dealerportaal: accounts, omkeur-aanvragen, formulieren en facturen

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_dealer BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  kvk TEXT,
  vat_number TEXT,
  rdw_recognized TEXT,
  has_workshop TEXT,
  estimated_omkeuren TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS dealers_email_lower_idx ON dealers (lower(email));

CREATE TABLE IF NOT EXISTS dealer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  license_plate TEXT NOT NULL,
  meldcode TEXT NOT NULL,
  vin TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year TEXT,
  notes TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'received' CHECK (
    status IN (
      'received',
      'approved',
      'docs_requested',
      'awaiting_delivery',
      'rdw_submitted',
      'completed'
    )
  ),
  signed_form_status TEXT NOT NULL DEFAULT 'none' CHECK (
    signed_form_status IN ('none', 'waiting', 'received')
  ),
  form_path TEXT,
  form_uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dealer_applications_dealer_idx ON dealer_applications (dealer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS dealer_applications_status_idx ON dealer_applications (status);

CREATE TABLE IF NOT EXISTS dealer_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  application_id UUID REFERENCES dealer_applications(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'paid')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dealer_invoices_dealer_idx ON dealer_invoices (dealer_id, created_at DESC);

CREATE TABLE IF NOT EXISTS dealer_portal_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  form_path TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO dealer_portal_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_portal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY dealers_select_own_or_admin ON dealers
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY dealers_admin_write ON dealers
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY dealer_applications_select ON dealer_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dealers
      WHERE dealers.id = dealer_applications.dealer_id
        AND dealers.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY dealer_applications_admin_write ON dealer_applications
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY dealer_invoices_select ON dealer_invoices
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dealers
      WHERE dealers.id = dealer_invoices.dealer_id
        AND dealers.user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY dealer_invoices_admin_write ON dealer_invoices
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

CREATE POLICY dealer_portal_settings_select ON dealer_portal_settings
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY dealer_portal_settings_admin_write ON dealer_portal_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

INSERT INTO storage.buckets (id, name, public)
VALUES ('dealer-documents', 'dealer-documents', false)
ON CONFLICT (id) DO NOTHING;

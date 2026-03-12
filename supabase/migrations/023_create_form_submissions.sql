-- Form submissions table for contact and motor aanvraag forms
-- Stores all submissions since mailing may not work yet

CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'motor_aanvraag', 'bezichtiging')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  subject TEXT,
  motor_details JSONB,
  page_path TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(type);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (form submissions from website)
CREATE POLICY "Allow public form submissions" ON form_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated admin reads
CREATE POLICY "Allow authenticated reads on form_submissions" ON form_submissions
  FOR SELECT TO authenticated
  USING (true);

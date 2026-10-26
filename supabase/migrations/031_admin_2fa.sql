CREATE TABLE IF NOT EXISTS admin_2fa_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_2fa_codes_user ON admin_2fa_codes(user_id, expires_at DESC);

ALTER TABLE admin_2fa_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages admin 2fa codes"
  ON admin_2fa_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

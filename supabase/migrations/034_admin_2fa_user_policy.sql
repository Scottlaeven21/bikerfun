-- 2FA-codes mogen door de ingelogde admin zelf worden weggeschreven.
-- Normale mail gebruikt geen tabel; 2FA wel. Zonder deze policy faalt 2FA
-- ook als SMTP verder prima werkt.

GRANT SELECT, INSERT, UPDATE ON admin_2fa_codes TO authenticated;

DROP POLICY IF EXISTS "Users manage own admin 2fa codes" ON admin_2fa_codes;
CREATE POLICY "Users manage own admin 2fa codes"
  ON admin_2fa_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

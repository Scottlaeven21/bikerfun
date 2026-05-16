-- Sta admins toe om form submissions (inzendingen) te verwijderen vanuit het
-- admin dashboard. Voorheen waren alleen INSERT (publiek) en SELECT
-- (authenticated) toegestaan, waardoor de admin het overzicht niet kon
-- opschonen.

CREATE POLICY "Allow admin deletes on form_submissions"
  ON form_submissions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

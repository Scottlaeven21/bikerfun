ALTER TABLE dealer_invoices
  ADD COLUMN IF NOT EXISTS pdf_path TEXT;

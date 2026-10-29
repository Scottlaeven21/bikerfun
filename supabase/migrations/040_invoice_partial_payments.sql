ALTER TABLE dealer_invoices
  ADD COLUMN IF NOT EXISTS amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0;

UPDATE dealer_invoices
SET amount_paid = amount
WHERE status = 'paid' AND amount_paid = 0;

ALTER TABLE dealer_invoices
  DROP CONSTRAINT IF EXISTS dealer_invoices_status_check;

ALTER TABLE dealer_invoices
  ADD CONSTRAINT dealer_invoices_status_check
  CHECK (status IN ('open', 'partial', 'paid'));

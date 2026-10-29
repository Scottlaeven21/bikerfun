ALTER TABLE dealer_applications
  DROP CONSTRAINT IF EXISTS dealer_applications_status_check;

ALTER TABLE dealer_applications
  ADD CONSTRAINT dealer_applications_status_check
  CHECK (
    status IN (
      'received',
      'approved',
      'docs_requested',
      'awaiting_delivery',
      'rdw_submitted',
      'completed',
      'not_possible',
      'invoiced',
      'paid'
    )
  );

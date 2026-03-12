-- Add 'bezichtiging' type to form_submissions for occasion viewing requests
ALTER TABLE form_submissions DROP CONSTRAINT IF EXISTS form_submissions_type_check;
ALTER TABLE form_submissions ADD CONSTRAINT form_submissions_type_check 
  CHECK (type IN ('contact', 'motor_aanvraag', 'bezichtiging'));

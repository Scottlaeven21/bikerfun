ALTER TABLE public.dealers
  ADD COLUMN IF NOT EXISTS email_updates TEXT NOT NULL DEFAULT 'all';

ALTER TABLE public.dealers
  DROP CONSTRAINT IF EXISTS dealers_email_updates_check;

ALTER TABLE public.dealers
  ADD CONSTRAINT dealers_email_updates_check
  CHECK (email_updates IN ('all', 'action', 'none'));

ALTER TABLE public.dealer_applications
  ADD COLUMN IF NOT EXISTS proceed_on_approval BOOLEAN NOT NULL DEFAULT FALSE;

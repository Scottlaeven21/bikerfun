ALTER TABLE public.dealer_applications
  ALTER COLUMN vin DROP NOT NULL;

ALTER TABLE public.dealer_applications
  ADD COLUMN IF NOT EXISTS vin_image_path TEXT;

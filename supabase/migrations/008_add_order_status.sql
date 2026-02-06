-- Add a combined status column to orders for easier querying
-- This combines payment_status and fulfillment_status into one readable status
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT;

-- Update existing orders with a combined status
UPDATE orders 
SET status = CASE 
  WHEN payment_status = 'paid' AND fulfillment_status = 'delivered' THEN 'completed'
  WHEN payment_status = 'paid' AND fulfillment_status IN ('fulfilled', 'shipped') THEN 'processing'
  WHEN payment_status = 'paid' THEN 'paid'
  WHEN payment_status = 'pending' THEN 'pending'
  WHEN payment_status = 'failed' THEN 'failed'
  WHEN fulfillment_status = 'cancelled' THEN 'cancelled'
  ELSE 'pending'
END
WHERE status IS NULL;

-- Set default value for new orders
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Add check constraint for valid status values
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'failed', 'cancelled', 'refunded'));

-- Create function to auto-update status based on payment and fulfillment
CREATE OR REPLACE FUNCTION update_order_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status := CASE 
    WHEN NEW.payment_status = 'paid' AND NEW.fulfillment_status = 'delivered' THEN 'completed'
    WHEN NEW.payment_status = 'paid' AND NEW.fulfillment_status IN ('fulfilled', 'shipped') THEN 'processing'
    WHEN NEW.payment_status = 'paid' THEN 'paid'
    WHEN NEW.payment_status = 'pending' THEN 'pending'
    WHEN NEW.payment_status = 'failed' THEN 'failed'
    WHEN NEW.payment_status = 'refunded' THEN 'refunded'
    WHEN NEW.fulfillment_status = 'cancelled' THEN 'cancelled'
    ELSE 'pending'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update status
DROP TRIGGER IF EXISTS update_order_status_trigger ON orders;
CREATE TRIGGER update_order_status_trigger
  BEFORE INSERT OR UPDATE OF payment_status, fulfillment_status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_order_status();

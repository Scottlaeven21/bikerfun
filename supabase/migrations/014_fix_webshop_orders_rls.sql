-- Fix RLS policies for webshop orders
-- Anonymous users need to be able to create orders during checkout

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.webshop_orders;
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.webshop_order_items;

-- Allow anonymous users to INSERT orders (for checkout)
CREATE POLICY "Anonymous users can create orders"
  ON public.webshop_orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to INSERT order items (for checkout)
CREATE POLICY "Anonymous users can create order items"
  ON public.webshop_order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role (API) to do everything
CREATE POLICY "Service role can manage orders"
  ON public.webshop_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage order items"
  ON public.webshop_order_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admin) can UPDATE/DELETE orders
CREATE POLICY "Authenticated users can update orders"
  ON public.webshop_orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON public.webshop_orders
  FOR DELETE
  TO authenticated
  USING (true);

-- Comments
COMMENT ON POLICY "Anonymous users can create orders" ON public.webshop_orders 
  IS 'Allow checkout without login';
COMMENT ON POLICY "Anonymous users can create order items" ON public.webshop_order_items 
  IS 'Allow checkout without login';

-- Remove checkout/test products from the public catalog.
-- Run this in the Supabase SQL Editor. Safe to re-run.

DELETE FROM webshop_products
WHERE woo_product_id IN (3048, 3069, 4108)
   OR LOWER(name) LIKE '%do not order%'
   OR LOWER(name) LIKE '%niet bestellen%'
   OR LOWER(name) LIKE 'testhelmetcover%'
   OR LOWER(name) LIKE 'test hanger%'
   OR LOWER(name) LIKE 'test product%';

-- Add product images to existing products
-- Update products with appropriate images based on their category and name

-- Update helmet products
UPDATE products
SET image_url = '/helmet-black-yellow.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'helmen')
AND image_url IS NULL;

-- Update jacket products  
UPDATE products
SET image_url = '/product-jacket.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'jassen')
AND image_url IS NULL;

-- Update helmet cover products
UPDATE products
SET image_url = '/product-helmet-cover.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'helmet-covers')
AND image_url IS NULL;

-- Update keychain products
UPDATE products
SET image_url = '/product-keychain.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'sleutelhangers')
AND image_url IS NULL;

-- Update overige/accessories products
UPDATE products
SET image_url = '/product-accessories.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'overige')
AND image_url IS NULL;

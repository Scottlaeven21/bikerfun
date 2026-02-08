-- Update product images to use white background versions

-- Update helmet products
UPDATE products 
SET image_url = '/product-helmet-white-bg.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'helmen')
AND image_url IS NOT NULL;

-- Update jacket products
UPDATE products 
SET image_url = '/product-jacket-white-bg.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'jassen')
AND image_url IS NOT NULL;

-- Update gloves (if any exist in overige or separate category)
UPDATE products 
SET image_url = '/product-gloves-white-bg.jpg'
WHERE LOWER(name) LIKE '%handschoen%'
AND image_url IS NOT NULL;

-- Update keychain products
UPDATE products 
SET image_url = '/product-keychain-white-bg.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'sleutelhangers')
AND image_url IS NOT NULL;

-- Update helmet cover products
UPDATE products 
SET image_url = '/product-helmet-cover-white-bg.jpg'
WHERE category_id = (SELECT id FROM categories WHERE slug = 'helmet-covers')
AND image_url IS NOT NULL;

-- Update maintenance/accessories products in "Overige" category
UPDATE products 
SET image_url = CASE 
  WHEN LOWER(name) LIKE '%onderhouds%' OR LOWER(name) LIKE '%schoonmaak%' 
    THEN '/product-maintenance-white-bg.jpg'
  ELSE '/product-accessories-white-bg.jpg'
END
WHERE category_id = (SELECT id FROM categories WHERE slug = 'overige')
AND image_url IS NOT NULL;

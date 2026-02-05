-- Update categories for webshop
-- Remove old categories that are not needed
DELETE FROM categories WHERE slug IN ('handschoenen', 'laarzen', 'accessoires');

-- Insert new categories if they don't exist
INSERT INTO categories (name, slug, description) 
VALUES
  ('Helmet Covers', 'helmet-covers', 'Stoere helmet covers voor je motor helm'),
  ('Sleutelhangers', 'sleutelhangers', 'Motor sleutelhangers en accessoires'),
  ('Overige', 'overige', 'Overige motor accessoires en gadgets')
ON CONFLICT (slug) DO NOTHING;

-- Update existing categories descriptions
UPDATE categories 
SET description = 'Premium motor helmen voor veiligheid en comfort'
WHERE slug = 'helmen';

UPDATE categories 
SET description = 'Stoere motor jassen en beschermende kleding'
WHERE slug = 'jassen';

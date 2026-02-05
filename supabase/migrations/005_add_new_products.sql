-- Add example products for new categories

-- Helmet Covers
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock, image_url, is_featured) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'helmet-covers'),
    'Shark Helmet Cover',
    'shark-helmet-cover',
    'Stoere haai helmet cover. Perfect voor een opvallende look op de weg. Geschikt voor de meeste helmen.',
    24.99,
    29.99,
    50,
    '/product-helmet-cover.jpg',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'helmet-covers'),
    'Cat Helmet Cover',
    'cat-helmet-cover',
    'Leuke poes helmet cover. Trekt veel bekijks en zorgt voor leuke interacties. Volg de instructies voor perfecte pasvorm.',
    24.99,
    NULL,
    45,
    '/product-helmet-cover.jpg',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'helmet-covers'),
    'Dog Helmet Cover',
    'dog-helmet-cover',
    'Grappige honden helmet cover. Wordt geleverd met instructies. Past op de meeste helmtypes.',
    24.99,
    29.99,
    40,
    '/product-helmet-cover.jpg',
    false
  );

-- Sleutelhangers
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock, image_url, is_featured) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'sleutelhangers'),
    'Motor Sleutelhanger Set',
    'motor-sleutelhanger-set',
    'Set van 3 stoere motor sleutelhangers. Perfect cadeau voor motorliefhebbers.',
    9.99,
    14.99,
    100,
    '/product-keychain.jpg',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'sleutelhangers'),
    'Helm Sleutelhanger',
    'helm-sleutelhanger',
    'Mini helm sleutelhanger. Metalen uitvoering met detail.',
    7.99,
    NULL,
    80,
    '/product-keychain.jpg',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'sleutelhangers'),
    'Custom Motor Sleutelhanger',
    'custom-motor-sleutelhanger',
    'Personaliseerbare sleutelhanger met je eigen motortype.',
    12.99,
    NULL,
    60,
    '/product-keychain.jpg',
    false
  );

-- Overige
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock, image_url, is_featured) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'overige'),
    'Motor Onderhoud Set',
    'motor-onderhoud-set',
    'Complete onderhoud set voor je motor. Inclusief reinigingsmiddelen en doeken.',
    39.99,
    49.99,
    30,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'overige'),
    'Motor Cover',
    'motor-cover',
    'Waterdichte motor hoes. Beschermt tegen weer en wind. Verschillende maten beschikbaar.',
    59.99,
    NULL,
    25,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'overige'),
    'Tank Pad',
    'tank-pad',
    'Anti-slip tank pad. Beschermt je tank tegen krassen en geeft extra grip.',
    19.99,
    24.99,
    50,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    false
  );

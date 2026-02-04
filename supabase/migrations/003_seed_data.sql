-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES
  ('Helmen', 'helmen', 'Veiligheidshelmen voor motorrijders'),
  ('Jassen', 'jassen', 'Motor jassen en beschermende kleding'),
  ('Handschoenen', 'handschoenen', 'Motor handschoenen voor alle seizoenen'),
  ('Laarzen', 'laarzen', 'Motor laarzen en schoenen'),
  ('Accessoires', 'accessoires', 'Motor accessoires en gadgets');

-- Seed Products (example data)
INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock, image_url, is_featured) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'helmen'),
    'AGV K1 Integraalhelm',
    'agv-k1-integraalhelm',
    'Hoogwaardige integraalhelm met uitstekende veiligheid en comfort. Ideaal voor lange ritten.',
    299.99,
    349.99,
    15,
    'https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'jassen'),
    'Dainese Racing Jacket',
    'dainese-racing-jacket',
    'Premium racing jas met CE-goedgekeurde beschermers en optimale ventilatie.',
    449.99,
    549.99,
    8,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'handschoenen'),
    'Alpinestars GP Pro Handschoenen',
    'alpinestars-gp-pro-handschoenen',
    'Racing handschoenen met koolstofvezel beschermers en superieure grip.',
    159.99,
    NULL,
    25,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'laarzen'),
    'TCX Street Ace Laarzen',
    'tcx-street-ace-laarzen',
    'Casual motor laarzen met CE-certificering en waterbestendig leer.',
    189.99,
    219.99,
    12,
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'accessoires'),
    'Sena 20S Bluetooth Headset',
    'sena-20s-bluetooth-headset',
    'Premium Bluetooth communicatiesysteem voor motorhelmen met uitstekende geluidskwaliteit.',
    299.99,
    NULL,
    20,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'jassen'),
    'Rev''it Sand 3 Jacket',
    'revit-sand-3-jacket',
    'Adventure touring jas met waterdichte membraan en thermolaag.',
    549.99,
    649.99,
    6,
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    false
  ),
  (
    (SELECT id FROM categories WHERE slug = 'helmen'),
    'Shoei NXR2 Integraalhelm',
    'shoei-nxr2-integraalhelm',
    'Premium Japanse helm met superieure aerodynamica en geluidsdemping.',
    499.99,
    NULL,
    10,
    'https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800',
    true
  ),
  (
    (SELECT id FROM categories WHERE slug = 'handschoenen'),
    'Held Air n Dry Handschoenen',
    'held-air-n-dry-handschoenen',
    'Waterdichte touring handschoenen voor alle weersomstandigheden.',
    89.99,
    109.99,
    30,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800',
    false
  );

-- Note: To create an admin user, you need to:
-- 1. Sign up through the app
-- 2. Then run this query with your user ID:
-- UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';

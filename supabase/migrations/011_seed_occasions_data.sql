-- Seed initial occasions data
-- Insert Suzuki GSX-R 600
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, images, main_image, slug
) VALUES (
  'Suzuki',
  'GSX-R 600',
  2011,
  6950.00,
  'available',
  true,
  28500,
  'Handgeschakeld',
  'Benzine',
  '125 pk',
  'Mat Zwart',
  'Sport',
  '{
    "engine": "599cc 4-cilinder",
    "cylinders": "4",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Ketting",
    "weight": "196 kg",
    "seatHeight": "810 mm",
    "tankCapacity": "17 liter",
    "topSpeed": "260 km/u"
  }'::jsonb,
  'Zeer goed',
  2,
  'Volledig',
  '3 maanden volledige garantie',
  ARRAY['ABS', 'Aftermarket Uitlaat', 'Carbon Tank Pad', 'LED Achterlicht'],
  ARRAY['Aftermarket uitlaatsysteem', 'Carbon tank pad', 'Geanodiseerde remhendels', 'LED achterlicht', 'Zwart gespoten velgen'],
  'Deze Suzuki GSX-R 600 uit 2011 is een echte sportmotor die klaarstaat voor de volgende eigenaar. Met zijn 125 pk sterke viercilinder motor en slechts 28.500 km op de teller, biedt deze GSX-R nog jaren rijplezier. De motor is technisch in zeer goede staat en recent voorzien van nieuwe banden. Perfect voor zowel dagelijks gebruik als track days!',
  ARRAY['/suzuki-gsxr-1.jpg', '/suzuki-gsxr-5.jpg', '/suzuki-gsxr-2.jpg', '/suzuki-gsxr-3.jpg', '/suzuki-gsxr-4.jpg'],
  '/suzuki-hero-v2.png',
  'suzuki-gsxr-600-2011'
);

-- Insert Harley-Davidson Street Bob 114
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, main_image, slug
) VALUES (
  'Harley-Davidson',
  'Street Bob 114',
  2021,
  18950.00,
  'available',
  true,
  12500,
  'Handgeschakeld',
  'Benzine',
  '94 pk',
  'Vivid Black',
  'Cruiser',
  '{
    "engine": "1868cc V-Twin",
    "cylinders": "2",
    "cooling": "Luchtgekoeld",
    "gears": "6",
    "finalDrive": "Riem",
    "weight": "296 kg",
    "seatHeight": "675 mm",
    "tankCapacity": "13.2 liter",
    "topSpeed": "180 km/u"
  }'::jsonb,
  'Uitstekend',
  1,
  'Volledig',
  '6 maanden volledige garantie',
  ARRAY['ABS', 'Cruise Control', 'LED Verlichting', 'Sissybar', 'Wegklapbare Passagiersvoetsteunen'],
  ARRAY['Custom uitlaat', 'Vance & Hines slip-ons', 'Zwart uitgevoerd', 'Nieuw achterband'],
  'Deze Harley-Davidson Street Bob 114 uit 2021 is een echte eye-catcher. Met zijn minimalistische bobber-stijl en krachtige Milwaukee-Eight 114 motor levert hij puur rijplezier. De motor is in uitstekende staat, technisch perfect onderhouden en direct rijklaar. Kom hem proefrijden!',
  '/harley-street-bob.jpg',
  'harley-davidson-street-bob-114-2021'
);

-- Insert Yamaha MT-09
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, main_image, slug
) VALUES (
  'Yamaha',
  'MT-09',
  2022,
  11450.00,
  'available',
  true,
  8200,
  'Handgeschakeld',
  'Benzine',
  '119 pk',
  'Tech Black',
  'Naked',
  '{
    "engine": "890cc 3-cilinder",
    "cylinders": "3",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Ketting",
    "weight": "193 kg",
    "seatHeight": "825 mm",
    "tankCapacity": "14 liter",
    "topSpeed": "220 km/u"
  }'::jsonb,
  'Als nieuw',
  1,
  'Volledig bij Yamaha dealer',
  '12 maanden fabrieksgarantie',
  ARRAY['ABS', 'Traction Control', 'Quickshifter', 'TFT Display', 'Riding Modes'],
  ARRAY['Quickshifter', 'TFT kleurenscherm', 'LED verlichting', 'Riding modes'],
  'De Yamaha MT-09 uit 2022 in showroomstaat! Deze naked bike combineert comfort met sportieve prestaties. De krachtige 890cc driecilinder motor levert soepel vermogen over het hele toerentalbereik. Perfect onderhouden, originele staat en altijd gestald.',
  '/yamaha-mt09.jpg',
  'yamaha-mt09-2022'
);

-- Insert Ducati Monster 937
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, main_image, slug
) VALUES (
  'Ducati',
  'Monster 937',
  2023,
  13495.00,
  'available',
  true,
  3200,
  'Handgeschakeld',
  'Benzine',
  '111 pk',
  'Ducati Red',
  'Naked',
  '{
    "engine": "937cc L-Twin",
    "cylinders": "2",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Ketting",
    "weight": "188 kg",
    "seatHeight": "820 mm",
    "tankCapacity": "14 liter",
    "topSpeed": "210 km/u"
  }'::jsonb,
  'Uitstekend',
  1,
  'Volledig bij Ducati dealer',
  '18 maanden fabrieksgarantie',
  ARRAY['Cornering ABS', 'Traction Control', 'Keyless', 'TFT Display'],
  ARRAY['Keyless systeem', 'TFT display', 'Cornering ABS', 'LED verlichting'],
  'Deze Ducati Monster 937 uit 2023 is een moderne interpretatie van een iconisch model. Met zijn Testastretta 11° L-twin motor en minimalistisch Italiaans design is dit een pure rijmachine. Technisch perfect, weinig kilometers, en klaar voor nieuwe avonturen.',
  '/ducati-monster.jpg',
  'ducati-monster-937-2023'
);

-- Insert BMW R 1250 GS Adventure
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, main_image, slug
) VALUES (
  'BMW',
  'R 1250 GS Adventure',
  2022,
  19995.00,
  'available',
  true,
  8500,
  'Handgeschakeld',
  'Benzine',
  '136 pk',
  'Triple Black',
  'Adventure',
  '{
    "engine": "1254cc Boxer Twin",
    "cylinders": "2",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Cardan",
    "weight": "249 kg",
    "seatHeight": "890 mm",
    "tankCapacity": "30 liter",
    "topSpeed": "200 km/u"
  }'::jsonb,
  'Zeer goed',
  1,
  'Volledig bij BMW Motorrad',
  '12 maanden volledige garantie',
  ARRAY['Dynamic ESA', 'Cruise Control', 'Keyless', 'GPS Navigation'],
  ARRAY['GPS navigatie', 'Dynamic ESA', 'Koffers', 'Cruise control', 'Keyless', 'Verwarmde handvaten'],
  'De ultieme adventure bike! Deze BMW R 1250 GS Adventure uit 2022 is gebouwd voor lange afstanden en elk terrein. Met Dynamic ESA, cruise control, GPS navigatie en koffers is hij klaar voor jouw volgende avontuur. Zeer goed onderhouden met volledige servicehistorie.',
  '/bmw-r1250gs.jpg',
  'bmw-r1250gs-adventure-2022'
);

-- Insert Kawasaki Ninja H2 SX
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, slug
) VALUES (
  'Kawasaki',
  'Ninja H2 SX',
  2023,
  24995.00,
  'available',
  true,
  1200,
  'Handgeschakeld',
  'Benzine',
  '200 pk',
  'Emerald Blazed Green',
  'Sport Touring',
  '{
    "engine": "998cc Supercharged Inline-4",
    "cylinders": "4",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Ketting",
    "weight": "260 kg",
    "seatHeight": "835 mm",
    "tankCapacity": "19 liter",
    "topSpeed": "299 km/u"
  }'::jsonb,
  'Als nieuw',
  1,
  'Eerste service gedaan',
  '24 maanden fabrieksgarantie',
  ARRAY['Supercharged', 'Cornering ABS', 'Quick Shifter', 'TFT Display'],
  ARRAY['Supercharger', 'Cornering ABS', 'Quick shifter', 'Koffers', 'TFT display', 'Cruise control'],
  'Unieke kans! Kawasaki Ninja H2 SX met supercharged motor. Deze sport-tourer combineert extreme prestaties met touring comfort. Met slechts 1200 km vrijwel nieuw. De supercharged 998cc motor levert 200 pk en een ervaring die je nergens anders vindt.',
  'kawasaki-ninja-h2-sx-2023'
);

-- Insert Triumph Speed Triple 1200 RS
INSERT INTO occasions (
  brand, model, year, price, status, is_active,
  mileage, transmission, fuel, power, color, category,
  specs, condition, owners, service_history, warranty,
  features, extras, description, slug
) VALUES (
  'Triumph',
  'Speed Triple 1200 RS',
  2024,
  18995.00,
  'available',
  true,
  450,
  'Handgeschakeld',
  'Benzine',
  '180 pk',
  'Storm Grey',
  'Naked',
  '{
    "engine": "1160cc Triple",
    "cylinders": "3",
    "cooling": "Vloeistofgekoeld",
    "gears": "6",
    "finalDrive": "Ketting",
    "weight": "199 kg",
    "seatHeight": "830 mm",
    "tankCapacity": "15.5 liter",
    "topSpeed": "240 km/u"
  }'::jsonb,
  'Als nieuw',
  1,
  'Eerste service bij Triumph dealer',
  '24 maanden fabrieksgarantie',
  ARRAY['Öhlins Suspension', 'Brembo Brakes', 'Quick Shifter', 'Riding Modes'],
  ARRAY['Öhlins Smart EC 2.0', 'Brembo Stylema', 'Carbon details', 'Quick shifter', 'TFT display', 'Rijmodi'],
  'De nieuwe Triumph Speed Triple 1200 RS uit 2024, vrijwel ongebruikt! Met Öhlins semi-actieve suspension, Brembo Stylema remmen en 180 pk uit de 1160cc triple motor is dit de ultieme naked bike. Premium afwerking, alle opties, en in perfecte staat.',
  'triumph-speed-triple-1200-rs-2024'
);

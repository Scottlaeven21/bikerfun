-- Homepage Google reviews + overall score, managed from admin.

CREATE TABLE IF NOT EXISTS review_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  overall_score NUMERIC(2, 1) NOT NULL DEFAULT 4.8
    CHECK (overall_score >= 1 AND overall_score <= 5),
  review_count INTEGER NOT NULL DEFAULT 6 CHECK (review_count >= 0),
  google_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  body TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  date_label TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_reviews_active_sort
  ON site_reviews (is_active, sort_order, created_at);

ALTER TABLE review_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view review settings" ON review_settings;
CREATE POLICY "Public can view review settings"
  ON review_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active reviews" ON site_reviews;
CREATE POLICY "Public can view active reviews"
  ON site_reviews FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage review settings" ON review_settings;
CREATE POLICY "Admins can manage review settings"
  ON review_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins can view all reviews" ON site_reviews;
CREATE POLICY "Admins can view all reviews"
  ON site_reviews FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins can insert reviews" ON site_reviews;
CREATE POLICY "Admins can insert reviews"
  ON site_reviews FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins can update reviews" ON site_reviews;
CREATE POLICY "Admins can update reviews"
  ON site_reviews FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

DROP POLICY IF EXISTS "Admins can delete reviews" ON site_reviews;
CREATE POLICY "Admins can delete reviews"
  ON site_reviews FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

INSERT INTO review_settings (id, overall_score, review_count, google_url)
VALUES (
  1,
  4.8,
  6,
  'https://www.google.nl/search?q=bikerfun&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_8gyC0rTtSmLJNjwf_0P8Zgv-oK4ZO2iIPyAWdfc7vGBuzmS2kjxSKeonGahwLRn4sRgIqs%3D&uds=AJ5uw1-CsN_VmOWvV4nQCD6b3IOKEoAIaIAYgoXXwOoqSRP6Qe-Vwn507Kk-kQ8kzV7WWE_fjN6hbQI9Ju4wJhmSX57fw0RtAXvWLjTWH4NTUJZjxHxlR5U&sa=X'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO site_reviews (author, body, rating, date_label, is_verified, is_active, sort_order)
SELECT * FROM (VALUES
  ('Lars Gelissen', 'Ik heb onlangs een Yamaha R6 uit 2002 gekocht bij Bikerfun en ben ontzettend tevreden over de service! De motor kon ik voor een hele mooie prijs meenemen.', 5, '3 maanden geleden', true, true, 1),
  ('Duncan Boek', 'Afspraak maken ging makkelijk en was flexibel met zijn openingstijden. De verkoper weet echt waar hij het over heeft, communiceert snel en vriendelijk. Erg tevreden!', 5, '1 maand geleden', true, true, 2),
  ('Kylian Bogers', '3 maanden geleden hier mijn motor gekocht en ik ben op alle vlakken super tevreden. Super snelle en professionele service. Een paar weken geleden iets voor motor nodig gehad en werd direct geholpen!', 5, '3 maanden geleden', true, true, 3),
  ('Eelko ten Wolde', 'Ik kwam kijken voor een R6 voor mijn zoon en die heb ik ook gekocht. De eigenaar is een ambitieuze jonge man die weet waar hij het over heeft. Mooie motoren voor een realistische prijs. Die gaat het nog ver schoppen!', 5, '4 maanden geleden', true, true, 4),
  ('Tim Wagner', 'Hier een helmcover besteld. Snel en netjes geholpen. Prima kwaliteit. Gewoon lekker mee cruisen, krijg je veel leuke interactie. Oja gebruik de instructies de eerste keer! Het past.', 5, '8 maanden geleden', true, true, 5),
  ('Boran', 'Fantastische service bij BikerFun! Mijn Yamaha R6 laten omkeuren naar 35kW – alles is vlot verlopen en binnen 2 weken waren de papieren in orde. Zeker aan te raden, ook super goede A2 motoren te koop!', 5, '8 maanden geleden', true, true, 6)
) AS seed(author, body, rating, date_label, is_verified, is_active, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM site_reviews LIMIT 1);

# Inzendingen Setup - Bikerfun

## Overzicht

De admin heeft een **Inzendingen** tab waar alle formulierinzendingen per type worden getoond:
- **Contactformulier** - Algemene contactberichten
- **Bezichtiging inplannen** - Aanvragen voor een specifieke occasion
- **Motor op aanvraag** - Algemene motor zoekopdrachten

## Database Migratie

Voer de migratie uit via **Supabase Dashboard** → **SQL Editor**:

```sql
-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'motor_aanvraag', 'bezichtiging')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  subject TEXT,
  motor_details JSONB,
  page_path TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_type ON form_submissions(type);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public form submissions" ON form_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated reads on form_submissions" ON form_submissions
  FOR SELECT TO authenticated USING (true);
```

**Als je de tabel al hebt:** voer alleen dit uit om het type 'bezichtiging' toe te voegen:
```sql
ALTER TABLE form_submissions DROP CONSTRAINT IF EXISTS form_submissions_type_check;
ALTER TABLE form_submissions ADD CONSTRAINT form_submissions_type_check 
  CHECK (type IN ('contact', 'motor_aanvraag', 'bezichtiging'));
```

## Form types

| Type | Bron |
|------|------|
| contact | Contactpagina formulier |
| bezichtiging | "Plan Bezichtiging" op occasion pagina |
| motor_aanvraag | "Motor op Aanvraag" algemene pagina |

# Inzendingen Setup - Bikerfun

## Overzicht

De admin heeft nu een **Inzendingen** tab waar alle contactformulier en motor op aanvraag inzendingen worden getoond. Dit is handig omdat de mailing nog niet werkt - alle inzendingen worden nu opgeslagen in de database.

## Database Migratie

Voer de migratie uit via **Supabase Dashboard** → **SQL Editor**:

```sql
-- Form submissions table for contact and motor aanvraag forms
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'motor_aanvraag')),
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

Of voer de migratie uit: `supabase/migrations/023_create_form_submissions.sql`

## Wat er werkt

- **Contactformulier** - Alle inzendingen worden opgeslagen met naam, email, telefoon, onderwerp en bericht
- **Motor op Aanvraag** - Alle aanvragen worden opgeslagen inclusief motor details
- **Admin Inzendingen** - Bekijk alle inzendingen via Admin → Inzendingen
- Inzendingen worden altijd opgeslagen, ook als de email niet werkt

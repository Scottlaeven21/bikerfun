# 📁 Supabase Storage Setup voor Afbeelding Uploads

## Waarom nodig?
Je kunt nu afbeeldingen uploaden van je computer in het admin panel. Deze worden opgeslagen in Supabase Storage.

## Setup Instructies

### Optie 1: Via SQL Editor (Snelst)

1. **Open Supabase Dashboard**
   - Ga naar https://supabase.com/dashboard
   - Selecteer je project

2. **Open SQL Editor**
   - Klik op "SQL Editor" in het linker menu
   - Klik op "New Query"

3. **Voer SQL uit**
   - Kopieer de VOLLEDIGE inhoud van `supabase/migrations/013_create_images_storage.sql`
   - Plak in de SQL Editor
   - Klik op "Run" (of druk Ctrl+Enter)

4. **Verificatie**
   - Ga naar "Storage" in het linker menu
   - Je zou een bucket genaamd "images" moeten zien
   - De bucket is **PUBLIC** (afbeeldingen zijn toegankelijk via URL)

### Optie 2: Via Supabase Dashboard UI

1. **Open Storage**
   - Ga naar https://supabase.com/dashboard
   - Klik op "Storage" in het linker menu

2. **Create Bucket**
   - Klik op "New bucket"
   - Name: `images`
   - Public bucket: **✅ AAN** (belangrijk!)
   - Klik "Save"

3. **Set Policies**
   - Klik op de `images` bucket
   - Ga naar "Policies"
   - Voeg toe:
     * "Public read access" (iedereen kan afbeeldingen bekijken)
     * "Authenticated users can upload" (ingelogde admins kunnen uploaden)

## Testen

1. **Login in Admin Panel**
   - Ga naar `/admin/occasions/new`

2. **Upload Test**
   - Klik op "📁 Upload van computer" bij hoofdafbeelding
   - Selecteer een afbeelding van je computer
   - De afbeelding wordt geüpload en preview verschijnt

3. **URL Check**
   - De geüploade URL ziet er zo uit:
   - `https://[project-ref].supabase.co/storage/v1/object/public/images/occasions/[filename].jpg`

## Troubleshooting

**Error: "Bucket does not exist"**
- Voer stap 1 (SQL) opnieuw uit
- Check of de bucket naam exact `images` is (lowercase)

**Error: "Permission denied"**
- Check of je bent ingelogd in het admin panel
- Check of de bucket **public** is ingesteld

**Afbeelding laadt niet**
- Check of de bucket policy op "public read" staat
- Verifieer de URL in je browser

## Opslag Limiet

- **Gratis plan**: 1GB storage
- **Pro plan**: 100GB storage
- Afbeeldingen worden automatisch gecomprimeerd door de browser
- Aanbevolen: upload afbeeldingen < 2MB per stuk

## Volgende Stap

Na het uitvoeren van deze setup kun je:
- ✅ Afbeeldingen uploaden van je computer
- ✅ URLs automatisch invullen
- ✅ Afbeeldingen direct preview zien
- ✅ Blijft ook werken met handmatige URL input

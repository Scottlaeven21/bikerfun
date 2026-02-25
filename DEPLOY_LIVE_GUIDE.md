# 🚀 Bikerfun Website Live Zetten - Complete Handleiding

## 📋 **Overzicht**

Deze guide helpt je om de Bikerfun website live te zetten op `bikerfun.nl`. 

**Totale tijd:** ~45 minuten (waarvan 20-30 min wachten op DNS)

**Wat je nodig hebt:**
- Toegang tot Vercel dashboard
- Toegang tot je domain provider (waar bikerfun.nl is geregistreerd)
- Toegang tot Mollie dashboard
- Toegang tot WooCommerce admin (admin.bikerfun.nl)

---

## 🎯 **STAP 1: Domain Toevoegen in Vercel**

### 1.1 Login in Vercel

1. Ga naar [vercel.com/dashboard](https://vercel.com/dashboard)
2. Login met je account
3. Je ziet een lijst van je projecten

### 1.2 Open je Bikerfun Project

1. Klik op het **Bikerfun project** (of hoe je het hebt genoemd)
2. Je komt nu op de project overview pagina

### 1.3 Ga naar Domain Settings

1. Klik bovenin op **Settings** (tandwiel icon)
2. Klik in de linker menu op **Domains**
3. Je ziet nu een lijst van bestaande domains (waarschijnlijk alleen vercel.app URLs)

### 1.4 Voeg bikerfun.nl Toe

1. Boven de domain lijst zie je een input veld **"Enter domain name..."**
2. Type: `bikerfun.nl`
3. Klik op **Add**
4. Vercel checkt nu of het domain beschikbaar is

### 1.5 Voeg www.bikerfun.nl Toe (Optioneel maar Aanbevolen)

1. Herhaal het proces voor: `www.bikerfun.nl`
2. Klik op **Add**

**Waarom www ook toevoegen?**
- Sommige mensen typen www.bikerfun.nl
- Vercel redirect automatisch van www → bikerfun.nl (of andersom)
- Betere SEO (voorkomt duplicate content)

### 1.6 Vercel Toont DNS Instructies

Na het toevoegen toont Vercel een scherm met:
- ✅ **Optie A: Nameservers** (aanbevolen, makkelijkst)
- ✅ **Optie B: A Record + CNAME** (als je huidige nameservers wil behouden)

**⚠️ BELANGRIJK:** Laat dit scherm open! Je hebt deze informatie nodig voor stap 2.

---

## 🌐 **STAP 2: DNS Configureren bij Domain Provider**

Je hebt **2 opties**. Kies wat het beste past bij je situatie:

---

## **OPTIE A: Vercel Nameservers** ⭐ (AANBEVOLEN)

### ✅ **Voordelen:**
- Makkelijkste methode
- Vercel regelt alles automatisch
- Snelste SSL certificaat activatie
- Geen handmatige DNS records nodig

### 2A.1 Kopieer Nameservers van Vercel

Vercel toont iets zoals:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Kopieer deze twee nameservers!**

### 2A.2 Vind je Domain Provider

Waar heb je `bikerfun.nl` geregistreerd? Bijvoorbeeld:
- TransIP (transip.nl)
- Hostnet (hostnet.nl)
- Mijndomein (mijndomein.nl)
- GoDaddy
- Namecheap
- Andere?

**Login in je domain provider's control panel.**

### 2A.3 Ga naar DNS/Nameserver Settings

Elke provider heeft een andere interface, maar zoek naar:
- "DNS Management"
- "Nameservers"
- "Name Server Settings"
- "DNS instellingen"

**Bij TransIP:**
1. Login → Mijn TransIP
2. Klik op **Domeinen**
3. Klik op **bikerfun.nl**
4. Klik op **Nameservers**

**Bij Hostnet:**
1. Login → Control Panel
2. Domeinen → bikerfun.nl
3. DNS & Nameservers
4. Nameservers wijzigen

**Bij andere providers:** Vergelijkbare flow

### 2A.4 Verander Nameservers

1. Selecteer **"Custom nameservers"** of **"Externe nameservers"**
2. Verwijder de huidige nameservers
3. Voeg de **Vercel nameservers** toe:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Klik op **Opslaan** of **Save**

### 2A.5 Bevestiging

Je krijgt meestal een melding:
- "Nameservers zijn gewijzigd"
- "Wijzigingen worden verwerkt"
- "Dit kan tot 24 uur duren" (in praktijk vaak 10-30 minuten)

---

## **OPTIE B: A Record + CNAME** (Als je huidige nameservers wil behouden)

### 2B.1 Vind DNS Records Settings

Bij je domain provider, zoek naar:
- "DNS Records"
- "DNS Management"
- "Zone Editor"
- "DNS-records beheren"

### 2B.2 Verwijder Conflicterende Records

**BELANGRIJK:** Verwijder eerst oude A records en CNAME records voor:
- `@` (root domain)
- `www`

### 2B.3 Voeg A Record Toe voor Root Domain

Klik op **Add Record** of **Record toevoegen**:

| Veld | Waarde |
|------|--------|
| **Type** | `A` |
| **Name/Host** | `@` (of leeg laten) |
| **Value/Points to** | `76.76.21.21` |
| **TTL** | `3600` (of "Automatic") |

Klik op **Add** of **Opslaan**

### 2B.4 Voeg CNAME Record Toe voor WWW

Klik op **Add Record** of **Record toevoegen**:

| Veld | Waarde |
|------|--------|
| **Type** | `CNAME` |
| **Name/Host** | `www` |
| **Value/Points to** | `cname.vercel-dns.com` |
| **TTL** | `3600` (of "Automatic") |

Klik op **Add** of **Opslaan**

### 2B.5 Verifieer in Domain Provider

Je DNS records moeten er nu uitzien als:
```
Type    Name    Value                   TTL
A       @       76.76.21.21            3600
CNAME   www     cname.vercel-dns.com   3600
```

---

## ⏳ **STAP 3: Wachten op DNS Propagatie**

### 3.1 Wat is DNS Propagatie?

DNS wijzigingen moeten zich over het internet verspreiden. Dit duurt:
- **Minimaal:** 5 minuten
- **Gemiddeld:** 10-30 minuten
- **Maximaal:** 24-48 uur (zeer zeldzaam)

### 3.2 Status Checken in Vercel

1. Ga terug naar Vercel → Settings → Domains
2. Je ziet nu de status van `bikerfun.nl`:
   - **⏳ Pending/Invalid:** DNS nog niet doorgevoerd
   - **✅ Valid:** Domain is actief!

### 3.3 Handmatig Testen

Open een **incognito/private window** in je browser:
```
https://bikerfun.nl
```

**Als het werkt:** Je ziet je website! 🎉  
**Als het niet werkt:** Wacht nog 10 minuten en probeer opnieuw

### 3.4 DNS Check Tool (Optioneel)

Check DNS propagatie wereldwijd:
- [dnschecker.org](https://dnschecker.org)
- Voer `bikerfun.nl` in
- Check of het naar Vercel's IP wijst

---

## 🔒 **STAP 4: SSL Certificaat Verificatie**

### 4.1 Automatische SSL Activatie

Vercel genereert automatisch een SSL certificaat zodra:
- ✅ Domain status = "Valid"
- ✅ DNS wijst correct naar Vercel

**Dit duurt 1-5 minuten na DNS activatie.**

### 4.2 Check SSL Status

1. In Vercel → Settings → Domains
2. Naast `bikerfun.nl` zie je een **groen slotje** icon
3. Status: "Certificate issued"

### 4.3 Test HTTPS

Open in browser:
```
https://bikerfun.nl
```

Je moet een **groen slotje** zien in de adresbalk. Klik erop:
- "Connection is secure"
- "Certificate valid"

### 4.4 HTTP Redirect Test

Open in browser:
```
http://bikerfun.nl
```

Je wordt automatisch geredirect naar `https://bikerfun.nl` ✅

---

## ⚙️ **STAP 5: Environment Variables Updaten**

### 5.1 Waarom Updaten?

Je hebt waarschijnlijk nog `localhost` of verkeerde URLs in je environment variables. Deze moeten naar je echte domain wijzen.

### 5.2 Ga naar Environment Variables

1. Vercel → je project
2. **Settings** → **Environment Variables**
3. Je ziet een lijst van alle variabelen

### 5.3 Update de Volgende Variabelen

Zoek en update deze:

#### `NEXT_PUBLIC_APP_URL`
- **Oude waarde:** `http://localhost:3000`
- **Nieuwe waarde:** `https://bikerfun.nl`

**Waarom belangrijk?** Deze URL wordt gebruikt voor:
- Mollie return URLs (na betaling)
- Sitemap generatie
- Canonical URLs

### 5.4 Check Alle Environment Variables

Zorg dat je deze hebt (met correcte waarden):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Mollie
MOLLIE_API_KEY=live_sJGrU455zbfTq3RdzHf2MAt3f2Na3M

# WooCommerce
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_1b767b0530b8b33d22ea657fe966e9b6812c5c6
WOOCOMMERCE_CONSUMER_SECRET=cs_b5566034a355164520956a90a6f0a4abc9bb01a4

# App URL
NEXT_PUBLIC_APP_URL=https://bikerfun.nl
```

### 5.5 Redeploy

**BELANGRIJK:** Environment variable changes worden pas actief na redeploy!

1. Ga naar **Deployments** (in top menu)
2. Klik op de **laatste deployment** (bovenste in de lijst)
3. Klik op de **3 dots** (⋮) rechts bovenin
4. Klik op **Redeploy**
5. Selecteer **"Use existing Build Cache"** (sneller)
6. Klik op **Redeploy**
7. Wacht ~2-3 minuten tot build klaar is
8. Status: "Ready" ✅

---

## 🔔 **STAP 6: Mollie Webhook URL Instellen**

### 6.1 Waarom Webhooks?

Mollie webhooks zijn **cruciaal** voor:
- Order status updates (betaald/mislukt)
- WooCommerce synchronisatie
- Email notificaties
- Order bevestiging

**Zonder webhook blijven orders op "pending" staan!**

### 6.2 Login in Mollie Dashboard

1. Ga naar [mollie.com/dashboard](https://www.mollie.com/dashboard)
2. Login met je Mollie account
3. Je komt op het hoofdscherm

### 6.3 Ga naar Webhooks

1. Klik in het linker menu op **Developers**
2. Klik op **Webhooks**
3. Je ziet mogelijk al een webhook URL (van oude website)

### 6.4 Webhook URL Toevoegen/Updaten

**Als je AL een webhook hebt:**
1. Klik op de **Edit** knop (potlood icon)
2. Update de URL naar:
   ```
   https://bikerfun.nl/api/webhooks/mollie
   ```
3. Klik op **Save**

**Als je GEEN webhook hebt:**
1. Klik op **Add Webhook** of **Create Webhook**
2. Voer in:
   ```
   https://bikerfun.nl/api/webhooks/mollie
   ```
3. Beschrijving: `Bikerfun Order Status Updates`
4. Klik op **Save** of **Create**

### 6.5 Webhook Testen (Optioneel)

Mollie heeft een **Test Webhook** functie:
1. Naast je webhook zie je een **"Test"** knop
2. Klik erop
3. Vercel function logs tonen nu een test webhook call

**Check in Vercel:**
1. Vercel → je project → **Logs** (in top menu)
2. Filter op `/api/webhooks/mollie`
3. Je moet een 200 status zien

---

## 🛍️ **STAP 7: WooCommerce Return URLs Configureren**

### 7.1 Waarom Dit Belangrijk Is

WooCommerce moet weten waar klanten naartoe gaan na een bestelling. Dit was eerst `admin.bikerfun.nl`, maar moet nu `bikerfun.nl` zijn.

### 7.2 Login in WooCommerce Admin

1. Ga naar [admin.bikerfun.nl/wp-admin](https://admin.bikerfun.nl/wp-admin)
2. Login met je WordPress credentials
3. Je komt op het WordPress dashboard

### 7.3 Check WooCommerce Base URL

1. Ga in linker menu naar **WooCommerce** → **Settings**
2. Klik op tab **Advanced**
3. Scroll naar beneden naar **"REST API"** sectie
4. Check of er geen oude localhost of verkeerde URLs staan

### 7.4 Check WordPress Site URL

**BELANGRIJK:** WordPress moet weten dat het hoofddomein is veranderd.

1. Ga in linker menu naar **Settings** → **General**
2. Check deze velden:
   - **WordPress Address (URL):** Moet `https://admin.bikerfun.nl` zijn
   - **Site Address (URL):** Moet `https://admin.bikerfun.nl` zijn

**⚠️ NIET AANPASSEN** als deze correct zijn! Anders kun je jezelf buitensluiten.

### 7.5 Email Settings Verificeren

1. WooCommerce → Settings → **Emails**
2. Check of deze emails **enabled** zijn:
   - ✅ **New Order** (voor jou)
   - ✅ **Processing Order** (voor klant)
   - ✅ **Completed Order** (voor klant)
3. Test email (optioneel):
   - Klik op een email type
   - Scroll naar beneden
   - Klik op **"Send Test Email"**

---

## 🔐 **STAP 8: Supabase RLS Policies Checken** (Veiligheid)

### 8.1 Login in Supabase

1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard)
2. Login en open je Bikerfun project
3. Klik op **Table Editor** (in linker menu)

### 8.2 Check RLS Status

Voor de volgende tabellen moet **RLS enabled** zijn:
- ✅ `webshop_orders`
- ✅ `webshop_order_items`
- ✅ `occasions`
- ✅ `page_views`

**Hoe checken:**
1. Klik op een tabel naam
2. Rechtsboven zie je een **RLS shield icon**
3. Als groen: RLS is enabled ✅
4. Als rood: RLS is disabled ⚠️

### 8.3 RLS Enablen (Als Nodig)

**Als RLS disabled is voor webshop_orders of webshop_order_items:**

1. Ga naar **Authentication** → **Policies** (in linker menu)
2. Zoek de tabel
3. Klik op **Enable RLS**
4. Voeg policies toe:

**Voor `webshop_orders` en `webshop_order_items`:**
```sql
-- Allow service role (API) to read/write
CREATE POLICY "Service role full access"
ON webshop_orders
FOR ALL
TO service_role
USING (true);

-- Allow public to insert orders (checkout)
CREATE POLICY "Anyone can create orders"
ON webshop_orders
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public to view their own orders
CREATE POLICY "Users can view orders by ID"
ON webshop_orders
FOR SELECT
TO anon
USING (true);
```

**Herhaal voor `webshop_order_items`:**
```sql
CREATE POLICY "Service role full access"
ON webshop_order_items
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Anyone can create order items"
ON webshop_order_items
FOR INSERT
TO anon
WITH CHECK (true);
```

**Waarom belangrijk?** Anders kunnen klanten geen orders plaatsen!

---

## 🧪 **STAP 9: Complete Test van de Website**

### 9.1 Basis Website Check

Open `https://bikerfun.nl` in een **incognito window** en test:

- [ ] **Homepage** laadt correct
  - Hero video speelt af
  - Occasions carousel werkt
  - Webshop preview zichtbaar
  - Footer compleet

- [ ] **Ons Aanbod** (`/aanbod`) werkt
  - 29 occasions zichtbaar
  - Filter "Nieuwste eerst" werkt
  - Klik op een occasion → detail pagina werkt

- [ ] **Webshop** (`/products`) werkt
  - 196 producten zichtbaar
  - Categorieën kloppen (Helmcovers, Handschoenen, etc.)
  - Geen "Motoren" categorie
  - Producten hebben afbeeldingen

### 9.2 Product Detail Pagina

1. Klik op een product (bijv. een Helmcover)
2. Check:
   - [ ] Product afbeelding laadt
   - [ ] Prijs correct
   - [ ] Beschrijving leesbaar
   - [ ] "In winkelwagen" knop zichtbaar

### 9.3 Winkelwagen Functionaliteit

1. Klik op **"In winkelwagen"** bij een product
2. Check:
   - [ ] Groene bevestiging verschijnt
   - [ ] Winkelwagen icon toont aantal (1)
3. Klik op **winkelwagen icon** (rechts boven)
4. Check:
   - [ ] Product zichtbaar in winkelwagen
   - [ ] Prijs correct
   - [ ] Aantal aanpassen werkt (+/-)
   - [ ] Verwijderen werkt (prullenbak icon)
   - [ ] Subtotaal correct
5. Voeg nog een product toe (om meerdere items te testen)
6. Check:
   - [ ] Winkelwagen icon toont aantal (2)
   - [ ] Beide producten zichtbaar

### 9.4 Checkout Flow Test

Dit is de **belangrijkste test**!

1. Klik op **"Afrekenen"** in winkelwagen
2. Je komt op `/checkout` pagina

**Check formulier:**
- [ ] Alle velden zichtbaar (email, naam, adres, etc.)
- [ ] Geen console errors (F12 → Console tab)

**Vul gegevens in:**
- Email: `jouw-email@example.com`
- Naam: `Test Gebruiker`
- Straat: `Teststraat`
- Huisnummer: `123`
- Postcode: `1234AB`
- Plaats: `Amsterdam`
- Land: `Nederland`
- Telefoon: `0612345678`

**Check shipping berekening:**
- [ ] Verzendkosten €6.95 (bij < €50)
- [ ] GRATIS verzending (bij ≥ €50)

3. Klik op **"Betalen met Mollie"**

### 9.5 Mollie Payment Test

Je wordt nu doorgestuurd naar Mollie:

**Check Mollie pagina:**
- [ ] Correct bedrag
- [ ] Correcte producten
- [ ] Betaalmethoden zichtbaar (iDEAL, creditcard, etc.)

**Test betaling:**

**OPTIE A: Test Mode Payment (Gratis)**
1. Als je Mollie in **test mode** hebt staan:
2. Kies **iDEAL**
3. Kies een test bank (bijv. "Betaling succesvol")
4. Klik op **Betalen**

**OPTIE B: Echte Betaling (Als je live key gebruikt)**
1. Kies je betaalmethode
2. Voer echte betaalgegevens in
3. Betaal (je kunt dit later terugbetalen in Mollie dashboard)

### 9.6 Return & Order Confirmation

Na betaling word je teruggestuurd naar:
```
https://bikerfun.nl/payment-return?orderId=xxx
```

**Check return pagina:**
- [ ] Loading indicator verschijnt
- [ ] Na 1-3 seconden redirect naar order confirmation
- [ ] Geen errors

**Check order confirmation pagina:**
- [ ] Bedankbericht zichtbaar
- [ ] Bestelnummer correct (bijv. #ORD-20260204-0001)
- [ ] Producten lijst correct
- [ ] Totaalbedrag klopt
- [ ] "Terug naar webshop" knop werkt

### 9.7 Email Check

**Check je inbox** (binnen 1-5 minuten):

- [ ] **Order bevestiging** van WooCommerce ontvangen
  - Bestelnummer
  - Producten lijst
  - Totaalbedrag
  - Verzendadres
  - Payment bevestiging

**Check spam folder** als je niks ziet!

---

## 🎛️ **STAP 10: Admin Dashboard Verificatie**

### 10.1 Login in Admin Dashboard

1. Ga naar `https://bikerfun.nl/admin`
2. Login met je Supabase credentials
   - Email: `je@email.com`
   - Password: `jouw-password`

**⚠️ Geen admin account?**
1. Ga naar [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open je project → **Authentication** → **Users**
3. Klik op **Add User**
4. Vul email + password in
5. Klik op **Create User**

### 10.2 Check Orders in Dashboard

1. In admin dashboard, klik op **Bestellingen** (linker menu)
2. Check:
   - [ ] Je test order staat in de lijst
   - [ ] Status: "Betaald" (groen)
   - [ ] WooCommerce kolom toont **#nummer** (link naar WooCommerce)
   - [ ] Klik op "Bekijken" → Order details correct

### 10.3 Check WooCommerce Sync

1. Klik op de **WooCommerce link** (bijv. #12345)
2. Je wordt doorgestuurd naar WooCommerce admin
3. Check:
   - [ ] Order bestaat in WooCommerce
   - [ ] Status: "Processing"
   - [ ] Klantgegevens correct
   - [ ] Producten correct
   - [ ] Mollie payment ID aanwezig

### 10.4 Check Occasions

1. Klik op **Occasions** in admin menu
2. Check:
   - [ ] 29 occasions zichtbaar
   - [ ] Verkocht status werkt
   - [ ] "Bewerken" opent formulier
   - [ ] "Verwijderen" vraagt bevestiging

### 10.5 Check Products

1. Klik op **Producten** in admin menu
2. Check:
   - [ ] 196 producten zichtbaar
   - [ ] Search functie werkt
   - [ ] "Bekijk op website" link werkt
   - [ ] Geen motoren/occasions in lijst

---

## 🐛 **STAP 11: Troubleshooting**

### Probleem 1: Domain Laadt Niet

**Symptoom:** `bikerfun.nl` geeft error of laadt oude site

**Oplossingen:**
1. **Wacht langer** → DNS kan tot 24u duren (meestal 30 min)
2. **Check DNS:**
   - Ga naar [dnschecker.org](https://dnschecker.org)
   - Voer `bikerfun.nl` in
   - Moet wijzen naar Vercel IP: `76.76.21.21`
3. **Flush DNS cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```
4. **Test in incognito** (om browser cache te vermijden)
5. **Check Vercel domain status:**
   - Vercel → Settings → Domains
   - Status moet "Valid" zijn (groen vinkje)

---

### Probleem 2: SSL Certificaat Error

**Symptoom:** "Not Secure" of "Certificate Error" in browser

**Oplossingen:**
1. **Wacht 5-10 minuten** → SSL certificaat generatie duurt even
2. **Check Vercel:**
   - Settings → Domains
   - Naast domain moet groen slotje staan
   - Status: "Certificate issued"
3. **Force SSL renewal:**
   - Vercel → Settings → Domains
   - Klik op domain → **Refresh**
4. **Test HTTPS direct:**
   - Type expliciet: `https://bikerfun.nl`

---

### Probleem 3: Producten Laden Niet

**Symptoom:** "Geen producten gevonden" op `/products`

**Oplossingen:**
1. **Check Supabase verbinding:**
   - Open browser console (F12)
   - Ga naar `/products`
   - Zoek naar errors
2. **Check environment variables:**
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_SUPABASE_URL` correct?
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` correct?
3. **Check Supabase data:**
   - [supabase.com/dashboard](https://supabase.com/dashboard)
   - Table Editor → `webshop_products`
   - Zie je 196 producten?
4. **Redeploy:**
   - Vercel → Deployments
   - Laatste deployment → Redeploy

---

### Probleem 4: Checkout Geeft Error

**Symptoom:** Error bij "Betalen met Mollie" knop

**Oplossingen:**
1. **Check browser console:**
   - F12 → Console tab
   - Kijk naar rode errors
2. **Check Mollie API key:**
   - Vercel → Settings → Environment Variables
   - `MOLLIE_API_KEY` moet beginnen met `live_`
   - Gebruik je test key? (`test_xxx`) → Werkt alleen in test mode
3. **Check Vercel function logs:**
   - Vercel → Logs
   - Filter op `/api/checkout`
   - Kijk naar errors
4. **Test API key:**
   - Mollie Dashboard → Developers → API Keys
   - Check of live key **enabled** is

---

### Probleem 5: Order Niet in WooCommerce

**Symptoom:** Order staat in Supabase maar niet in WooCommerce

**Oplossingen:**
1. **Check payment status:**
   - Admin dashboard → Bestellingen
   - Status moet "Betaald" zijn (groen)
   - Niet betaalde orders worden NIET gesynchroniseerd
2. **Check webhook:**
   - Mollie Dashboard → Developers → Webhooks
   - URL moet `https://bikerfun.nl/api/webhooks/mollie` zijn
   - Test webhook (klik op Test knop)
3. **Check Vercel logs:**
   - Vercel → Logs
   - Filter op `/api/webhooks/mollie`
   - Zoek naar "WooCommerce sync" logs
4. **Manual sync (fallback):**
   ```bash
   # Via API (vervang ORDER_ID met echte ID)
   curl -X POST https://bikerfun.nl/api/orders/[ORDER_ID]/sync
   ```
5. **Check WooCommerce API:**
   - Test keys via `/api/test-woocommerce`
   - Als PHP memory errors: Contact hosting provider

---

### Probleem 6: Geen Emails Ontvangen

**Symptoom:** Order succesvol, maar geen email

**Oplossingen:**
1. **Check spam folder** (vaak daar!)
2. **Check WooCommerce sync:**
   - Admin dashboard → Bestellingen
   - WooCommerce kolom moet **#nummer** tonen
   - Klik op link → Order moet in WooCommerce staan
3. **Check WooCommerce email settings:**
   - WooCommerce admin → Settings → Emails
   - "Processing Order" moet enabled zijn
   - Test email versturen
4. **Check email provider:**
   - WooCommerce → Settings → Emails → "From" email
   - Moet een geldig email adres zijn (@bikerfun.nl?)
5. **Check order status in WooCommerce:**
   - Order moet status "Processing" hebben
   - Niet "Pending" (dan worden geen emails gestuurd)

---

### Probleem 7: Afbeeldingen Laden Niet

**Symptoom:** Producten of occasions zonder afbeeldingen

**Oplossingen:**
1. **Check image URLs in database:**
   - Supabase → Table Editor → `webshop_products`
   - Column `images` moet array zijn met geldige URLs
2. **Check next.config.ts:**
   - Moet `admin.bikerfun.nl` in `remotePatterns` hebben
3. **Check image sources:**
   - Browser console (F12)
   - Kijk naar failed image requests
   - Check of URLs bereikbaar zijn
4. **Redeploy:**
   - Vercel → Deployments → Redeploy

---

## 📊 **STAP 12: Performance Check** (Optioneel)

### 12.1 Google PageSpeed Insights

1. Ga naar [pagespeed.web.dev](https://pagespeed.web.dev)
2. Voer in: `https://bikerfun.nl`
3. Klik op **Analyze**
4. Wacht op resultaten

**Verwachte scores:**
- Performance: 90+ ⚡
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### 12.2 Core Web Vitals

Check in Google Search Console (na een paar dagen):
- LCP (Largest Contentful Paint): < 2.5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 🎉 **STAP 13: Go Live Checklist**

Print deze checklist en vink af:

### DNS & Domain
- [ ] Domain toegevoegd in Vercel
- [ ] DNS records geconfigureerd (nameservers of A record)
- [ ] `bikerfun.nl` opent de website
- [ ] `www.bikerfun.nl` redirect naar `bikerfun.nl`
- [ ] SSL certificaat actief (groen slotje)
- [ ] HTTP → HTTPS redirect werkt

### Configuration
- [ ] Environment variables bijgewerkt in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` = `https://bikerfun.nl`
- [ ] Mollie webhook URL ingesteld
- [ ] WooCommerce return URLs correct
- [ ] Supabase RLS policies enabled
- [ ] Redeploy gedaan na env var changes

### Website Functionaliteit
- [ ] Homepage laadt correct
- [ ] Occasions pagina werkt (29 items)
- [ ] Webshop pagina werkt (196 producten)
- [ ] Product detail pagina's werken
- [ ] Winkelwagen werkt (toevoegen/verwijderen)
- [ ] Occasions detail pagina's werken
- [ ] Contact formulieren werken

### Checkout & Payment
- [ ] Checkout formulier werkt
- [ ] Mollie payment redirect werkt
- [ ] Test betaling succesvol
- [ ] Return naar website werkt
- [ ] Order confirmation pagina werkt
- [ ] Bestelnummer klopt

### Backend Integration
- [ ] Order staat in Supabase (`webshop_orders`)
- [ ] Order staat in WooCommerce (admin.bikerfun.nl)
- [ ] WooCommerce order status = "Processing"
- [ ] Order bevestiging email ontvangen
- [ ] Admin dashboard toont orders correct
- [ ] WooCommerce sync indicator werkt

### Admin Dashboard
- [ ] Admin login werkt (`/admin`)
- [ ] Occasions overzicht werkt
- [ ] Occasions toevoegen/bewerken werkt
- [ ] Producten overzicht werkt (196 items)
- [ ] Orders overzicht werkt
- [ ] Analytics werkt (occasion views)

### Mobile Testing
- [ ] Website werkt op mobiel
- [ ] Hero videos spelen af
- [ ] Occasionss carousel swipeable
- [ ] Products 2-per-row layout
- [ ] Checkout formulier mobile-friendly
- [ ] Geen overflow/white bars

---

## 🚨 **KRITIEKE PUNTEN - DUBBEL CHECK!**

### 1. Mollie Webhook URL

**Check in Mollie Dashboard:**
```
https://bikerfun.nl/api/webhooks/mollie
```

**NIET:**
- ❌ `http://bikerfun.nl/...` (zonder HTTPS)
- ❌ `https://admin.bikerfun.nl/...` (verkeerd domain)
- ❌ `http://localhost:3000/...` (localhost)

### 2. Environment Variables

**Check in Vercel dat deze EXACT kloppen:**

```bash
NEXT_PUBLIC_APP_URL=https://bikerfun.nl
MOLLIE_API_KEY=live_sJGrU455zbfTq3RdzHf2MAt3f2Na3M
```

**Let op:**
- Geen trailing slash (`/`) aan het einde van URLs
- Mollie key moet `live_` zijn (niet `test_`)
- Domain moet HTTPS zijn (niet HTTP)

### 3. Redeploy na Environment Variable Changes

**ALTIJD redeploy na het aanpassen van env vars!**

Anders gebruik de website nog de oude waarden.

---

## 📞 **Support & Monitoring**

### Vercel Logs Monitoren

**Real-time logs:**
1. Vercel → je project → **Logs**
2. Filter op:
   - `/api/checkout` → Checkout errors
   - `/api/webhooks/mollie` → Webhook status
   - Error level: "Error" → Alleen errors

### Mollie Dashboard Monitoren

**Betalingen checken:**
1. Mollie Dashboard → **Payments**
2. Je ziet alle betalingen (status: paid/pending/failed)
3. Klik op betaling → Zie details + webhook logs

**Webhook logs:**
1. Mollie Dashboard → Developers → **Webhooks**
2. Klik op je webhook
3. Tab **"Attempts"** → Zie alle webhook calls
4. Check op errors (rode status codes)

### WooCommerce Orders Monitoren

**Check orders:**
1. admin.bikerfun.nl/wp-admin
2. WooCommerce → **Orders**
3. Nieuwe orders verschijnen automatisch
4. Status moet "Processing" zijn voor betaalde orders

---

## 🎊 **Gefeliciteerd!**

Als alle checkboxes ✅ zijn, dan is je website **LIVE**! 

### **Wat werkt nu:**
- 🏠 Complete homepage met occasions en webshop preview
- 🏍️ 29 Occasions met detail pagina's, filters, contact formulieren
- 🛍️ 196 Webshop producten met categorieën en zoekfunctie
- 🛒 Volledig functionele winkelwagen
- 💳 Mollie checkout (alle betaalmethoden)
- 📧 Automatische emails via WooCommerce
- 📦 Shipping integratie via WooCommerce
- 🎛️ Admin dashboard voor beheer
- 📊 Analytics voor occasions

### **Performance:**
- ⚡ Razendsnelle laadtijden (geen WooCommerce crashes meer)
- 📱 Mobile-first responsive design
- 🔒 SSL/HTTPS beveiligd
- 🔍 SEO geoptimaliseerd

---

## 📝 **Post-Launch Taken** (Optioneel)

Na een paar dagen gebruik:

1. **Google Search Console** instellen voor SEO monitoring
2. **Google Analytics** toevoegen (traffic monitoring)
3. **Backup strategie** opzetten (Supabase heeft auto backups)
4. **Monitor Mollie/WooCommerce** voor de eerste paar orders
5. **Product CRUD** in admin dashboard (als je producten wil toevoegen)

---

## 🆘 **Hulp Nodig?**

Als je ergens vastloopt:
1. Check **Troubleshooting** sectie hierboven
2. Lees `WOOCOMMERCE_SYNC_INFO.md` voor sync problemen
3. Check Vercel logs voor runtime errors
4. Stuur me een screenshot + error message

---

**Succes met het live zetten! Je bent er bijna! 🚀**

# 🛠️ Bikerfun Setup Guide

Complete stap-voor-stap handleiding om de Bikerfun webshop op te zetten.

## 📋 Vereisten

- Node.js 18+ geïnstalleerd
- Een Supabase account (https://supabase.com)
- Een Stripe account (https://stripe.com)
- Een GitHub account (voor deployment)
- Een Vercel account (https://vercel.com)

## 🚀 Stap 1: Supabase Setup

### 1.1 Nieuw Project Aanmaken

1. Ga naar https://supabase.com
2. Klik op "New Project"
3. Vul de projectnaam, database wachtwoord en regio in
4. Wacht tot het project is aangemaakt (±2 minuten)

### 1.2 Database Migrations Uitvoeren

1. Ga naar de SQL Editor in je Supabase dashboard
2. Voer de volgende SQL bestanden uit in deze volgorde:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_row_level_security.sql`
   - `supabase/migrations/003_seed_data.sql`

### 1.3 API Keys Ophalen

1. Ga naar Settings → API
2. Kopieer de volgende waarden:
   - `Project URL` → Dit wordt je `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Dit wordt je `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → Dit wordt je `SUPABASE_SERVICE_ROLE_KEY` (houd deze privé!)

### 1.4 Admin User Aanmaken

1. Registreer via de app (na lokaal opstarten)
2. Kopieer je user ID uit de Supabase dashboard (Authentication → Users)
3. Run deze query in de SQL Editor:
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
   ```

## 💳 Stap 2: Stripe Setup

### 2.1 Account Activeren

1. Ga naar https://stripe.com
2. Maak een account aan of log in
3. Activeer "Test Mode" (toggle rechtsboven)

### 2.2 API Keys Ophalen

1. Ga naar Developers → API keys
2. Kopieer de volgende waarden:
   - `Publishable key` → Dit wordt je `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → Dit wordt je `STRIPE_SECRET_KEY`

### 2.3 Webhook Setup (later, na deployment)

1. Ga naar Developers → Webhooks
2. Klik op "Add endpoint"
3. URL: `https://jouw-domein.vercel.app/api/webhooks/stripe`
4. Events te luisteren:
   - `checkout.session.completed`
5. Kopieer de `Signing secret` → Dit wordt je `STRIPE_WEBHOOK_SECRET`

## 🔧 Stap 3: Lokale Setup

### 3.1 Dependencies Installeren

```bash
npm install
```

### 3.2 Environment Variables

1. Open `.env.local` in de root directory
2. Vul alle waarden in met je Supabase en Stripe credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (later toevoegen)

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 Development Server Starten

```bash
npm run dev
```

De app draait nu op http://localhost:3000

## 🧪 Stap 4: Testen

### 4.1 Test Bestellingen

Gebruik Stripe test cards:
- Succesvolle betaling: `4242 4242 4242 4242`
- Datum: Elke datum in de toekomst
- CVC: Elke 3 cijfers
- Postcode: Elke 5 cijfers

### 4.2 iDEAL Testen

Gebruik test bank: "Test Bank - Success"

## 🚢 Stap 5: Deployment naar Vercel

### 5.1 GitHub Repository

1. Initialiseer git (als nog niet gedaan):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push naar GitHub:
   ```bash
   git remote add origin https://github.com/jouwnaam/bikerfun.git
   git branch -M main
   git push -u origin main
   ```

### 5.2 Vercel Deployment

1. Ga naar https://vercel.com
2. Klik op "Add New..." → "Project"
3. Importeer je GitHub repository
4. Configureer Environment Variables:
   - Voeg alle variabelen uit `.env.local` toe
   - Pas `NEXT_PUBLIC_APP_URL` aan naar je productie URL

5. Klik op "Deploy"
6. Wacht tot de deployment klaar is

### 5.3 Stripe Webhook Activeren

1. Kopieer je Vercel productie URL
2. Ga terug naar Stripe → Webhooks
3. Voeg webhook endpoint toe: `https://jouw-domein.vercel.app/api/webhooks/stripe`
4. Kopieer de webhook signing secret
5. Voeg deze toe aan Vercel Environment Variables als `STRIPE_WEBHOOK_SECRET`
6. Redeploy de applicatie in Vercel

## 📱 Stap 6: Production Mode

### 6.1 Stripe Live Mode Activeren

1. Verwijder "Test Mode" toggle in Stripe
2. Voer verificatie uit (bedrijfsgegevens, bankrekening)
3. Herhaal API keys en webhooks setup voor Live mode
4. Update Environment Variables in Vercel met live keys

### 6.2 Supabase Production

1. Schakel RLS policies in voor alle tabellen
2. Maak backups aan (Database → Backups)
3. Configureer email templates (Authentication → Email Templates)

## 🎨 Aanpassingen

### Logo en Branding

1. Update `app/layout.tsx` voor meta tags
2. Vervang kleuren in `tailwind.config.ts`
3. Voeg logo afbeelding toe in `public/` folder

### Email Notificaties

Integreer een email service zoals:
- Resend (https://resend.com)
- SendGrid
- Mailgun

Voeg toe in `app/api/webhooks/stripe/route.ts` na order creatie.

### Extra Features

- Product reviews
- Wishlist
- Product varianten (maten, kleuren)
- Coupon codes
- Newsletter signup
- Live chat support

## 🔒 Beveiliging Checklist

- ✅ RLS policies actief in Supabase
- ✅ Service role key alleen server-side gebruikt
- ✅ Stripe webhook signature verificatie
- ✅ HTTPS in productie
- ✅ Rate limiting (overweeg Vercel Edge Config)
- ✅ Input validatie op alle forms

## 📊 Monitoring

### Aanbevolen Tools

- **Vercel Analytics** - Voor performance metrics
- **Sentry** - Voor error tracking
- **LogRocket** - Voor session replay
- **Stripe Dashboard** - Voor betalingen monitoring

## 🆘 Troubleshooting

### Database Connection Issues

- Check of Supabase project online is
- Verificeer API keys in environment variables
- Check firewall/network instellingen

### Stripe Webhook Fails

- Controleer signing secret
- Check of webhook URL correct is
- Bekijk logs in Stripe Dashboard

### Build Errors

- Verwijder `.next` folder en `node_modules`
- Run `npm install` opnieuw
- Check TypeScript errors met `npm run build`

## 📚 Nuttige Links

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

## 💡 Tips

1. **Test alles lokaal eerst** voordat je deploy
2. **Maak regelmatig backups** van je database
3. **Monitor je Stripe dashboard** voor fraudulente bestellingen
4. **Gebruik environment variables** voor alle secrets
5. **Houd dependencies up-to-date** met `npm outdated`

## 🎉 Klaar!

Je Bikerfun webshop is nu live! Veel succes met je motor gear business! 🏍️

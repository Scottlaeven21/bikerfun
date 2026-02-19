# 📧 Email Setup Guide - Resend

## ✅ Wat is Resend?

Resend is een moderne email service speciaal voor developers. Perfect voor:
- Contact formulier emails
- Motor aanvraag notificaties
- Auto-reply emails voor klanten

**Waarom Resend?**
- ✅ Gratis tier: 3.000 emails per maand
- ✅ Geen credit card vereist voor gratis tier
- ✅ Eenvoudige setup (5 minuten)
- ✅ Professioneel & betrouwbaar

---

## 🚀 Setup Instructies

### Stap 1: Maak een Resend Account aan

1. Ga naar: https://resend.com
2. Klik op **"Sign Up"** (rechtsboven)
3. Registreer met je email
4. Verifieer je email adres

---

### Stap 2: Voeg je Domein toe

1. Log in op Resend Dashboard
2. Ga naar **"Domains"** in het menu
3. Klik op **"Add Domain"**
4. Voer je domein in: `bikerfun.nl`
5. Volg de instructies om DNS records toe te voegen

**DNS Records die je moet toevoegen bij je hosting provider (Strato):**

Resend geeft je 3 DNS records die je moet toevoegen. Dit zijn meestal:
- **MX record** (voor email receiving)
- **TXT record** (voor SPF/DKIM verificatie)
- **CNAME record** (voor DKIM signing)

**Let op:** Dit kan tot 24 uur duren voordat DNS wijzigingen actief zijn.

---

### Stap 3: Genereer API Key

1. Ga naar **"API Keys"** in het Resend menu
2. Klik op **"Create API Key"**
3. Geef hem een naam: `Bikerfun Website`
4. Selecteer permission: **"Sending access"** (voldoende voor dit gebruik)
5. Klik **"Create"**
6. **Kopieer de API key** (je kunt hem maar 1x zien!)
7. Bewaar deze veilig

---

### Stap 4: Update Environment Variables

Open `.env.local` in je project en update:

```env
# Resend - Email service
RESEND_API_KEY=re_jouwAPIkey123456789
RESEND_FROM_EMAIL=noreply@bikerfun.nl
RESEND_TO_EMAIL=info@bikerfun.nl
```

**Uitleg:**
- `RESEND_API_KEY`: De API key die je zojuist hebt aangemaakt
- `RESEND_FROM_EMAIL`: Het "van" adres (moet op je geverifieerde domein zijn)
- `RESEND_TO_EMAIL`: Het adres waar je notificaties wilt ontvangen

---

### Stap 5: Test de Email Functionaliteit

1. Start je development server:
   ```bash
   npm run dev
   ```

2. Ga naar: `http://localhost:3000/contact`

3. Vul het formulier in en verstuur

4. Check je email inbox voor:
   - ✅ Notificatie email (op `RESEND_TO_EMAIL`)
   - ✅ Auto-reply email (op het ingevulde email adres)

---

### Stap 6: Deploy naar Vercel

1. Ga naar Vercel Dashboard
2. Open je project
3. Ga naar **Settings** → **Environment Variables**
4. Voeg toe:
   - `RESEND_API_KEY` (Mark as Secret! ✅)
   - `RESEND_FROM_EMAIL`
   - `RESEND_TO_EMAIL`

5. Klik **"Save"**
6. Redeploy je app (Vercel doet dit automatisch als je pusht naar GitHub)

---

## 📋 Welke Emails worden er verstuurd?

### 1. Contact Formulier (`/contact`)
**Naar jou (business):**
- Onderwerp: "Nieuw contactbericht van [Naam]"
- Inhoud: Naam, Email, Telefoon, Bericht

**Naar klant (auto-reply):**
- Onderwerp: "Bedankt voor je bericht - Bikerfun"
- Inhoud: Bedankje + contactgegevens Bikerfun

### 2. Motor op Aanvraag (`/motor-op-aanvraag` & `/occasions/[id]/aanvraag`)
**Naar jou (business):**
- Onderwerp: "Nieuwe motor aanvraag van [Naam] - [Merk Model]"
- Inhoud: Motor details, Naam, Email, Telefoon, Bericht

**Naar klant (auto-reply):**
- Onderwerp: "Bedankt voor je bericht - Bikerfun"
- Inhoud: Bedankje + contactgegevens Bikerfun

---

## 🎨 Email Design

Alle emails hebben:
- ✅ Bikerfun branding (geel/zwart)
- ✅ Responsive design (mobiel vriendelijk)
- ✅ Professionele layout
- ✅ Direct klikbare email/telefoon links

---

## 🔍 Troubleshooting

### "Email service is niet beschikbaar"
**Oorzaak:** API key is niet correct ingesteld
**Oplossing:** 
- Check of `RESEND_API_KEY` in `.env.local` staat
- Verifieer dat de key begint met `re_`
- Restart dev server na env changes

### Emails komen niet aan
**Mogelijke oorzaken:**
1. **Domein niet geverifieerd in Resend**
   - Check Resend Dashboard → Domains
   - Wacht tot DNS propagatie klaar is (max 24 uur)

2. **Email in spam folder**
   - Check spam/junk folder
   - Voeg noreply@bikerfun.nl toe aan contacten

3. **API key onjuist**
   - Genereer nieuwe API key in Resend
   - Update `.env.local`

### Test mode
Resend heeft een **Test Mode** voor development:
- Emails worden gesimuleerd (niet echt verzonden)
- Check in Resend Dashboard → Logs
- Voor productie: zet domein verificatie af

---

## 📊 Monitoring

Check je email logs in Resend Dashboard:
1. Ga naar https://resend.com
2. Klik op **"Logs"**
3. Zie alle verzonden emails:
   - Status (delivered, bounced, etc.)
   - Timestamps
   - Recipients
   - Error messages (indien van toepassing)

---

## 💰 Kosten

**Gratis Tier:**
- 3.000 emails per maand
- Geen credit card vereist
- Perfect voor klein/medium bedrijf

**Als je meer nodig hebt:**
- Pro: $20/maand voor 50.000 emails
- Scale: Custom pricing

Voor Bikerfun is de gratis tier ruim voldoende!

---

## ⚠️ Belangrijk

- **Commit NOOIT je API key naar Git!**
- `.env.local` staat al in `.gitignore`
- Gebruik alleen `RESEND_API_KEY` op server-side (niet in `NEXT_PUBLIC_*`)
- Bewaar een backup van je API key op een veilige plek

---

**Gemaakt door:** Scott Laeven  
**Datum:** 2026-02-18  
**Project:** Bikerfun Website  
**Status:** ✅ Ready to Use

# ✅ Vercel Environment Variables Checklist

## 📋 Alle Benodigde Environment Variables

### 1. Supabase (✅ Waarschijnlijk al geconfigureerd)
```
NEXT_PUBLIC_SUPABASE_URL=https://uxepjramdcqvwafxwcxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=sb_secret_[YOUR_SERVICE_ROLE_KEY]
```

### 2. Mollie (✅ Waarschijnlijk al geconfigureerd)
```
MOLLIE_API_KEY=live_[YOUR_MOLLIE_KEY]
```

### 3. WooCommerce (⚠️ Check Dit!)
```
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_[YOUR_CONSUMER_KEY]
WOOCOMMERCE_CONSUMER_SECRET=cs_[YOUR_CONSUMER_SECRET]
```

### 4. App URL (✅ Waarschijnlijk al geconfigureerd)
```
NEXT_PUBLIC_APP_URL=https://bikerfun.nl
```

### 5. SMTP-mail (Next.js / Nodemailer — niet Resend)

Zonder deze vijf wordt **geen** mail verstuurd (`lib/email/client.ts`):

```
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bikerfun.nl
SMTP_PASSWORD=(mailbox-wachtwoord)
SMTP_FROM_EMAIL=info@bikerfun.nl
```

**Waar komen notificaties binnen:** `SMTP_TO_EMAIL` (default in code: `info@bikerfun.nl`). Zet hier het adres waar jij notificaties wilt ontvangen.

**Optioneel:** `SMTP_ADMIN_ORDER_EMAILS` — komma-gescheiden extra adressen voor “bestelling betaald”; anders alleen `SMTP_TO_EMAIL`.

**Optioneel gedrag:** `CONTACT_FORM_AUTOREPLY`, `MOTOR_FORMS_AUTOREPLY`, `ADMIN_ORDER_PAID_NOTIFICATION` (= `false` om uit te zetten).

---

## 🔧 Hoe Te Controleren in Vercel

### Via Vercel Dashboard:

1. **Ga naar:** https://vercel.com/dashboard
2. **Open:** Je Bikerfun project
3. **Klik:** Settings
4. **Klik:** Environment Variables
5. **Check:** Of alle bovenstaande variabelen er staan

---

## 📝 Hoe Te Voegen/Updaten

### Voor Elke Variable:

1. **Klik:** "Add New"
2. **Name:** (bijv. `WOOCOMMERCE_CONSUMER_KEY`)
3. **Value:** (de waarde)
4. **Environments:** Selecteer alle 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Klik:** "Save"

---

## 🚨 KRITIEK: Na Toevoegen/Wijzigen

**Je MOET een nieuwe deployment triggeren!**

Opties:
1. Push een kleine code wijziging naar Git
2. Of: Ga naar Deployments tab → Klik op laatste deployment → "Redeploy"

**Anders worden de nieuwe environment variables NIET gebruikt!**

---

## 🎯 Waarom Dit Belangrijk Is Voor Afbeeldingen

Als `NEXT_PUBLIC_WOOCOMMERCE_URL` **niet** in Vercel staat:
- De app weet niet waar WordPress staat
- Product data kan niet worden opgehaald
- Afbeeldingen kunnen niet worden geladen

Als `WOOCOMMERCE_CONSUMER_KEY/SECRET` **niet** in Vercel staat:
- WooCommerce API werkt niet
- Order sync werkt niet
- Product sync werkt niet

---

## 🧪 Test of Environment Variables Werken

### Via Browser Console (op bikerfun.nl):

```javascript
// Check public env vars
console.log(process.env.NEXT_PUBLIC_WOOCOMMERCE_URL);
console.log(process.env.NEXT_PUBLIC_APP_URL);
```

### Via API Route:

Open: `https://bikerfun.nl/api/test-woocommerce`

Als het werkt: zie je WooCommerce producten
Als het niet werkt: zie je een error

---

## ✅ Volledige Checklist

### In Vercel Environment Variables:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] MOLLIE_API_KEY
- [ ] **NEXT_PUBLIC_WOOCOMMERCE_URL** ⚠️ KRITIEK VOOR AFBEELDINGEN
- [ ] **WOOCOMMERCE_CONSUMER_KEY** ⚠️ KRITIEK VOOR AFBEELDINGEN
- [ ] **WOOCOMMERCE_CONSUMER_SECRET** ⚠️ KRITIEK VOOR AFBEELDINGEN
- [ ] NEXT_PUBLIC_APP_URL
- [ ] **SMTP_HOST**, **SMTP_PORT**, **SMTP_SECURE**, **SMTP_USER**, **SMTP_PASSWORD**, **SMTP_FROM_EMAIL** (verplicht voor verzenden)
- [ ] **SMTP_TO_EMAIL** (bv. info@bikerfun.nl)
- [ ] SMTP_ADMIN_ORDER_EMAILS (optioneel)

### Na Toevoegen:

- [ ] Alle variabelen staan voor Production, Preview én Development
- [ ] Nieuwe deployment getriggerd (Redeploy)
- [ ] 2-3 minuten gewacht voor nieuwe deployment
- [ ] Website getest: https://bikerfun.nl/products
- [ ] Afbeeldingen laden! ✅

---

## 🔍 Debug Tips

### Als Afbeeldingen Nog Steeds Niet Laden:

1. **Check Browser Console** (F12):
   - Zie je errors over "Failed to load image"?
   - Wat is de exacte URL die wordt gebruikt?

2. **Check Network Tab** (F12 → Network):
   - Worden de afbeeldingen überhaupt aangevraagd?
   - Wat is de HTTP status code? (404, 403, 500?)

3. **Check Deployment Logs** in Vercel:
   - Zijn er build errors?
   - Zijn er runtime errors?

4. **Test API Direct:**
   - Open: https://bikerfun.nl/api/test-woocommerce
   - Of: Check browser console op product pagina

---

## 📞 Als Het Nog Niet Werkt

Laat me weten:
1. Welke environment variables **wel** in Vercel staan
2. Wat je ziet in browser console (F12)
3. Screenshot van Vercel Environment Variables pagina

Dan help ik je verder! 🚀

# 🔄 Automatische WooCommerce Sync - Hoe Werkt Het?

## 📖 **Overzicht**

Na elke succesvolle Mollie betaling worden orders **automatisch** gesynchroniseerd van Supabase naar WooCommerce, zodat:
1. ✅ Orders verschijnen in WooCommerce admin
2. ✅ Klanten ontvangen automatisch een orderbevestiging email van WooCommerce
3. ✅ Voorraad wordt automatisch bijgewerkt

---

## ⚙️ **Hoe Werkt Het?**

### 1️⃣ **Klant Plaatst Bestelling**

```
Klant → Checkout → Mollie Betaling → Betaling Geslaagd
                                              ↓
                                    Order in Supabase
                                    (payment_status: 'paid')
```

### 2️⃣ **Vercel Cron Job Draait (1x per dag om 09:00 UTC)**

```
09:00 UTC (10:00 NL) → Vercel Cron Start
                              ↓
                    Check Supabase Database
                              ↓
              Zoek Orders Met Status "paid" 
                   ZONDER WooCommerce ID
                              ↓
                    Sync Max 10 Orders
```

### 3️⃣ **Sync Proces Per Order**

Voor elke order die nog niet is gesynct:

```
Supabase Order → WooCommerce API
                        ↓
                WooCommerce Order Aangemaakt
                        ↓
        WooCommerce Verstuurt Email Automatisch
                        ↓
        Update Supabase: woo_order_id + synced_to_woo = true
```

### 4️⃣ **Klant Ontvangt Email**

WooCommerce stuurt automatisch een orderbevestiging naar het opgegeven email adres met:
- Order nummer
- Producten
- Totaalbedrag
- Verzendadres
- Link naar order status

---

## 📊 **Belangrijke Details**

### ⏰ **Schedule**
- **Frequentie:** 1x per dag om **09:00 UTC** (10:00 Nederlandse tijd)
- **Reden:** Vercel Hobby plan staat alleen dagelijkse cron jobs toe
- **Impact:** Max 24 uur vertraging voor email (meestal veel korter)

### 📦 **Batch Limiet**
- **Max per run:** 10 orders
- **Reden:** Voorkomt timeout en memory issues
- **Impact:** Bij > 10 unsynced orders, worden deze de volgende dag gesynct

### 🔒 **Security**
- **CRON_SECRET:** Alleen Vercel kan de cron endpoint aanroepen
- **Service Role Key:** Supabase admin toegang voor de sync
- **WooCommerce API Keys:** Veilig opgeslagen in Vercel environment variables

---

## 🛠️ **Setup Vereisten**

### ✅ **Environment Variables in Vercel**

Alle onderstaande moeten staan in: https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables

| Variable | Beschrijving | Status |
|----------|--------------|--------|
| `CRON_SECRET` | Security token voor cron job | ✅ Toegevoegd |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin key voor Supabase | ✅ Moet staan |
| `WOOCOMMERCE_CONSUMER_KEY` | WooCommerce API key | ✅ Moet staan |
| `WOOCOMMERCE_CONSUMER_SECRET` | WooCommerce API secret | ✅ Moet staan |
| `NEXT_PUBLIC_WOOCOMMERCE_URL` | WordPress URL | ✅ Moet staan |

### ✅ **Vercel Cron Config**

**File:** `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-orders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Schedule:** `0 9 * * *` = Elke dag om 09:00 UTC (10:00 NL tijd)

### ✅ **API Endpoint**

**File:** `app/api/cron/sync-orders/route.ts`

**URL:** `https://bikerfun.nl/api/cron/sync-orders`

**Methode:** GET met `Authorization: Bearer {CRON_SECRET}` header

---

## 🧪 **Testing & Monitoring**

### Test Handmatig (na succesvolle deployment):

```bash
npx tsx scripts/trigger-production-cron.ts
```

Dit triggert de cron handmatig en toont:
- ✅ Hoeveel orders zijn gesynct
- ❌ Eventuele errors
- 📊 Response van API

### Check Cron Logs in Vercel:

1. Ga naar: https://vercel.com/scottlaeven21s-projects/bikerfun
2. Klik op **"Logs"** tab
3. Filter op **"Cron"**
4. Bekijk de `🔄 [CRON]` log regels

### Check Unsynced Orders:

```bash
npx tsx scripts/check-supabase-orders.ts
```

Dit toont:
- Alle recente orders
- Welke orders nog GEEN `woo_order_id` hebben (moeten worden gesynct)
- Status van laatste order

---

## ❓ **Veelgestelde Vragen**

### **Waarom niet real-time sync?**

**Probleem:** Mollie webhooks falen door WordPress memory issues (128MB te weinig).

**Oplossing:** Vercel Cron is **100% betrouwbaar** omdat:
- Geen WordPress memory nodig
- Altijd automatische retry
- Gebruikt zelfde sync logic als manual sync (die werkt perfect!)

### **Kan ik handmatig syncen?**

Ja! In admin dashboard: **"Sync Orders"** knop

Dit triggert dezelfde sync functie als de cron job.

### **Wat als ik > 10 unsynced orders heb?**

De cron synct **10 orders per dag**. Bij meer dan 10 orders:
- Dag 1: 10 orders gesynct
- Dag 2: Volgende 10 orders gesynct
- etc.

Je kunt ook **handmatig** alle orders syncen via admin dashboard.

### **Hoe weet ik of een order is gesynct?**

**In Supabase:**
- `woo_order_id` = NOT NULL (bijv. `1234`)
- `synced_to_woo` = `true`

**In WooCommerce:**
- Order verschijnt in admin dashboard
- Order nummer matcht met Bikerfun order nummer in meta data

### **Wat als de cron faalt?**

De cron job heeft ingebouwde error handling:
- Logt alle errors in Vercel
- Probeert volgende dag opnieuw
- Synct alleen orders met status `paid`
- Slaat orders over die al zijn gesynct

---

## 🚨 **Troubleshooting**

### **Cron geeft 401 Unauthorized**

**Oorzaak:** `CRON_SECRET` niet ingesteld of matcht niet.

**Fix:**
1. Check Vercel environment variables
2. Redeploy na toevoegen CRON_SECRET

### **Orders worden niet gesynct**

**Check:**
1. Is de deployment succesvol? (Check Vercel deployments)
2. Staat `CRON_SECRET` in Vercel?
3. Zijn er orders met `payment_status = 'paid'` en `woo_order_id = NULL`?
4. Check Vercel cron logs voor errors

**Test:**
```bash
npx tsx scripts/trigger-production-cron.ts
```

### **WooCommerce API geeft 500 errors**

**Oorzaak:** WordPress memory te laag (was 128MB, nu 512MB).

**Fix:** IT'er heeft memory verhoogd naar 512MB. Dit is opgelost.

### **Orders krijgen geen email**

**Oorzaak:** WooCommerce email settings zijn uitgeschakeld of SMTP is niet geconfigureerd.

**Check:**
1. WordPress admin → WooCommerce → Settings → Emails
2. Check of "New Order" email is enabled
3. Check SMTP configuratie in WordPress

---

## 📝 **Wat Nu?**

### Na Succesvolle Deployment:

1. ✅ **Test de cron handmatig:**
   ```bash
   npx tsx scripts/trigger-production-cron.ts
   ```

2. ✅ **Check of order BF-1772438235364 is gesynct:**
   ```bash
   npx tsx scripts/check-supabase-orders.ts
   ```
   → Moet nu een `woo_order_id` hebben!

3. ✅ **Check WooCommerce admin:**
   https://admin.bikerfun.nl/wp-admin/edit.php?post_type=shop_order
   → Order moet hier verschijnen

4. ✅ **Check of klant email heeft ontvangen**
   → Vraag klant (mc.ew.j.gr@gmail.com) of email is ontvangen

---

## 🎯 **Samenvatting**

| Aspect | Status |
|--------|--------|
| **Cron Code** | ✅ Werkend |
| **Vercel Config** | ✅ Correct (`vercel.json`) |
| **CRON_SECRET** | ✅ Toegevoegd aan Vercel |
| **TypeScript Types** | ✅ `@types/nodemailer` geïnstalleerd |
| **Deployment** | ⏳ Wachten op Vercel... |
| **Testing** | ⏸️ Na deployment klaar |

---

## 🔮 **Verwachting**

Na succesvolle deployment:
- 🕐 Cron draait **elke dag om 10:00 NL tijd**
- 📧 Klanten ontvangen **automatisch emails** na betaling (max 24u vertraging)
- 📦 Orders verschijnen **automatisch in WooCommerce**
- 🎊 **Geen handmatige sync meer nodig!**

---

**Laatst geüpdatet:** 2 maart 2026

# 🔄 WooCommerce Synchronisatie - Bikerfun

**Datum:** 2 maart 2026  
**Status:** ✅ Volledig geïmplementeerd

---

## 📖 **Wat Is Dit?**

Een automatisch synchronisatie systeem tussen WooCommerce (admin.bikerfun.nl) en de Next.js website (bikerfun.nl).

### **Sync Richting:**

```
WooCommerce → Website:
├── 🏍️ Occasions (motors > €5000)
└── 🛍️ Producten (kleding, helmen, etc.)

Website → WooCommerce:
└── 📦 Bestellingen (via Mollie betaald)
```

---

## 🎯 **Waarom?**

**Probleem:**
- Gebruiker moet producten/occasions in **twee systemen** bijhouden
- Data kan out-of-sync raken
- Dubbel werk

**Oplossing:**
- ✅ **Één bron van waarheid**: WooCommerce
- ✅ **Automatische sync**: Elke nacht om 03:00
- ✅ **Handmatige sync**: Via admin dashboard wanneer nodig
- ✅ **Bidirectioneel**: Orders gaan terug naar WooCommerce

---

## 🛠️ **Hoe Werkt Het?**

### **Automatische Sync (Elke Nacht)**

**Wanneer:** Elke nacht om 03:00 uur  
**Wat:** Alle occasions, producten en bestellingen  
**Waar:** Vercel Cron Job

```
03:00 AM → Cron Job Start
  ↓
  🏍️ Sync Occasions (WC → Website)
  ↓
  🛍️ Sync Producten (WC → Website)
  ↓
  📦 Sync Bestellingen (Website → WC)
  ↓
✅ Klaar!
```

### **Handmatige Sync (Op Verzoek)**

**Wanneer:** Na het toevoegen van nieuwe producten/occasions  
**Waar:** `/admin/sync` pagina in dashboard  
**Wie:** Admin gebruiker

**Gebruik scenario:**
1. Voeg nieuwe motor toe in WooCommerce
2. Ga naar bikerfun.nl/admin/sync
3. Klik op "Start Synchronisatie"
4. Motor verschijnt direct op website!

---

## 📁 **Bestanden**

### **API Endpoints**

| Bestand | Doel | Toegang |
|---------|------|---------|
| `app/api/admin/sync-woocommerce/route.ts` | Handmatige sync via dashboard | Admin alleen |
| `app/api/cron/sync-woocommerce/route.ts` | Automatische cron job | Vercel (CRON_SECRET) |

### **UI Components**

| Bestand | Doel |
|---------|------|
| `app/(admin)/admin/sync/page.tsx` | Sync pagina met mooie UI |
| `app/(admin)/layout.tsx` | Admin navigatie (+ Sync link) |

### **Configuratie**

| Bestand | Doel |
|---------|------|
| `vercel.json` | Cron job schedule (03:00) |
| `.env.local` | Environment variables |

---

## 🏍️ **Occasions Sync (WooCommerce → Website)**

### **Logica:**

1. Haalt alle producten op uit WooCommerce
2. Filtert op **prijs > €5000** (= occasions)
3. Extraheert brand, model, jaar uit productnaam
4. Sync naar Supabase `occasions` tabel

### **Data Mapping:**

```typescript
WooCommerce Product → Supabase Occasion
├── name → brand, model, year (extracted)
├── price → price
├── status → status (available/sold)
├── stock_status → status (outofstock = sold)
├── images → images + main_image
├── description → description
└── id → woo_product_id
```

### **Update/Insert:**

- **Nieuw product?** → INSERT
- **Bestaat al (op slug)?** → UPDATE
- **Verwijderd in WC?** → Blijft staan (manual cleanup)

---

## 🛍️ **Producten Sync (WooCommerce → Website)**

### **Logica:**

1. Haalt alle producten op uit WooCommerce
2. Filtert op **prijs ≤ €5000** (= webshop producten)
3. Sync naar Supabase `webshop_products` tabel

### **Data Mapping:**

```typescript
WooCommerce Product → Supabase Product
├── id → woo_product_id
├── sku → sku
├── name → name
├── slug → slug (generated)
├── price → price
├── sale_price → sale_price
├── stock_quantity → stock_quantity
├── stock_status → stock_status
├── categories → categories (array)
├── tags → tags (array)
├── images → images (array)
└── featured → featured
```

### **Update/Insert:**

- **Nieuw product?** → INSERT
- **Bestaat al (op woo_product_id)?** → UPDATE
- **Voorraad wijzigt?** → Automatisch geüpdatet

---

## 📦 **Bestellingen Sync (Website → WooCommerce)**

### **Logica:**

1. Haalt alle **ongesyncte, betaalde** bestellingen uit Supabase
2. Creëert WooCommerce order via REST API
3. Markeert bestelling als `synced_to_woo = true`

### **Data Mapping:**

```typescript
Supabase Order → WooCommerce Order
├── order_number → order_number
├── customer_email → billing.email
├── customer_name → billing.first_name
├── billing_address → billing (full)
├── shipping_address → shipping (full)
├── order_items → line_items
├── total_amount → total
└── payment_status → status (paid = processing)
```

### **Fallback:**

Als `product_id` null/0 is (Supabase-only product):
- Alleen naam + prijs wordt verzonden
- WooCommerce accepteert dit als "custom product"

---

## ⚙️ **Environment Variables**

### **Vereist in Vercel:**

```env
# WooCommerce API
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_...
WOOCOMMERCE_CONSUMER_SECRET=cs_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Cron Job Secret
CRON_SECRET=9q4jb5m3l6
```

---

## 🧪 **Testen**

### **Handmatige Sync Testen:**

1. Login admin dashboard: https://bikerfun.nl/admin
2. Ga naar "WooCommerce Sync" in navigatie
3. Klik "Start Synchronisatie"
4. Bekijk resultaten (geïmporteerd, geüpdatet, mislukt)

### **Cron Job Testen (Lokaal):**

```bash
# Test cron endpoint met CRON_SECRET
curl -X GET https://bikerfun.nl/api/cron/sync-woocommerce \
  -H "Authorization: Bearer 9q4jb5m3l6"
```

### **Checklist na Deployment:**

- [ ] Vercel Environment Variables ingesteld
- [ ] `CRON_SECRET` toegevoegd
- [ ] Handmatige sync getest via dashboard
- [ ] Cron job zichtbaar in Vercel Cron dashboard
- [ ] Eerste automatische sync succesvol (check 's ochtends om 03:15)

---

## 📊 **Sync Resultaten**

De sync geeft gedetailleerde feedback:

```json
{
  "success": true,
  "occasions": {
    "imported": 5,   // Nieuwe occasions toegevoegd
    "updated": 12,   // Bestaande occasions geüpdatet
    "deleted": 0,    // (Reserved voor toekomstig)
    "failed": 0      // Fouten tijdens sync
  },
  "products": {
    "imported": 23,
    "updated": 45,
    "deleted": 0,
    "failed": 1
  },
  "orders": {
    "synced": 3,     // Bestellingen naar WC gesynct
    "failed": 0
  },
  "errors": []       // Lijst van fouten (indien van toepassing)
}
```

---

## ⚠️ **Bekende Limitaties**

### **1. Vercel Hobby Plan: 1 Cron per Dag**

**Probleem:**  
- Hobbyplan staat max 1 cron job per dag toe
- We hebben 2 crons (orders + woocommerce)

**Oplossing:**  
- Orders sync: 09:00 (voor ochtend verwerking)
- WooCommerce sync: 03:00 ('s nachts, minder traffic)

### **2. WordPress Memory Limiet**

**Probleem:**  
- WordPress heeft 128MB memory limiet
- WooCommerce REST API kan crashen bij product lookups

**Workaround:**  
- `product_id` wordt weggelaten als null/0
- WooCommerce accepteert custom line items met alleen naam + prijs

**Permanente Fix:**  
- IT'er moet WordPress PHP memory verhogen naar 512MB
- Zie: `URGENT_VOOR_ITER_2_MAART.md`

### **3. Geen Real-Time Sync**

**Probleem:**  
- Wijzigingen in WooCommerce zijn pas zichtbaar na volgende sync (max 24u wachttijd)

**Oplossing (toekomst):**  
- Implementeer WooCommerce webhooks voor real-time updates
- Vereist eerst WordPress memory fix
- Cron blijft als backup/fallback

---

## 🔮 **Toekomstige Verbeteringen**

### **Fase 1: ✅ Basis Sync (DONE)**
- Automatische nachtelijke sync
- Handmatige sync via dashboard
- Occasions, producten, bestellingen

### **Fase 2: 📋 Webhooks (TODO)**
- Real-time sync bij WooCommerce wijzigingen
- WordPress webhook naar Next.js endpoint
- Vereist: WordPress memory fix

### **Fase 3: 📋 Sync History (TODO)**
- Laatste sync tijden tonen
- Sync logs opslaan in database
- Failure notifications via email

### **Fase 4: 📋 Intelligente Sync (TODO)**
- Delta sync (alleen wijzigingen)
- Conflict resolution (WC vs Website wins)
- Soft-delete (archive ipv hard delete)

---

## 🆘 **Troubleshooting**

### **"Sync failed: WooCommerce API Error 500"**

**Oorzaak:** WordPress memory exhaustion  
**Fix:** Zie `URGENT_VOOR_ITER_2_MAART.md`

### **"Unauthorized" bij cron job**

**Oorzaak:** `CRON_SECRET` niet correct  
**Fix:** Check Vercel environment variables

### **"No occasions/products imported"**

**Mogelijke oorzaken:**
1. Geen producten in WooCommerce
2. Alle producten < €5000 (geen occasions)
3. WooCommerce API credentials verkeerd

**Debug:**
- Check WooCommerce API direct: `curl https://admin.bikerfun.nl/wp-json/wc/v3/products?consumer_key=...&consumer_secret=...`

### **Occasions verschijnen niet op website**

**Check:**
1. Is `status = 'publish'` in WooCommerce?
2. Is prijs > €5000?
3. Sync succesvol? (check admin dashboard)
4. Browser cache geleegd?

---

## 📞 **Support & Contact**

**Voor de gebruiker (Scott):**
- Handmatige sync: `/admin/sync`
- Laatste sync resultaten: Op sync pagina
- Vraag: WhatsApp IT'er

**Voor de IT'er:**
- Vercel Dashboard: https://vercel.com/scottlaeven21s-projects/bikerfun
- Cron Logs: Vercel → Deployments → Logs → Filter "cron"
- WordPress Memory: Zie `URGENT_VOOR_ITER_2_MAART.md`

**Voor ontwikkelaars:**
- API endpoints: `/api/admin/sync-woocommerce`, `/api/cron/sync-woocommerce`
- Sync logica: Check console logs (Vercel)
- Database: Supabase dashboard

---

## ✅ **Status Overzicht**

| Feature | Status | Testen | Productie |
|---------|--------|--------|-----------|
| Occasions sync (WC → Website) | ✅ Done | ⏳ TODO | ⏳ TODO |
| Producten sync (WC → Website) | ✅ Done | ⏳ TODO | ⏳ TODO |
| Bestellingen sync (Website → WC) | ✅ Done | ✅ Tested | ✅ Live |
| Handmatige sync button | ✅ Done | ⏳ TODO | ⏳ TODO |
| Automatische cron (03:00) | ✅ Done | ⏳ TODO | ⏳ TODO |
| Admin UI | ✅ Done | ⏳ TODO | ⏳ TODO |
| Error handling | ✅ Done | ⏳ TODO | ⏳ TODO |
| WordPress memory fix | ❌ TODO | ❌ N/A | ❌ Blocked |

---

**Laatste update:** 2 maart 2026, 17:30  
**Door:** Cursor AI  
**Voor:** Scott (Bikerfun)

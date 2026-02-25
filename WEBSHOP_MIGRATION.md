# 🚀 Webshop Migratie: WooCommerce → Supabase + Mollie

## 📋 OVERZICHT

We migreren van WooCommerce API naar Supabase + Mollie om:
- ⚡ **Snellere laadtijden** (geen PHP memory crashes)
- 💪 **Stabielere performance** (directe database toegang)
- 🎯 **Betere schaalbaarheid** (1000+ producten geen probleem)
- ✅ **Behoud alle functionaliteit** (emails, shipping, tracking blijven werken)

## 🏗️ ARCHITECTUUR

### Nieuwe Flow:

```
PRODUCTEN
├── Supabase (Master Database)
│   ├── webshop_products tabel
│   ├── Volledige product data
│   └── Super snelle queries
│
└── WooCommerce (Shell Products)
    ├── Minimale product data
    ├── Alleen voor order processing
    └── Auto-sync van Supabase

ORDERS
├── Klant bestelt op bikerfun.nl
├── Betaalt via Mollie
├── Order in Supabase
└── Auto-sync naar WooCommerce
    ├── WooCommerce emails
    ├── PDF Invoices
    ├── Shipping labels
    └── Track & Trace
```

## 📊 DATABASE SCHEMA

### `webshop_products`
Alle product data van WooCommerce geïmporteerd:
- Product info (naam, beschrijving, prijs)
- Voorraad beheer
- Categorieën & tags
- Afbeeldingen
- WooCommerce product ID (voor sync)

### `webshop_orders`
Orders van Mollie checkout:
- Order details
- Customer info
- Billing & shipping address
- Payment status (Mollie)
- WooCommerce order ID (na sync)

### `webshop_order_items`
Order line items:
- Product referenties
- Quantities & prijzen
- Product snapshot (naam, afbeelding)

## 🔧 IMPLEMENTATIE STAPPEN

### ✅ STAP 1: Database Setup (DONE)
- [x] Supabase migratie: `011_create_webshop_products.sql`
- [x] Supabase migratie: `012_create_webshop_orders.sql`
- [x] Mollie API key geconfigureerd in `.env.local`

### 🔄 STAP 2: CSV Import (IN PROGRESS)
- [ ] CSV parser script
- [ ] Data cleaning (prijzen, afbeeldingen, categorieën)
- [ ] Import in Supabase
- [ ] Verificatie (aantal producten, categorieën)

### 🛒 STAP 3: Product Pages (TODO)
- [ ] Fetch producten van Supabase (ipv WooCommerce)
- [ ] Category filtering van Supabase
- [ ] Search functionaliteit
- [ ] Product detail pages

### 💳 STAP 4: Mollie Checkout (TODO)
- [ ] Mollie client setup
- [ ] Checkout flow
- [ ] Payment redirect
- [ ] Webhook handler

### 🔗 STAP 5: WooCommerce Sync (TODO)
- [ ] Auto-create shell products in WooCommerce
- [ ] Order sync na Mollie payment
- [ ] Test met PDF Invoice plugin
- [ ] Test met shipping plugins

### ✅ STAP 6: Testing & Launch (TODO)
- [ ] Test complete checkout flow
- [ ] Test emails
- [ ] Test shipping workflow
- [ ] Production deployment

## 🔑 API KEYS & CREDENTIALS

### Mollie
```
Live API Key: live_sJGrU455zbfTq3RdzHf2MAt3f2Na3M
Location: .env.local → MOLLIE_API_KEY
```

### WooCommerce
```
Consumer Key: ck_5cd35c61dffeac50354a6f7574cf3aafb628b917
Consumer Secret: cs_d9a2f346c90a32010f37318f5670213f460a8390
Location: .env.local → WOOCOMMERCE_CONSUMER_KEY/SECRET
```

### Supabase
```
URL: https://uxepjramdcqvwafxwcxk.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Location: .env.local → NEXT_PUBLIC_SUPABASE_*
```

## 📦 CSV EXPORT

### Location
```
C:\Users\Scott\AppData\Local\Packages\...\wc-product-export-25-2-2026-1771976407099.csv
```

### Stats
- **Total lines:** ~697
- **Products:** ~696 (excluding header)
- **Categories:** Helmcovers, Sleutelhangers, etc.
- **Published:** Mix of published (1) and draft (-1)

### Columns Used
- ID → woo_product_id
- SKU → sku
- Naam → name
- Beschrijving → description
- Reguliere prijs → price, regular_price
- Actieprijs → sale_price
- Voorraad → stock_quantity
- Categorieën → categories (array)
- Afbeeldingen → images (JSONB)
- Gepubliceerd → status

## 🎯 VERWACHTE RESULTATEN

### Performance
- **Product pages:** < 500ms (was 2-5s)
- **Category pages:** < 300ms (was 3-10s)
- **Search:** < 200ms (nieuw!)
- **Checkout:** < 2s (was 5-15s)

### Reliability
- **No PHP memory errors** ✅
- **No WooCommerce API timeouts** ✅
- **Scalable to 10,000+ products** ✅

### Functionality
- **All WooCommerce plugins still work** ✅
- **Same emails & PDFs** ✅
- **Same shipping workflow** ✅
- **Same admin experience** ✅

## 🔄 PRODUCT SYNC STRATEGIE

### Admin toevoegt nieuw product:

```
1. Admin creates product in Dashboard
   ↓ (Saves in Supabase)
   
2. Auto-create "shell" in WooCommerce
   ↓ (Minimal data: name, price, SKU)
   
3. Link WooCommerce ID terug naar Supabase
   ↓ (Store woo_product_id)
   
4. Product INSTANT zichtbaar op website
   ↓ (Frontend haalt van Supabase)
```

### Klant bestelt product:

```
1. Customer adds to cart
   ↓ (From Supabase product)
   
2. Checkout & pays via Mollie
   ↓ (Mollie payment created)
   
3. Webhook: Payment successful
   ↓ (Mollie calls our API)
   
4. Create order in WooCommerce
   ↓ (Using woo_product_id)
   
5. WooCommerce triggers:
   ├── Email confirmation
   ├── PDF Invoice
   ├── Stock update
   └── Shipping label ready
```

## 📈 MIGRATION TIMELINE

### Week 1: Foundation (Current)
- [x] Day 1: Database schema
- [ ] Day 2-3: CSV import & testing
- [ ] Day 4-5: Product pages rebuild

### Week 2: Checkout
- [ ] Day 6-7: Mollie integration
- [ ] Day 8-9: WooCommerce sync
- [ ] Day 10: Testing

### Week 3: Polish & Launch
- [ ] Day 11-12: Bug fixes
- [ ] Day 13-14: Final testing
- [ ] Day 15: 🚀 LIVE!

## ⚠️ ROLLBACK PLAN

Als iets misgaat:
1. Switch DNS terug naar oude site
2. WooCommerce blijft volledig intact
3. Nieuwe site blijft beschikbaar op staging URL
4. Geen data verlies (beide systemen parallel)

## 🆘 SUPPORT

Bij vragen:
- Email: bikerfun.info@gmail.com
- Documentatie: Dit bestand + WEBSHOP_STATUS.md
- Logs: Check Vercel deployment logs
- Database: Check Supabase dashboard

---

**Status:** 🔄 IN PROGRESS
**Last Updated:** 2026-02-25
**Next Step:** CSV Import Script

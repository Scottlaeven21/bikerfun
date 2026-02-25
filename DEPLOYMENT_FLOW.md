# 🔄 Deployment & Order Flow - Visueel Overzicht

## 🌐 **Live Deployment Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. CODE REPOSITORY                           │
│                                                                 │
│  GitHub: Scottlaeven21/bikerfun                                │
│  Branch: main                                                   │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  │ Auto-deploy on push
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    2. VERCEL HOSTING                            │
│                                                                 │
│  • Builds Next.js app                                          │
│  • Hosts on CDN (razend snel)                                  │
│  • Auto SSL certificaat                                        │
│  • Environment variables                                       │
│                                                                 │
│  Domain: bikerfun.nl ──┐                                       │
│  URL: www.bikerfun.nl ─┴─→ Auto redirect                      │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  │ DNS points to
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    3. LIVE WEBSITE                              │
│                                                                 │
│  https://bikerfun.nl                                           │
│                                                                 │
│  ✅ Homepage          ✅ Occasions                              │
│  ✅ Webshop           ✅ Product pages                          │
│  ✅ Cart              ✅ Checkout                               │
│  ✅ Admin dashboard   ✅ Analytics                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💳 **Complete Order Flow (Klant → Email)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  STAP 1: KLANT WINKELT                                              │
└───────────────────────┬──────────────────────────────────────────────┘
                        │
                        │ Klant voegt producten toe
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  bikerfun.nl/products                                           │
│  • Browse 196 producten                                         │
│  • Filter op categorie                                          │
│  • Klik "In winkelwagen"                                        │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  WINKELWAGEN                                                    │
│  • Producten lijst                                              │
│  • Aantal aanpassen                                             │
│  • Subtotaal + verzendkosten                                    │
│  • Klik "Afrekenen"                                             │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAP 2: CHECKOUT FORMULIER                                     │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ Klant vult gegevens in
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  bikerfun.nl/checkout                                           │
│  • Email, naam, telefoon                                        │
│  • Factuuradres                                                 │
│  • Verzendadres                                                 │
│  • Verzendkosten berekening (gratis bij ≥ €50)                 │
│  • Klik "Betalen met Mollie"                                    │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ POST naar /api/checkout
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAP 3: ORDER CREATIE (Backend)                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  /api/checkout                                                  │
│  1. Valideer cart items                                         │
│  2. Bereken totaal                                              │
│  3. Create order in Supabase (status: pending)                 │
│  4. Create order items in Supabase                             │
│  5. Create Mollie payment                                       │
│  6. Save mollie_payment_id in order                            │
│  7. Return: Mollie checkout URL                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ Redirect klant naar Mollie
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAP 4: MOLLIE PAYMENT                                         │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  mollie.com/checkout/...                                        │
│  • Klant ziet order samenvatting                               │
│  • Kiest betaalmethode (iDEAL, creditcard, etc.)               │
│  • Voert betaalgegevens in                                      │
│  • Betaalt                                                      │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ├─────────────────────┬──────────────────────────┐
                   │                     │                          │
           ┌───────▼─────────┐  ┌────────▼────────┐   ┌──────────▼─────────┐
           │  Betaling       │  │  Mollie Webhook │   │  Klant Return      │
           │  Succesvol      │  │                 │   │                    │
           └───────┬─────────┘  └────────┬────────┘   └──────────┬─────────┘
                   │                     │                         │
                   │                     │ Mollie stuurt webhook   │
                   │                     ▼                         │
                   │         ┌─────────────────────────────────┐  │
                   │         │  bikerfun.nl/api/webhooks/mollie│  │
                   │         │                                 │  │
                   │         │  1. Fetch payment status        │  │
                   │         │  2. Update order in Supabase    │  │
                   │         │  3. Check: payment = 'paid'?    │  │
                   │         │     ├─ YES → Sync to WooComm    │  │
                   │         │     └─ NO  → Stop               │  │
                   │         └────────┬────────────────────────┘  │
                   │                  │                            │
                   │                  │ If paid                    │
                   │                  ▼                            │
                   │         ┌─────────────────────────────────┐  │
                   │         │  WooCommerce Sync               │  │
                   │         │                                 │  │
                   │         │  1. Check if already synced     │  │
                   │         │  2. Create order in WooCommerce │  │
                   │         │  3. Save woo_order_id           │  │
                   │         │  4. WooCommerce sends emails    │  │
                   │         │  5. Shipping plugins activated  │  │
                   │         └────────┬────────────────────────┘  │
                   │                  │                            │
                   └──────────────────┴────────────┬───────────────┘
                                                   │
                                                   ▼
                   ┌─────────────────────────────────────────────┐
                   │  STAP 5: ORDER CONFIRMATION                 │
                   └──────────────────┬──────────────────────────┘
                                      │
                                      ▼
                   ┌─────────────────────────────────────────────┐
                   │  bikerfun.nl/payment-return?orderId=xxx     │
                   │  • Fetch order status                       │
                   │  • Poll every 2s if pending                 │
                   │  • Redirect to order confirmation           │
                   └──────────────────┬──────────────────────────┘
                                      │
                                      ▼
                   ┌─────────────────────────────────────────────┐
                   │  bikerfun.nl/order-confirmation/[orderId]   │
                   │  • Toon bestelnummer                        │
                   │  • Toon producten lijst                     │
                   │  • Toon totaalbedrag                        │
                   │  • "Terug naar webshop" knop                │
                   └─────────────────────────────────────────────┘
```

---

## 📧 **Email & Shipping Flow**

```
┌─────────────────────────────────────────────────────────────────┐
│  AFTER PAYMENT SUCCESS                                          │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ Mollie webhook triggers sync
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  Order Created in WooCommerce                                   │
│  Status: Processing (= Betaald)                                 │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ├─────────────────────┬─────────────────────────┐
                   │                     │                         │
           ┌───────▼────────┐   ┌────────▼─────────┐   ┌─────────▼────────┐
           │  KLANT EMAIL   │   │  ADMIN EMAIL     │   │  SHIPPING        │
           │                │   │                  │   │                  │
           │  ✉ Bestelling  │   │  ✉ Nieuwe order │   │  📦 Plugins      │
           │    bevestiging │   │     notificatie  │   │     pakken order │
           │  ✉ PDF Invoice │   │  ✉ Order details│   │     op           │
           │  ✉ Track&Trace │   │                  │   │  📧 Verzend      │
           │    (later)     │   │                  │   │     notificatie  │
           └────────────────┘   └──────────────────┘   └──────────────────┘
```

---

## 🎯 **Deployment Status Check**

### Hoe Weet je dat Alles Werkt?

#### ✅ **DNS Actief:**
```bash
# Open in browser
https://bikerfun.nl

# Moet website tonen (niet error)
```

#### ✅ **SSL Actief:**
```bash
# Check groene slotje in browser adresbalk
# URL moet beginnen met https://
```

#### ✅ **Checkout Werkt:**
```bash
1. Voeg product toe aan cart
2. Checkout
3. Betaal via Mollie
4. Return naar bikerfun.nl/order-confirmation
5. Check email inbox
```

#### ✅ **WooCommerce Sync Werkt:**
```bash
1. Login admin.bikerfun.nl/wp-admin
2. WooCommerce → Orders
3. Je test order moet er staan
4. Status: "Processing"
```

---

## 🚨 **Critical URLs Checklist**

### Environment Variables in Vercel:
```bash
NEXT_PUBLIC_APP_URL=https://bikerfun.nl           # ← Juiste domain!
MOLLIE_API_KEY=live_sJGrU455zbfTq3RdzHf2MAt3f2Na3M
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
```

### Mollie Webhook URL:
```
https://bikerfun.nl/api/webhooks/mollie          # ← Moet EXACT kloppen!
```

### Vercel Domains:
```
bikerfun.nl      → Primary domain
www.bikerfun.nl  → Redirects to bikerfun.nl
```

---

## 📊 **Monitoring na Live Gaan**

### Dag 1-3: Let Op

**Check dagelijks:**
- Vercel logs voor errors
- Mollie payments voor succesvolle betalingen
- WooCommerce orders voor sync
- Email ontvangst (test zelf een bestelling)

**Check metrics:**
- Vercel Analytics → Traffic
- Mollie Dashboard → Payments
- WooCommerce → Reports

### Week 1: Optimalisatie

**Performance:**
- Google PageSpeed Insights
- Core Web Vitals check
- Mobile performance test

**SEO:**
- Google Search Console instellen
- Sitemap indienen
- Check indexatie

**UX:**
- Real user testing (vrienden/familie)
- Feedback verzamelen
- Kleine verbeteringen doorvoeren

---

## 🎊 **Launch Day Checklist**

Print deze checklist voor launch dag:

### Pre-Launch (1 uur voor)
- [ ] Laatste code changes gepushed
- [ ] Vercel deployment succesvol
- [ ] Alle tests passed
- [ ] Backup van database gemaakt

### Launch (Go Live)
- [ ] Domain toegevoegd in Vercel
- [ ] DNS geconfigureerd
- [ ] SSL certificaat actief
- [ ] Environment variables bijgewerkt
- [ ] Mollie webhook ingesteld
- [ ] Test checkout succesvol

### Post-Launch (eerste 24 uur)
- [ ] Monitor Vercel logs
- [ ] Check eerste echte order
- [ ] Verifieer email ontvangst
- [ ] Check WooCommerce sync
- [ ] Social media announcement (optioneel)
- [ ] Newsletter naar klanten (optioneel)

---

## 🆘 **Emergency Rollback**

Als er iets COMPLEET mis gaat na launch:

### Terug naar Oude Website (Snel)

**Bij je domain provider:**
1. Wijzig nameservers terug naar oude hosting
2. Of update A record naar oude server IP
3. DNS propagatie: ~10 minuten

**In Mollie:**
1. Wijzig webhook terug naar oude URL

### Vercel Blijft Beschikbaar

Je nieuwe website blijft beschikbaar op:
```
https://bikerfun-xxx.vercel.app
```

Je kunt hier verder ontwikkelen en later opnieuw live gaan.

---

## 📞 **Support Contact**

### Vercel Support
- [vercel.com/help](https://vercel.com/help)
- Live chat beschikbaar
- Response tijd: ~1-4 uur

### Mollie Support
- [mollie.com/contact](https://mollie.com/contact)
- Email: info@mollie.com
- Telefoon: +31 20 820 20 70

### Supabase Support
- [supabase.com/support](https://supabase.com/support)
- Discord community
- Documentation: [supabase.com/docs](https://supabase.com/docs)

---

## 🎯 **TL;DR - Snelle Acties**

**Wat JIJ moet doen vandaag:**

1. **5 min:** Vercel domain toevoegen
2. **5 min:** DNS configureren
3. **30 min:** Wachten (koffie halen ☕)
4. **2 min:** Environment variable updaten + redeploy
5. **2 min:** Mollie webhook instellen
6. **10 min:** Complete test checkout
7. **5 min:** Eerste echte order monitoren

**Totaal: ~1 uur (waarvan 30 min wachten)**

---

## 🚀 **Na Launch**

### Website is nu LIVE met:
- ✅ Razendsnelle performance
- ✅ 196 Webshop producten
- ✅ 29 Motor occasions
- ✅ Mollie checkout (alle betaalmethoden)
- ✅ Automatische emails
- ✅ WooCommerce shipping integratie
- ✅ Admin dashboard
- ✅ Mobile responsive
- ✅ SEO geoptimaliseerd
- ✅ SSL beveiligd

### Volgende Features (Optioneel):
- Admin product management (CRUD)
- Advanced analytics dashboard
- Newsletter integratie
- Social media sharing
- Customer reviews
- Wishlist functionaliteit

---

**Je bent klaar voor launch! 🎉**

Volg `DEPLOY_LIVE_GUIDE.md` voor gedetailleerde stappen, of gebruik `QUICK_START_DEPLOY.md` voor snelle setup.

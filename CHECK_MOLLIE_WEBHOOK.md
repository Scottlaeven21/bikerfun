# Check Mollie Webhook Configuratie

## 🎯 Het Probleem

Orders worden succesvol betaald, maar **WooCommerce sync gebeurt niet automatisch**.

**Handmatig syncen werkt** → WooCommerce API werkt ✓  
**Automatisch syncen werkt niet** → Mollie webhook probleem ✗

---

## ✅ Stap 1: Check Mollie Webhook URL

### Login Op Mollie Dashboard

```
URL: https://www.mollie.com/dashboard
```

**Navigatie:**
```
Dashboard → Developers → Webhooks
```

### Check/Configureer Webhook

**Webhook URL moet zijn:**
```
https://bikerfun.nl/api/webhooks/mollie
```

**Settings:**
- ✅ **URL:** `https://bikerfun.nl/api/webhooks/mollie`
- ✅ **Events:** All payment events (of minimaal: paid, failed, expired, canceled)
- ✅ **Status:** Active/Enabled

**Als webhook NIET bestaat:**
1. Klik **Create webhook**
2. URL: `https://bikerfun.nl/api/webhooks/mollie`
3. Description: `Bikerfun Order Sync`
4. Save

**Als webhook WEL bestaat maar andere URL:**
1. Delete oude webhook
2. Create nieuwe met correcte URL

---

## ✅ Stap 2: Test Webhook (In Mollie Dashboard)

### Test Via Mollie

**In Mollie Dashboard:**
1. Ga naar: **Developers → Webhooks**
2. Klik op je webhook
3. Klik: **Test webhook** (als beschikbaar)

**OF:**

1. Ga naar: **Payments**
2. Open een betaling
3. Klik: **Resend webhook**

**Verwacht resultaat:**
- Mollie stuurt POST request naar `bikerfun.nl/api/webhooks/mollie`
- Vercel webhook processed het
- Order wordt gesynced naar WooCommerce

---

## ✅ Stap 3: Check Vercel Webhook Logs

### Login Op Vercel

```
URL: https://vercel.com/scottlaeven21s-projects/bikerfun
```

**Navigatie:**
```
Project: bikerfun → Logs → Functions
```

**Filter:**
```
/api/webhooks/mollie
```

**Wat moet je zien:**

**Als webhook WERKT:**
```
[13:33:50] POST /api/webhooks/mollie 200
[13:33:50] Mollie webhook received for payment: tr_FxrVcXc3fyAT3HuUmbjMJ
[13:33:50] Payment status: paid
[13:33:51] Order synced! WooCommerce Order ID: 3047
```

**Als webhook NIET aangeroepen wordt:**
```
<no logs>
```
→ Mollie stuurt geen webhook → Check Mollie configuratie

**Als webhook FAALT:**
```
[13:33:50] POST /api/webhooks/mollie 500
[13:33:50] Error: ...
```
→ Webhook wordt wel aangeroepen maar crasht → Check error message

---

## ✅ Stap 4: Test Met Nieuwe Bestelling

**Plaats test bestelling:**

1. Ga naar: `bikerfun.nl/products`
2. Voeg product toe
3. Checkout
4. Betaal via Mollie

**Direct NA betaling:**

**Check 1: Vercel Logs (onmiddellijk)**
```
vercel.com → bikerfun → Logs → filter: /api/webhooks/mollie
```

**Check 2: Supabase (na 5-10 sec)**
```bash
npx tsx scripts/check-supabase-orders.ts
```

Nieuwste order moet `woo_order_id` hebben!

**Check 3: WooCommerce Admin (na 10 sec)**
```
admin.bikerfun.nl/wp-admin → WooCommerce → Orders
```

Nieuwe order moet er staan!

---

## 🔧 Troubleshooting

### Probleem: Webhook niet in Mollie Dashboard

**Oplossing:** Maak webhook handmatig aan (zie Stap 1)

### Probleem: Webhook bestaat maar geen logs in Vercel

**Mogelijke oorzaken:**
1. **URL is fout** → Check exact: `https://bikerfun.nl/api/webhooks/mollie`
2. **Webhook disabled** → Enable in Mollie
3. **Test/Live mode mismatch** → Check dat je LIVE API key gebruikt in productie

**Check in Mollie:**
- Test mode API key → Test mode webhooks
- Live mode API key → Live mode webhooks

### Probleem: Webhook faalt in Vercel (500 error)

**Check de error in Vercel logs:**
- Als memory error → IT'er moet restart doen
- Als database error → Check Supabase connection
- Als WooCommerce error → Check API keys

---

## 📋 Quick Checklist

**Voor automatische sync:**

- [ ] Memory limit verhoogd naar 512M ✓ (dit werkt nu!)
- [ ] Apache herstart ✓ (dit werkt nu!)
- [ ] Vercel deployment klaar (check status)
- [ ] Mollie webhook URL correct: `https://bikerfun.nl/api/webhooks/mollie`
- [ ] Mollie webhook enabled/active
- [ ] Test bestelling → check Vercel logs
- [ ] Test bestelling → order heeft WooCommerce ID

---

## 🚀 Tijdelijke Workflow (Tot Webhook Werkt)

**Na elke betaling:**
```bash
# Check of er unsynced orders zijn:
npx tsx scripts/check-supabase-orders.ts

# Als je NULL ziet bij WC ID, sync:
npx tsx scripts/sync-latest-order.ts

# Dit synct automatisch alle betaalde orders zonder WooCommerce ID
```

---

## 💡 Auto-Sync Script (Cron Job - Optioneel)

Als je webhook lastig te fixen is, kan je een cron job maken:

**Maak:** `scripts/auto-sync-cron.sh`
```bash
#!/bin/bash
cd /path/to/project
npx tsx scripts/sync-latest-order.ts
```

**Cron:**
```bash
# Run elke 5 minuten:
*/5 * * * * /path/to/scripts/auto-sync-cron.sh
```

**Maar:** Dit is een workaround. Webhook fix is beter!

---

## 🎯 Next Steps

**Nu (onmiddellijk):**
1. ✅ Orders zijn gesynced
2. 📧 Verstuur emails handmatig via WooCommerce admin:
   - Order 3043: https://admin.bikerfun.nl/wp-admin/post.php?post=3043&action=edit
   - Order 3047: https://admin.bikerfun.nl/wp-admin/post.php?post=3047&action=edit

**Daarna (voor automatische sync):**
1. Check Mollie webhook configuratie
2. Check Vercel deployment status
3. Test nieuwe bestelling
4. Check Vercel webhook logs

**Als webhook blijft falen:**
1. Gebruik `scripts/sync-latest-order.ts` na elke bestelling
2. Of setup cron job voor automatische sync elke 5 min

# 🔍 Mollie Webhook Diagnostics

## Het Probleem

Orders worden succesvol betaald via Mollie, maar **automatische synchronisatie naar WooCommerce werkt niet**.

**Wat werkt:**
- ✅ Checkout flow
- ✅ Mollie betaling
- ✅ Order opslaan in Supabase
- ✅ WooCommerce API (handmatig syncen werkt!)

**Wat NIET werkt:**
- ❌ Automatische sync na betaling
- ❌ Mollie webhook triggert niet (of crasht)

---

## 🎯 Stap 1: Check Mollie Webhook Configuratie

### Login Mollie Dashboard

```
URL: https://www.mollie.com/dashboard
```

**Let op:** Zorg dat je in **LIVE mode** zit (rechtsboven), NIET in test mode!

### Navigatie

```
Dashboard → Developers → Webhooks
```

### Check Webhook URL

**De webhook URL MOET exact zijn:**
```
https://bikerfun.nl/api/webhooks/mollie
```

**Check:**
- [ ] Webhook bestaat
- [ ] URL is EXACT `https://bikerfun.nl/api/webhooks/mollie`
- [ ] Status is "Active" of "Enabled"
- [ ] Je bent in LIVE mode (niet test mode)

### Als Webhook Niet Bestaat

**Maak nieuwe webhook aan:**

1. Klik: **Create webhook** of **Add webhook**
2. **URL:** `https://bikerfun.nl/api/webhooks/mollie`
3. **Description:** `Bikerfun Order Sync`
4. **Events:** Select "All payment events" (of minimaal: paid, failed, expired, canceled)
5. Klik: **Save** / **Create**

### Als Webhook Wel Bestaat Maar Andere URL

**Delete en maak opnieuw:**

1. Klik op webhook
2. Delete
3. Maak nieuwe aan met correcte URL (zie boven)

---

## 🎯 Stap 2: Test Webhook Met Bestaande Betaling

### In Mollie Dashboard

1. Ga naar: **Payments** (in sidebar)
2. Find de test betaling (€0.01) van vandaag:
   - Payment ID: `tr_P9jX4zvYJpmWpyXrddjMJ`
   - Datum: 27 Feb 2026 13:51
   - Bedrag: €0.01
3. Klik op de payment
4. Klik: **Resend webhook** (als beschikbaar)

**Verwacht resultaat:**
- Mollie stuurt POST request naar `bikerfun.nl/api/webhooks/mollie`
- Order wordt gesynchroniseerd
- Check Supabase: order heeft nu `woo_order_id`

**Check of het werkt:**
```bash
npx tsx scripts/check-supabase-orders.ts
```

Nieuwste order (BF-1772200304240) moet nu WooCommerce ID hebben!

---

## 🎯 Stap 3: Check Vercel Webhook Logs

### Login Vercel

```
URL: https://vercel.com/scottlaeven21s-projects/bikerfun
```

### Ga Naar Logs

```
Project: bikerfun → Logs → Functions
```

### Filter Op Webhook

In het filter veld typ:
```
/api/webhooks/mollie
```

### Wat Moet Je Zien?

**Als webhook WERKT:**
```
[13:51:58] POST /api/webhooks/mollie 200
[13:51:58] Mollie webhook received for payment: tr_P9jX4zvYJpmWpyXrddjMJ
[13:51:58] Payment status: paid
[13:51:59] Order synced! WooCommerce Order ID: 3050
```

**Als webhook NIET aangeroepen wordt:**
```
<no logs>
```
→ Mollie stuurt geen webhook
→ Check Mollie webhook configuratie (Stap 1)

**Als webhook FAALT (500 error):**
```
[13:51:58] POST /api/webhooks/mollie 500
[13:51:58] Error: ...
```
→ Webhook wordt aangeroepen maar crasht
→ Check error message in logs

---

## 🎯 Stap 4: Check Live/Test Mode

### Mollie API Keys

**Vercel Environment Variables:**
```
https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables
```

**Check:**
- [ ] `MOLLIE_API_KEY` begint met `live_` (NIET `test_`)

**Als je test key gebruikt:**
- Webhook in Mollie test mode != webhook in Mollie live mode
- Echte betalingen triggeren niet de test mode webhook

**Fix:**
1. Mollie Dashboard → Developers → API Keys
2. Kopieer LIVE key (begint met `live_`)
3. Update Vercel environment variable `MOLLIE_API_KEY`
4. Redeploy Vercel

---

## 🎯 Stap 5: Check Vercel Deployment

### Deployment Status

```
https://vercel.com/scottlaeven21s-projects/bikerfun/deployments
```

**Check laatste deployment:**
- [ ] Status: **Ready** (groen)
- [ ] Commit: `bd68d4f` of nieuwer
- [ ] Time: Binnen laatste 2 uur
- [ ] Domain: `bikerfun.nl`

**Als deployment NIET klaar:**
- Wacht tot "Ready"
- Refresh pagina
- Check voor errors

**Als deployment oud is (>2 uur):**
- Er is geen nieuwe deployment getriggerd
- Push nieuwe commit of trigger handmatig

---

## 🎯 Stap 6: Test Met Nieuwe Bestelling

**Na het fixen van webhook configuratie:**

1. Plaats nieuwe €0.01 test bestelling
2. Betaal via Mollie
3. **Direct daarna (10 sec):**

```bash
npx tsx scripts/check-supabase-orders.ts
```

**Verwacht resultaat:**
- ✅ Nieuwste order heeft `woo_order_id`
- ✅ `synced_to_woo: true`
- ✅ Status: `processing`

**Check ook Vercel logs (zie Stap 3)**

---

## 🔧 Troubleshooting

### Probleem: Webhook Logs Tonen 500 Error

**Mogelijke oorzaken:**
1. **Memory issue** (WordPress crasht nog)
   - Check WordPress error log
   - IT'er moet Apache restart doen
   - Verify memory limit: 512MB

2. **Database error** (Supabase)
   - Check error message in Vercel logs
   - Check Supabase connection

3. **WooCommerce API error**
   - Check WooCommerce API keys
   - Test handmatig: `npx tsx scripts/check-woocommerce-order.ts`

### Probleem: Geen Logs In Vercel

**Check:**
1. Mollie webhook URL is correct
2. Je bent in LIVE mode (niet test)
3. API key in Vercel is LIVE key
4. Webhook is enabled in Mollie

**Test:**
- Resend webhook in Mollie dashboard (zie Stap 2)
- Check logs binnen 10 seconden

### Probleem: Deployment Niet "Ready"

**Wacht of trigger nieuw:**
```bash
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 📋 Quick Checklist

**Voor automatische sync:**

- [ ] Mollie webhook URL correct: `https://bikerfun.nl/api/webhooks/mollie`
- [ ] Mollie webhook enabled/active
- [ ] Mollie LIVE mode (niet test)
- [ ] Vercel `MOLLIE_API_KEY` is LIVE key (begint met `live_`)
- [ ] Vercel deployment status: Ready
- [ ] Test bestelling → check Vercel logs
- [ ] Test bestelling → order heeft WooCommerce ID

---

## 🚀 Tijdelijke Workflow (Tot Webhook Werkt)

**Na elke betaling:**
```bash
# Check welke orders nog niet gesynced zijn:
npx tsx scripts/check-supabase-orders.ts

# Sync alle unsynced orders automatisch:
npx tsx scripts/sync-latest-order.ts
```

Dit synct automatisch alle betaalde orders zonder WooCommerce ID.

---

## 💡 Next Steps

**Prioriteit 1: Configureer Mollie Webhook**
1. Volg Stap 1 hierboven
2. Maak/check webhook in Mollie dashboard
3. Test met "Resend webhook" (Stap 2)
4. Check Vercel logs (Stap 3)

**Prioriteit 2: Test Nieuwe Bestelling**
1. Plaats nieuwe €0.01 test order
2. Check of auto-sync werkt
3. Check Vercel logs voor errors

**Als webhook blijft falen:**
1. Gebruik handmatige sync: `npx tsx scripts/sync-latest-order.ts`
2. Of setup cron job voor automatische sync elke 5 min
3. Debug met Vercel logs

---

## 📧 Voor Nu: Email Handmatig Versturen

**Order 3050 (test order €0.01):**
```
https://admin.bikerfun.nl/wp-admin/post.php?post=3050&action=edit
```

**Stappen:**
1. Open URL
2. Scroll naar: **Order Actions** dropdown
3. Selecteer: "Email invoice / order details to customer"
4. Klik: **Update**

---

## 🎉 Success Criteria

**Automatische sync werkt als:**
- ✅ Nieuwe bestelling plaatsen
- ✅ Betalen via Mollie
- ✅ Order verschijnt automatisch in WooCommerce (binnen 10 sec)
- ✅ `woo_order_id` in Supabase
- ✅ Email wordt automatisch verstuurd
- ✅ Geen handmatige actie nodig

**Huidig status:**
- ✅ Checkout werkt
- ✅ Betaling werkt
- ✅ Manual sync werkt
- ❌ Automatische sync via webhook werkt NIET

**Actie:** Check Mollie webhook configuratie (Stap 1)!

# 🧪 Checkout & WooCommerce Sync - Test Plan

## ✅ Pre-requisites (COMPLETED!)

- [x] Database RLS policies ingesteld
- [x] Mollie webhook geconfigureerd (`https://bikerfun.nl/api/webhooks/mollie`)
- [x] WooCommerce API keys correct
- [x] PHP memory limit verhoogd
- [x] Verzendkosten logica geconfigureerd

---

## 🧪 Test 1: Checkout Proces

### Stappen:
1. Ga naar `https://bikerfun.nl/products`
2. Voeg een product toe aan winkelwagen (bijv. €30 product)
3. Klik op **winkelwagen icon** (rechts boven)
4. Klik op **"Naar Checkout"**
5. Vul gegevens in:
   - **Email:** test@bikerfun.nl
   - **Naam:** Test Gebruiker
   - **Adres:** Teststraat 123
   - **Postcode:** 1234 AB
   - **Plaats:** Amsterdam
   - **Land:** Nederland
6. Klik **"Bestelling Plaatsen"**

### Verwacht Resultaat:
✅ Redirect naar Mollie betaalpagina
✅ Juist bedrag getoond (€30 + verzendkosten)
✅ Order aangemaakt in Supabase

### Als het NIET werkt:
❌ Check browser console (F12) voor errors
❌ Ververs de pagina en probeer opnieuw

---

## 🧪 Test 2: Mollie Betaling

### Stappen:
1. Op Mollie betaalpagina, kies **"iDEAL"**
2. Kies bank: **"Test Bank"** (in test mode)
3. Kies: **"Paid"** (simuleer succesvolle betaling)
4. Klik **"Continue"**

### Verwacht Resultaat:
✅ Redirect terug naar bikerfun.nl
✅ Success pagina getoond

---

## 🧪 Test 3: Supabase Order Check

### Stappen:
1. Ga naar Supabase Dashboard: https://supabase.com/dashboard/project/uxepjramdcqvwafxwcxk
2. Klik op **"Table Editor"** (linkermenu)
3. Selecteer tabel: **`webshop_orders`**
4. Zoek de nieuwste order (laatst aangemaakte)

### Verwacht Resultaat:
✅ **`status`** = **'processing'** (niet 'pending')
✅ **`payment_status`** = **'paid'**
✅ **`woo_order_id`** = heeft een nummer (bijv. 12345)
✅ **`synced_to_woo`** = **true**
✅ **`paid_at`** = heeft datum/tijd

### Als `woo_order_id` NULL is:
❌ Sync naar WooCommerce is mislukt
❌ Check **`sync_error`** kolom voor error message

---

## 🧪 Test 4: WooCommerce Order Check

### Stappen:
1. Login WooCommerce: `https://admin.bikerfun.nl/wp-admin`
2. Ga naar **WooCommerce → Orders**
3. Zoek de nieuwste order (met order nummer uit Supabase)

### Verwacht Resultaat:
✅ **Order bestaat** in WooCommerce
✅ **Status:** Processing
✅ **Klantgegevens:** Correct
✅ **Producten:** Correct
✅ **Verzendkosten:** Correct bedrag
✅ **Totaal:** Klopt met betaald bedrag

### Check Details:
- Billing adres: Teststraat 123, Amsterdam
- Shipping adres: Zelfde als billing
- Payment method: "Mollie"
- Order notes: Kan lege zijn

---

## 🧪 Test 5: Email Verificatie

### Stappen:
1. Check email inbox van `test@bikerfun.nl`
2. Zoek naar email van WooCommerce

### Verwacht Resultaat:
✅ **Email ontvangen** met onderwerp: "Your Bikerfun order..."
✅ Email bevat order details
✅ Email bevat producten
✅ Email bevat totaalbedrag

### Als geen email:
❌ Check WooCommerce email settings
❌ Check spam folder
❌ Check if StackMail werkt (zie `EMAIL_DNS_CONFIGURATION.md`)

---

## 🧪 Test 6: Verzendlabel (Optioneel)

### Stappen:
1. In WooCommerce order (admin.bikerfun.nl)
2. Klik op **"Print packing slip"** of gebruik verzendplugin
3. Maak verzendlabel aan zoals je normaal doet

### Verwacht Resultaat:
✅ **Verzendlabel** kan worden aangemaakt
✅ Alle data aanwezig voor verzending
✅ Werkt zoals voorheen met WooCommerce orders

---

## 🚨 Troubleshooting

### Checkout werkt niet (500 error):
1. Check browser console (F12)
2. Check `/api/checkout` endpoint
3. Verifieer Supabase RLS policies

### Order niet gesynced naar WooCommerce:
1. Check Supabase `webshop_orders` → `sync_error` kolom
2. Check WooCommerce API keys in Vercel env vars
3. Check PHP memory limit in WordPress (moet ≥256MB zijn)
4. Check Vercel logs: `vercel logs bikerfun.nl`

### Mollie webhook wordt niet getriggerd:
1. Check Mollie Dashboard → Settings → Webhooks
2. Webhook URL moet zijn: `https://bikerfun.nl/api/webhooks/mollie`
3. Test met Mollie test payment
4. Check Mollie webhook logs in Mollie Dashboard

### Email niet verzonden:
1. Check WooCommerce → Settings → Emails
2. Test email verzending in WooCommerce
3. Check StackMail configuratie (zie `EMAIL_DNS_CONFIGURATION.md`)

---

## ✅ Success Criteria

Alles werkt als:
- ✅ Checkout succesvol
- ✅ Betaling via Mollie werkt
- ✅ Order status = 'processing' in Supabase
- ✅ `woo_order_id` is gevuld
- ✅ Order verschijnt in WooCommerce admin
- ✅ Klant ontvangt email
- ✅ Verzendlabel kan worden aangemaakt

**Als alle tests slagen: De complete flow werkt en orders van bikerfun.nl worden automatisch in WooCommerce geplaatst voor verzending!** 🎉

---

## 📞 Support

Als er issues zijn:
1. Check Supabase `sync_error` kolom
2. Check Vercel logs
3. Check WooCommerce PHP error logs
4. Test WooCommerce API: `https://bikerfun.nl/api/test-woocommerce`

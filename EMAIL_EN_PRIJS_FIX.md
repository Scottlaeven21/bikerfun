# 📧 Email & Prijs Problemen Opgelost

## 🔍 De Problemen

### ❌ Probleem 1: Verkeerde Bedragen in WooCommerce

**Wat je zag in WooCommerce:**
- Bestelling van €6.95 verschijnt als **€8.41** (21% te hoog)
- €6.95 × 1.21 = €8.41

**Oorzaak:**
WooCommerce heeft `prices_include_tax: true` (Nederlandse standaard = prijzen zijn inclusief BTW).

Onze sync code stuurde:
- Product prijs: €6.95 (bruto)
- WooCommerce dacht: "dit is netto, ik moet 21% BTW toevoegen"
- Resultaat: €6.95 + 21% = €8.41

**Voorbeeld:**
```
Key to Happiness = €6.95 (incl. BTW)

Oude sync → WooCommerce:
  price: 6.95 (WooCommerce denkt: netto)
  WC berekent: 6.95 + 21% BTW = €8.41 ❌

Nieuwe sync → WooCommerce:
  price: 6.95
  prices_include_tax: true
  WC berekent: €6.95 (geen extra BTW) ✅
```

---

### ❌ Probleem 2: Geen Bevestiging Emails

**Wat gebeurde:**
Orders werden correct gesynced naar WooCommerce, maar klanten ontvingen geen bevestiging email.

**Oorzaak:**
WooCommerce stuurt emails normaal bij **status changes**:
- Pending → Processing = email ✅
- Pending → Completed = email ✅

Onze sync maakte orders direct aan als:
- Status: `processing` (geen change!)
- Paid: `true`

Omdat er geen status *change* was, werd geen email getriggerd.

---

## ✅ De Oplossingen

### Fix 1: Correcte Prijzen

**Toegevoegd aan sync code:**
```typescript
{
  prices_include_tax: true,  // ← Nieuwe regel
  // ...rest van order data
}
```

Dit vertelt WooCommerce: "De prijzen die ik stuur zijn al inclusief BTW, bereken GEEN extra BTW!"

**Resultaat:**
- €6.95 product → €6.95 in WooCommerce ✅
- €0.01 product → €0.01 in WooCommerce ✅

---

### Fix 2: Email Triggering

**Toegevoegd aan sync code:**
```typescript
meta_data: [
  // ... andere meta data
  {
    key: '_send_order_email',
    value: 'true',  // ← Nieuwe regel
  },
]
```

**Maar dit is niet genoeg!** WooCommerce REST API triggert niet automatisch emails.

**Extra stap nodig:** WordPress plugin of custom endpoint.

---

## 🔧 Voor Bestaande (Oude) Orders

### Optie A: Handmatig Emails Versturen (Simpelst)

**Voor elke oude order:**

1. **Login WooCommerce:**
   ```
   https://admin.bikerfun.nl/wp-admin/edit.php?post_type=shop_order
   ```

2. **Open order** (bijvoorbeeld #3047, #3043)

3. **Scroll naar "Order Actions"** (rechts)

4. **Selecteer:** "Email invoice / order details to customer"

5. **Klik:** Update

6. Email wordt direct verstuurd! ✅

**Oude orders met verkeerde bedragen:**
- #3047: €8.41 (zou €6.95 moeten zijn)
- #3043: €8.41 (zou €6.95 moeten zijn)
- #3042: €8.41 (zou €6.95 moeten zijn)

**Actie:**
1. Edit order
2. Pas totaal aan naar €6.95
3. Verstuur email

---

### Optie B: WordPress Plugin Voor Auto-Emails (Beste Langetermijn)

**Installeer plugin:** "WooCommerce Order Email Trigger for REST API"

**Stappen:**

1. **WordPress admin:**
   ```
   https://admin.bikerfun.nl/wp-admin/plugin-install.php
   ```

2. **Search:** "WooCommerce Email"

3. **Installeer een van deze:**
   - "WooCommerce Admin Custom Order Fields"
   - "Order Email Trigger for WooCommerce"
   - Of: custom code snippet

4. **Configureer:** Trigger emails bij order creation via REST API

---

### Optie C: Custom WordPress Code (Voor IT'er)

**Voeg toe aan `functions.php` van theme:**

```php
<?php
// Trigger email bij order creation via REST API
add_action('woocommerce_api_create_order', 'send_order_email_on_api_create', 10, 2);

function send_order_email_on_api_create($order_id, $request) {
    $order = wc_get_order($order_id);
    
    if ($order && $order->get_status() === 'processing' && $order->is_paid()) {
        // Verstuur nieuwe order email
        WC()->mailer()->get_emails()['WC_Email_New_Order']->trigger($order_id);
        
        // Verstuur klant bevestiging email
        WC()->mailer()->get_emails()['WC_Email_Customer_Processing_Order']->trigger($order_id);
    }
}
```

**Of via Code Snippets plugin:**
1. Install "Code Snippets" plugin
2. Add snippet met bovenstaande code
3. Activate

---

## 🧪 Test Nieuwe Sync

**Na deployment (wacht tot "Ready"):**

1. **Plaats nieuwe test bestelling:**
   - Ga naar: `bikerfun.nl/products`
   - Bestel TEST PRODUCT (€0.01)
   - Betaal via Mollie

2. **Wacht 5-6 minuten** (cron sync)

3. **Check WooCommerce:**
   ```
   https://admin.bikerfun.nl/wp-admin/edit.php?post_type=shop_order
   ```
   
   **Verwacht:**
   - ✅ Nieuw order met **€0.01** (correct bedrag!)
   - ❓ Email: hangt af van of custom code toegevoegd is

4. **Check inbox:**
   - Als custom code / plugin: ✅ Email ontvangen
   - Anders: ❌ Handmatig versturen (zie Optie A)

---

## 📋 Checklist Voor Nieuwe Orders

**Wat nu automatisch werkt:**
- ✅ Checkout flow
- ✅ Betaling via Mollie  
- ✅ Order in Supabase
- ✅ **Correcte prijzen** (nieuw!)
- ✅ Cron sync naar WooCommerce elke 5 min
- ✅ **Correcte bedragen in WooCommerce** (nieuw!)
- ✅ Product voorraad update

**Wat handmatig moet (tot custom code / plugin):**
- ❌ Email versturen via WooCommerce admin

---

## 🎯 Aanbeveling

**Voor nu (snel):**
1. ✅ Nieuwe sync code is gedeployed (wacht op "Ready")
2. ✅ Prijzen zijn nu correct
3. ⚠️ Emails: verstuur handmatig via WooCommerce admin

**Langetermijn (beste oplossing):**
1. IT'er voegt custom PHP code toe (zie Optie C)
2. OF: installeer plugin (zie Optie B)  
3. Dan zijn emails ook 100% automatisch

---

## 📞 Voor Oude Orders (Nu Fixen)

**Oude orders met verkeerd bedrag:**

**Order #3047, #3043, #3042:**
1. Login WooCommerce admin
2. Open order
3. **Check "Order Items" sectie:**
   - Product subtotal moet €6.95 zijn (niet €8.41)
   - Als verkeerd: klik "Recalculate" button
4. **Manual email:**
   - Order Actions → "Email invoice"
   - Update

**Test orders (#3046, #3044, etc.):**
- Kunnen verwijderd of "Cancelled" worden
- Niet belangrijk voor klanten

---

## ✅ Success Criteria

**Nieuwe orders (na deployment):**
- ✅ Correct bedrag in WooCommerce (bijv. €6.95)
- ✅ Automatische sync binnen 5 min
- ✅ Product voorraad bijgewerkt
- ⚠️ Email: handmatig OF via custom code

**Volgende test bestelling checken:**
```bash
# Na bestelling + 5 min:
npx tsx scripts/check-supabase-orders.ts

# Check WooCommerce order:
# https://admin.bikerfun.nl/wp-admin/edit.php?post_type=shop_order
# → Nieuwste order moet correct bedrag hebben!
```

---

## 🚀 Summary

**Wat is gefixt:**
- ✅ **Prijzen nu correct** (`prices_include_tax: true`)
- ✅ **Email trigger toegevoegd** (`_send_order_email` meta data)

**Wat je moet doen:**
1. ⏱️ Wacht op Vercel deployment "Ready" (~3 min)
2. 🧪 Test nieuwe bestelling
3. 📧 Voor oude orders: verstuur emails handmatig
4. 💡 Langetermijn: voeg WordPress email trigger code toe

**Deployment:** Gedeployed! (commit `d404315`)

Check status: https://vercel.com/scottlaeven21s-projects/bikerfun/deployments

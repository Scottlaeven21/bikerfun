# 🔄 WooCommerce Order Sync

## Hoe Het Werkt

### Automatische Sync Flow:

```
1. Klant plaatst bestelling
   ↓
2. Betaalt via Mollie
   ↓
3. Mollie stuurt webhook naar bikerfun.nl/api/webhooks/mollie
   ↓
4. Webhook update order status in Supabase
   ↓
5. Als payment_status = 'paid':
   ├─ Order wordt automatisch naar WooCommerce gestuurd
   ├─ WooCommerce maakt order aan (status: processing)
   └─ WooCommerce verstuurt emails:
       ├─ Bevestigingsmail naar klant
       ├─ Nieuwe order notificatie naar jou
       └─ PDF invoice (als plugin actief is)
   ↓
6. WooCommerce shipping plugins pakken order op
   ├─ Verzendlabel genereren
   ├─ Track & trace mail naar klant
   └─ Status updates
```

## 📊 Wat wordt gesynchroniseerd?

### Order Data:
- ✅ Customer gegevens (naam, email, telefoon)
- ✅ Billing address (factuuradres)
- ✅ Shipping address (verzendadres)
- ✅ Order items (producten + aantal)
- ✅ Prijzen (subtotaal, verzendkosten, totaal)
- ✅ Payment info (Mollie payment ID)
- ✅ Order status (processing = betaald)

### Meta Data (voor tracking):
- `_bikerfun_order_id` → Supabase order ID
- `_bikerfun_order_number` → Bestelnummer (#ORD-20260204-0001)
- `_mollie_payment_id` → Mollie payment ID

## 🔍 Order Status in Admin Dashboard

### Kolommen:
- **Bestelnr** → Uniek bestelnummer (ORD-20260204-0001)
- **Datum** → Wanneer bestelling geplaatst
- **Klant** → Naam + email
- **Totaal** → Totaalbedrag
- **Betaling** → Mollie status (Betaald/Wacht/Mislukt)
- **WooCommerce** → Link naar WooCommerce admin (als gesynchroniseerd)
- **Acties** → Bekijk order details

### Payment Status Kleuren:
- 🟢 **Groen (Betaald)** → Klant heeft betaald, order is gesynchroniseerd
- 🟡 **Geel (Pending/Open)** → Wacht op betaling van klant
- 🔴 **Rood (Failed/Canceled/Expired)** → Betaling mislukt

### WooCommerce Sync Indicator:
- **#12345 →** → Order is gesynchroniseerd (link naar WooCommerce admin)
- **"Niet gesynchroniseerd"** → Order moet nog gesynchroniseerd worden

## 🛠️ Handmatige Sync (Als Automatisch Faalt)

Als de automatische sync om een of andere reden faalt, kan je handmatig syncen:

### Via API (voor developers):
```bash
curl -X POST https://bikerfun.nl/api/orders/[ORDER_ID]/sync
```

### Via Admin Dashboard:
(Toekomstige feature - sync button toevoegen)

## ⚙️ Configuratie

### Vereiste Environment Variables:
```
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
MOLLIE_API_KEY=live_xxxxx
NEXT_PUBLIC_APP_URL=https://bikerfun.nl
```

### Mollie Webhook URL:
In Mollie Dashboard moet je webhook URL zijn:
```
https://bikerfun.nl/api/webhooks/mollie
```

## 🐛 Troubleshooting

### Order niet gesynchroniseerd?

**Check 1: Mollie Webhook**
- Ga naar Mollie Dashboard → Webhooks
- Check of webhook URL correct is
- Check webhook logs voor errors

**Check 2: WooCommerce API**
- Test API keys in `WOOCOMMERCE_PHP_MEMORY_FIX.md`
- Check of WooCommerce REST API enabled is

**Check 3: Supabase Order**
- Ga naar Supabase Dashboard → Table Editor → webshop_orders
- Check of `payment_status` = 'paid'
- Check of `woo_order_id` ingevuld is (NULL = niet gesynchroniseerd)

### Emails niet ontvangen?

**Check WooCommerce Email Settings:**
1. Login in WooCommerce admin (admin.bikerfun.nl)
2. WooCommerce → Settings → Emails
3. Check of "New order" en "Processing order" emails enabled zijn
4. Check of email templates correct zijn

## 🎯 Resultaat

Na succesvolle sync:
- ✅ Order staat in WooCommerce admin
- ✅ Klant ontvangt bevestigingsmail (via WooCommerce)
- ✅ Jij ontvangt nieuwe order notificatie
- ✅ PDF invoice wordt gegenereerd (als plugin actief)
- ✅ Shipping plugins pakken order op
- ✅ Track & trace automatisch verstuurd

## 📧 Email Flow (na sync):

### Klant ontvangt:
1. **Order bevestiging** (via WooCommerce)
   - Bestelnummer
   - Order details
   - Betaalbevestiging
   
2. **Verzending notificatie** (via WooCommerce shipping plugin)
   - Track & trace code
   - Verwachte leverdatum

### Jij ontvangt:
1. **Nieuwe order notificatie** (via WooCommerce)
   - Order details
   - Klantgegevens
   - Verzendadres
   - Link naar order in admin

## 🚀 Performance

- **Sync tijd:** ~1-2 seconden
- **Reliability:** Automatische retry als webhook faalt
- **Fallback:** Handmatige sync mogelijk via API

## 📦 Product Mapping

Orders bevatten `woo_product_id` die verwijst naar het originele WooCommerce product. Dit zorgt ervoor dat:
- ✅ Voorraad correct wordt bijgewerkt in WooCommerce
- ✅ Product naam/details correct zijn
- ✅ Shipping berekeningen correct zijn

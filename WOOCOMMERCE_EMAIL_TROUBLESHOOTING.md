# WooCommerce Email Troubleshooting

## 🔍 Probleem
Orders worden succesvol gesynced naar WooCommerce (WooCommerce ID verschijnt in Supabase), maar er komen **geen bevestigingsmails** aan bij de klant.

---

## ✅ Check 1: Is de order in WooCommerce?

1. Log in op `admin.bikerfun.nl/wp-admin`
2. Ga naar **WooCommerce → Orders**
3. Zoek het laatste ordernummer (bijvoorbeeld `BF-2024-0001`)
4. Check of deze order bestaat

**Als de order NIET bestaat:**
- WooCommerce sync is gefaald (ondanks WooCommerce ID in Supabase)
- Check de Mollie webhook logs in Vercel

**Als de order WEL bestaat, ga door naar Check 2 ↓**

---

## ✅ Check 2: WooCommerce Email Instellingen

### 2.1 Check of emails enabled zijn

1. Ga naar **WooCommerce → Settings → Emails**
2. Check deze emails:
   - ✅ **New Order** (naar admin) - moet **Enabled** zijn
   - ✅ **Processing Order** (naar klant) - moet **Enabled** zijn  
   - ✅ **Completed Order** (naar klant) - moet **Enabled** zijn

### 2.2 Check order status

WooCommerce stuurt alleen emails bij **specifieke order statussen**:
- `pending` → `processing` = triggers "Processing Order" email
- `processing` → `completed` = triggers "Completed Order" email

**Check in de order:**
1. Open de order in WooCommerce admin
2. Check de **Order Status** (rechtsboven)
3. Als deze `pending` is → verander naar `processing`
4. Check of er nu een email verstuurd wordt

---

## ✅ Check 3: SMTP / Email Server

WooCommerce gebruikt **WordPress' mail functie**, die standaard PHP's `mail()` gebruikt. Dit werkt vaak niet goed.

### 3.1 Check of emails überhaupt verzonden worden

1. Ga naar **WooCommerce → Orders → [een order]**
2. Scroll naar beneden naar **Order Notes**
3. Zoek naar: `"Order status changed from X to Y"`
4. Als er GEEN note staat over "Email sent", dan worden emails niet verzonden

### 3.2 Test WordPress Email

1. Installeer plugin: **WP Mail SMTP** (optioneel, maar helpt)
   - Of gebruik: **Check & Log Email** plugin voor testen
2. Ga naar **Tools → Site Health**
3. Klik op **Info** tab → **Server** → check `mail()` functie

### 3.3 Gebruik StackMail SMTP (aanbevolen)

Jullie hebben al StackMail SMTP ingesteld. Zorg dat WooCommerce dit gebruikt:

**Optie A: WP Mail SMTP plugin** (makkelijkst)
1. Installeer **WP Mail SMTP** plugin
2. Configureer met deze settings:
   ```
   SMTP Host: smtp.stackmail.com
   SMTP Port: 587 (TLS) of 465 (SSL)
   Username: info@bikerfun.nl
   Password: [jouw StackMail wachtwoord]
   From Email: info@bikerfun.nl
   From Name: Bikerfun
   ```

**Optie B: wp-config.php** (geavanceerd)
Voeg toe aan `wp-config.php`:
```php
define('SMTP_USER', 'info@bikerfun.nl');
define('SMTP_PASS', 'jouw_wachtwoord');
define('SMTP_HOST', 'smtp.stackmail.com');
define('SMTP_FROM', 'info@bikerfun.nl');
define('SMTP_NAME', 'Bikerfun');
define('SMTP_PORT', '587');
define('SMTP_SECURE', 'tls');
define('SMTP_AUTH', true);
```

---

## ✅ Check 4: Email Template & Recipient

1. Ga naar **WooCommerce → Settings → Emails**
2. Klik op **Processing Order**
3. Check:
   - **Recipient:** moet het klant email adres zijn (standaard `{customer_email}`)
   - **Subject:** `Je bestelling bij Bikerfun is ontvangen`
   - **Preview:** klik om email template te zien

---

## ✅ Check 5: Spam Filter

Emails kunnen in spam terecht komen:

1. Check **Spam folder** van het klant email adres
2. Check **StackMail logs**:
   - Log in op StackCP (`hosting.stack.nl`)
   - Ga naar **Email Accounts → Logs**
   - Zoek naar recent verzonden emails

---

## 🚀 Quick Fix: Manual Email Resend

Als je wilt dat een klant alsnog een email krijgt:

1. Open de order in WooCommerce
2. Scroll naar beneden naar **Order Actions** (rechts)
3. Selecteer **Resend processing order notification**
4. Klik **↻** (Update/Refresh)

---

## 🔧 Recommended Solution

**Gebruik WP Mail SMTP plugin + StackMail SMTP:**

```bash
# Via wp-admin:
1. Plugins → Add New → zoek "WP Mail SMTP"
2. Install & Activate
3. Settings → WP Mail SMTP
4. Mailer: "Other SMTP"
5. SMTP Host: smtp.stackmail.com
6. SMTP Port: 587
7. Encryption: TLS
8. Auto TLS: ON
9. Authentication: ON
10. Username: info@bikerfun.nl
11. Password: [jouw wachtwoord]
12. From Email: info@bikerfun.nl
13. From Name: Bikerfun
14. Save Settings
15. Send Test Email
```

---

## 📊 Debug Info

### Check Mollie Webhook

1. Log in op Vercel
2. Ga naar **Logs** → filter op `/api/webhooks/mollie`
3. Check of sync succesvol was:
   ```
   ✅ Order synced to WooCommerce
   WooCommerce Order ID: 12345
   ```

### Check Supabase Order

```sql
-- In Supabase SQL Editor:
SELECT 
  id,
  order_number,
  woo_order_id,
  customer_email,
  status,
  payment_status,
  created_at
FROM webshop_orders
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🎯 Next Steps

1. ✅ **Vercel deployment wacht** (JavaScript fix deployt ~3-5 min)
2. ✅ **Check WooCommerce order status** in admin panel
3. ✅ **Installeer WP Mail SMTP** plugin
4. ✅ **Configureer StackMail SMTP** settings
5. ✅ **Send test email** vanuit WP Mail SMTP
6. ✅ **Resend order email** vanuit WooCommerce order

---

## 💡 Why This Happens

WooCommerce emails falen vaak omdat:
- PHP `mail()` functie is geblokkeerd door hosting
- Geen SMTP server geconfigureerd
- Order status triggert geen email (bijv. `pending` blijft `pending`)
- Email gaat naar spam (geen SPF/DKIM voor verzend domein)

**Solution:** Gebruik altijd een dedicated SMTP service (StackMail in jullie geval).

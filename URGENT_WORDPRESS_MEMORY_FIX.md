# 🚨 URGENT: WordPress Memory Limit Fix

## Probleem

WordPress/WooCommerce geeft herhaaldelijk deze error:
```
Allowed memory size of 134217728 bytes exhausted
```

**Impact:**
- ❌ WooCommerce API faalt
- ❌ Order sync naar WooCommerce faalt
- ❌ Bevestigingsmails worden niet verstuurd
- ❌ Admin interface crasht

**Huidige limiet:** 128MB (te weinig!)  
**Nodig:** 512MB (of minimaal 256MB)

---

## ✅ Oplossing 1: wp-config.php (AANBEVOLEN)

**Locatie:** `/admin.bikerfun.nl/wp-config.php`

**Voeg BOVENAAN toe** (vóór de regel `/* That's all, stop editing! */`):

```php
// Increase PHP memory limit for WooCommerce
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');
@ini_set('memory_limit', '512M');
```

**Volledige context:**
```php
<?php
/**
 * The base configuration for WordPress
 * ...
 */

// Increase PHP memory limit for WooCommerce
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');
@ini_set('memory_limit', '512M');

// ** MySQL settings - You can get this info from your web host ** //
define('DB_NAME', 'database_name_here');
// ... rest of config ...

/* That's all, stop editing! Happy blogging. */
```

---

## ✅ Oplossing 2: .htaccess (ALTERNATIEF)

**Locatie:** `/admin.bikerfun.nl/.htaccess`

**Voeg BOVENAAN toe:**

```apache
# Increase PHP memory limit
php_value memory_limit 512M
```

**Volledige context:**
```apache
# Increase PHP memory limit
php_value memory_limit 512M

# BEGIN WordPress
# ... rest of .htaccess ...
```

---

## ✅ Oplossing 3: php.ini (SERVER LEVEL)

Als je toegang hebt tot StackCP panel of server php.ini:

**Locatie:** Meestal `/etc/php/7.4/apache2/php.ini` of via StackCP PHP Settings

**Wijzig:**
```ini
memory_limit = 512M
```

**StackCP Panel:**
1. Login op StackCP (hosting.stack.nl)
2. Ga naar **PHP Settings** of **Advanced** → **PHP Configuration**
3. Zoek `memory_limit`
4. Wijzig naar `512M`
5. Save & Restart Apache/PHP-FPM

---

## 🧪 Verificatie Na Fix

**Test 1: Check WordPress Admin**
1. Login op `admin.bikerfun.nl/wp-admin`
2. Ga naar **Tools** → **Site Health**
3. Klik op **Info** tab
4. Expand **Server**
5. Check `memory_limit` → moet `512M` zijn

**Test 2: Via Script**
```bash
npx tsx scripts/check-woocommerce-order.ts
```

Zou nu **GEEN** `memory exhausted` error moeten geven.

**Test 3: WooCommerce Orders Lijst**
```
admin.bikerfun.nl/wp-admin/edit.php?post_type=shop_order
```

Zou zonder crashes moeten laden.

---

## 📊 Waarom 512MB?

WooCommerce heeft veel memory nodig voor:
- ✅ Order verwerking
- ✅ Product catalogs
- ✅ REST API calls
- ✅ Email templates
- ✅ Shipping calculations
- ✅ Payment gateway communicatie

**128MB = te weinig** (crash bij complexe operaties)  
**256MB = minimum** (kan nog steeds crashen)  
**512MB = aanbevolen** (stabiel voor normale webshops)

---

## ⏰ Urgentie

**HOOG** - Zonder deze fix:
- Orders worden niet correct gesynced
- Klanten ontvangen geen bevestigingsmails
- WooCommerce admin is onstabiel
- API calls falen regelmatig

**Geschatte tijd:** 2-5 minuten om te fixen

---

## 📞 Contact

Als je vragen hebt of hulp nodig hebt:
- Check eerst welke methode mogelijk is op jullie server
- Test na implementatie via WooCommerce admin
- Herstart Apache/PHP-FPM na wijzigingen

---

## ✅ Checklist Voor IT'er

- [ ] Backup `wp-config.php` (of `.htaccess`) gemaakt
- [ ] Memory limit verhoogd naar 512M via één van de methodes
- [ ] Apache/PHP herstart (indien nodig)
- [ ] WordPress admin check: memory_limit = 512M
- [ ] WooCommerce orders lijst test (geen crash)
- [ ] API test: `bikerfun.nl/api/test-woocommerce` (geen 500 error)
- [ ] Bevestig met ontwikkelaar dat fix werkt

---

**Laatste error (27 feb 2026):**
```
{
  "code": "internal_server_error",
  "message": "Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes)",
  "file": "/home/sites/22a/f/fe81a8ad69/admin.bikerfun.nl/wp-includes/class-wp-hook.php",
  "line": 346
}
```

**Dit is een PERMANENT probleem** dat continue terugkomt sinds 26 februari.

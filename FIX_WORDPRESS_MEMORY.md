# 🔧 Fix WordPress Memory Limit Probleem

## 🚨 Probleem

WooCommerce API geeft error:
```
Allowed memory size of 134217728 bytes exhausted
```

**Betekenis:** WordPress heeft 128MB PHP memory, maar WooCommerce heeft minimaal 256MB nodig.

---

## ✅ Oplossing 1: Via wp-config.php (AANBEVOLEN)

### Voor Je IT'er:

1. **Login bij StackCP** of via FTP/SFTP
2. **Open File Manager**
3. **Navigeer naar:** WordPress root folder (waar `wp-config.php` staat)
4. **Bewerk:** `wp-config.php`

5. **Voeg deze regel toe VOOR de regel `/* That's all, stop editing! */`:**

```php
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

**Volledig voorbeeld:**

```php
// ... andere config regels ...

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

// ⬇️ VOEG DEZE REGELS TOE ⬇️
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
// ⬆️ VOEG DEZE REGELS TOE ⬆️

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
```

6. **Save het bestand**
7. **Test opnieuw:** https://bikerfun.nl/api/test-woocommerce

---

## ✅ Oplossing 2: Via .htaccess (Alternatief)

Als Oplossing 1 niet werkt:

1. **Open:** `.htaccess` in WordPress root
2. **Voeg toe:**

```apache
php_value memory_limit 256M
php_value max_execution_time 300
```

---

## ✅ Oplossing 3: Via php.ini (Voor Dedicated/VPS)

Als je toegang hebt tot php.ini:

1. **Zoek:** `memory_limit` regel
2. **Wijzig naar:**
```ini
memory_limit = 256M
```

3. **Restart PHP-FPM/Apache**

---

## ✅ Oplossing 4: Via StackCP Hosting Panel

Sommige hosting providers hebben een UI voor PHP settings:

1. **Login bij StackCP**
2. **Zoek:** "PHP Settings" of "PHP Configuration"
3. **Wijzig:** `memory_limit` naar `256M`
4. **Save**

---

## 🧪 Test Na Het Fixen

### Test 1: WooCommerce API
```
https://bikerfun.nl/api/test-woocommerce
```

**Verwacht resultaat:**
```json
{
  "success": true,
  "message": "WooCommerce API is working! ✅",
  "stats": {
    "total_products_fetched": 20,
    "sample_products": [...]
  }
}
```

### Test 2: WordPress Admin
```
https://admin.bikerfun.nl/wp-admin
```

Login en check of alles normaal werkt.

### Test 3: Product Pagina
```
https://bikerfun.nl/products
```

Check of producten en afbeeldingen laden.

---

## 📊 Memory Limit Aanbevelingen

| Website Type | Aanbevolen Memory |
|--------------|------------------|
| Kleine WordPress site | 128M (huidige) |
| WordPress + WooCommerce | **256M** ✅ |
| Grote webshop | 512M |
| Enterprise | 1024M (1GB) |

**Voor Bikerfun (WooCommerce):** Minimaal **256M**, idealiter **512M**.

---

## ⚠️ Als Het Nog Steeds Niet Werkt

### Check Current Memory Limit

Voeg tijdelijk een test file toe:

**Maak:** `wp-content/memory-test.php`
```php
<?php
echo 'PHP Memory Limit: ' . ini_get('memory_limit') . '<br>';
echo 'WP Memory Limit: ' . WP_MEMORY_LIMIT . '<br>';
echo 'WP Max Memory: ' . WP_MAX_MEMORY_LIMIT;
?>
```

**Open:** https://admin.bikerfun.nl/wp-content/memory-test.php

Dit toont de huidige limiet.

---

### Contact Hosting Support

Als je geen toegang hebt tot wp-config.php of .htaccess:

**Contact StackCP hosting support:**
- Vraag: "Kunnen jullie de PHP memory_limit verhogen naar 256M voor admin.bikerfun.nl?"
- Meestal gratis en binnen 30 minuten gefixed

---

## 🎯 Verwacht Eindresultaat

Na het verhogen van memory limit:

```
✅ WooCommerce API werkt
✅ Geen memory errors meer
✅ Product API calls succesvol
✅ Afbeeldingen laden op bikerfun.nl
✅ Checkout flow werkt
✅ Order sync naar WooCommerce werkt
```

---

## 📝 Quick Fix Script (Voor IT'er)

Als je SSH toegang hebt:

```bash
# Backup wp-config.php
cp wp-config.php wp-config.php.backup

# Voeg memory limits toe (voor de wp-settings.php regel)
sed -i "/require_once.*wp-settings.php/i define('WP_MEMORY_LIMIT', '256M');\ndefine('WP_MAX_MEMORY_LIMIT', '512M');" wp-config.php

# Check of het toegevoegd is
grep -A 2 "WP_MEMORY_LIMIT" wp-config.php
```

---

## ✅ Checklist Voor IT'er

- [ ] StackCP ingelogd of FTP/SFTP toegang
- [ ] wp-config.php geopend
- [ ] Memory limit regels toegevoegd (256M)
- [ ] Bestand opgeslagen
- [ ] https://bikerfun.nl/api/test-woocommerce getest
- [ ] Success response ontvangen
- [ ] https://bikerfun.nl/products werkt
- [ ] Afbeeldingen laden correct

---

## 🆘 Als Je Vast Zit

Laat me weten:
1. Welke methode je hebt geprobeerd
2. Of je toegang hebt tot wp-config.php
3. Screenshot van eventuele errors

Dan help ik verder! 🚀

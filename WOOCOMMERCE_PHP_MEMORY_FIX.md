# WooCommerce PHP Memory Fix

## Probleem

WooCommerce API geeft `500 Internal Server Error` bij het ophalen van producten:

```
Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes)
```

Het huidige PHP memory limit is **128MB**, wat te laag is voor WooCommerce.

## Oplossing (Voor ICT'er)

Verhoog het PHP memory limit naar **256MB** of **512MB**.

### Optie 1: Via wp-config.php (Aanbevolen)

Voeg deze regel toe aan `wp-config.php` (voor de regel `/* That's all, stop editing! */`):

```php
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

### Optie 2: Via .htaccess

Voeg deze regel toe aan `.htaccess` in de root:

```apache
php_value memory_limit 256M
```

### Optie 3: Via php.ini

Als je toegang hebt tot `php.ini`:

```ini
memory_limit = 256M
```

### Optie 4: Via Hosting Control Panel

- Log in op hosting control panel (bijv. DirectAdmin, cPanel, Plesk)
- Zoek naar "PHP Settings" of "PHP Configuration"
- Verander `memory_limit` naar `256M` of `512M`
- Sla op en herstart PHP-FPM indien nodig

## Verificatie

Na de wijziging, test of het werkt:

1. Log in op WordPress admin
2. Ga naar **WooCommerce** → **Status** → **System Status**
3. Check de "PHP Memory Limit" - zou nu **256M** of hoger moeten zijn

## Impact

- **Huidige situatie**: Max 5-10 producten per API call
- **Na fix**: 50-100+ producten per API call
- **Resultaat**: Betere performance en meer producten zichtbaar op bikerfun.nl

## Referenties

- [WooCommerce System Requirements](https://woocommerce.com/document/server-requirements/)
- WooCommerce aanbeveling: **256MB minimum**, **512MB recommended**

## Contact

Bij vragen: bikerfun.info@gmail.com

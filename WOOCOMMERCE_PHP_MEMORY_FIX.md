# 🚨 URGENT: WooCommerce PHP Memory Fix

## ⚠️ KRITIEK PROBLEEM - ACTIE VEREIST

De webshop van bikerfun.nl toont momenteel **SLECHTS 5-10 producten** in plaats van alle 100+ producten!

Dit moet **ZO SNEL MOGELIJK** opgelost worden door de ICT.

## Probleem

WooCommerce API geeft constant `500 Internal Server Error`:

```
Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes)
```

**Oorzaak:** PHP memory limit is **128MB** - dit is **veel te laag** voor WooCommerce met 100+ producten.

**Gevolg:** 
- Klanten zien maar 5-10 producten
- Categorieën werken niet volledig
- Webshop is NIET functioneel

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

### 🔴 Huidige Situatie (128MB memory)
- Max **5 producten** op "Alle producten" pagina
- Max **10 producten** per categorie
- Klanten kunnen **niet alle producten zien**
- Webshop is **ONBRUIKBAAR**
- Omzet wordt **GEMIST**

### ✅ Na Fix (512MB memory)
- **50-100+ producten** per pagina
- Alle categorieën tonen **volledige inventaris**
- **Snellere** API calls
- **Volledige** webshop functionaliteit
- **Hogere omzet**

### ⏱️ Urgentie
**HOOG** - Webshop is momenteel niet volledig functioneel!

## Referenties

- [WooCommerce System Requirements](https://woocommerce.com/document/server-requirements/)
- WooCommerce aanbeveling: **256MB minimum**, **512MB recommended**

## Contact

Bij vragen: bikerfun.info@gmail.com

# SNELLE FIX: 128MB → 512MB (5 Minuten)

## 🚀 Snelste Methode: wp-config.php

### Stap 1: Open wp-config.php

**Locatie:**
```
/home/sites/22a/f/fe81a8ad69/admin.bikerfun.nl/wp-config.php
```

**Via StackCP File Manager:**
1. Login op StackCP panel
2. File Manager → admin.bikerfun.nl → wp-config.php
3. Klik "Edit"

**Via FTP/SSH:**
```bash
nano /home/sites/22a/f/fe81a8ad69/admin.bikerfun.nl/wp-config.php
```

---

### Stap 2: Voeg Deze 3 Regels Toe

**Zoek deze regel:**
```php
/* That's all, stop editing! Happy blogging. */
```

**Voeg ERVOOR toe:**
```php
// Increase memory limit for WooCommerce
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');
@ini_set('memory_limit', '512M');

/* That's all, stop editing! Happy blogging. */
```

**Volledige voorbeeld:**
```php
<?php
// ... existing config ...

// Increase memory limit for WooCommerce
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');
@ini_set('memory_limit', '512M');

/* That's all, stop editing! Happy blogging. */

require_once ABSPATH . 'wp-settings.php';
```

---

### Stap 3: Sla Op & Herstart Apache

**Via StackCP Panel:**
1. Save wp-config.php
2. Ga naar: Services → Apache
3. Klik: "Restart"

**Via SSH:**
```bash
# Save file (Ctrl+X in nano)

# Restart Apache:
sudo systemctl restart apache2

# Of:
sudo service apache2 restart
```

---

### Stap 4: Verificatie (30 seconden)

**Test 1: Via WordPress Admin**
```
1. Login: admin.bikerfun.nl/wp-admin
2. Ga naar: Tools → Site Health
3. Klik: Info tab
4. Expand: Server
5. Zoek: memory_limit
6. Check: Moet "512M" zijn ✓
```

**Test 2: Via Command Line**
```bash
php -r "echo ini_get('memory_limit');"
# Output moet zijn: 512M
```

**Test 3: Via API Test**
```bash
curl https://bikerfun.nl/api/test-woocommerce
# Moet 200 OK zijn (geen 500 error)
```

---

## ✅ Done! (Totale tijd: 5 minuten)

Als memory_limit = 512M in Site Health:
- ✓ WooCommerce API werkt
- ✓ Order sync werkt
- ✓ Emails kunnen verzonden worden
- ✓ Geen crashes meer

---

## 🔧 Als Het Niet Werkt (Troubleshooting)

### Probleem: memory_limit nog steeds 128M

**Mogelijke oorzaken:**

**1. Apache niet herstart**
```bash
# Force restart:
sudo systemctl restart apache2
sudo systemctl restart php8.1-fpm
```

**2. Verkeerde php.ini geladen**
```bash
# Check welke php.ini actief is:
php -i | grep "Loaded Configuration File"

# Edit die file:
nano /etc/php/8.1/apache2/php.ini

# Zoek regel:
memory_limit = 128M

# Wijzig naar:
memory_limit = 512M

# Save & restart
sudo systemctl restart apache2
```

**3. .htaccess overschrijft het**
```bash
# Check .htaccess in WordPress root:
cat /home/sites/.../admin.bikerfun.nl/.htaccess

# Als je ziet: php_value memory_limit 128M
# Wijzig naar: php_value memory_limit 512M
```

---

## 📞 Verificatie Commando's

**Quick checks na wijziging:**

```bash
# Check 1: PHP CLI
php -r "echo ini_get('memory_limit');"
# Expected: 512M

# Check 2: PHP-FPM (via test script)
echo "<?php echo ini_get('memory_limit'); ?>" > /tmp/test.php
php-cgi /tmp/test.php
# Expected: 512M

# Check 3: Via WordPress (meest betrouwbaar!)
# admin.bikerfun.nl/wp-admin → Site Health → 512M
```

---

## ⏱️ Checklist (5 Minuten)

- [ ] (1 min) Edit wp-config.php → voeg 3 regels toe
- [ ] (30 sec) Save file
- [ ] (1 min) Restart Apache/PHP-FPM
- [ ] (30 sec) Check WordPress Site Health → memory_limit = 512M
- [ ] (1 min) Test API: `curl https://bikerfun.nl/api/test-woocommerce`
- [ ] (1 min) Test checkout flow

**Totaal: 5 minuten** ✓

---

## 🎯 Priority Order (Als Je Haast Hebt)

**Absolute minimum (2 min):**
1. Edit wp-config.php (3 regels toevoegen)
2. Restart Apache
3. Done!

**Proper verification (5 min):**
1. Edit wp-config.php
2. Restart Apache
3. Check Site Health
4. Test API
5. Done!

---

## 💡 Pro Tip

**Als je via SSH werkt:**

```bash
# One-liner om bovenaan wp-config.php toe te voegen:
cd /home/sites/22a/f/fe81a8ad69/admin.bikerfun.nl/

# Backup maken:
cp wp-config.php wp-config.php.backup

# Voeg memory settings toe:
sed -i "/\/\* That's all/i \\\n// Increase memory limit for WooCommerce\ndefine('WP_MEMORY_LIMIT', '512M');\ndefine('WP_MAX_MEMORY_LIMIT', '512M');\n@ini_set('memory_limit', '512M');\n" wp-config.php

# Restart:
sudo systemctl restart apache2

# Check:
php -r "echo ini_get('memory_limit');"
```

**Copy-paste en klaar in 30 seconden!**

---

## ✅ Verwacht Resultaat

**Voor fix (logs):**
```
[error] Allowed memory size of 134217728 bytes exhausted  ← 128MB
[error] Allowed memory size of 134217728 bytes exhausted  ← 128MB
[error] Allowed memory size of 134217728 bytes exhausted  ← 128MB
```

**Na fix (geen errors meer!):**
```
[info] Request processed successfully
[info] Order created via API
[info] Email sent to customer
```

**Tijd tot effect:** Onmiddellijk na Apache restart!

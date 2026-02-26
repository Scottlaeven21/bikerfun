# 🔧 StackCP + Vercel DNS Configuratie

## 📊 Situatie

**Hosting:** StackCP (UK server)  
**Server IP:** 185.151.30.182  
**IPv6:** 2a07:7800::182  

**Probleem:** admin.bikerfun.nl niet geconfigureerd in StackCP

---

## ✅ Stap 1: Voeg DNS Records Toe in Vercel

We configureren de DNS nu al, zodat het werkt zodra StackCP geconfigureerd is.

### In Vercel Dashboard:

1. **Ga naar:** https://vercel.com/dashboard
2. **Klik account naam** → **"Domains"**
3. **Zoek en klik:** `bikerfun.nl`
4. **Ga naar:** **"DNS Records"** tab

### Voeg Deze Records Toe:

#### Record 1: A Record voor admin (IPv4)
```
Type:  A
Name:  admin
Value: 185.151.30.182
TTL:   3600
```

#### Record 2: AAAA Record voor admin (IPv6)
```
Type:  AAAA
Name:  admin
Value: 2a07:7800::182
TTL:   3600
```

### Klik "Save" voor beide records

---

## ✅ Stap 2: Configureer StackCP

Je IT'er moet in StackCP control panel:

### Login StackCP:
- URL: https://cp.stackcp.com (of je specifieke panel URL)
- Login met je credentials

### Voeg Subdomain Toe:

1. **Dashboard** → **"Subdomains"**
2. **"Add Subdomain"**
3. Vul in:
   - **Subdomain:** admin
   - **Domain:** bikerfun.nl
   - **Document Root:** Waar WordPress staat (bijv. `/public_html/wordpress` of `/public_html/admin`)

4. **Save/Create**

### Check WordPress Installatie:

1. **File Manager** → `/public_html/`
2. Check of WordPress bestanden bestaan:
   - `wp-config.php` ✓
   - `wp-admin/` folder ✓
   - `wp-content/` folder ✓

**Als WordPress er NIET is:** Dan moeten we beslissen:
- WordPress opnieuw installeren
- Of: WooCommerce functionaliteit weglaten
- Of: Alleen API gebruiken voor sync (zonder backend toegang)

---

## 🧪 Stap 3: Test

### Wacht 10-15 minuten na beide configuraties

### Test DNS:
```bash
dig admin.bikerfun.nl
# Verwacht: 185.151.30.182
```

### Test in Browser:
```
https://admin.bikerfun.nl
# Verwacht: WordPress site of login
```

### Test WooCommerce Backend:
```
https://admin.bikerfun.nl/wp-admin
# Verwacht: WordPress login scherm
```

---

## 🎯 Als Het Werkt

Zodra admin.bikerfun.nl bereikbaar is:

1. ✅ Login bij WooCommerce backend
2. ✅ Check of API keys nog kloppen
3. ✅ Test of orders binnenkomen
4. ✅ Run image migration: `npm run migrate:images`

---

## ⚠️ Als WordPress NIET Meer Bestaat

Dan hebben we 2 opties:

### Optie A: WordPress Opnieuw Installeren
- Installeer WordPress op StackCP
- Installeer WooCommerce plugin
- Importeer producten opnieuw (we hebben de CSV!)
- Configureer API keys

### Optie B: Zonder WordPress/WooCommerce Backend
- Accepteer dat WooCommerce backend offline is
- Gebruik alleen Mollie voor payments (geen WooCommerce sync)
- Gebruik alleen Supabase voor product management
- Verwijder WooCommerce afhankelijkheden

**Voor Nu:** We hebben WooCommerce sync al geïmplementeerd, maar die werkt alleen als WordPress/WooCommerce bereikbaar is.

---

## 📞 Contact Info

**StackCP Support (als je hulp nodig hebt):**
- Check je hosting provider support (zij gebruiken StackCP)
- Of: support forums op stackcp.com

---

## 📋 Checklist

### DNS Configuratie (In Vercel)
- [ ] Vercel Dashboard geopend
- [ ] bikerfun.nl DNS records geopend
- [ ] A-record toegevoegd: admin → 185.151.30.182
- [ ] AAAA-record toegevoegd: admin → 2a07:7800::182
- [ ] Opgeslagen

### StackCP Configuratie (IT'er)
- [ ] StackCP panel ingelogd
- [ ] Subdomain admin.bikerfun.nl toegevoegd
- [ ] Document root ingesteld naar WordPress folder
- [ ] Opgeslagen

### WordPress Check (IT'er)
- [ ] File Manager geopend
- [ ] WordPress bestanden gevonden?
  - [ ] Ja → Klaar!
  - [ ] Nee → Beslissing maken (herinstalleren of niet)

### Testing
- [ ] 15 minuten gewacht
- [ ] DNS getest: `dig admin.bikerfun.nl`
- [ ] Browser test: https://admin.bikerfun.nl
- [ ] WordPress login bereikbaar
- [ ] WooCommerce backend werkt

### Product Images
- [ ] admin.bikerfun.nl werkt
- [ ] `npm run migrate:images` uitgevoerd
- [ ] Afbeeldingen gemigreerd naar Supabase
- [ ] Website toont alle product afbeeldingen

---

## 🎉 Eindresultaat

```
✅ bikerfun.nl         → Vercel → Next.js
✅ admin.bikerfun.nl   → StackCP → WordPress/WooCommerce
✅ Product afbeeldingen → Supabase Storage
✅ Orders              → Mollie → Supabase → WooCommerce sync
✅ Alles werkt perfect!
```

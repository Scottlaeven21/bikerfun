# 🛒 Webshop Status & Werking

## ✅ WAT WERKT

### Categorieën
- **Helmcovers** - 100% werkend
- **Sleutelhangers** - 100% werkend
- **Rugzakken** - 100% werkend
- **Kentekenplaathouders** - 100% werkend
- **Knipperlichten** - 100% werkend

### Functionaliteit
- ✅ Producten per categorie tonen (100 producten)
- ✅ Product details bekijken
- ✅ Toevoegen aan winkelwagen
- ✅ Winkelwagen beheren
- ✅ Checkout proces
- ✅ Order aanmaken in WooCommerce

## ⚠️ HUIDIGE BEPERKINGEN

### "Alle Producten" Pagina
- ❌ Toont **GEEN** producten
- ✅ Toont **WEL** alle categorieknoppen
- 💡 Gebruikers moeten een categorie kiezen

**Waarom?**
- WooCommerce server heeft PHP memory limit van 128MB
- Dit is **veel te laag** voor het laden van alle producten tegelijk
- Individuele categorieën werken perfect!

## 🚀 PERFORMANCE

### Laadtijden
- **"Alle" pagina**: Instant ⚡ (geen API calls)
- **Per categorie**: ~1-2 seconden
- **Cache**: 30 minuten (snelle herhaalde bezoeken)

### Optimalisaties
- Categorieën zijn hardcoded (geen API call)
- Producten worden gecached
- Geen onnodige API calls meer
- Defensive error handling

## 🔧 HOE HET WERKT

### 1. Gebruiker bezoekt `/products`
```
┌─────────────────────────────────────┐
│  ONZE WEBSHOP                       │
├─────────────────────────────────────┤
│  [Alle] [Helmcovers] [Rugzakken]   │ ← Instant geladen
│  [Sleutelhangers] [...]             │
├─────────────────────────────────────┤
│  📦 Kies een categorie              │
└─────────────────────────────────────┘
```

### 2. Gebruiker klikt op "Helmcovers"
```
┌─────────────────────────────────────┐
│  HELMCOVERS                         │
├─────────────────────────────────────┤
│  [Product 1] [Product 2] [...]      │ ← 100 producten
│  [Product 3] [Product 4] [...]      │
└─────────────────────────────────────┘
```

## 🛠️ PERMANENTE OPLOSSING

**ICT moet PHP memory verhogen op `admin.bikerfun.nl`:**

### Stap 1: Voeg toe aan `wp-config.php`
```php
define('WP_MEMORY_LIMIT', '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

### Stap 2: Verwijder hardcoded categories
In `app/(shop)/products/page.tsx`:
- Verwijder de hardcoded categories array
- Uncomment de `getCachedCategories()` API call
- Re-enable de "Alle producten" fetching

### Stap 3: Test
- "Alle" pagina zou dan alle producten moeten tonen
- Webshop werkt op volle capaciteit

## 📊 TECHNISCHE DETAILS

### Hardcoded Categories
Location: `app/(shop)/products/page.tsx`

```typescript
allCategories = [
  { id: 16, name: 'Helmcovers', slug: 'helmcovers' },
  { id: 17, name: 'Sleutelhangers', slug: 'sleutelhangers' },
  { id: 18, name: 'Rugzakken', slug: 'rugzakken' },
  { id: 19, name: 'Kentekenplaathouders', slug: 'kentekenplaathouders' },
  { id: 20, name: 'Knipperlichten', slug: 'knipperlichten' },
];
```

**Category ID's aanpassen:**
1. Ga naar `admin.bikerfun.nl/wp-admin`
2. Products → Categories
3. Hover over categorie
4. Zie ID in URL: `tag_ID=16`
5. Update het ID in de code

### Product Filtering
- Occasions/motoren worden automatisch gefilterd
- Filtering gebeurt op categorie naam en product naam
- Merken: Yamaha, Honda, Suzuki, Kawasaki, etc.

## 📈 ANALYTICS

Alle page views en occasion views worden getrackt via Supabase:
- Per pagina
- Per apparaat (mobile/desktop/tablet)
- Per occasion

Dashboard: `/admin/analytics`

## 📞 SUPPORT

Bij vragen of problemen:
- Email: bikerfun.info@gmail.com
- Zie: `WOOCOMMERCE_PHP_MEMORY_FIX.md` voor PHP memory instructies

---

**Laatste update:** 2026-02-04
**Status:** ✅ Werkend (met beperkingen ivm PHP memory)

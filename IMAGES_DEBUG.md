# 🖼️ Product Afbeeldingen Debug Guide

## Waarom laden sommige afbeeldingen niet?

### Mogelijke oorzaken:

1. **Product heeft geen afbeelding in WooCommerce**
   - Producten zonder featured image tonen 📦 placeholder

2. **Broken image links in WooCommerce**
   - Image URL bestaat niet meer
   - Image is verwijderd van server

3. **Image bestandsnaam heeft speciale karakters**
   - Spaties, emoji's, of vreemde tekens in filename

## Hoe te checken?

### Stap 1: Open Developer Console (F12)
Je ziet errors zoals:
```
Failed to load image: https://admin.bikerfun.nl/wp-content/uploads/...
```

### Stap 2: Check welke producten problemen hebben

Producten MET placeholder (📦) hebben een van deze problemen:
- Geen afbeelding in WooCommerce
- Image URL is broken

### Stap 3: Fix in WooCommerce

1. Ga naar `admin.bikerfun.nl/wp-admin`
2. Products → All Products
3. Zoek het product dat geen afbeelding toont
4. Click "Edit"
5. Scroll naar "Product image" rechts
6. Upload een nieuwe afbeelding (of selecteer uit media library)
7. Click "Update"

## Next.js Image Configuratie

### Toegestane domains:
```typescript
- https://**.supabase.co
- https://admin.bikerfun.nl
- https://**.bikerfun.nl
- http://admin.bikerfun.nl
```

### Settings:
```typescript
unoptimized: true        // Geen Next.js optimization
loading: "lazy"          // Lazy load voor performance
onError: handler         // Toon placeholder bij error
```

## Fallback Placeholder

Alle producten zonder werkende afbeelding tonen:

```
┌─────────────────┐
│                 │
│       📦        │  ← Fallback emoji
│                 │
└─────────────────┘
```

Dit is **normaal gedrag** en crasht de site niet!

## Bulksgewijs Fix

Als VEEL producten geen afbeeldingen hebben:

### Optie 1: WooCommerce Bulk Edit
1. Products → All Products
2. Checkbox bij meerdere producten
3. Bulk Actions → Edit
4. Apply
5. Upload featured images

### Optie 2: WooCommerce Product CSV Import
1. Products → Import
2. Upload CSV met product ID + image URL
3. Map columns
4. Run import

### Optie 3: WordPress Media Upload
1. Media → Add New
2. Bulk upload alle product afbeeldingen
3. Ga per product en selecteer afbeelding

## Performance Tips

### Images optimaliseren voor sneller laden:

1. **Resize afbeeldingen VOOR upload**
   - Max 1000x1000px voor productfoto's
   - Geen 4K afbeeldingen uploaden!

2. **Gebruik WEBP format**
   - Kleinere bestandsgrootte
   - Betere kwaliteit
   - Converteren: https://squoosh.app

3. **Comprimeer afbeeldingen**
   - TinyPNG: https://tinypng.com
   - ImageOptim (Mac)
   - Squoosh: https://squoosh.app

## Console Debugging

Open F12 → Console en kijk naar:

```javascript
// Success
Image loaded: helmcover-white.jpg

// Error (toont rode tekst)
Failed to load image: https://admin.bikerfun.nl/.../product-123.jpg
```

## Quick Fix Checklist

- [ ] Check Console voor "Failed to load image" errors
- [ ] Noteer welke producten problemen hebben
- [ ] Log in WooCommerce admin
- [ ] Upload nieuwe afbeeldingen voor die producten
- [ ] Clear browser cache (Ctrl+Shift+R)
- [ ] Test opnieuw

## Contact

Bij vragen over specifieke producten die niet laden:
- Email: bikerfun.info@gmail.com
- Check Console logs en stuur screenshots

---

**TIP:** De 📦 placeholder is GEEN bug - het betekent gewoon dat het product geen afbeelding heeft in WooCommerce!

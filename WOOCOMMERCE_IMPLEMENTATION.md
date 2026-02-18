# 🛒 WooCommerce Implementatie Handleiding

## ✅ Status: KLAAR VOOR API KEYS

De volledige WooCommerce integratie is voorbereid en wacht alleen nog op de API credentials van de klant.

---

## 📁 Wat is er al geïmplementeerd?

### 1. **TypeScript Types** (`types/woocommerce.ts`)
- Volledige WooCommerce REST API types
- Product, Cart, Order interfaces
- API configuratie types

### 2. **WooCommerce Client** (`lib/woocommerce/client.ts`)
- Custom OAuth 1.0a authenticatie (geen externe packages nodig!)
- Product fetching methodes
- Error handling
- Singleton pattern voor efficiency

### 3. **Utility Functions** (`lib/woocommerce/utils.ts`)
- Product conversie naar frontend formaat
- Prijs formatting (NL currency)
- Stock status checks
- Discount berekeningen
- Sorting en filtering helpers

### 4. **Product Caching** (`lib/woocommerce/products.ts`)
- Server-side caching met `unstable_cache`
- 5 minuten cache duration
- Verschillende fetch strategieën:
  - Alle producten
  - Single product (by ID of slug)
  - Per categorie
  - Featured products
  - Sale products
  - Search functionaliteit

### 5. **Cart Actions** (`app/actions/cart.ts`)
- Server Actions voor cart operaties
- Add to cart
- Buy now (direct checkout)
- Redirect naar WooCommerce cart/checkout

### 6. **Environment Variables**
- `.env.local` voorbereid met placeholders
- `.env.example` aangemaakt voor documentatie

---

## 🔧 Wat moet je doen zodra je de API keys hebt?

### Stap 1: Update Environment Variables

Open `.env.local` en vervang de dummy waarden:

```env
# WooCommerce - Vervang deze waarden met de echte keys van de klant
NEXT_PUBLIC_WOOCOMMERCE_URL=https://shop.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
```

### Stap 2: Update Vercel Environment Variables

Ga naar Vercel Dashboard → Je Project → Settings → Environment Variables

Voeg toe:
- `NEXT_PUBLIC_WOOCOMMERCE_URL`
- `WOOCOMMERCE_CONSUMER_KEY` (Mark as Secret!)
- `WOOCOMMERCE_CONSUMER_SECRET` (Mark as Secret!)

### Stap 3: Test de Verbinding

Run lokaal:

```bash
npm run dev
```

Test console in browser DevTools voor errors.

### Stap 4: Producten Ophalen

De huidige `/products` pagina haalt nog data uit Supabase.
Update deze om WooCommerce producten te gebruiken:

```typescript
// app/(shop)/products/page.tsx
import { getCachedProducts } from '@/lib/woocommerce/products';

export default async function ProductsPage() {
  const products = await getCachedProducts({
    per_page: 20,
    status: 'publish',
  });

  // Rest van de component...
}
```

---

## 🎯 Hoe werkt de integratie?

### Product Flow:
1. **Frontend (Next.js)** toont producten van WooCommerce
2. **User klikt "Toevoegen aan winkelwagen"**
3. **Server Action** (`addToCart`) wordt aangeroepen
4. **Redirect** naar WooCommerce site met product in cart
5. **Checkout** gebeurt op WooCommerce
6. **User keert terug** naar Next.js site (na betaling)

### Waarom deze aanpak?
- ✅ Geen PCI compliance issues (WooCommerce handelt payments)
- ✅ Bestaande WooCommerce checkout blijft werken
- ✅ Volledige WooCommerce admin functionaliteit
- ✅ Product sync is automatisch (via API)
- ✅ Orders worden beheerd in WooCommerce

---

## 📋 Usage Voorbeelden

### Products ophalen in Server Component:

```typescript
import { getCachedProducts } from '@/lib/woocommerce/products';

const products = await getCachedProducts({
  per_page: 10,
  category: 'helmen',
});
```

### Single product ophalen:

```typescript
import { getCachedProduct } from '@/lib/woocommerce/products';

const product = await getCachedProduct(123);
```

### Featured products:

```typescript
import { getCachedFeaturedProducts } from '@/lib/woocommerce/products';

const featured = await getCachedFeaturedProducts({ per_page: 6 });
```

### Add to cart button:

```typescript
'use client';

import { addToCart } from '@/app/actions/cart';

export function AddToCartButton({ productId }: { productId: number }) {
  return (
    <button onClick={() => addToCart(productId, 1)}>
      Toevoegen aan winkelwagen
    </button>
  );
}
```

---

## 🔍 API Endpoints Beschikbaar

De WooCommerce client (`lib/woocommerce/client.ts`) heeft deze methodes:

- `getProducts(params)` - Alle producten met filters
- `getProduct(id)` - Single product by ID
- `getProductBySlug(slug)` - Single product by slug
- `getProductsByCategory(categorySlug, params)` - Filter op categorie
- `searchProducts(query, params)` - Zoeken
- `getFeaturedProducts(params)` - Featured only
- `getSaleProducts(params)` - Sale only
- `getCheckoutUrl()` - WooCommerce checkout URL
- `getCartUrl()` - WooCommerce cart URL
- `isConfigured()` - Check of API keys zijn ingesteld

---

## 🚀 Deployment Checklist

Zodra de API keys binnen zijn:

- [ ] Update `.env.local` met echte keys
- [ ] Test lokaal (`npm run dev`)
- [ ] Verifieer dat producten laden
- [ ] Test add-to-cart flow
- [ ] Update Vercel environment variables
- [ ] Deploy naar Vercel
- [ ] Test op productie
- [ ] Verifieer checkout redirect werkt
- [ ] Test complete purchase flow

---

## ⚠️ Troubleshooting

### "WooCommerce is not configured"
- Check of environment variables correct zijn ingesteld
- Verifieer dat keys niet leeg zijn
- Restart dev server na env changes

### "API Error 401 Unauthorized"
- Consumer Key/Secret zijn incorrect
- Check of keys read/write permissions hebben
- Verifieer WooCommerce REST API is enabled

### "Products not loading"
- Check browser console voor errors
- Verifieer WooCommerce URL is correct (met https://)
- Check of WooCommerce REST API endpoint bereikbaar is

### Cache issues
- Cache wordt elke 5 minuten ververst
- Force refresh: herstart dev server
- Productie: wacht of trigger revalidation

---

## 📞 Need Help?

Check de volgende files voor meer details:
- `lib/woocommerce/client.ts` - API client implementation
- `lib/woocommerce/utils.ts` - Helper functions
- `lib/woocommerce/products.ts` - Caching layer
- `app/actions/cart.ts` - Cart actions
- `types/woocommerce.ts` - Type definitions

---

**Gemaakt door:** Scott Laeven  
**Datum:** 2026-02-18  
**Project:** Bikerfun Website  
**Status:** ✅ Ready for API Keys

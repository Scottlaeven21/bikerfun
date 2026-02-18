# 🔧 Developer Instructies: WooCommerce API Integratie

## 📦 Wat je ontvangt van de klant:

```
WooCommerce URL: admin.bikerfun.nl
Consumer Key: ck_xxxxxxxxxxxxxxxxxxxx
Consumer Secret: cs_xxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Setup in Next.js Project

### Stap 1: Environment Variables Toevoegen

Maak/bewerk `.env.local` in de root van je project:

```env
# WooCommerce API Credentials
NEXT_PUBLIC_WOOCOMMERCE_URL=https://admin.bikerfun.nl
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxx
```

**⚠️ BELANGRIJK:**
- Voeg `.env.local` toe aan `.gitignore`
- Commit NOOIT API keys naar Git!

---

### Stap 2: WooCommerce Package Installeren

```bash
npm install @woocommerce/woocommerce-rest-api
```

---

### Stap 3: WooCommerce Client Aanmaken

Maak bestand: `lib/woocommerce/client.ts`

```typescript
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const WooCommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL!,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
  version: "wc/v3",
  queryStringAuth: true // Voor HTTPS
});

export default WooCommerce;
```

---

### Stap 4: Test API Connection

Maak test bestand: `lib/woocommerce/test.ts`

```typescript
import WooCommerce from './client';

export async function testWooCommerceAPI() {
  try {
    const response = await WooCommerce.get("products", {
      per_page: 5,
    });
    
    console.log("✅ WooCommerce verbinding werkt!");
    console.log(`Aantal producten gevonden: ${response.data.length}`);
    return response.data;
  } catch (error) {
    console.error("❌ WooCommerce API Error:", error);
    throw error;
  }
}
```

Test in een Server Component of API route:

```typescript
const products = await testWooCommerceAPI();
```

---

## 📋 Volgende Stappen

Na succesvolle API test:

1. [ ] Producten ophalen en tonen op webshop pagina
2. [ ] Winkelwagen flow implementeren
3. [ ] Checkout integratie bouwen
4. [ ] Order aanmaken via API
5. [ ] Environment variables toevoegen aan Vercel

---

## 🔐 Vercel Environment Variables

Bij deployment, voeg toe in Vercel dashboard:

```
Settings → Environment Variables

Name: NEXT_PUBLIC_WOOCOMMERCE_URL
Value: https://admin.bikerfun.nl

Name: WOOCOMMERCE_CONSUMER_KEY
Value: ck_xxxxxxxxxxxxxxxxxxxx

Name: WOOCOMMERCE_CONSUMER_SECRET
Value: cs_xxxxxxxxxxxxxxxxxxxx
```

**Zet voor alle omgevingen:** Production, Preview, Development

---

## ✅ Checklist

- [ ] API credentials ontvangen van klant
- [ ] `.env.local` aangemaakt met credentials
- [ ] WooCommerce package geïnstalleerd
- [ ] Client setup compleet
- [ ] API verbinding getest
- [ ] Producten succesvol opgehaald
- [ ] Environment variables toegevoegd aan Vercel

---

## 📞 Troubleshooting

**Error: "Consumer key is missing"**
→ Check of environment variables correct zijn ingesteld

**Error: "Sorry, you cannot list resources"**
→ API keys hebben geen juiste permissions, klant moet keys opnieuw aanmaken met Read/Write

**Error: "404 Not Found"**
→ WooCommerce URL klopt niet of REST API is niet geactiveerd

**Error: "SSL certificate problem"**
→ Gebruik `queryStringAuth: true` in WooCommerce client config

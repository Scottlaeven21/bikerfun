# ⚡ Quick Start: Website Live Zetten (5 minuten)

## 🎯 **Snelle Checklist**

### 1️⃣ **Vercel Domain** (2 min)
1. [vercel.com/dashboard](https://vercel.com/dashboard) → Je project
2. Settings → Domains
3. Add: `bikerfun.nl` en `www.bikerfun.nl`

### 2️⃣ **DNS Instellen** (2 min)
Bij je domain provider (TransIP/Hostnet/etc.):

**Optie A (Makkelijkst):**
- Nameservers wijzigen naar:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```

**Optie B:**
- A record: `@` → `76.76.21.21`
- CNAME: `www` → `cname.vercel-dns.com`

### 3️⃣ **Wachten** (10-30 min)
- DNS propagatie
- SSL certificaat (automatisch)
- Test: `https://bikerfun.nl`

### 4️⃣ **Environment Variable** (1 min)
Vercel → Settings → Environment Variables:
- Update: `NEXT_PUBLIC_APP_URL` → `https://bikerfun.nl`
- **Redeploy!**

### 5️⃣ **Mollie Webhook** (1 min)
[mollie.com/dashboard](https://mollie.com/dashboard) → Developers → Webhooks:
- URL: `https://bikerfun.nl/api/webhooks/mollie`

### 6️⃣ **Test Checkout** (5 min)
1. Ga naar bikerfun.nl/products
2. Voeg product toe
3. Checkout + betaal
4. Check email
5. Check admin dashboard
6. Check WooCommerce

---

## ✅ **Klaar!**

Website is nu live op `bikerfun.nl`!

Voor **uitgebreide handleiding** met troubleshooting: zie `DEPLOY_LIVE_GUIDE.md`

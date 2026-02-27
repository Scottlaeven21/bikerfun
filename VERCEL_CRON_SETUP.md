# 🔄 Vercel Cron Job - Automatische Order Sync

## Wat Doet Dit?

In plaats van te vertrouwen op de Mollie webhook (die faalt door memory issues), gebruikt Bikerfun nu een **Vercel Cron Job** die automatisch elke 5 minuten draait.

**Hoe het werkt:**
1. ⏰ Vercel Cron draait automatisch elke 5 minuten
2. 🔍 Check Supabase voor betaalde orders zonder WooCommerce ID
3. 📤 Sync max 10 orders per run naar WooCommerce
4. 📧 WooCommerce verstuurt automatisch emails
5. ✅ Orders krijgen `woo_order_id` en `synced_to_woo: true`

**Voordelen:**
- ✅ Geen memory issues (gebruikt geen WordPress)
- ✅ 100% betrouwbaar (altijd retry)
- ✅ Zelfde sync logic als manual sync (die werkt perfect!)
- ✅ Geen IT'er aanpassingen nodig
- ✅ Automatisch na deployment

**Nadelen:**
- ⏱️ Max 5 minuten vertraging (acceptabel voor emails)

---

## 📋 Setup Instructies

### Stap 1: Environment Variable Toevoegen

**Login Vercel:**
```
https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables
```

**Voeg nieuwe variable toe:**
- **Key:** `CRON_SECRET`
- **Value:** (genereer een random string)
- **Environment:** Production, Preview, Development

**Genereer random string:**
```bash
# In terminal (op je laptop):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Of gebruik online tool: https://www.random.org/strings/

**Voorbeeld:**
```
CRON_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

### Stap 2: Deploy Naar Vercel

**Commit en push de nieuwe code:**
```bash
git add .
git commit -m "Add Vercel Cron job for automatic order sync"
git push origin main
```

**Wacht op deployment:**
```
https://vercel.com/scottlaeven21s-projects/bikerfun/deployments
```

Status moet "Ready" worden (2-3 minuten).

---

### Stap 3: Verificatie

**Check Cron Logs:**

1. Ga naar Vercel dashboard:
   ```
   https://vercel.com/scottlaeven21s-projects/bikerfun
   ```

2. Ga naar: **Logs → Functions**

3. Filter op: `/api/cron/sync-orders`

4. **Wacht 5 minuten** en refresh

**Verwachte logs:**
```
[CRON] Starting order sync job...
[CRON] Found 2 unsynced order(s)
[CRON] Syncing order BF-1772200304240...
[CRON] Synced BF-1772200304240 → WC Order 3050
[CRON] Sync complete: 2 synced, 0 failed
```

---

### Stap 4: Test Met Nieuwe Bestelling

1. Plaats nieuwe €0.01 test bestelling
2. Betaal via Mollie
3. **Wacht 5 minuten**
4. Check Supabase:
   ```bash
   npx tsx scripts/check-supabase-orders.ts
   ```
5. Nieuwste order moet `woo_order_id` hebben!

---

## 🔍 Monitoring

### Check Cron Status

**Vercel Dashboard:**
```
Settings → Crons
```

Je zou moeten zien:
- ✅ `/api/cron/sync-orders` - Every 5 minutes

### Check Logs

**Real-time logs:**
```bash
vercel logs --follow
```

**Of via Vercel dashboard:**
```
Logs → Functions → filter: /api/cron/sync-orders
```

### Manual Trigger (Voor Testen)

Je kunt de cron ook handmatig triggeren:

```bash
curl -X GET "https://bikerfun.nl/api/cron/sync-orders" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Vervang `YOUR_CRON_SECRET` met de waarde uit Vercel environment variables.

---

## 🔧 Troubleshooting

### Cron Draait Niet

**Check:**
1. `vercel.json` is correct committed
2. `CRON_SECRET` environment variable bestaat
3. Deployment is "Ready"
4. Wacht minimaal 5 minuten na deployment

**Verificatie:**
```bash
# Check of vercel.json is gepusht:
git log -1 --name-only
```

### Cron Faalt (500 Error)

**Check Vercel logs voor errors:**
```
Logs → Functions → filter: /api/cron/sync-orders
```

**Mogelijke oorzaken:**
1. WooCommerce API keys incorrect
2. Supabase connection issue
3. Memory error (gebeurt alleen bij READ, niet bij CREATE)

**Fix:**
- Check environment variables
- Test handmatig: `npx tsx scripts/sync-latest-order.ts`

### Orders Worden Niet Gesynced

**Check:**
1. Order heeft `payment_status: 'paid'`
2. Order heeft GEEN `woo_order_id` (anders al gesynced)
3. Cron logs tonen "No orders to sync" → check Supabase data

**Debug:**
```bash
# Check welke orders unsynced zijn:
npx tsx scripts/check-supabase-orders.ts
```

---

## ⚙️ Configuratie Aanpassen

### Verander Frequentie

**Edit `vercel.json`:**
```json
{
  "crons": [
    {
      "path": "/api/cron/sync-orders",
      "schedule": "*/2 * * * *"  // Elke 2 minuten
    }
  ]
}
```

**Cron syntax:**
- `*/5 * * * *` = Elke 5 minuten
- `*/2 * * * *` = Elke 2 minuten
- `*/10 * * * *` = Elke 10 minuten
- `0 * * * *` = Elk uur

**Na aanpassing:**
```bash
git add vercel.json
git commit -m "Update cron schedule"
git push origin main
```

### Verander Max Orders Per Run

**Edit `app/api/cron/sync-orders/route.ts`:**
```typescript
.limit(10); // ← Verander dit getal
```

Default = 10 orders per run (voldoende voor normale shop)

---

## 📊 Performance

**Cron runtime:**
- Geen orders: ~100ms
- 1 order: ~1-2 sec
- 10 orders: ~10-15 sec

**Vercel Free Tier:**
- ✅ Gratis tot 100 cron runs per dag
- ✅ 5 min interval = 288 runs per dag
- ⚠️ Dus je moet upgraden naar Pro ($20/maand)

**Vercel Pro:**
- ✅ Unlimited cron runs
- ✅ Betere performance
- ✅ Priority support

---

## 🔄 Mollie Webhook vs Cron

### Waarom Niet Mollie Webhook?

**Probleem:** WordPress memory issues (128MB te weinig)
- ❌ Webhook faalt met 500 error
- ❌ Orders worden niet gesynced
- ❌ IT'er kan/wil memory niet verhogen

**Oplossing:** Vercel Cron
- ✅ Geen WordPress dependency
- ✅ Altijd reliable
- ✅ Automatische retry

### Kan Ik Later Terugschakelen?

**Ja!** Als IT'er later memory verhoogt naar 512MB:

1. Test Mollie webhook:
   ```bash
   # In Mollie dashboard → Resend webhook
   ```

2. Als het werkt → disable cron:
   ```json
   {
     "crons": []
   }
   ```

3. Push en deploy

---

## 🎉 Success!

**Na setup werkt alles automatisch:**
- ✅ Klant bestelt product
- ✅ Betaalt via Mollie
- ✅ Order in Supabase (status: paid)
- ⏱️ Wacht max 5 minuten
- ✅ Cron synct naar WooCommerce
- ✅ Email automatisch verstuurd
- ✅ Label/verzending ready
- ✅ Voorraad bijgewerkt

**Geen handmatige actie meer nodig!** 🚀

---

## 📞 Support

**Als er problemen zijn:**
1. Check Vercel cron logs
2. Test handmatig: `npx tsx scripts/sync-latest-order.ts`
3. Check `CRON_SECRET` in Vercel
4. Verify `vercel.json` is committed

**Logs altijd opslaan voor debugging!**

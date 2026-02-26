# 🔑 Update WooCommerce Keys in Vercel

## 🆕 Nieuwe WooCommerce API Keys

Je IT'er heeft nieuwe keys aangemaakt:

```
Consumer Key:    ck_1b767b0530b8b33d22ea657fb966e9b6f812c5cb
Consumer Secret: cs_b55f6034a35516452095e690a6f0a4abd9bb01a4
```

**⚠️ Let op:** Als er een vreemd teken `б` (Cyrillisch) aan het einde stond, heb ik dit vervangen door `b`.

---

## 🚨 KRITIEK: Update Vercel Environment Variables!

De lokale `.env.local` is al geüpdatet, maar je MOET ook Vercel updaten!

---

## 📋 Stap-voor-Stap Instructies

### Stap 1: Ga Naar Vercel

1. **Open:** https://vercel.com/dashboard
2. **Klik** op je **Bikerfun** project
3. **Klik** op **"Settings"** (bovenaan)
4. **Klik** op **"Environment Variables"** (zijmenu links)

---

### Stap 2: Update/Voeg WooCommerce Keys Toe

Je moet **3 environment variables** checken/updaten:

#### Variable 1: NEXT_PUBLIC_WOOCOMMERCE_URL

**Check of deze bestaat:**
- Als **JA**: Check of de value `https://admin.bikerfun.nl` is
- Als **NEE** of fout: Voeg toe/update

**Hoe:**
1. Als bestaat: Klik op het **potlood icoontje** (edit)
2. Als niet bestaat: Klik **"Add New"**
3. **Name:** `NEXT_PUBLIC_WOOCOMMERCE_URL`
4. **Value:** `https://admin.bikerfun.nl`
5. **Environments:** Selecteer ALLE 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. **Save**

---

#### Variable 2: WOOCOMMERCE_CONSUMER_KEY

**Dit is de Consumer Key - MOET worden geüpdatet!**

1. Zoek naar bestaande `WOOCOMMERCE_CONSUMER_KEY`
2. Als bestaat: Klik **potlood icoontje** (edit), anders klik **"Add New"**
3. **Name:** `WOOCOMMERCE_CONSUMER_KEY`
4. **Value:** `ck_1b767b0530b8b33d22ea657fb966e9b6f812c5cb`
5. **Environments:** Selecteer ALLE 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. **Save**

---

#### Variable 3: WOOCOMMERCE_CONSUMER_SECRET

**Dit is de Consumer Secret - MOET worden geüpdatet!**

1. Zoek naar bestaande `WOOCOMMERCE_CONSUMER_SECRET`
2. Als bestaat: Klik **potlood icoontje** (edit), anders klik **"Add New"**
3. **Name:** `WOOCOMMERCE_CONSUMER_SECRET`
4. **Value:** `cs_b55f6034a35516452095e690a6f0a4abd9bb01a4`
5. **Environments:** Selecteer ALLE 3:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
6. **Save**

---

### Stap 3: Trigger Nieuwe Deployment 🚨

**SUPER BELANGRIJK!** Na het updaten van environment variables moet je een nieuwe deployment triggeren!

**Optie A: Via Vercel Dashboard**

1. **Ga naar:** "Deployments" tab (bovenaan)
2. **Klik** op de **laatste deployment** (bovenste in de lijst)
3. **Klik** op de **"⋯" (drie puntjes)** knop rechtsboven
4. **Selecteer:** **"Redeploy"**
5. **Bevestig:** "Redeploy"
6. **Wacht:** 2-4 minuten tot deployment compleet is

**Optie B: Via Git Push (Als je Git gebruikt)**

```bash
git add .
git commit -m "Update WooCommerce API keys"
git push
```

---

### Stap 4: Test of Het Werkt

Na de nieuwe deployment (wacht tot status = ✅ Ready):

1. **Open:** https://bikerfun.nl/products
2. **Hard refresh:** `Ctrl + Shift + R` (of `Cmd + Shift + R` op Mac)
3. **Check:** Laden de product afbeeldingen nu? ✅

**Test API Direct:**

Open in browser: https://bikerfun.nl/api/test-woocommerce

**Verwacht resultaat:**
```json
{
  "success": true,
  "message": "WooCommerce API is working!",
  "productCount": XX,
  "products": [...]
}
```

---

## 🔍 Debug Tips

### Als Het Nog Niet Werkt:

#### 1. Check Browser Console (F12)

```javascript
// In Console tab, run:
console.log('NEXT_PUBLIC_WOOCOMMERCE_URL:', process.env.NEXT_PUBLIC_WOOCOMMERCE_URL);
```

**Verwacht:** `https://admin.bikerfun.nl`  
**Als undefined:** Environment variable is niet correct in Vercel!

---

#### 2. Check Network Tab (F12 → Network)

Filter op "img" en check:
- Worden afbeeldingen aangevraagd?
- Wat is de URL?
- Wat is de HTTP status? (200 = OK, 403 = Forbidden, 404 = Not Found)

---

#### 3. Check Deployment Logs

1. **In Vercel:** Ga naar Deployments
2. **Klik** op de laatste deployment
3. **Check "Building"** logs voor errors
4. **Check "Functions"** logs voor runtime errors

---

## ⚠️ Veelgemaakte Fouten

### Fout 1: Verkeerde Environments Geselecteerd

**Probleem:** Variable is alleen toegevoegd voor "Production"  
**Oplossing:** Edit de variable en selecteer ALLE 3 environments

### Fout 2: Geen Redeploy Gedaan

**Probleem:** Variable is toegevoegd maar geen nieuwe deployment getriggerd  
**Oplossing:** Doe een Redeploy (zie Stap 3)

### Fout 3: Spatie of Enter in API Key

**Probleem:** Per ongeluk een spatie of enter gekopieerd in de value  
**Oplossing:** Edit de variable en verwijder extra whitespace

### Fout 4: Verkeerde Variable Namen

**Probleem:** Typo in variable naam (bijv. `WOOCOMMERCE_KEY` i.p.v. `WOOCOMMERCE_CONSUMER_KEY`)  
**Oplossing:** Gebruik EXACT deze namen:
- `NEXT_PUBLIC_WOOCOMMERCE_URL`
- `WOOCOMMERCE_CONSUMER_KEY`
- `WOOCOMMERCE_CONSUMER_SECRET`

---

## ✅ Checklist

### In Vercel Environment Variables Pagina:
- [ ] `NEXT_PUBLIC_WOOCOMMERCE_URL` = `https://admin.bikerfun.nl`
- [ ] `WOOCOMMERCE_CONSUMER_KEY` = `ck_1b767b0530b8b33d22ea657fb966e9b6f812c5cb`
- [ ] `WOOCOMMERCE_CONSUMER_SECRET` = `cs_b55f6034a35516452095e690a6f0a4abd9bb01a4`
- [ ] Alle 3 variabelen hebben Production, Preview EN Development geselecteerd
- [ ] Opgeslagen (geen "Unsaved changes" melding)

### Deployment:
- [ ] Redeploy getriggerd
- [ ] Wachten tot deployment status = ✅ Ready (2-4 min)
- [ ] Geen errors in deployment logs

### Testing:
- [ ] Website hard refresh: Ctrl + Shift + R
- [ ] https://bikerfun.nl/products geopend
- [ ] Product afbeeldingen laden ✅
- [ ] https://bikerfun.nl/api/test-woocommerce test succesvol
- [ ] Checkout werkt
- [ ] WooCommerce orders verschijnen in admin

---

## 🎯 Verwacht Eindresultaat

```
✅ Nieuwe WooCommerce keys in Vercel
✅ Nieuwe deployment gedaan
✅ API verbinding met admin.bikerfun.nl werkt
✅ Product afbeeldingen laden
✅ Checkout functionaliteit werkt
✅ Order sync naar WooCommerce werkt
```

---

## 📞 Hulp Nodig?

Als het nog niet werkt na deze stappen:

1. Screenshot van Vercel Environment Variables pagina
2. Screenshot van browser console (F12) op /products pagina
3. Resultaat van https://bikerfun.nl/api/test-woocommerce

Dan kunnen we verder debuggen! 🚀

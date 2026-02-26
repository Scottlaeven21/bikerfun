# 🔍 Browser Image Debug Checklist

## ✅ Wat We Weten

Database data is **perfect**:
```json
{
  "src": "https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-Toothless.jpg",
  "alt": "Toothless - Helmcover",
  "id": "Helmcover-Toothless"
}
```

✅ Image URLs correct
✅ next.config.ts geconfigureerd
✅ admin.bikerfun.nl bereikbaar
✅ WooCommerce API werkt

**Probleem moet in browser zitten!**

---

## 🧪 Debug Stappen

### Stap 1: Open Browser Console

1. **Ga naar:** https://bikerfun.nl/products
2. **Druk:** F12 (open Developer Tools)
3. **Ga naar:** Console tab

**Check voor errors:**
```
Failed to load image: ...
CORS error ...
net::ERR_...
```

**Screenshot deze errors en stuur naar mij!**

---

### Stap 2: Check Network Tab

1. **In Developer Tools (F12)**
2. **Ga naar:** Network tab
3. **Filter op:** img (bovenaan filter input)
4. **Refresh pagina:** Ctrl + R

**Check:**
- Zie je image requests?
- Wat is de status code?
  - 200 = ✅ Werkt
  - 403 = ❌ Forbidden
  - 404 = ❌ Not Found
  - (pending) = ⏳ Hangt

**Screenshot de Network tab met image requests!**

---

### Stap 3: Check Element Inspect

1. **Right-click** op waar afbeelding zou moeten zijn
2. **Selecteer:** "Inspect Element"

**Check in HTML:**
- Zie je een `<img>` tag?
- Wat is de `src` URL?
- Zijn er inline styles die het verbergen?

**Screenshot het Element panel!**

---

### Stap 4: Direct Image Test

**Open deze URL direct in browser:**
```
https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-Toothless.jpg
```

**Wat gebeurt er?**
- ✅ Afbeelding laadt
- ❌ Error pagina
- ❌ 403 Forbidden
- ❌ Timeout

---

### Stap 5: Check Browser Cache

**Clear cache en test:**

1. **Druk:** Ctrl + Shift + Delete
2. **Selecteer:** "Cached images and files"
3. **Time range:** "All time"
4. **Klik:** "Clear data"
5. **Refresh:** Ctrl + Shift + R

**Laden afbeeldingen nu?**

---

### Stap 6: Incognito Test

1. **Open:** Nieuwe Incognito window (Ctrl + Shift + N)
2. **Ga naar:** https://bikerfun.nl/products

**Laden afbeeldingen in Incognito?**
- ✅ Ja → Browser cache probleem
- ❌ Nee → Andere issue

---

## 🔍 Mogelijke Oorzaken

### 1. CORS Issue

Als Console toont:
```
Access to image at '...' from origin 'https://bikerfun.nl' has been blocked by CORS policy
```

**Fix:** IT'er moet CORS headers toevoegen op admin.bikerfun.nl

---

### 2. Next.js Image Optimization Probleem

Als console toont errors over Next/Image:
```
Error: Failed to load external image
```

**Mogelijk probleem:** `unoptimized={true}` werkt niet correct.

---

### 3. CSP (Content Security Policy)

Browser blokkeert images van admin.bikerfun.nl.

Check Console voor:
```
Refused to load the image ... violates the following Content Security Policy directive
```

---

### 4. DNS Propagatie

admin.bikerfun.nl resolves niet correct voor jouw locatie.

**Test:** Open terminal/CMD:
```powershell
nslookup admin.bikerfun.nl
```

Verwacht: `185.151.30.182`

---

### 5. SSL Certificate Issue

Als admin.bikerfun.nl HTTPS heeft maar met invalid cert:
```
Mixed Content: The page at 'https://bikerfun.nl' was loaded over HTTPS, but requested an insecure image
```

---

## 📝 Debug Checklist

Vul in en stuur naar mij:

**Browser Console Errors:**
```
[plak hier console errors]
```

**Network Tab Status:**
- [ ] Zie image requests: JA / NEE
- [ ] Status codes: _______
- [ ] Screenshot: [attach]

**Direct Image Test:**
```
https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-Toothless.jpg
```
Resultaat: ✅ Laadt / ❌ Error / ❌ Timeout

**Incognito Test:**
- [ ] Afbeeldingen laden in Incognito: JA / NEE

**DNS Check:**
```powershell
nslookup admin.bikerfun.nl
```
Resultaat: _______

---

## 🆘 Als Je Hulp Nodig Hebt

Stuur mij:
1. Screenshot van Browser Console (F12 → Console tab)
2. Screenshot van Network tab (F12 → Network → filter: img)
3. Resultaat van direct image test
4. Incognito test resultaat

Dan kan ik exact zien wat het probleem is! 🚀

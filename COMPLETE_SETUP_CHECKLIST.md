# ✅ Complete Setup Checklist - Bikerfun Live

## 🎯 **Alles Wat Gedaan Moet Worden - In Volgorde**

---

## **FASE 1: Vercel Configuratie** ✅ (AF)

- [x] Project deployed naar Vercel
- [x] Domain toegevoegd (`bikerfun.nl`, `www.bikerfun.nl`)
- [x] Environment variables toegevoegd:
  - [x] `NEXT_PUBLIC_APP_URL`
  - [x] `MOLLIE_API_KEY`
  - [x] `RESEND_API_KEY`
  - [x] `RESEND_FROM_EMAIL`
  - [x] `RESEND_TO_EMAIL`
  - [x] `WOOCOMMERCE_*`
  - [x] `SUPABASE_*`

**Status:** ✅ **COMPLEET**

---

## **FASE 2: Initial Redeploy** ⚠️ (CONTROLEREN!)

### **Check Dit NU:**

1. Vercel → **Deployments**
2. Bovenste deployment:
   - **Tijdstip:** Binnen laatste 10 minuten?
   - **Status:** "Ready" ✅?

**Als NEE of twijfel:**

### **Redeploy Doen:**
1. Deployments → Laatste deployment
2. 3 dots (⋮) → **Redeploy**
3. "Use existing Build Cache"
4. Wacht 2-3 minuten
5. Status: "Ready" ✅

**Status:** [ ] **TE CONTROLEREN**

---

## **FASE 3: DNS - Nameservers bij Strato** ⚠️ (HOOFDTAAK!)

### **Wat Je Moet Doen:**

1. Login **strato.nl** (of strato.de)
2. **Domeinen** → **bikerfun.nl**
3. Ga naar **"Nameserver"** sectie (NIET "DNS Records"!)
4. Klik **"Externe nameservers"** of **"Andere nameserver"**
5. **Vervang** de huidige nameservers:

**VAN:**
```
shades16.rzone.de
docks24.rzone.de
```

**NAAR:**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

6. Klik **"Opslaan"** / **"Speichern"**

**Guide:** Volg `STRATO_DNS_GUIDE.md` → Optie 1

**Status:** [ ] **NOG TE DOEN**

---

## **FASE 4: DNS Propagatie Wachten** ⏳

### **Wachttijd:**
- Minimaal: 15 minuten
- Gemiddeld: 30-60 minuten
- Maximaal: 2-4 uur (zeldzaam bij Strato)

### **Checken (na 30 min):**

**Test 1: Browser**
- Open **incognito window** (Ctrl+Shift+N)
- Type: `https://bikerfun.nl`
- **Werkt het?** → ✅ DNS actief, ga verder!
- **Error?** → Wacht nog 15 min

**Test 2: Vercel Dashboard**
- Settings → Domains
- Status `bikerfun.nl`: 
  - ✅ "Valid" (groen) → DNS actief!
  - ❌ "Invalid" (rood) → Wacht nog

**Status:** [ ] **WACHTEN OP DNS**

---

## **FASE 5: Resend DNS Records in VERCEL** 📧 (NA DNS actief!)

### **BELANGRIJK:** 
Omdat nameservers naar Vercel wijzen, moet je Resend DNS records **in VERCEL** toevoegen (NIET bij Strato!)

### **Wat Je Moet Doen:**

1. **Vercel** → Settings → **Domains**
2. Klik op **`bikerfun.nl`**
3. Scroll naar beneden naar **"DNS Records"** sectie
4. Klik **"Add Record"** (3x voor 3 records)

### **Record 1: DKIM** (Voor email authenticatie)
```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7+Yfhcd2mOsx7Gx+Wpz8YUynlGYhj15YB9RBiqqG3LW/E0CrH53S19t2fDazyY5zecnXDYHXfMRHpYFkoOzo3YuSn2rwieo3vXIRlkROAB8Of47V1OL+k+c5MpEH6JYhadPyBTjGCE26126FnGfU8N4Vj0lE2Xfp7GZx2MqkXvQIDAQAB
TTL: Auto (of 3600)
```

### **Record 2: SPF** (Anti-spam)
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.eu.resend.com ~all
TTL: Auto (of 3600)
```

### **Record 3: MX** (Reply emails - optioneel)
```
Type: MX
Name: @
Priority: 10
Value: feedback-smtp.eu.resend.com
TTL: Auto (of 3600)
```

**Opslaan na elke record!**

**Status:** [ ] **NA DNS ACTIEF**

---

## **FASE 6: Resend Domain Verificatie** ✅

### **Check in Resend Dashboard:**

1. Login [resend.com/dashboard](https://resend.com/dashboard)
2. Ga naar **Domains**
3. Klik op **bikerfun.nl**
4. Check status:
   - ⏳ "Pending verification" → Wacht 10-15 min
   - ✅ "Verified" (groen vinkje) → Klaar!

**Als "Verified":** Je kunt nu emails versturen vanaf `info@bikerfun.nl`! 📧

**Status:** [ ] **NA DNS RECORDS TOEVOEGEN**

---

## **FASE 7: Mollie Webhook URL** 🔔

### **Instellen:**

1. Login [mollie.com/dashboard](https://mollie.com/dashboard)
2. **Developers** → **Webhooks**
3. Edit bestaande webhook (of Create new)
4. **Webhook URL:**
   ```
   https://bikerfun.nl/api/webhooks/mollie
   ```
5. Klik **"Save"**

### **Test Webhook (Optioneel):**
- Naast webhook zie je "Test" knop
- Klik erop
- Check Vercel Logs voor webhook call

**Status:** [ ] **NA DNS ACTIEF**

---

## **FASE 8: Complete Testing** 🧪

### **Test 1: Website Basics**
- [ ] `https://bikerfun.nl` laadt homepage
- [ ] Groene slotje (SSL) in browser
- [ ] Hero video speelt af
- [ ] Occasions carousel werkt
- [ ] Footer compleet

### **Test 2: Webshop**
- [ ] `/products` toont 196 producten
- [ ] Categorieën werken
- [ ] Product detail pagina werkt
- [ ] "In winkelwagen" knop werkt
- [ ] Winkelwagen icon toont aantal

### **Test 3: Checkout Flow** 🔥 (BELANGRIJKSTE TEST!)
```
1. Product toevoegen aan cart
   ↓
2. Winkelwagen → Afrekenen
   ↓
3. Gegevens invullen:
   - Email: je@email.nl
   - Naam: Test Gebruiker
   - Adres: volledig invullen
   ↓
4. Klik "Betalen met Mollie"
   ↓
5. Redirect naar Mollie → Betaal (test payment)
   ↓
6. Redirect terug naar bikerfun.nl/payment-return
   ↓
7. Redirect naar order-confirmation
   ↓
8. Check binnen 5 min:
   ├─ Email ontvangen? ✅
   ├─ Admin dashboard: order zichtbaar? ✅
   └─ WooCommerce: order gesynchroniseerd? ✅
```

**Als stap 6-7 FAALT:**
- ❌ Redeploy niet gedaan
- ❌ `NEXT_PUBLIC_APP_URL` verkeerd

**Als stap 8 (emails) FAALT:**
- ❌ WooCommerce sync niet gelukt
- ❌ Check webhook in Mollie
- ❌ Check Vercel logs

---

### **Test 4: Contact Formulier Email** 📧

```
1. Ga naar bikerfun.nl/contact
   ↓
2. Vul formulier in:
   - Naam: Test
   - Email: je@email.nl
   - Onderwerp: Test
   - Bericht: Dit is een test
   ↓
3. Klik "Verstuur bericht"
   ↓
4. Verwacht:
   ├─ "Bericht verzonden!" melding ✅
   ├─ Email ontvangen (binnen 1 min) ✅
   └─ Auto-reply naar klant ✅
```

**Als dit FAALT:**
- ❌ Resend domain niet geverifieerd (DKIM records niet correct)
- ❌ Resend API key verkeerd
- ❌ Check Vercel function logs

---

### **Test 5: Motor op Aanvraag** 🏍️

```
1. Ga naar bikerfun.nl/motor-op-aanvraag
   ↓
2. Vul formulier in
   ↓
3. Verstuur
   ↓
4. Check email ontvangst
```

**Ook testen vanaf occasion detail:**
- Occasion met "Verkocht" status
- Klik "Motor op Aanvraag"
- Auto-ingevulde gegevens correct?

---

## **FASE 9: Admin Dashboard Verificatie** 🎛️

### **Check:**

1. Login `/admin`
2. **Orders:**
   - [ ] Test order zichtbaar
   - [ ] WooCommerce link werkt
   - [ ] Status correct ("Betaald")
3. **Occasions:**
   - [ ] 29 occasions zichtbaar
   - [ ] Verkocht status werkt
   - [ ] Bewerken werkt
4. **Products:**
   - [ ] 196 producten zichtbaar
   - [ ] Search werkt

---

## 🎊 **SUCCESS CRITERIA:**

### **Website is LIVE als:**
- ✅ `bikerfun.nl` laadt de website
- ✅ SSL certificaat actief (groen slotje)
- ✅ Vercel domain status = "Valid"

### **Checkout WERKT als:**
- ✅ Complete flow zonder errors
- ✅ Order confirmation pagina werkt
- ✅ Email ontvangen (WooCommerce)
- ✅ Order in admin dashboard
- ✅ Order in WooCommerce admin

### **Contact Mailing WERKT als:**
- ✅ Contact formulier verzendt
- ✅ Email ontvangen binnen 1 min
- ✅ Auto-reply naar klant
- ✅ Geen errors in Vercel logs

---

## 🔍 **WAAROM Werkt Mailing NU Nog Niet?**

### **Antwoord:**

**1. Website Nog Niet Live:**
- bikerfun.nl wijst nog naar Strato
- Contact formulieren bestaan daar niet
- Kan niet testen

**2. DKIM Records Verkeerde Plek:**
- Je hebt DKIM bij Strato toegevoegd
- Maar nameservers gaan naar Vercel (straks)
- Strato DNS wordt dan genegeerd
- **Must fix:** DKIM toevoegen bij Vercel (NA nameserver wijziging)

**3. Resend Domain Niet Geverifieerd:**
- Resend checkt DNS voor `bikerfun.nl`
- Vindt geen correcte records (want bij verkeerde plek)
- Domain verification = failed
- Kan geen emails versturen

---

## 🚀 **ACTIEPLAN:**

### **NU (Vandaag):**

**1. Redeploy Check** (5 min)
- [ ] Vercel → Deployments → Check tijdstip
- [ ] Als ouder dan Mollie key → Redeploy!

**2. Nameservers Wijzigen** (5 min)
- [ ] Strato → Nameserver settings
- [ ] Wijzig naar Vercel
- [ ] Opslaan

**3. Wachten** (30-60 min)
- [ ] ☕ Koffie/thee
- [ ] Timer zetten

### **STRAKS (Na 30+ min):**

**4. DNS Check** (2 min)
- [ ] Test bikerfun.nl in browser
- [ ] Check Vercel status

**5. Resend DNS in VERCEL** (5 min)
- [ ] Vercel → Domains → bikerfun.nl → DNS Records
- [ ] Add DKIM (jouw key)
- [ ] Add SPF
- [ ] Add MX (optioneel)

**6. Wachten op Resend** (10-30 min)
- [ ] Resend domain verificatie

**7. Mollie Webhook** (2 min)
- [ ] mollie.com → Webhook URL update

**8. TESTEN!** (15 min)
- [ ] Checkout flow
- [ ] Email ontvangst (WooCommerce)
- [ ] Contact formulier
- [ ] Email ontvangst (Resend)

---

## 🎉 **RESULTAAT:**

**Als alle checkboxes ✅:**
- Website LIVE op bikerfun.nl
- Checkout werkt met Mollie
- Emails werken (WooCommerce + Resend)
- Admin dashboard functioneel
- **KLAAR VOOR VERKOPEN!** 🎊

---

## 📞 **Support:**

**Als iets niet werkt:**
- Check `DEPLOY_LIVE_GUIDE.md` → Troubleshooting
- Check Vercel Logs (voor API errors)
- Check Mollie Webhook logs
- Check Resend Dashboard (domain verification)

---

## ⏱️ **Totale Tijd:**

- Actieve tijd: ~30 minuten
- Wachttijd: ~60 minuten (DNS propagatie)
- **Totaal:** ~90 minuten

**Resultaat:** Volledig functionele webshop! 🚀

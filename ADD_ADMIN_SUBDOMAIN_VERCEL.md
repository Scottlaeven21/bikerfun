# 🔧 Admin Subdomain Toevoegen in Vercel

## 🎯 Probleem

`admin.bikerfun.nl` staat **niet** in Vercel Domains lijst, daarom werkt het niet!

---

## ✅ Oplossing: Voeg Subdomain Toe in Vercel

### 📋 Stap-voor-Stap Handleiding

---

## STAP 1: Voeg Domain Toe in Vercel

1. **Open Vercel Dashboard:**
   - Ga naar: https://vercel.com/dashboard
   - **Belangrijk:** Klik NIET op je Bikerfun project!
   - Blijf op de hoofdpagina van je dashboard

2. **Zoek "Domains" in Sidebar:**
   - Klik op **"Domains"** in het menu links
   - Dit opent de algemene domains pagina (niet project-specifiek)

3. **Of: Ga Direct Naar Project Settings:**
   - Open je **Bikerfun project**
   - Klik op **"Settings"** tab
   - Klik op **"Domains"** in het zijmenu

4. **Klik "Add Domain"**
   - Er staat een knop: **"Add"** of **"Add Domain"**
   - Klik daarop

5. **Voer Subdomain In:**
   ```
   admin.bikerfun.nl
   ```
   - Type dit exact in het veld
   - Klik **"Add"**

---

## STAP 2A: Als Vercel Zegt "Already Owned" ✅

Vercel zegt: *"This domain is already owned by you"*

**Dit is GOED!** Het betekent dat Vercel weet dat je de eigenaar bent (omdat de nameservers naar Vercel wijzen).

### Nu Moet Je Kiezen:

**OPTIE 1: Redirect naar Strato** ⭐ **AANBEVOLEN**

Vercel zal vragen: *"Which project should this domain point to?"*

- Selecteer: **"No Project"** of **"External DNS"**
- Of klik op: **"Configure DNS Records"**

**Dan:**
1. Klik op **"DNS"** tab
2. Klik **"Add Record"**
3. Vul in:
   - **Type:** A
   - **Name:** admin
   - **Value:** [Strato IP - zie hieronder hoe je dit vindt]
   - **TTL:** 3600
4. Klik **"Save"**

---

## STAP 2B: Als Vercel Vraagt om Verificatie

Vercel kan vragen om te verifiëren dat je eigenaar bent:

1. **Kies:** "Use Nameservers" (je hebt dit al gedaan!)
2. **Of:** Vercel herkent het automatisch

---

## STAP 3: Vind Strato Server IP-Adres

Je hebt het **Strato server IP-adres** nodig.

### Methode 1: Bel Strato Support 📞

**Tel:** 088 - 300 7000

**Zeg:**
> "Hallo, wat is het IP-adres van mijn WordPress hosting voor bikerfun.nl?"

**Noteer het IP:** bijv. `81.169.xxx.xxx`

---

### Methode 2: Check Strato Hosting Panel

1. Login: https://www.strato.nl/apps/CustomerService
2. Ga naar: **"Producten"** → **"Webhosting"**
3. Selecteer: **bikerfun.nl** package
4. Zoek: **"Server Informatie"** of **"IP-adres"**
5. Noteer het IP

---

### Methode 3: Check Oude DNS Records (Als Je Die Hebt)

Als je oude DNS records hebt opgeslagen (voor de nameserver wijziging), staat het IP daar!

---

## STAP 4: Configureer DNS in Vercel

1. **In Vercel Dashboard:**
   - Ga naar: **Settings** → **Domains**
   - Zoek: `admin.bikerfun.nl`

2. **Klik op het domain**
   - Er komt een popup of nieuwe pagina

3. **Ga naar "DNS" tab**

4. **Voeg A Record Toe:**
   - Klik **"Add Record"**
   - **Type:** A
   - **Name:** admin (of @ als het vraagt om subdomain)
   - **Value:** [Strato IP bijv. 81.169.xxx.xxx]
   - **TTL:** 3600
   - Klik **"Save"**

---

## STAP 5: Wacht en Test

### Wacht 5-10 Minuten

DNS propagatie heeft tijd nodig.

### Test met PowerShell:

```powershell
# Check DNS resolving
nslookup admin.bikerfun.nl

# Expected output:
# Address: 81.169.xxx.xxx (jouw Strato IP)
```

### Test in Browser:

Open: https://admin.bikerfun.nl

**Verwacht:** WordPress login pagina! ✅

---

## 📊 Voor/Na Overzicht

### ❌ VOOR (Nu)

```
Vercel Domains Lijst:
- bikerfun.nl ✅
- (admin.bikerfun.nl ontbreekt!)

DNS Request: admin.bikerfun.nl
    ↓
Vercel: "Ik ken dit domain niet"
    ↓
❌ 404 Error
```

### ✅ NA (Straks)

```
Vercel Domains Lijst:
- bikerfun.nl ✅
- admin.bikerfun.nl ✅

Vercel DNS Records:
- admin.bikerfun.nl → A → 81.169.xxx.xxx (Strato)

DNS Request: admin.bikerfun.nl
    ↓
Vercel: "Ik ken dit! Stuur door naar 81.169.xxx.xxx"
    ↓
Strato Server
    ↓
✅ WordPress!
```

---

## 🚀 Na Het Fixen

Zodra `admin.bikerfun.nl` werkt:

### Test Afbeelding:

Open: https://admin.bikerfun.nl/wp-content/uploads/2023/10/Helmcover-bunny.jpg

**Verwacht:** Afbeelding wordt getoond! ✅

### Run Migratie Script:

```powershell
npm run migrate:images
```

**Dit doet:**
1. ✅ Download alle 284 product afbeeldingen van WordPress
2. ✅ Upload naar Supabase Storage
3. ✅ Update database URLs
4. ✅ Website 100% werkend!

**Duurt:** 2-5 minuten

---

## ❓ Problemen?

### "Ik zie geen optie om DNS records toe te voegen"

**Oplossing:**
1. Zorg dat je admin.bikerfun.nl **eerst toevoegt** als domain
2. Dan verschijnt de DNS management optie
3. Of ga naar: Vercel Dashboard → Project → Settings → Domains → Scroll naar beneden → "DNS Records"

### "Ik kan geen A-record toevoegen"

**Oplossing:**
- Vercel heeft soms een speciale "External DNS" optie
- Of: Gebruik CNAME naar een Strato hostname (bijv. `h123456.stratoserver.net`)
- Contact Vercel Support: https://vercel.com/support

### "Vercel wil admin.bikerfun.nl aan mijn project koppelen"

**Oplossing:**
- Dit is OK! Laat het eerst koppelen
- Dan kun je daarna de DNS records wijzigen
- Of selecteer "No Framework" als deployment optie

---

## 📞 Support Contacten

**Strato:**
- Tel: 088 - 300 7000
- Voor: Server IP-adres opvragen

**Vercel:**
- https://vercel.com/support
- Voor: DNS configuratie hulp

---

## ✅ Volledige Checklist

### Vercel Setup
- [ ] Vercel Dashboard geopend
- [ ] "Add Domain" geklikt
- [ ] `admin.bikerfun.nl` ingevoerd
- [ ] Domain toegevoegd aan lijst

### Strato IP Vinden
- [ ] Strato gebeld of hosting panel gecheckt
- [ ] IP-adres genoteerd: `____________________`

### DNS Configuratie
- [ ] DNS tab geopend voor admin.bikerfun.nl
- [ ] A-record toegevoegd
- [ ] Name: admin
- [ ] Value: [Strato IP]
- [ ] Opgeslagen

### Testing
- [ ] 10 minuten gewacht
- [ ] `nslookup admin.bikerfun.nl` getest
- [ ] https://admin.bikerfun.nl geopend
- [ ] WordPress login zichtbaar
- [ ] Test afbeelding laadt

### Migratie
- [ ] `npm run migrate:images` uitgevoerd
- [ ] Script succesvol afgerond
- [ ] Product pagina's tonen afbeeldingen
- [ ] Website 100% werkend!

---

## 🎉 Eindresultaat

```
✅ bikerfun.nl         → Vercel → Next.js
✅ admin.bikerfun.nl   → Strato → WordPress
✅ Alle afbeeldingen   → Supabase Storage
✅ Website volledig werkend!
```

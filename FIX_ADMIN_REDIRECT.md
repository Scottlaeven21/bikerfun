# 🔧 Fix admin.bikerfun.nl - Redirect naar WordPress

## 🚨 Probleem

`admin.bikerfun.nl` wijst nu naar je **Next.js project** op Vercel, niet naar WordPress!

**Screenshot toont:**
```
admin.bikerfun.nl → Production ✓ (Vercel Next.js)
```

**We willen:**
```
admin.bikerfun.nl → WordPress op Strato
```

---

## ✅ Oplossing 1: Verwijder Domain Uit Vercel Project (BESTE)

### Stap 1: Verwijder admin.bikerfun.nl

1. **In Vercel Dashboard:**
   - Je bent al op: Settings → Domains
   - Zoek de rij: `admin.bikerfun.nl`

2. **Klik op het ⋮ (drie puntjes) menu** rechts van de rij

3. **Selecteer:** "Remove Domain" of "Delete"

4. **Bevestig:** Ja, verwijder het domain

**Let op:** Dit verwijdert `admin.bikerfun.nl` uit je **project**, maar NIET uit je Vercel account!

---

### Stap 2: Configureer als Externe Redirect

Nu moet je admin.bikerfun.nl configureren als een **externe redirect** naar Strato.

**MAAR:** We hebben het **Strato server IP-adres** nodig!

---

## 📞 Stap 3: Vind Strato Server IP

### Methode A: Bel Strato (SNELST)

**Tel:** 088 - 300 7000

**Vraag:**
> "Wat is het IP-adres van mijn WordPress hosting voor bikerfun.nl?"

**Noteer:** bijv. `81.169.xxx.xxx`

---

### Methode B: Check Strato Hosting Panel

1. Login: https://www.strato.nl/apps/CustomerService
2. Ga naar: Producten → Webhosting
3. Selecteer: bikerfun.nl
4. Zoek: "Server IP-adres" of "Server Informatie"

---

### Methode C: Oude DNS Records

Als je een backup hebt van je oude DNS configuratie (voor nameserver wijziging), staat het IP daar!

---

## Stap 4: Voeg DNS A-Record Toe in Vercel

Nu wordt het interessant. Er zijn 2 manieren:

### Optie A: Via Vercel DNS Management

1. **In Vercel Dashboard:**
   - Klik op je **account naam** (linksboven)
   - Ga naar: **"Domains"** (algemene domains, niet project-specifiek)
   - Of ga naar: https://vercel.com/dashboard/domains

2. **Zoek `bikerfun.nl`** in de lijst
   - Klik erop

3. **Ga naar "DNS" tab**

4. **Check of er al een record bestaat voor `admin`:**
   - Als JA: klik op "Edit" en wijzig het
   - Als NEE: ga naar volgende stap

5. **Klik "Add Record"**

6. **Vul in:**
   - **Type:** A
   - **Name:** admin
   - **Value:** [Strato IP bijv. 81.169.145.123]
   - **TTL:** 3600

7. **Klik "Save"**

---

### Optie B: Via Vercel CLI (Alternatief)

Als je technisch bent:

```bash
vercel dns add bikerfun.nl admin A 81.169.xxx.xxx
```

---

## Stap 5: Wacht en Test

### Wacht 5-10 Minuten

DNS propagatie heeft tijd nodig.

### Test met PowerShell:

```powershell
# Check DNS
nslookup admin.bikerfun.nl

# Expected: Strato IP address
```

### Test in Browser:

1. **Clear browser cache:** Ctrl + Shift + Delete
2. **Open:** https://admin.bikerfun.nl
3. **Verwacht:** WordPress login pagina ✅

---

## ⚠️ Als Dit Niet Werkt...

Dan moet je een andere aanpak:

---

## ✅ Oplossing 2: Gebruik Git Branch voor admin.bikerfun.nl

In plaats van het domain te verwijderen, configureer een aparte branch:

1. **In Vercel → Settings → Domains**
2. **Klik op admin.bikerfun.nl**
3. **Change Git Branch:**
   - Selecteer een **niet-bestaande branch** (bijv. `wordpress-admin`)
4. **Dit zorgt ervoor dat Vercel het domain "negeert"**

---

## ✅ Oplossing 3: Terug naar Strato Nameservers (NIET AANBEVOLEN)

Als niets werkt, kan je overwegen nameservers terug te zetten:

### ⚠️ NADEEL: Dan moet je bikerfun.nl handmatig configureren!

1. **Zet nameservers terug naar Strato:**
   - ns1.strato.com
   - ns2.strato.com

2. **Configureer in Strato DNS:**
   - `bikerfun.nl` → A-record → Vercel IP (76.76.21.21)
   - `www.bikerfun.nl` → A-record → Vercel IP
   - `admin.bikerfun.nl` → A-record → Strato IP

**Nadeel:** Je moet beide kanten beheren (Strato EN Vercel).

---

## 📊 Voor/Na Overzicht

### ❌ NU (Fout)

```
Vercel Project Domains:
├─ bikerfun.nl → Next.js ✅
├─ www.bikerfun.nl → Next.js ✅
└─ admin.bikerfun.nl → Next.js ❌ (FOUT!)

Resultaat:
admin.bikerfun.nl toont Next.js site ❌
```

### ✅ STRAKS (Correct)

```
Vercel Project Domains:
├─ bikerfun.nl → Next.js ✅
└─ www.bikerfun.nl → Next.js ✅

Vercel DNS Records:
└─ admin.bikerfun.nl (A) → 81.169.xxx.xxx (Strato) ✅

Resultaat:
admin.bikerfun.nl toont WordPress ✅
```

---

## 🎯 Stappen Samenvatting

1. ✅ Verwijder `admin.bikerfun.nl` uit Vercel **project** domains
2. 📞 Bel Strato voor WordPress server IP-adres
3. ⚙️ Voeg DNS A-record toe in Vercel DNS management
4. ⏱️ Wacht 10 minuten
5. 🧪 Test admin.bikerfun.nl
6. 🚀 Run `npm run migrate:images`
7. 🎉 Klaar!

---

## 📋 Checklist

### Domain Cleanup
- [ ] In Vercel Dashboard → Settings → Domains
- [ ] admin.bikerfun.nl gevonden
- [ ] Drie puntjes menu geklikt
- [ ] "Remove Domain" geselecteerd
- [ ] Bevestigd

### Strato IP Vinden
- [ ] Strato gebeld: 088 - 300 7000
- [ ] IP-adres gekregen: `____________________`

### DNS Configuratie
- [ ] Vercel Dashboard → Domains (algemeen)
- [ ] bikerfun.nl geopend
- [ ] DNS tab geopend
- [ ] A-record toegevoegd voor admin
- [ ] Value: [Strato IP]
- [ ] Opgeslagen

### Testing
- [ ] 10 minuten gewacht
- [ ] DNS cache geleegd: `ipconfig /flushdns`
- [ ] Browser cache geleegd: Ctrl + Shift + Del
- [ ] admin.bikerfun.nl getest
- [ ] WordPress login zichtbaar ✅

### Migratie
- [ ] `npm run migrate:images` uitgevoerd
- [ ] Alle afbeeldingen gemigreerd
- [ ] Website werkt perfect!

---

## 🆘 Troubleshooting

### "Ik kan admin.bikerfun.nl niet verwijderen"

**Oplossing:**
- Check of je Admin rechten hebt in Vercel
- Vraag team admin om het te verwijderen
- Of: wijzig de Git Branch naar een dummy branch

### "DNS record option is grayed out"

**Oplossing:**
- Zorg dat admin.bikerfun.nl NIET in een project zit
- Verwijder het eerst uit het project
- Dan wordt DNS management beschikbaar

### "Het blijft naar Next.js redirecten"

**Oplossing:**
1. Clear browser cache volledig
2. Test in Incognito mode
3. Test op andere device/netwerk
4. Check DNS: `nslookup admin.bikerfun.nl`

---

## 🎉 Eindresultaat

```
✅ bikerfun.nl         → Vercel → Next.js
✅ www.bikerfun.nl     → Vercel → Next.js
✅ admin.bikerfun.nl   → Strato → WordPress
✅ Afbeeldingen        → Supabase Storage
✅ Alles werkt! 🎊
```

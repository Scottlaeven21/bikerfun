# 🔧 Fix admin.bikerfun.nl Subdomain

## 🚨 Probleem

Na het aanpassen van nameservers naar Vercel is `admin.bikerfun.nl` niet meer bereikbaar.

**Oorzaak:** Vercel beheert nu alle DNS, maar `admin.bikerfun.nl` is niet geconfigureerd.

---

## ✅ Oplossing 1: Subdomain Toevoegen in Vercel (AANBEVOLEN)

### Stap 1: Vind Strato Server IP-Adres

Je moet het IP-adres van je Strato WordPress server vinden.

**Optie A: Via Strato Hosting Panel**
1. Login bij Strato: https://www.strato.nl/apps/CustomerService
2. Ga naar je hosting package
3. Zoek naar "Server Information" of "IP Address"
4. Noteer het IP-adres (bijv. `81.169.xxx.xxx`)

**Optie B: Via Command Prompt (als admin.bikerfun.nl nog cached is)**
```powershell
nslookup admin.bikerfun.nl 8.8.8.8
```

**Optie C: Contact Strato Support**
- Tel: 088 - 300 7000
- Vraag: "Wat is het IP-adres van mijn WordPress hosting voor bikerfun.nl?"

---

### Stap 2: Voeg Subdomain Toe in Vercel

1. **Open Vercel Dashboard**
   - Ga naar: https://vercel.com/dashboard
   - Selecteer je `bikerfun` project

2. **Ga naar Settings → Domains**

3. **Klik op "Add Domain"**
   - Voer in: `admin.bikerfun.nl`
   - Klik "Add"

4. **Vercel zal zeggen: "Domain already owned"**
   - Dit is normaal! Klik op "Configure DNS"

5. **Voeg A Record Toe**
   - Klik op "DNS Records" tab
   - Klik "+ Add Record"
   - **Type:** A
   - **Name:** admin
   - **Value:** [IP-adres van Strato server]
   - **TTL:** 3600
   - Klik "Save"

6. **Wacht 5-10 minuten**
   - DNS propagatie kan even duren
   - Test daarna: https://admin.bikerfun.nl

---

## ✅ Oplossing 2: Gebruik CNAME Record (Alternatief)

Als je het IP-adres niet weet, maar wel een hostname van Strato:

1. **Contact Strato Support**
   - Vraag: "Wat is de hostname voor mijn WordPress hosting?"
   - Bijv: `h12345678.stratoserver.net`

2. **Voeg CNAME toe in Vercel DNS**
   - **Type:** CNAME
   - **Name:** admin
   - **Value:** [Strato hostname]
   - **TTL:** 3600

---

## ✅ Oplossing 3: Terug naar Strato Nameservers (NIET AANBEVOLEN)

Als bovenstaande niet werkt, kan je nameservers terugzetten:

### ⚠️ NADEEL: bikerfun.nl werkt dan NIET meer!

1. **Login bij Strato**
2. **Ga naar DNS Settings**
3. **Zet nameservers terug naar Strato:**
   ```
   ns1.strato.com
   ns2.strato.com
   ```

4. **Voeg A-record toe voor bikerfun.nl in Strato:**
   - **Type:** A
   - **Name:** @ (of laat leeg)
   - **Value:** [Vercel IP - zie vercel dashboard]
   - **TTL:** 3600

### 📋 Vercel IP Adressen Vinden:

In Vercel Dashboard → Settings → Domains → bikerfun.nl → "Configure DNS"

Je ziet iets als:
```
A Record: @ → 76.76.21.21
```

---

## 🎯 Wat Ik Aanraad

**Beste optie: Oplossing 1**
- Behoud Vercel nameservers (bikerfun.nl blijft werken!)
- Voeg `admin.bikerfun.nl` toe met A-record naar Strato IP
- Beide domeinen werken dan perfect!

---

## 🔍 Test of Het Werkt

Na configuratie, test met:

```powershell
# Test DNS resolving
nslookup admin.bikerfun.nl

# Test in browser
https://admin.bikerfun.nl
```

---

## 📞 Hulp Nodig?

**Strato Support:**
- Tel: 088 - 300 7000
- Vraag: "IP-adres van mijn WordPress hosting voor bikerfun.nl"

**Vercel Support:**
- https://vercel.com/support
- Of: community.vercel.com

---

## ✅ Checklist

- [ ] Strato server IP-adres gevonden
- [ ] `admin.bikerfun.nl` toegevoegd in Vercel
- [ ] A-record aangemaakt in Vercel DNS
- [ ] 10 minuten gewacht voor DNS propagatie
- [ ] admin.bikerfun.nl getest in browser
- [ ] WordPress admin panel bereikbaar
- [ ] Product afbeeldingen bereikbaar

---

## 🚀 Na Het Fixen

Zodra `admin.bikerfun.nl` weer werkt:

1. ✅ Run image migration script: `npm run migrate:images`
2. ✅ Alle product afbeeldingen worden naar Supabase gemigreerd
3. ✅ Website werkt perfect!

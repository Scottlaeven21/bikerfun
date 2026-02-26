# 📞 Bel Strato Support - Script

## 🎯 Doel
Het IP-adres van je WordPress hosting server vinden.

---

## 📞 Contact Informatie

**Strato Support Nederland:**
- **Telefoon:** 088 - 300 7000
- **Tijden:** Ma-Vr 9:00-17:00
- **Email:** support@strato.nl

---

## 🗣️ Wat Te Zeggen

### Stap 1: Introductie
```
"Hallo, ik heb een vraag over mijn hosting voor bikerfun.nl."
```

### Stap 2: Uitleg Situatie
```
"Ik heb de nameservers veranderd naar Vercel voor mijn hoofddomein,
maar mijn WordPress site op admin.bikerfun.nl staat nog op Strato.
Ik heb het IP-adres van die server nodig om de DNS correct in te stellen."
```

### Stap 3: Specifieke Vraag
```
"Wat is het IP-adres van de server waar mijn WordPress hosting voor 
bikerfun.nl op draait? Ik moet het subdomain admin.bikerfun.nl daar 
naartoe laten wijzen."
```

### Stap 4: Klantgegevens Paraat Hebben
- Domeinnaam: `bikerfun.nl`
- Subdomain: `admin.bikerfun.nl`
- Je klantnummer (indien je die hebt)
- Je email adres gekoppeld aan het account

---

## 📝 Wat Ze Je Geven

Je krijgt waarschijnlijk een IP-adres zoals:

```
81.169.xxx.xxx
```

OF een hostname zoals:

```
h12345678.stratoserver.net
```

**Noteer dit!** Je hebt het meteen nodig.

---

## 🚀 Na Het Telefoontje

Zodra je het IP hebt:

### Stap 1: Ga naar Vercel
1. https://vercel.com/dashboard
2. Open je Bikerfun project
3. Settings → Domains
4. Zoek de rij: `admin.bikerfun.nl`

### Stap 2: Wijzig A-Record
1. Klik op het potlood icoontje naast `admin.bikerfun.nl`
2. Of ga naar DNS Records tab
3. Vind de A-record voor `admin.bikerfun.nl`
4. **Wijzig Data van:**
   - `185.151.30.182` (Vercel IP)
   - **NAAR:**
   - `[Het IP dat Strato je gaf]`
5. Klik "Save"

### Stap 3: Wacht 5-10 Minuten
DNS propagatie heeft even tijd nodig.

### Stap 4: Test
```powershell
# In PowerShell:
nslookup admin.bikerfun.nl

# Open in browser:
https://admin.bikerfun.nl
```

---

## ✅ Als Het Werkt

Zodra `admin.bikerfun.nl` weer bereikbaar is:

1. ✅ WordPress admin werkt
2. ✅ Product afbeeldingen zijn toegankelijk
3. ✅ Run: `npm run migrate:images`
4. ✅ Alle afbeeldingen worden naar Supabase gemigreerd
5. ✅ Website is volledig werkend!

---

## ❓ Alternatief: Strato Hosting Panel

Als je liever zelf zoekt in het hosting panel:

1. Login: https://www.strato.nl/apps/CustomerService
2. Ga naar "Producten" → "Webhosting"
3. Selecteer je package voor bikerfun.nl
4. Zoek naar:
   - "Server Informatie"
   - "IP-adres"
   - "Server Details"
   - "Technische Gegevens"

Het IP-adres staat daar ergens vermeld.

---

## 🔧 Vercel DNS Record Format

Voor de zekerheid, dit is wat je in Vercel moet invullen:

| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | admin |
| **Value** | [Strato IP zoals 81.169.xxx.xxx] |
| **TTL** | 3600 |

---

## 📞 Andere Hosting Providers (Voor Het Geval)

Als blijkt dat bikerfun.nl NIET bij Strato gehost is:

**TransIP:**
- Tel: 0877 33 66 55
- https://www.transip.nl/contact

**Versio:**
- Tel: 030 - 760 05 00
- https://www.versio.nl/contact

**Byte:**
- Tel: 020 - 535 37 00
- https://www.byte.nl/contact

---

## 🎯 Checklist

- [ ] Strato gebeld
- [ ] IP-adres genoteerd
- [ ] Vercel DNS aangepast
- [ ] 10 minuten gewacht
- [ ] admin.bikerfun.nl getest
- [ ] WordPress bereikbaar
- [ ] `npm run migrate:images` uitgevoerd
- [ ] Website 100% werkend!

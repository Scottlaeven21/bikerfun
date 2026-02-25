# 🌐 Strato DNS Configuratie voor Vercel - Complete Handleiding

## 📋 **Overzicht**

Deze handleiding legt uit hoe je de DNS instellingen voor `bikerfun.nl` bij Strato configureert om het domein naar Vercel te laten wijzen.

**Tijdsduur:** 5-10 minuten (+ 30-60 minuten wachttijd voor DNS propagatie)

---

## 🎯 **Kies Je Methode**

Je hebt **2 opties**. Probeer eerst Optie 1. Als dat niet werkt, gebruik Optie 2.

- ✅ **Optie 1: Nameservers wijzigen** (Makkelijkst - Vercel regelt alles)
- ✅ **Optie 2: A-record + CNAME** (Als Optie 1 niet beschikbaar is)

---

# **OPTIE 1: Nameservers Wijzigen** ⭐ (Aanbevolen)

## **Stap 1: Login bij Strato**

### 1.1 Open Strato Website

Ga naar een van deze URLs:
- 🇳🇱 Nederlandse klanten: [www.strato.nl](https://www.strato.nl)
- 🇩🇪 Duitse klanten: [www.strato.de](https://www.strato.de)

### 1.2 Login

1. Klik **rechtsboven** op de **"Login"** knop
2. Selecteer **"Klantenlogin"** (of "Kundenbereich" in het Duits)
3. Je ziet nu het login scherm

### 1.3 Voer Credentials In

Je hebt 2 opties om in te loggen:

**Optie A: Met Klantnummer**
- **Klantnummer:** (8-cijferig nummer, staat op je facturen)
- **Wachtwoord:** Je Strato wachtwoord

**Optie B: Met Email**
- **E-mailadres:** Je geregistreerde email bij Strato
- **Wachtwoord:** Je Strato wachtwoord

Klik op **"Inloggen"** of **"Login"**

### 1.4 Bevestiging

Je komt nu in het **Strato Klantenpaneel** (Customer Center / Kundenbereich)

---

## **Stap 2: Navigeer naar Domain Beheer**

### 2.1 Open Domeinen Menu

In het **linker menu** zie je verschillende opties. Zoek naar:
- **"Domeinen"** (Nederlands)
- **"Domains"** (Engels/Duits)
- **"Domeinbeheer"**

Klik erop.

### 2.2 Domein Lijst

Je ziet nu een overzicht van al je domeinen bij Strato. Dit kan zijn:
```
bikerfun.nl
anderedomeinen.nl
etc.
```

### 2.3 Selecteer bikerfun.nl

1. Zoek **bikerfun.nl** in de lijst
2. **Klik op de domeinnaam** om deze te openen
3. Je komt nu op de domain detail pagina

---

## **Stap 3: Nameserver Settings Vinden**

### 3.1 Zoek Nameserver Sectie

Op de domain detail pagina, zoek naar een tab of sectie genaamd:
- **"Nameserver"**
- **"Nameserver Settings"**
- **"Nameserver-Einstellungen"**
- **"DNS Instellingen"**

**Mogelijke locaties:**
- Als **tab bovenaan** de pagina
- Als **sectie/card** op de pagina
- Onder **"DNS-Konfiguration"** of **"DNS Configuratie"**

Klik erop.

### 3.2 Huidige Nameservers

Je ziet nu waarschijnlijk de **huidige nameservers** van Strato:
```
shades16.rzone.de
docks24.rzone.de
```

Of vergelijkbare namen zoals:
```
shades[nummer].rzone.de
docks[nummer].rzone.de
```

**Dit zijn de standaard Strato nameservers.**

---

## **Stap 4: Wijzigen naar Vercel Nameservers**

### 4.1 Klik op Bewerken

Je ziet meestal een knop of link:
- **"Bewerken"** (Nederlands)
- **"Bearbeiten"** (Duits)
- **"Edit"** (Engels)
- **"Ändern"** (Duits)

Klik erop.

### 4.2 Selecteer Externe Nameservers

Je krijgt nu opties te zien:

**Selecteer:**
- ⭐ **"Externe Nameservers gebruiken"**
- ⭐ **"Use external nameservers"**
- ⭐ **"Andere Nameserver verwenden"**
- ⭐ **"Fremde Nameserver"**

**NIET selecteren:**
- ❌ "Strato Nameservers gebruiken" (dit is de oude situatie)
- ❌ "DNS Management bij Strato" (dit is voor A-records)

### 4.3 Vul Vercel Nameservers In

Je ziet nu **2 invoervelden** (soms 4 of meer):

**Veld 1 - Primaire Nameserver:**
```
ns1.vercel-dns.com
```

**Veld 2 - Secundaire Nameserver:**
```
ns2.vercel-dns.com
```

**Veld 3 & 4 (als aanwezig):** 
- Laat deze **LEEG** (niet invullen)
- Of vul ook Vercel nameservers in als het verplicht is:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```

### 4.4 Opslaan

1. Scroll naar beneden
2. Klik op:
   - **"Speichern"** (Duits)
   - **"Opslaan"** (Nederlands)
   - **"Save"** (Engels)
   - **"Übernehmen"** (Duits - bevestigen)

### 4.5 Bevestiging

Je ziet nu een bevestigingsmelding:

**Succesmelding:**
```
✅ Die Nameserver wurden erfolgreich geändert
✅ Nameservers zijn succesvol gewijzigd
✅ Nameservers have been updated
```

**Waarschuwing:**
```
⚠️ Hinweis: Die Änderungen können bis zu 24 Stunden dauern
⚠️ Let op: Wijzigingen kunnen tot 24 uur duren
⚠️ Note: Changes may take up to 24 hours
```

**Dit is normaal!** In de praktijk werkt het meestal binnen 30-60 minuten.

---

## ⏳ **Stap 5: Wachten op DNS Propagatie**

### 5.1 Wat Gebeurt Er Nu?

Strato stuurt de nieuwe nameserver informatie door naar:
1. Top Level Domain servers (.nl registry)
2. DNS servers wereldwijd
3. Internet Service Providers
4. Je eigen computer/router

**Dit proces heet "DNS Propagatie".**

### 5.2 Hoe Lang Duurt Het?

**Bij Strato (ervaring):**
- ⚡ **Snel scenario:** 15-30 minuten
- 🕐 **Normaal scenario:** 30-90 minuten
- 🐢 **Langzaam scenario:** 2-24 uur (zeer zeldzaam)

**Strato is meestal aan de tragere kant vergeleken met andere providers.**

### 5.3 Status Checken

**Methode 1: Browser Test (Simpelst)**
1. Open een **incognito/privé window** (Ctrl+Shift+N)
2. Type: `https://bikerfun.nl`
3. Als de website laadt: ✅ **Het werkt!**
4. Als error of oude site: ⏳ **Wacht nog 15 minuten en probeer opnieuw**

**Methode 2: DNS Checker Tool**
1. Ga naar [dnschecker.org](https://dnschecker.org)
2. Voer in: `bikerfun.nl`
3. Klik op **Search**
4. Je ziet nu een wereldkaart met DNS status per locatie
5. Als overal **groen** met Vercel nameservers: ✅ **Actief!**
6. Als nog rood of oude nameservers: ⏳ **Wacht nog**

**Methode 3: Vercel Dashboard Check**
1. Ga naar [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open je Bikerfun project
3. Ga naar **Settings** → **Domains**
4. Kijk naar de status van `bikerfun.nl`:
   - **⏳ "Invalid" of "Pending"** → DNS nog niet actief, wacht nog
   - **✅ "Valid" met groen vinkje** → DNS is actief!

---

## ✅ **Stap 6: SSL Certificaat Verificatie**

### 6.1 Automatische SSL

Zodra DNS actief is, genereert Vercel **automatisch** een gratis SSL certificaat.

**Dit gebeurt zonder jouw actie!** Duur: 1-5 minuten na DNS activatie.

### 6.2 Check SSL Status in Vercel

1. Vercel → Settings → Domains
2. Naast `bikerfun.nl` zie je een **slot icon** 🔒
3. Status moet zijn:
   - ✅ **Groen slot** → Certificaat actief
   - ⏳ **Grijs slot** → Wordt gegenereerd, wacht nog

### 6.3 Test HTTPS in Browser

1. Open: `https://bikerfun.nl` (let op: **https**, niet http)
2. Klik op het **slotje** in de adresbalk (links naast de URL)
3. Je moet zien:
   ```
   ✅ Verbinding is beveiligd
   ✅ Connection is secure
   ✅ Certificaat geldig
   ```

### 6.4 Auto HTTP → HTTPS Redirect

Test ook:
1. Type: `http://bikerfun.nl` (zonder 's' in http)
2. Je wordt **automatisch** geredirect naar `https://bikerfun.nl`
3. Als dit werkt: ✅ **SSL is volledig actief!**

---

# **OPTIE 2: A-Record bij Strato** (Backup Methode)

**⚠️ Gebruik deze methode alleen als:**
- Strato geen externe nameservers toestaat in jouw pakket
- Optie 1 niet werkt na 2 uur wachten
- Je specifieke DNS configuratie nodig hebt

---

## **Stap 1: DNS Zone Management**

### 1.1 Login en Ga naar Domain

Volg **Optie 1 - Stap 1 en 2** (hierboven) om bij `bikerfun.nl` te komen.

### 1.2 Open DNS Settings

In plaats van "Nameserver", zoek nu naar:
- **"DNS-Einstellungen"**
- **"DNS Settings"**
- **"Managed DNS"**
- **"DNS Records"**
- **"Zone File"**

Klik erop.

### 1.3 DNS Records Overzicht

Je ziet nu een tabel met DNS records, bijvoorbeeld:
```
Type    Name    Value               TTL
A       @       123.456.789.10     3600
CNAME   www     bikerfun.nl        3600
MX      @       mail.strato.de     3600
```

---

## **Stap 2: Verwijder Conflicterende Records**

### 2.1 Zoek Oude A-Records

**Let op:** Dit is belangrijk om conflicts te voorkomen!

Zoek records met:
- **Type:** `A`
- **Name/Host:** `@` of leeg of `bikerfun.nl`

### 2.2 Verwijder Oude A-Records

1. Klik op het **verwijder icon** (prullenbak, X, of minus)
2. Bevestig de verwijdering
3. Het record wordt verwijderd

### 2.3 Zoek Oude WWW Records

Zoek records met:
- **Type:** `CNAME` of `A`
- **Name/Host:** `www`

### 2.4 Verwijder Oude WWW Records

1. Klik op het **verwijder icon**
2. Bevestig de verwijdering

**⚠️ BELANGRIJK:** Verwijder ALLEEN records voor `@` en `www`. Laat andere records (MX, TXT, etc.) staan!

---

## **Stap 3: Voeg Vercel A-Record Toe**

### 3.1 Klik op Record Toevoegen

Zoek naar een knop:
- **"Add Record"**
- **"Neuer Eintrag"**
- **"Record toevoegen"**
- **"+"** icon

Klik erop.

### 3.2 Selecteer Record Type

1. Je ziet een dropdown of keuzemenu
2. Selecteer **"A"** (A-record)
3. Het formulier verschijnt

### 3.3 Vul A-Record In

| Veld | Nederlandse Naam | Duitse Naam | Wat Invullen |
|------|------------------|-------------|--------------|
| **Type** | Type | Typ | `A` |
| **Name/Host** | Naam / Host | Name / Host | `@` |
| **Value** | Waarde / IP-adres | Wert / IP-Adresse | `76.76.21.21` |
| **TTL** | TTL / Verlooptijd | TTL / Gültigkeitsdauer | `3600` |

**⚠️ LET OP bij Name/Host veld:**
- Sommige interfaces: type `@`
- Andere interfaces: **laat leeg** (betekent root domain)
- Weer andere: type `bikerfun.nl`

**Kies wat Strato accepteert. Meestal is `@` correct.**

### 3.4 Opslaan

1. Klik op **"Speichern"** of **"Opslaan"** of **"Save"**
2. Het record verschijnt nu in je DNS lijst

---

## **Stap 4: Voeg WWW CNAME Toe**

### 4.1 Klik Opnieuw op Record Toevoegen

Zelfde knop als bij Stap 3.1:
- **"Add Record"** / **"Neuer Eintrag"**

### 4.2 Selecteer Record Type

1. Dropdown menu
2. Selecteer **"CNAME"**
3. Formulier verschijnt

### 4.3 Vul CNAME In

| Veld | Nederlandse Naam | Duitse Naam | Wat Invullen |
|------|------------------|-------------|--------------|
| **Type** | Type | Typ | `CNAME` |
| **Name/Host** | Naam / Host | Name / Host | `www` |
| **Value** | Waarde / Doel | Wert / Ziel | `cname.vercel-dns.com` |
| **TTL** | TTL / Verlooptijd | TTL | `3600` |

**⚠️ BELANGRIJK bij Value/Target:**
- Type **exact:** `cname.vercel-dns.com`
- **Geen punt** aan het einde (`.`)
- **Geen `https://`** ervoor

### 4.4 Opslaan

1. Klik op **"Speichern"** / **"Opslaan"** / **"Save"**
2. Het CNAME record verschijnt in je lijst

---

## **Stap 5: Verifieer DNS Records**

### 5.1 Check je DNS Lijst

Na het toevoegen moet je DNS lijst er **exact** zo uitzien:

```
┌──────────┬──────┬──────────────────────┬──────┐
│   Type   │ Name │        Value         │ TTL  │
├──────────┼──────┼──────────────────────┼──────┤
│    A     │  @   │    76.76.21.21       │ 3600 │
│  CNAME   │ www  │ cname.vercel-dns.com │ 3600 │
└──────────┴──────┴──────────────────────┴──────┘
```

**Let op:**
- Andere records (MX, TXT, etc.) mogen blijven staan
- Alleen `@` en `www` records zijn aangepast

### 5.2 Geen Waarschuwingen?

Strato toont soms waarschuwingen:
- ⚠️ **"CNAME wijst naar extern domein"** → **Dit is OK!**
- ⚠️ **"Wijzigingen in behandeling"** → **Dit is OK!**

**Negeer deze waarschuwingen, ze zijn normaal.**

---

## ⏳ **Stap 6: Wachttijd & Propagatie**

### 6.1 Wat Nu?

Je DNS wijzigingen zijn **opgeslagen** maar nog **niet wereldwijd actief**.

**Wat gebeurt er:**
1. Strato verstuurt wijzigingen naar DNS netwerk
2. DNS servers wereldwijd updaten hun cache
3. Je domain wijst nu naar Vercel in plaats van oude hosting

**Geduld is key!** ☕

### 6.2 Hoe Lang Wachten?

**Bij Strato A-records (ervaringen):**
- ⚡ **Snelste:** 15-30 minuten
- 🕐 **Gemiddeld:** 30-90 minuten
- 🐢 **Langzaamste:** 2-4 uur (zeldzaam)

**⚠️ Strato is vaak iets trager dan andere providers.**

### 6.3 Eerste Check (na 30 minuten)

1. Open **incognito window** (Ctrl+Shift+N of Ctrl+Shift+P)
2. Type: `https://bikerfun.nl`
3. **Werkt het?**
   - ✅ **Ja, website laadt!** → **Gelukt! Ga naar stap 7**
   - ❌ **Nee, error of oude site** → Wacht nog 30 minuten en probeer opnieuw

### 6.4 DNS Cache Flush (Optioneel)

Als je lokale computer oude DNS cache heeft:

**Windows:**
```powershell
# Open PowerShell als Administrator
ipconfig /flushdns
```

**Mac:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
```

Dan test opnieuw in **incognito window**.

---

## ✅ **Stap 7: Verificatie**

### 7.1 Website Check

Open in **incognito window**:
```
https://bikerfun.nl
```

**✅ Check deze dingen:**
- [ ] Website laadt (geen error)
- [ ] Groene slotje in adresbalk (SSL actief)
- [ ] Homepage ziet er correct uit
- [ ] Geen "Not Secure" waarschuwing

### 7.2 WWW Redirect Check

Test ook de www-versie:
```
https://www.bikerfun.nl
```

**✅ Moet automatisch redirecten naar:**
```
https://bikerfun.nl
```

(URL in adresbalk verandert naar non-www versie)

### 7.3 HTTP Redirect Check

Test HTTP (zonder SSL):
```
http://bikerfun.nl
```

**✅ Moet automatisch redirecten naar:**
```
https://bikerfun.nl
```

(URL verandert naar HTTPS)

### 7.4 Vercel Status Check

1. Ga naar [vercel.com/dashboard](https://vercel.com/dashboard)
2. Open je project → Settings → Domains
3. Check status van `bikerfun.nl`:
   - ✅ **"Valid"** met groen vinkje
   - 🔒 **Groen slot icon** (SSL actief)

**Als alles groen is: je bent klaar!** 🎉

---

## 🐛 **Troubleshooting bij Strato**

### Probleem 1: "Externe nameservers niet beschikbaar"

**Symptoom:** Je ziet geen optie voor externe nameservers

**Oorzaak:** Je Strato pakket ondersteunt dit misschien niet

**Oplossing:**
1. **Check je pakket:** Strato Basic ondersteunt soms geen externe NS
2. **Upgrade pakket** (tijdelijk):
   - Strato → Producten → Domain upgrade
   - Of bel Strato: 074 - 700 0 800
3. **Gebruik Optie 2** (A-record + CNAME) in plaats van nameservers

---

### Probleem 2: DNS Werkt na 2 Uur Nog Niet

**Symptoom:** Na 2+ uur wachten werkt `bikerfun.nl` nog niet

**Check 1: DNS Records Correct?**
1. Login Strato
2. Domains → bikerfun.nl → DNS Settings
3. Verifieer:
   - A record: `@` → `76.76.21.21` ✅
   - CNAME: `www` → `cname.vercel-dns.com` ✅

**Check 2: Vercel Domain Toegevoegd?**
1. Vercel dashboard → Settings → Domains
2. Is `bikerfun.nl` toegevoegd? ✅

**Check 3: Typo's?**
- Nameserver: `ns1.vercel-dns.com` (niet `ns1.vercel.com`)
- CNAME: `cname.vercel-dns.com` (niet `bikerfun.vercel.app`)
- IP: `76.76.21.21` (niet `76.76.21.2`)

**Check 4: Whois Lookup**
```bash
# Online tool: https://who.is
# Zoek: bikerfun.nl
# Check: Nameservers moeten Vercel tonen
```

**Als alles klopt maar het werkt nog niet:**
- Bel Strato support: 074 - 700 0 800
- Vraag: "Waarom zijn mijn nameserver wijzigingen nog niet actief?"

---

### Probleem 3: "Certificate Error" of "Not Secure"

**Symptoom:** Website laadt maar browser toont "Not Secure" of certificaat error

**Oorzaak:** SSL certificaat nog niet gegenereerd of actief

**Oplossing:**
1. **Wacht 10-15 minuten** → SSL generatie kan even duren
2. **Check Vercel SSL status:**
   - Settings → Domains
   - Moet groen slotje tonen naast domain
3. **Force SSL renewal:**
   - Vercel → Settings → Domains
   - Klik op `bikerfun.nl`
   - Klik op **"Refresh"** of **"Renew Certificate"**
4. **Clear browser cache:**
   - Ctrl+Shift+Delete → Clear cache
   - Test opnieuw in incognito
5. **Wacht 30 minuten** en probeer opnieuw

---

### Probleem 4: Website Toont Nog Oude Content

**Symptoom:** `bikerfun.nl` laadt oude website of Strato parkeer pagina

**Oorzaak:** DNS cache of verkeerde DNS records

**Oplossing:**
1. **Flush DNS** (zie Stap 6.4 hierboven)
2. **Test in incognito** (Ctrl+Shift+N)
3. **Test op ander apparaat** (telefoon via 4G, niet WiFi)
4. **Check DNS records in Strato:**
   - Moeten naar Vercel wijzen (niet oude hosting)
5. **Check Vercel domain lijst:**
   - `bikerfun.nl` moet status "Valid" hebben

---

## 📞 **Strato Support Contactgegevens**

Als je echt vastloopt:

### Telefonisch (Nederlands)
- **Nederland:** 074 - 700 0 800
- **Tijden:** Ma-Vr: 08:00 - 22:00, Za-Zo: 10:00 - 18:00

### Telefonisch (Duits)
- **Duitsland:** 030 - 300 146 000
- **Tijden:** 24/7

### Email Support
1. Login Strato Customer Center
2. Klik op **"Support"** of **"Hilfe"**
3. Klik op **"Contact opnemen"** of **"Kontakt"**
4. Vul formulier in

### Live Chat (Als Beschikbaar)
- Rechts onderaan in Customer Center zie je soms een **chat icon**
- Klik erop voor directe hulp

### Wat Vraag Je aan Strato?

**Copy-paste deze tekst:**
```
Hallo,

Ik wil het domein bikerfun.nl naar Vercel hosting verhuizen.

Optie 1: Kan ik de nameservers wijzigen naar:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

Optie 2: Als externe nameservers niet mogelijk zijn, wil ik graag:
- A record voor @ → 76.76.21.21
- CNAME voor www → cname.vercel-dns.com

Kunnen jullie mij hiermee helpen of uitleggen hoe ik dit in mijn pakket doe?

Bedankt!
```

---

## 🎯 **Snelle Samenvatting Strato**

### Als je snel wil:

**Nameservers wijzigen (Optie 1):**
```
1. strato.nl → Login
2. Domeinen → bikerfun.nl
3. Nameserver → Externe nameservers
4. ns1.vercel-dns.com + ns2.vercel-dns.com
5. Opslaan → Wachten 30-60 min
```

**A-record methode (Optie 2):**
```
1. strato.nl → Login
2. Domeinen → bikerfun.nl → DNS Settings
3. Verwijder oude @ en www records
4. Add A: @ → 76.76.21.21
5. Add CNAME: www → cname.vercel-dns.com
6. Opslaan → Wachten 30-60 min
```

---

## ✅ **Verificatie Checklist**

Na DNS configuratie, check deze punten:

### DNS Actief:
- [ ] `https://bikerfun.nl` laadt website (niet error)
- [ ] `https://www.bikerfun.nl` redirect naar bikerfun.nl
- [ ] Vercel dashboard: `bikerfun.nl` status = "Valid" ✅

### SSL Actief:
- [ ] Groene slotje in browser adresbalk 🔒
- [ ] `http://bikerfun.nl` redirect naar `https://bikerfun.nl`
- [ ] Geen certificaat errors
- [ ] Vercel dashboard: SSL icon groen

### Website Werkt:
- [ ] Homepage laadt correct
- [ ] Occasions pagina werkt (`/aanbod`)
- [ ] Webshop werkt (`/products`)
- [ ] Geen console errors (F12)

**Als alle checkboxes ✅ zijn: SUCCESS!** 🎉

---

## 🔄 **Wat Daarna?**

Na succesvolle DNS configuratie:

### **Stap 1: Environment Variable Updaten**
1. Vercel → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_APP_URL` → `https://bikerfun.nl`
3. Save
4. **Redeploy!** (Deployments → laatste deployment → Redeploy)

### **Stap 2: Mollie Webhook**
1. Mollie Dashboard → Developers → Webhooks
2. URL: `https://bikerfun.nl/api/webhooks/mollie`
3. Save

### **Stap 3: Complete Test**
- Test checkout flow
- Check email ontvangst
- Verifieer WooCommerce sync

---

## 📧 **Vragen over Deze Handleiding?**

- Iets onduidelijk? Stuur screenshot!
- Stuk overslaan? Vraag om verduidelijking!
- Fout tegengekomen? Deel error message!

---

## 📄 **Printvriendelijke Versie**

Voor een printvriendelijke versie om naast je computer te leggen:
1. Open deze file in browser of text editor
2. Ctrl+P (Print)
3. Save as PDF of print

---

**Succes met het instellen bij Strato! Je gaat dit makkelijk fixen! 💪**

---

## 🏷️ **Quick Reference Card**

```
═══════════════════════════════════════════════════
  STRATO DNS CONFIGURATIE - QUICK REFERENCE
═══════════════════════════════════════════════════

Domain: bikerfun.nl
Provider: Strato
Doel: Vercel hosting

─────────────────────────────────────────────────
OPTIE 1: NAMESERVERS (Aanbevolen)
─────────────────────────────────────────────────
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com

─────────────────────────────────────────────────
OPTIE 2: DNS RECORDS (Backup)
─────────────────────────────────────────────────
A Record:
  Name: @
  Value: 76.76.21.21
  TTL: 3600

CNAME Record:
  Name: www
  Value: cname.vercel-dns.com
  TTL: 3600

─────────────────────────────────────────────────
STRATO SUPPORT
─────────────────────────────────────────────────
Telefoon NL: 074 - 700 0 800
Telefoon DE: 030 - 300 146 000

─────────────────────────────────────────────────
VERCEL VERIFY
─────────────────────────────────────────────────
Check: vercel.com/dashboard
Status: bikerfun.nl moet "Valid" zijn ✅
SSL: Groen slotje icon 🔒

═══════════════════════════════════════════════════
```

Print deze card en leg naast je computer! 📋

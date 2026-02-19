# DNS Records Toevoegen bij Strato - Email Configuratie

## 📧 Waarom deze stappen?

Deze DNS records zijn nodig om emails te kunnen versturen vanaf de Bikerfun website (contactformulier, motor aanvragen, etc.).

**Geschatte tijd:** 10-15 minuten  
**Wachttijd tot actief:** 1-24 uur (meestal binnen 2 uur)

---

## 🔐 Stap 1: Inloggen bij Strato

1. Ga naar: **https://www.strato.nl**
2. Klik rechtsboven op **"Login"**
3. Log in met je Strato account gegevens
4. Ga naar **"Mijn Producten"** of **"Domeinen"**

---

## 🌐 Stap 2: DNS Beheer Openen

1. Zoek in de lijst naar je domein: **bikerfun.nl**
2. Klik op het domein om de instellingen te openen
3. Zoek naar een van deze opties:
   - **"DNS Instellingen"**
   - **"DNS Beheer"**
   - **"Domeinbeheer"** → **"DNS Records"**
4. Je ziet nu een lijst met bestaande DNS records

---

## ➕ Stap 3: Voeg de 3 Records Toe

Je moet **3 nieuwe records** toevoegen. Klik steeds op **"Nieuw Record"** of **"Record toevoegen"**.

---

### ✅ Record 1: DKIM (TXT Record)

**Doel:** Digitale handtekening voor emails

| Veld | Waarde |
|------|--------|
| **Type** | `TXT` |
| **Host/Naam** | `resend._domainkey` |
| **Waarde/Content** | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7+Yfhcd2mOsx7Gx+Wpz8YUynlGYhj15YB9RBiqqG3LW/E0CrH53S19t2fDazyY5zecnXDYHXfMRHpYFkoOzo3YuSn2rwieo3vXIRlkROAB8Of47V1OL+k+c5MpEH6JYhadPyBTjGCE26126FnGfU8N4Vj0lE2Xfp7GZx2MqkXvQIDAQAB` |
| **TTL** | `Auto` (of `3600`) |

**Let op:**
- Host naam is precies: `resend._domainkey` (met punt tussen resend en _domainkey)
- Kopieer de hele Waarde zonder spaties aan het begin of einde
- Als Strato automatisch `.bikerfun.nl` toevoegt, is dat prima

---

### ✅ Record 2: SPF Mail Server (MX Record)

**Doel:** Vertelt waar emails vandaan komen

| Veld | Waarde |
|------|--------|
| **Type** | `MX` |
| **Host/Naam** | `send` |
| **Waarde/Content** | `feedback-smtp.eu-west-1.amazonses.com` |
| **Prioriteit** | `10` |
| **TTL** | `Auto` (of `3600`) |

**Let op:**
- Host naam is precies: `send` (zonder verdere domeinnaam)
- Prioriteit moet `10` zijn

---

### ✅ Record 3: SPF Policy (TXT Record)

**Doel:** Authorisatie voor email verzenden

| Veld | Waarde |
|------|--------|
| **Type** | `TXT` |
| **Host/Naam** | `send` |
| **Waarde/Content** | `v=spf1 include:amazonses.com ~all` |
| **TTL** | `Auto` (of `3600`) |

**Let op:**
- Host naam is precies: `send` (zonder verdere domeinnaam)
- Waarde begint met `v=spf1`

---

## 💾 Stap 4: Opslaan

1. Controleer of alle 3 de records correct zijn ingevoerd
2. Klik op **"Opslaan"** of **"Bevestigen"**
3. Je ziet een bevestiging dat de records zijn toegevoegd

---

## ⏱️ Stap 5: Wachten op Activatie

**Wat gebeurt er nu?**

DNS wijzigingen worden wereldwijd doorgevoerd. Dit duurt meestal:
- **Minimaal:** 30 minuten
- **Gemiddeld:** 1-2 uur
- **Maximaal:** 24 uur

**Je hoeft niets meer te doen!** De records worden automatisch actief.

---

## ✅ Verificatie (optioneel)

Na 2-3 uur kun je controleren of het werkt:

1. Ga naar een online DNS checker zoals:
   - https://mxtoolbox.com/SuperTool.aspx
   - https://dnschecker.org

2. Zoek op:
   - `resend._domainkey.bikerfun.nl` (TXT record)
   - `send.bikerfun.nl` (MX en TXT records)

3. Als je de waarden ziet die je hebt ingevoerd = ✅ Gelukt!

---

## ❓ Problemen?

### "Ik kan DNS records niet vinden/bewerken"

**Oplossing:**
- Zoek naar **"Pakket Beheer"** of **"Webhosting Instellingen"**
- Kijk in het menu voor **"Geavanceerde instellingen"**
- Bel Strato support: 030 799 00 00

### "Er staat al een record met dezelfde naam"

**Oplossing:**
- Verwijder het oude record eerst
- Of: Bewerk het bestaande record met de nieuwe waarde

### "Strato voegt automatisch mijn domein toe"

**Bijvoorbeeld:** Je voert `send` in, maar Strato maakt er `send.bikerfun.nl` van

**Oplossing:**
- Dat is correct! Laat het zo staan
- Gebruik gewoon `send` als host naam (niet `send.bikerfun.nl`)

### "Na 24 uur nog steeds niet actief"

**Oplossing:**
1. Controleer of je de juiste waarden hebt gebruikt (geen typfouten)
2. Controleer of de records niet per ongeluk zijn verwijderd
3. Neem contact op met Strato support

---

## 📞 Strato Support

**Telefoonnummer:** 030 799 00 00  
**Tijden:** Ma-Vr 08:00-22:00, Za-Zo 10:00-18:00  
**Email:** info@strato.nl

Vertel hen: *"Ik wil 3 DNS records toevoegen voor email configuratie (DKIM en SPF)"*

---

## ✉️ Na Activatie

Zodra de DNS records actief zijn:
- De website kan automatisch emails versturen
- Contactformulieren werken
- Motor aanvragen worden verstuurd
- Je ontvangt notificaties op je email

**Je hoeft zelf niets meer te doen!**

---

**Vragen?** Neem contact op met je webdeveloper.

**Document versie:** 1.0 - Bikerfun Website  
**Datum:** Februari 2026

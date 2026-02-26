# 📧 Email DNS Configuratie - Analyse & Fix

## 📊 Huidige Situatie

### ✅ WooCommerce Emails (StackMail)
```
bikerfun.nl MX → mx.stackmail.com (prioriteit 10)
SPF: v=spf1 include:spf.stackmail.com a mx -all
DKIM: s1._domainkey.bikerfun.nl
imap/smtp/pop3 → stackmail.com
```

**Status:** ✅ Perfect geconfigureerd - blijft exact hetzelfde werken!

---

### ⚠️ Contact Formulier Emails (Resend)

**Huidige configuratie:**
```
send.bikerfun.nl MX → feedback-smtp.eu-west-1.amazonses.com
send.bikerfun.nl SPF → v=spf1 include:amazonses.com ~all
resend._domainkey.bikerfun.nl → DKIM key
```

**Potentieel probleem:** `send.bikerfun.nl` heeft een MX record, maar Resend werkt meestal beter met TXT records op het hoofddomein.

---

## 🔍 Resend DNS Requirements

Resend (via Amazon SES) verwacht normaal:

1. **DKIM Record** (TXT) - ✅ AL GECONFIGUREERD
   ```
   resend._domainkey.bikerfun.nl TXT p=MIGfMA0GCS...
   ```

2. **SPF Record** (TXT) - ⚠️ MOET OP HOOFDDOMEIN
   ```
   bikerfun.nl TXT v=spf1 include:spf.stackmail.com include:amazonses.com a mx -all
   ```

3. **DMARC Record** (TXT) - ✅ AL GECONFIGUREERD
   ```
   _dmarc.bikerfun.nl TXT v=DMARC1;p=none;...
   ```

---

## ❌ Probleem Met Huidige Setup

### Conflict: Twee SPF Records

**Huidig:**
```
bikerfun.nl TXT → v=spf1 include:spf.stackmail.com a mx -all
send.bikerfun.nl TXT → v=spf1 include:amazonses.com ~all
```

**Probleem:** 
- Als Resend emails stuurt vanaf `noreply@bikerfun.nl` of `info@bikerfun.nl`
- Dan checkt de ontvangende mailserver de SPF van `bikerfun.nl`
- Maar daar staat NIET `include:amazonses.com`!
- Resultaat: Emails kunnen als spam worden gemarkeerd of geblokkeerd ❌

---

## ✅ Oplossing: Gecombineerde SPF

### Wijzig Hoofddomein SPF Record

**Van:**
```
bikerfun.nl TXT v=spf1 include:spf.stackmail.com a mx -all
```

**Naar:**
```
bikerfun.nl TXT v=spf1 include:spf.stackmail.com include:amazonses.com a mx -all
```

**Effect:**
- ✅ StackMail emails blijven werken (WooCommerce)
- ✅ Amazon SES/Resend emails werken ook (Contact formulieren)
- ✅ Allebei geautoriseerd!

---

## 🗑️ Optioneel: Opruimen

De `send.bikerfun.nl` records zijn waarschijnlijk niet nodig:

### Kunnen verwijderd worden (als Resend met hoofddomein werkt):
```
❌ send.bikerfun.nl MX → feedback-smtp.eu-west-1.amazonses.com
❌ send.bikerfun.nl TXT → v=spf1 include:amazonses.com ~all
```

### Moeten blijven:
```
✅ resend._domainkey.bikerfun.nl TXT → (DKIM key)
```

---

## 🔧 Wat Te Doen

### Stap 1: Update SPF Record in Vercel

1. **Ga naar:** Vercel Dashboard → Domains → bikerfun.nl → DNS
2. **Zoek:** TXT record voor `bikerfun.nl` met SPF
3. **Wijzig value naar:**
   ```
   v=spf1 include:spf.stackmail.com include:amazonses.com a mx -all
   ```
4. **Save**

---

### Stap 2: Test Email Configuratie

#### Test WooCommerce Emails:
- Plaats test order
- Check of bevestigingsmail arriveert
- Check spam folder

#### Test Contact Formulier:
- Stuur test bericht via contact form
- Check of email bij info@bikerfun.nl aankomt
- Check spam folder

---

### Stap 3: Configureer Resend FROM Address

In Vercel environment variables:

```
RESEND_FROM_EMAIL=noreply@bikerfun.nl
```

**OF:**

```
RESEND_FROM_EMAIL=info@bikerfun.nl
```

**NIET:**
```
❌ RESEND_FROM_EMAIL=noreply@send.bikerfun.nl
```

Want `send.bikerfun.nl` heeft geen webmail/inbox geconfigureerd.

---

## 📧 Email Flow Overview

### WooCommerce Orders:
```
Order geplaatst
    ↓
WooCommerce stuurt email
    ↓
Via server's mail functie (StackMail)
    ↓
SPF check: spf.stackmail.com ✅
    ↓
Email arriveert bij klant
```

### Contact Formulier:
```
Formulier verzonden
    ↓
Next.js server action
    ↓
Resend API (Amazon SES)
    ↓
SPF check: amazonses.com ✅ (na SPF update!)
DKIM check: resend._domainkey ✅
    ↓
Email arriveert bij info@bikerfun.nl
```

---

## ⚠️ Belangrijke Notities

### 1. SPF Lookup Limit
SPF heeft een limiet van 10 DNS lookups. Onze configuratie gebruikt:
- `spf.stackmail.com` (1 lookup)
- `amazonses.com` (1 lookup)
- `a` (1 lookup)
- `mx` (1 lookup)

**Totaal: 4 lookups** ✅ (Ruim binnen limiet)

### 2. DMARC Policy
```
_dmarc.bikerfun.nl TXT v=DMARC1;p=none;...
```

Policy `p=none` betekent: monitoren maar niet blokkeren.

**Dit is goed voor nu!** Later kunnen we strengere policy instellen (`p=quarantine` of `p=reject`).

### 3. Email Deliverability
Om spam te voorkomen:
- ✅ SPF correct (na update)
- ✅ DKIM geconfigureerd
- ✅ DMARC ingesteld
- ✅ Gebruik professionele "from" adressen (geen @gmail.com)
- ✅ Gebruik bestaande domein (niet nieuwe subdomain)

---

## 🎯 Actie Items

### Voor Jou (In Vercel):
- [ ] Update SPF TXT record voor bikerfun.nl
- [ ] Voeg `include:amazonses.com` toe
- [ ] Save en wacht 10 minuten

### Voor IT'er:
- [ ] Check of send.bikerfun.nl records echt nodig zijn
- [ ] Optioneel: verwijder send.bikerfun.nl MX/TXT records (test eerst!)

### Testing:
- [ ] Test WooCommerce email (order bevestiging)
- [ ] Test contact formulier
- [ ] Check spam folders
- [ ] Verificeer SPF/DKIM met mail-tester.com

---

## 🧪 Email Testing Tools

### Mail Tester
https://www.mail-tester.com

Stuur test email naar het gegeven adres, krijg score van 1-10.

### MXToolbox
https://mxtoolbox.com/SuperTool.aspx

Check:
- SPF: `spf:bikerfun.nl`
- DKIM: `dkim:bikerfun.nl:resend`
- DMARC: `dmarc:bikerfun.nl`

---

## ✅ Verwachte Eindresultaat

```
✅ bikerfun.nl
   ├─ MX → mx.stackmail.com (WooCommerce emails)
   ├─ SPF → include:spf.stackmail.com + amazonses.com
   ├─ DMARC → configured
   └─ DKIM
       ├─ s1._domainkey (StackMail)
       └─ resend._domainkey (Resend/SES)

✅ WooCommerce emails → Werken via StackMail
✅ Contact form emails → Werken via Resend/Amazon SES
✅ Beide SPF-approved
✅ Beide DKIM-signed
✅ Goede deliverability score
```

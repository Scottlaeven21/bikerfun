# 📧 Resend DNS Setup voor IT'er

## Doel
We willen emails kunnen versturen vanaf de Bikerfun website (contactformulier) via Resend.com.

---

## ⚠️ Wat moet er gebeuren?

Er moeten **DNS records** worden toegevoegd aan het domein `bikerfun.nl` bij **Strato**.

---

## 📋 Welke DNS Records?

In Resend.com staan de **exacte records** die moeten worden toegevoegd:

1. **Ga naar:** https://resend.com/domains
2. **Login met:** [account van Scott]
3. **Klik op:** `bikerfun.nl`
4. **Kopieer de DNS records** die daar staan

---

## 🔧 DNS Records die toegevoegd moeten worden

### 1. **SPF Record (TXT)**

Resend geeft je een TXT record zoals:

```
Type: TXT
Name: @ (of bikerfun.nl)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (of default)
```

**Let op:** Als er al een SPF record bestaat, moet `include:_spf.resend.com` worden **toegevoegd** aan het bestaande record, niet vervangen!

**Voorbeeld als er al een SPF record is:**
```
Oud: v=spf1 include:strato.de ~all
Nieuw: v=spf1 include:strato.de include:_spf.resend.com ~all
```

---

### 2. **DKIM Record (TXT of CNAME)**

Resend geeft je een DKIM record zoals:

```
Type: CNAME (of TXT)
Name: resend._domainkey (of iets als rs20240101._domainkey)
Value: rs20240101.domainkey.resend.com.
TTL: 3600 (of default)
```

**Belangrijk:** Let op de **punt** aan het einde van de Value bij CNAME records!

---

### 3. **MX Record (Optioneel)**

Dit is **ALLEEN** nodig als we emails willen **ontvangen** op @bikerfun.nl via Resend.

Voor **alleen versturen** (contactformulier) is dit **NIET verplicht**.

Als Resend dit toch vraagt:
```
Type: MX
Name: @ (of bikerfun.nl)
Value: feedback-smtp.eu-central-1.amazonses.com
Priority: 10
TTL: 3600
```

**⚠️ Overleg eerst:** MX records wijzigen kan bestaande email ontvangst verstoren!

---

## ⏱️ Hoe lang duurt dit?

- **DNS propagatie:** 15 minuten tot 48 uur
- **Gemiddeld:** 1-4 uur
- **Check status:** In Resend dashboard verschijnt een ✅ als records correct zijn

---

## ✅ Verificatie

Na het toevoegen van de DNS records:

1. Wacht 15-30 minuten
2. Ga naar: https://resend.com/domains
3. Klik **"Verify"** bij `bikerfun.nl`
4. Als alles correct is → Status wordt "Verified" ✅

---

## 🔧 DNS Provider: Strato

### Waar voeg je DNS records toe bij Strato?

1. Log in op: https://www.strato.nl/apps/CustomerService
2. Ga naar: **Domeinen** of **DNS Beheer**
3. Klik op: `bikerfun.nl`
4. Zoek naar: **DNS Instellingen** of **DNS Zone Editor**
5. Voeg de records toe zoals hierboven beschreven

---

## 🆘 Hulp nodig?

### Optie 1: Screenshot vanuit Resend
Scott kan inloggen op Resend en een screenshot maken van de exacte DNS records.

### Optie 2: Resend Support
Resend heeft goede support: https://resend.com/support

### Optie 3: Alternatief (zonder DNS wijzigingen)
Als DNS wijzigingen niet mogelijk zijn, kunnen we:
- Een Gmail SMTP gebruiken (minder betrouwbaar)
- Een ander email service account gebruiken
- Emails doorsturen via een bestaande bedrijfsmail

---

## 📧 Vragen?

Neem contact op met Scott of check de Resend documentatie:
https://resend.com/docs/dashboard/domains/introduction

---

## 🎯 Verwacht resultaat

Na correcte DNS setup kan de Bikerfun website:
- ✅ Contactformulier emails versturen naar info@bikerfun.nl
- ✅ Automatische bevestigingsmails versturen naar klanten
- ✅ Motor aanvraag notificaties versturen

**Van adres:** noreply@bikerfun.nl of info@bikerfun.nl
**Naar adres:** info@bikerfun.nl (of elk ander gewenst adres)

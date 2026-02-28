# 📧 StackMail SMTP Setup voor Bikerfun Contactformulier

## ✅ Wat is het doel?

Het contactformulier op bikerfun.nl moet emails kunnen versturen via **StackMail** (de bestaande email hosting).

---

## 🔧 Benodigde SMTP Gegevens van IT'er

De IT'er moet de volgende **SMTP inloggegevens** aanleveren:

### 1. **SMTP Host**
- Bijvoorbeeld: `smtp.stackmail.com` of `mail.bikerfun.nl`
- Dit is de server die emails verstuurt

### 2. **SMTP Port**
- **587** (TLS/STARTTLS) - meest gebruikelijk ✅
- **465** (SSL) - ook mogelijk
- **25** (onbeveiligd) - niet aanbevolen

### 3. **SMTP User**
- Bijvoorbeeld: `noreply@bikerfun.nl` of `info@bikerfun.nl`
- Het email account dat gebruikt wordt om te versturen

### 4. **SMTP Password**
- Het wachtwoord van bovenstaande email account

### 5. **SSL/TLS Setting**
- **false** als port 587 (STARTTLS)
- **true** als port 465 (SSL)

---

## 📋 Email Adressen Setup

Je moet ook bepalen:

### Van Adres (FROM)
- **Optie 1:** `noreply@bikerfun.nl` (geen antwoorden)
- **Optie 2:** `info@bikerfun.nl` (klanten kunnen antwoorden)
- **Aanbeveling:** Gebruik `info@bikerfun.nl` zodat klanten direct kunnen antwoorden

### Naar Adres (TO)
- Waar moeten contactformulier berichten naartoe?
- Meestal: `info@bikerfun.nl`

---

## 🔑 Environment Variables (voor Vercel)

Zodra je de SMTP gegevens hebt van de IT'er, voeg deze toe aan **Vercel**:

### Ga naar:
```
https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables
```

### Voeg de volgende variabelen toe:

```env
SMTP_HOST=smtp.bikerfun.nl
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@bikerfun.nl
SMTP_PASSWORD=[wachtwoord van email account]
SMTP_FROM_EMAIL=info@bikerfun.nl
SMTP_TO_EMAIL=info@bikerfun.nl
```

**Let op:**
- Alle 7 variabelen zijn **verplicht**
- Vink **Production + Preview + Development** aan
- Na opslaan triggert automatisch een nieuwe deployment

---

## 🧪 Lokaal Testen (optioneel)

Om lokaal te testen, voeg toe aan `.env.local`:

```env
# StackMail SMTP Configuration
SMTP_HOST=smtp.stackmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@bikerfun.nl
SMTP_PASSWORD=jouw_wachtwoord_hier
SMTP_FROM_EMAIL=info@bikerfun.nl
SMTP_TO_EMAIL=info@bikerfun.nl
```

Test met:
```bash
npx tsx scripts/test-email-config.ts
```

---

## 📧 Wat werkt na setup?

Na correcte SMTP setup werken:
- ✅ Contactformulier op bikerfun.nl
- ✅ Motor aanvraag formulieren
- ✅ Automatische bevestigingsmails naar klanten

**Voorbeeld flow:**
1. Klant vult contactformulier in
2. Email wordt verstuurd **vanaf** `info@bikerfun.nl`
3. Email komt aan **bij** `info@bikerfun.nl`
4. Klant ontvangt automatisch een bevestigingsmail

---

## 🆘 Veelgestelde vragen voor IT'er

### Q: Waar vind ik de SMTP gegevens?
**A:** In StackCP hosting panel → Email Accounts → Klik op `info@bikerfun.nl` → SMTP instellingen

### Q: Welke port moet ik gebruiken?
**A:** Port 587 met STARTTLS is de standaard en meest veilige optie.

### Q: Kan ik een bestaand email account gebruiken?
**A:** Ja! Je kunt `info@bikerfun.nl` gebruiken om emails te versturen EN te ontvangen.

### Q: Hoeveel emails kan ik versturen?
**A:** Afhankelijk van je hosting plan. Meestal 500-1000 emails per dag voor kleine websites.

### Q: Is dit veiliger dan Resend?
**A:** Beide zijn veilig. StackMail is praktischer omdat je geen externe service nodig hebt en het al gehost is.

---

## ⚙️ Technische Details

### SMTP Configuratie Voorbeeld (StackMail/StackCP):

```
Host: smtp.bikerfun.nl
Port: 465
Encryption: SSL
Authentication: Yes
Username: info@bikerfun.nl
Password: [jouw email wachtwoord]
```

**Alternatief (non-SSL):**

```
Host: smtp.bikerfun.nl
Port: 587
Encryption: STARTTLS
Authentication: Yes
Username: info@bikerfun.nl
Password: [jouw email wachtwoord]
```

---

## 🔒 Security Best Practices

1. **Gebruik een sterk wachtwoord** voor het email account
2. **Deel SMTP credentials NOOIT** in Git of publieke code
3. **Gebruik alleen Environment Variables** in Vercel
4. **Enable 2FA** op het email account indien mogelijk

---

## 🚀 Deployment Flow

1. IT'er levert SMTP gegevens aan
2. Jij voegt credentials toe aan Vercel Environment Variables
3. Vercel triggert automatisch nieuwe deployment
4. Test contactformulier op live site
5. Check of emails binnenkomen bij info@bikerfun.nl

---

## 📞 Contact

Voor vragen over de SMTP setup:
- **IT'er:** Voor StackMail/StackCP inloggegevens
- **Scott:** Voor Vercel environment variables en code

---

## ✅ Checklist

- [ ] SMTP gegevens ontvangen van IT'er
- [ ] `SMTP_HOST` toegevoegd aan Vercel
- [ ] `SMTP_PORT` toegevoegd aan Vercel
- [ ] `SMTP_SECURE` toegevoegd aan Vercel
- [ ] `SMTP_USER` toegevoegd aan Vercel
- [ ] `SMTP_PASSWORD` toegevoegd aan Vercel
- [ ] `SMTP_FROM_EMAIL` toegevoegd aan Vercel
- [ ] `SMTP_TO_EMAIL` toegevoegd aan Vercel
- [ ] Vercel deployment succesvol
- [ ] Contactformulier getest op live site
- [ ] Email ontvangen bij info@bikerfun.nl

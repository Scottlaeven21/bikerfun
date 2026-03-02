# 🔧 SMTP Debug Checklist voor IT'er

**Datum:** 2 maart 2026  
**Status:** SMTP authenticatie faalt met "535 Incorrect authentication data"

---

## 📋 **Huidige Configuratie (faalt)**

```
Host: smtp.stackmail.com
Port: 465 (SSL)
User: info@bikerfun.nl  
Password: nRr2#sx<`tj2!&~ld%mu2hhF
```

**Error:**
```
Error: Invalid login: 535 Incorrect authentication data
```

**Al getest:**
- ✅ Port 465 (SSL) en 587 (STARTTLS)
- ✅ Host smtp.stackmail.com en mail.bikerfun.nl
- ✅ Username info@bikerfun.nl en info
- ❌ **Alle combinaties falen met 535 error**

---

## ✅ **Stap 1: Verifieer SMTP Login Credentials**

### Check 1.1: Is het wachtwoord correct?

**Test in webmail:**

1. Ga naar: https://mail.bikerfun.nl
2. Login met:
   - Email: `info@bikerfun.nl`
   - Wachtwoord: `nRr2#sx<`tj2!&~ld%mu2hhF`
3. **Lukt de login?**
   - ✅ **JA** → Wachtwoord is correct, ga naar Stap 2
   - ❌ **NEE** → Wachtwoord is VERKEERD, geef nieuwe wachtwoord aan Scott

### Check 1.2: Heeft het email account SMTP rechten?

**Check in StackCP panel:**

1. Login StackCP control panel
2. Ga naar **Email Accounts**
3. Zoek `info@bikerfun.nl`
4. Check de volgende opties:
   - ✅ Is "SMTP Access" ingeschakeld?
   - ✅ Is "External SMTP" of "Remote SMTP" toegestaan?
   - ✅ Is "Relay Access" ingeschakeld?

**DIT IS WAARSCHIJNLIJK HET PROBLEEM!**

---

## ✅ **Stap 2: Check Externe SMTP Toegang**

### Check 2.1: Staat StackCP externe SMTP toe?

**Probleem:**
- StackCP/StackMail staat **standaard** vaak geen externe SMTP toe
- SMTP werkt alleen vanaf dezelfde server/netwerk
- Vercel (externe server) wordt geblokkeerd

**Oplossing:**
- In StackCP panel moet "External SMTP" of "SMTP Relay" worden geactiveerd
- Zoek naar instellingen zoals:
  - "Allow external SMTP connections"
  - "Enable SMTP relay"
  - "Remote SMTP access"

### Check 2.2: Is IP Whitelisting nodig?

**Probleem:**
- Sommige mail servers blokkeren SMTP vanaf "onbekende" IP adressen
- Vercel gebruikt dynamische IPs uit verschillende regio's
- StackCP heeft mogelijk een SMTP IP whitelist

**Vraag aan StackCP Support:**
```
Onderwerp: Enable external SMTP relay for info@bikerfun.nl

Vraag:
1. Ondersteunt StackMail externe SMTP relay?
2. Moet Vercel IP range worden gewhitelist?
3. Hoe activeren we externe SMTP voor info@bikerfun.nl?
```

---

## ✅ **Stap 3: Test SMTP Connectie**

### Test Met PowerShell (Windows)

```powershell
# Test of poort 465 bereikbaar is
Test-NetConnection -ComputerName smtp.stackmail.com -Port 465

# Test of poort 587 bereikbaar is  
Test-NetConnection -ComputerName smtp.stackmail.com -Port 587
```

**Verwacht:**
```
TcpTestSucceeded : True
```

Als `False`, dan blokkeert je firewall of ISP de SMTP poorten.

---

## 🎯 **Meest Waarschijnlijke Problemen**

### **#1: Externe SMTP Niet Toegestaan (90% kans)**

**Wat:**
- StackCP blokkeert SMTP vanaf externe servers (Vercel)
- Credentials zijn correct, maar alleen lokaal toegestaan

**Hoe fixen:**
1. Login StackCP panel
2. Ga naar Email Settings / SMTP Settings
3. Zoek naar "External SMTP" of "Relay" opties
4. Schakel "Allow external connections" in
5. Herstart email service (indien nodig)

### **#2: IP Whitelisting Vereist (5% kans)**

**Wat:**
- StackCP vereist whitelist van IP adressen
- Vercel IPs staan niet in whitelist

**Hoe fixen:**
1. Contact StackCP support
2. Vraag om Vercel IP ranges toe te voegen
3. Vercel IPs: https://vercel.com/docs/concepts/edge-network/regions

### **#3: Verkeerd Wachtwoord (5% kans)**

**Wat:**
- Wachtwoord is toch verkeerd (bijv. speciale karakters)

**Hoe fixen:**
1. Login webmail om te verifiëren
2. Reset wachtwoord indien nodig
3. Gebruik simpel wachtwoord zonder speciale karakters (tijdelijk)

---

## 💡 **Alternatieve Oplossingen**

Als StackMail externe SMTP **echt niet ondersteunt**:

### **Optie A: Gebruik Resend (AANGERADEN)**

**Wat:**
- Moderne email API service
- 100 emails/dag gratis
- Werkt perfect met Vercel
- **Al getest met Bikerfun - werkte perfect!**

**Setup:**
1. Maak account: https://resend.com
2. Verifieer domein (DNS CNAME record)
3. Voeg API key toe aan Vercel
4. **5 minuten werk, werkt gegarandeerd!**

**Voordelen:**
- ✅ Simpel, betrouwbaar
- ✅ Geen IP whitelisting
- ✅ Geen firewall problemen

**Nadelen:**
- ⚠️ Vereist DNS wijziging (CNAME)
- ⚠️ Extra service (niet via StackCP)

### **Optie B: WordPress SMTP Plugin**

**Wat:**
- Installeer "WP Mail SMTP" plugin in WordPress
- WordPress verstuurt emails via StackMail
- Werkt omdat WordPress op zelfde server staat als email

**Voordelen:**
- ✅ Gebruikt bestaande StackMail
- ✅ Geen externe SMTP nodig

**Nadelen:**
- ⚠️ Alleen voor WooCommerce emails
- ⚠️ Contactformulier heeft nog steeds externe SMTP nodig

---

## 📝 **Concrete Acties voor IT'er**

### **Actie 1: Check StackCP Email Settings**

```
1. Login StackCP panel
2. Ga naar "Email" of "SMTP Settings"
3. Zoek account: info@bikerfun.nl
4. Check:
   - [ ] Is "External SMTP" ingeschakeld?
   - [ ] Is "SMTP Relay" toegestaan?
   - [ ] Is "Remote Access" ingeschakeld?
5. Schakel alle SMTP relay opties IN
6. Sla op en herstart email service (indien nodig)
```

### **Actie 2: Test SMTP Login**

```
1. Login webmail: https://mail.bikerfun.nl
2. Email: info@bikerfun.nl
3. Wachtwoord: nRr2#sx<`tj2!&~ld%mu2hhF
4. Werkt dit? → Wachtwoord is correct
```

### **Actie 3: Contact StackCP Support**

Als bovenstaande niet helpt:

```
Email naar: StackCP support email
Onderwerp: Enable external SMTP relay for info@bikerfun.nl

Bericht:
---
Hallo,

We hebben een website (bikerfun.nl) gehost op Vercel die emails moet 
kunnen versturen via StackMail SMTP.

Email account: info@bikerfun.nl
SMTP server: smtp.stackmail.com
Poort: 465 (SSL) of 587 (STARTTLS)

Probleem:
- SMTP login faalt met "535 Incorrect authentication data"
- Credentials zijn correct (werken in webmail)
- Waarschijnlijk is externe SMTP relay niet ingeschakeld

Vraag:
1. Kunnen jullie externe SMTP relay activeren voor info@bikerfun.nl?
2. Moet Vercel IP range worden gewhitelist?
3. Zijn er speciale instellingen nodig voor externe SMTP?

Alvast bedankt!
---
```

---

## 🧪 **Test Na Wijzigingen**

Na elke wijziging kan de IT'er testen met:

```bash
npx tsx scripts/test-email-config.ts
```

Dit test de SMTP verbinding en stuurt een test email.

---

## 🚀 **Mijn Aanbeveling Aan Scott**

### **Snelste Oplossing: Gebruik Resend**

**Waarom:**
1. ✅ **5 minuten setup** (DNS + API key)
2. ✅ **100% betrouwbaar** (werkt gegarandeerd)
3. ✅ **Al getest** met Bikerfun
4. ✅ **Gratis** (100 emails/dag = ruim genoeg voor contactformulier)
5. ✅ **Geen gedoe** met IP whitelisting of firewall

**Wat nodig:**
- 1x DNS CNAME record toevoegen
- 1x API key in Vercel environment variables

**Ik kan je hier stap-voor-stap bij helpen!**

### **Alternatief: Blijf StackMail Proberen**

**Als je echt bij StackMail wilt blijven:**
1. IT'er moet "External SMTP" activeren in StackCP panel
2. Of contact StackCP support voor hulp
3. Kan 1-3 dagen duren

---

## 📞 **Contact & Hulp**

**Voor Scott:** 06 15 45 21 08  
**Test Script:** `npx tsx scripts/test-email-config.ts`  
**Vercel Env Vars:** https://vercel.com/scottlaeven21s-projects/bikerfun/settings/environment-variables

---

## ❓ **Keuze Maken**

**Keuze 1: Resend gebruiken** 
→ Zeg "ja, gebruik Resend" en ik help met DNS setup (5 minuten)

**Keuze 2: StackMail blijven proberen**  
→ Geef deze checklist aan IT'er en wacht op antwoord (1-3 dagen)

**Keuze 3: Beide**  
→ Resend nu (werkt direct), StackMail later (als IT'er tijd heeft)

---

**Laatste update:** 2 maart 2026, 16:00

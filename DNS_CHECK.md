# DNS Check voor mail.bikerfun.nl

## Wat ik zag in je eerdere DNS screenshot:

```
mail.bikerfun.nl → CNAME → webmail.stackcp.com.
```

Deze CNAME record **bestaat al** in je DNS!

---

## ⚠️ BELANGRIJK: Verschil tussen Webmail en SMTP

### **mail.bikerfun.nl** (CNAME naar webmail.stackcp.com)
- Dit is voor **webmail toegang** (inloggen in browser)
- **NIET** voor SMTP verzenden vanaf server
- Gebruikt door: Gebruikers die hun email via web willen checken

### **smtp.stackmail.com** (SMTP server)
- Dit is voor **SMTP verzenden** vanaf servers (Vercel)
- **WEL** voor contactformulier emails
- Gebruikt door: Website om emails te versturen

---

## ✅ Conclusie:

Voor het contactformulier moet je **`smtp.stackmail.com`** gebruiken, NIET `mail.bikerfun.nl`.

De `mail.bikerfun.nl` CNAME is alleen bedoeld voor webmail toegang (zoals Outlook Web Access).

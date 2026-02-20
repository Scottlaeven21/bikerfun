# 📊 Google Analytics Setup - Bikerfun

Deze handleiding legt uit hoe je Google Analytics instelt voor de Bikerfun website om bezoekers, conversies en traffic te kunnen meten.

---

## 📋 Wat is Google Analytics?

Google Analytics is een **gratis** tool van Google waarmee je kunt zien:
- 📈 Hoeveel bezoekers je website heeft
- 🌍 Waar ze vandaan komen (Google, social media, direct)
- 📱 Welk apparaat ze gebruiken (mobiel, desktop)
- 🎯 Welke pagina's het populairst zijn
- ⏱️ Hoe lang ze op de site blijven
- 💼 Hoeveel mensen het contactformulier invullen

**Perfect voor marketing en business beslissingen!**

---

## 🚀 Stap 1: Google Analytics Account Aanmaken

### 1.1 Ga naar Google Analytics
- Open: [https://analytics.google.com](https://analytics.google.com)
- Log in met je **Google account** (Gmail)
- Als je geen Google account hebt, maak er eerst één aan

### 1.2 Start Account Setup
- Klik op **"Start measuring"** of **"Meten starten"**
- Vul in:
  - **Account naam**: `Bikerfun`
  - Vink alle data sharing opties aan (aanbevolen)
- Klik **"Volgende"**

### 1.3 Property Aanmaken
- Vul in:
  - **Property naam**: `Bikerfun Website`
  - **Tijdzone**: `Netherlands (GMT+1)`
  - **Valuta**: `Euro (EUR)`
- Klik **"Volgende"**

### 1.4 Bedrijfsgegevens
- **Branche**: `Automotive` of `Retail`
- **Bedrijfsgrootte**: Selecteer wat van toepassing is
- **Gebruik**: Vink aan wat relevant is (bijv. "Measure customer engagement")
- Klik **"Maken"**

### 1.5 Accepteer Terms
- Lees de voorwaarden
- Vink **"I accept"** aan
- Klik **"I accept"**

---

## 🔑 Stap 2: Measurement ID Ophalen

### 2.1 Data Stream Setup
Na het aanmaken van je account:
- Je wordt gevraagd een **Data Stream** te maken
- Selecteer **"Web"**

### 2.2 Stream Details Invullen
- **Website URL**: `https://bikerfun.nl`
- **Stream naam**: `Bikerfun Website`
- Klik **"Stream maken"**

### 2.3 Measurement ID Kopiëren
- Je ziet nu je **Measurement ID**
- Format: `G-XXXXXXXXXX` (bijvoorbeeld: `G-ABC123DEF4`)
- **Kopieer deze ID!** Je hebt hem nodig in stap 3

---

## ⚙️ Stap 3: Measurement ID Toevoegen aan Website

### 3.1 Lokaal (Voor Ontwikkelaars)
Open `.env.local` en voeg toe:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

*(Vervang `G-XXXXXXXXXX` met jouw echte Measurement ID)*

### 3.2 Vercel (Productie)
1. Ga naar [https://vercel.com](https://vercel.com)
2. Open je **Bikerfun project**
3. Ga naar **Settings** → **Environment Variables**
4. Klik **"Add New"**
5. Vul in:
   - **Key**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (jouw Measurement ID)
   - **Environments**: Vink **Production**, **Preview**, en **Development** aan
6. Klik **"Save"**
7. **Redeploy** de website (Settings → Deployments → laatste deployment → "Redeploy")

---

## ✅ Stap 4: Testen of het Werkt

### 4.1 Real-Time Check in Google Analytics
1. Ga naar [https://analytics.google.com](https://analytics.google.com)
2. Selecteer je **Bikerfun property**
3. Klik op **"Reports"** → **"Realtime"**
4. Open **bikerfun.nl** in een nieuw tabblad
5. **Je zou jezelf nu moeten zien verschijnen als actieve gebruiker!** 🎉

### 4.2 Website Check
1. Open de website
2. Open **Chrome DevTools** (F12)
3. Ga naar **Console** tab
4. Type: `dataLayer`
5. Als je een array ziet met data → Analytics werkt! ✅

---

## 📊 Stap 5: Dashboard Gebruiken

### Belangrijkste Reports:

#### 1. **Realtime** - Wie is er nu op de site?
- Ga naar: **Reports** → **Realtime**
- Zie: Actieve gebruikers, welke pagina's ze bekijken, waar ze vandaan komen

#### 2. **Acquisition** - Hoe vinden mensen je?
- Ga naar: **Reports** → **Acquisition** → **Traffic acquisition**
- Zie: Google Search, Direct, Social Media, Referrals

#### 3. **Engagement** - Wat doen mensen?
- Ga naar: **Reports** → **Engagement** → **Pages and screens**
- Zie: Populairste pagina's, gemiddelde tijd op pagina

#### 4. **Events** - Custom tracking
- Ga naar: **Reports** → **Engagement** → **Events**
- Zie: Form submissions, occasion views, contact clicks
- **Deze data wordt automatisch getrackt door onze code!**

---

## 🎯 Belangrijke Events die Automatisch Worden Getrackt:

De website trackt automatisch:
- ✅ **Occasion views** - Welke motors bekijken mensen?
- ✅ **Form submissions** - Hoeveel contact/aanvragen?
- ✅ **Phone clicks** - Hoeveel bel-acties?
- ✅ **WhatsApp clicks** - Hoeveel WhatsApp gesprekken?
- ✅ **Product views** - (voor WooCommerce straks)
- ✅ **Add to cart** - (voor WooCommerce straks)

---

## 🔒 Privacy & Cookie Consent

**Goed nieuws:** De website heeft al een cookie consent banner!
- Alleen als gebruikers "Accepteer Alles" kiezen, wordt Google Analytics geladen
- Dit is **AVG/GDPR compliant** ✅
- Gebruikers kunnen altijd weigeren

---

## ❓ Veelgestelde Vragen

### Hoelang duurt het voordat ik data zie?
**24-48 uur** voor volledige rapporten, maar **Realtime** werkt direct!

### Kost Google Analytics geld?
**Nee!** Google Analytics is 100% gratis voor websites zoals Bikerfun.

### Moet ik elke maand iets doen?
**Nee.** Het werkt automatisch. Je kunt inloggen wanneer je wilt om data te bekijken.

### Kan ik het delen met meerdere mensen?
**Ja!** Ga naar **Admin** → **Property access management** → Voeg gebruikers toe.

### Hoe zie ik conversies (formulier submissions)?
Ga naar **Reports** → **Engagement** → **Events** → Zoek naar:
- `contact_form_submit`
- `motor_aanvraag_submit`

---

## 📞 Hulp Nodig?

Neem contact op met je developer (Scott) of stuur een berichtje. De setup is meestal binnen 10 minuten geregeld!

---

## 🎉 Klaar!

Zodra je de Measurement ID hebt toegevoegd aan Vercel en opnieuw hebt gedeployed, ben je klaar!

Je kunt nu:
- ✅ Real-time bezoekers zien
- ✅ Traffic sources analyseren
- ✅ Populaire occasions identificeren
- ✅ Conversies meten
- ✅ Data-driven beslissingen nemen

**Veel succes!** 🚀

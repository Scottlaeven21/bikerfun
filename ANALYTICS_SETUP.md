# 📊 Analytics System Setup - Bikerfun

Je hebt nu een **eigen analytics systeem** geïntegreerd in het admin dashboard! 🎉

Dit systeem trackt automatisch:
- 📈 Page views (per dag, week, maand)
- 🏍️ Populairste occasions
- 📧 Form submissions (contact + motor aanvraag)
- 📱 Device breakdown (mobiel, desktop, tablet)

**Geen externe dependencies, volledige privacy, real-time data!**

---

## ⚙️ Setup Stappen

### Stap 1: Database Migratie Uitvoeren

Je moet **één keer** de analytics tabellen aanmaken in Supabase:

1. **Log in op Supabase Dashboard**
   - Ga naar: [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Selecteer je **Bikerfun project**

2. **Open SQL Editor**
   - Klik in het linker menu op **"SQL Editor"**
   - Klik op **"New query"**

3. **Kopieer de SQL Query**
   - Open het bestand: `supabase/migrations/010_create_analytics.sql`
   - **Kopieer de VOLLEDIGE inhoud**

4. **Voer de Query Uit**
   - Plak de SQL in de SQL Editor
   - Klik op **"Run"** (rechts onderaan)
   - ✅ Je zou moeten zien: **"Success. No rows returned"**

### Stap 2: Klaar! 🎉

Dat is alles! Het systeem is nu actief en verzamelt automatisch data.

---

## 📊 Hoe Gebruik Je Het?

### Analytics Bekijken in Admin Dashboard

1. **Log in op admin dashboard**
   - Ga naar: `https://bikerfun.nl/admin`
   - Log in met je admin account

2. **Bekijk Statistieken**
   - Direct op de homepage van het dashboard zie je:
     - **Vandaag**: Aantal views vandaag + vergelijking met gisteren
     - **Deze Week**: Totaal deze week + gemiddelde per dag
     - **Deze Maand**: Totaal deze maand + gemiddelde per dag
     - **Conversies**: Totaal aantal form submissions
     - **Apparaten**: Verdeling mobiel/desktop/tablet
     - **Top Occasions**: Meest bekeken motors (met foto's!)

3. **Real-Time Updates**
   - Refresh de pagina om nieuwe data te zien
   - Data wordt automatisch verzameld vanaf nu

---

## 📈 Wat Wordt Getrackt?

### Automatisch:
- ✅ **Occasion Views** - Elke keer dat iemand een motor detail pagina opent
- ✅ **Contact Form** - Elke keer dat het contactformulier wordt verstuurd
- ✅ **Motor Aanvraag** - Elke keer dat motor aanvraag formulier wordt verstuurd
- ✅ **Device Type** - Of het mobiel, desktop of tablet is
- ✅ **Page Views** - Welke pagina's worden bezocht

### Data Privacy:
- ✅ Geen persoonlijke data opgeslagen (geen namen, emails in analytics)
- ✅ Geen cookies nodig voor tracking
- ✅ Alleen aggregated statistieken
- ✅ 100% privacy-vriendelijk

---

## 🎯 Wat Betekenen de Cijfers?

### Views Vandaag
- Aantal page views vandaag
- **Groen pijltje ↑** = Meer dan gisteren (goed!)
- **Rood pijltje ↓** = Minder dan gisteren

### Conversies
- **Contact forms** = Berichten via contactformulier
- **Motor aanvragen** = Specifieke motor aanvragen
- **Totaal** = Beide bij elkaar
- **Belangrijk cijfer voor business!**

### Top Occasions
- Welke motors worden het vaakst bekeken?
- Gebruik dit om te zien wat populair is
- Focus je marketing hierop!

### Apparaten
- **Mobiel hoog?** → Focus op mobile UX
- **Desktop hoog?** → Mensen doen research op computer
- Goed om te weten voor content strategie

---

## ❓ Veelgestelde Vragen

### Hoe lang wordt data bewaard?
**Permanent**, tenzij je handmatig verwijdert. Alle historische data blijft beschikbaar.

### Kan ik data verwijderen?
Ja, in de Supabase dashboard kun je oude analytics data verwijderen indien gewenst.

### Worden bezoekers geïdentificeerd?
**Nee!** We slaan geen IP-adressen of persoonlijke info op voor privacy. Alleen aggregated counts.

### Wat als er geen data is?
Normaal! Het systeem start vanaf nu met verzamelen. Na een paar dagen/weken zie je trends.

### Kan ik meer events toevoegen?
Ja! Je developer (Scott) kan eenvoudig meer tracking events toevoegen waar nodig.

---

## 🔧 Technische Details (Voor Developers)

### Database Tabellen:
- `page_views` - Algemene page views
- `analytics_events` - Custom events (forms, clicks)
- `occasion_views` - Specifieke occasion tracking

### Tracking Functions:
- `trackPageView(path, title)` - Track page view
- `trackEvent(name, data)` - Track custom event
- `trackOccasionView(occasionId)` - Track occasion view

### Dashboard API:
- `getAnalyticsData()` - Haalt alle statistieken op
- Real-time query's op Supabase
- Automatisch cached voor performance

---

## 🎉 Klaar!

Je hebt nu een professioneel analytics systeem dat volledig geïntegreerd is in je admin dashboard!

**Voordelen:**
- ✅ Real-time insights
- ✅ Privacy-vriendelijk
- ✅ Geen externe kosten
- ✅ Volledige controle
- ✅ Direct bruikbaar

**Veel succes met het analyseren van je website traffic!** 🚀

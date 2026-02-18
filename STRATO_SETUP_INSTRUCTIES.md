# 🏍️ Bikerfun Website Setup Instructies

**Doel:** De huidige WordPress/WooCommerce website verplaatsen naar een subdomein en API credentials aanmaken voor de nieuwe website.

**Geschatte tijd:** 30-60 minuten  
**Vereiste kennis:** Basiskennis van Strato en WordPress

---

## 📌 Wat gaat er gebeuren?

### Voor de aanpassing:
- `bikerfun.nl` → Huidige WordPress/WooCommerce website

### Na de aanpassing:
- `bikerfun.nl` → Nieuwe moderne website (Next.js)
- `admin.bikerfun.nl` → WordPress/WooCommerce backend (alleen voor jou zichtbaar)

**Let op:** Klanten zullen alleen de nieuwe moderne website zien. Je WordPress admin blijft gewoon toegankelijk voor jou via `admin.bikerfun.nl/wp-admin`.

---

## 🚀 FASE 1: Subdomein Aanmaken bij Strato

### Stap 1: Inloggen bij Strato

1. Ga naar: https://www.strato.nl/apps/CustomerLogin
2. Log in met je Strato klantgegevens
3. Klik op **"Pakketten & Domeinen"** of **"Mijn Producten"**

---

### Stap 2: Subdomein Aanmaken

1. Klik op je domein **`bikerfun.nl`** in de lijst
2. Zoek naar **"Subdomeinen"**, **"Subdomein beheren"** of **"Domain-instellingen"**
   - *Locatie verschilt per Strato pakket*
3. Klik op **"Nieuw subdomein aanmaken"** of **"+ Toevoegen"**

**Vul de volgende gegevens in:**

```
Subdomein:     admin
Hoofddomein:   bikerfun.nl
Resultaat:     admin.bikerfun.nl
```

4. Kies voor **doelmap**:
   - Als je een mapkeuze krijgt, kies: `/admin` of maak een nieuwe map `/admin-bikerfun`
5. Klik op **"Opslaan"** of **"Aanmaken"**

**⏱️ Verwachte tijd:** DNS propagatie kan 15 minuten tot 4 uur duren.

---

### Stap 3: Test of Subdomein Werkt

Open een nieuwe browser tab en ga naar:
```
http://admin.bikerfun.nl
```

**Wat je zou moeten zien:**
- Een lege pagina
- Of een "Directory Listing" pagina
- Of een foutmelding (dit is normaal, we gaan WordPress hier naartoe verplaatsen)

**Als je een foutmelding krijgt over "domein niet gevonden":**
- Wacht nog 15-30 minuten (DNS heeft tijd nodig)
- Test opnieuw

---

## 🔄 FASE 2: WordPress Verplaatsen naar Subdomein

### ⚠️ BELANGRIJK: Maak eerst een backup!

1. Log in op je huidige WordPress: `bikerfun.nl/wp-admin`
2. Installeer de plugin **"UpdraftPlus"** (gratis backup plugin)
3. Ga naar **Tools → UpdraftPlus Backups**
4. Klik op **"Back Up Now"**
5. Wacht tot backup compleet is
6. Download de backup naar je computer (voor de zekerheid)

---

### Stap 4: WordPress URL Aanpassen

**Let op:** Deze stap zorgt ervoor dat WordPress weet dat het op een nieuw adres draait.

1. Log in op WordPress admin: `bikerfun.nl/wp-admin`
2. Ga naar **Instellingen → Algemeen** (Settings → General)
3. Je ziet twee velden:

**Pas BEIDE aan naar het nieuwe subdomein:**

```
WordPress-adres (URL):
OUD: https://bikerfun.nl
NIEUW: https://admin.bikerfun.nl

Websiteadres (URL):
OUD: https://bikerfun.nl
NIEUW: https://admin.bikerfun.nl
```

4. Scroll naar beneden en klik op **"Wijzigingen opslaan"**

**⚠️ Wat gebeurt er nu:**
- Je wordt UITGELOGD
- WordPress is tijdelijk niet bereikbaar op `bikerfun.nl`
- Dit is normaal! Ga verder met de volgende stap.

---

### Stap 5: Bestanden en Database Verplaatsen

#### Optie A: Via Strato File Manager (Makkelijkst voor Beginners)

**Als je WordPress al op je huidige hosting draait:**

1. Log in bij Strato Control Panel
2. Ga naar **"File Manager"** of **"Webspace"**
3. Je ziet waarschijnlijk deze mapstructuur:
   ```
   /
   ├── public_html/  (of httpdocs/ of www/)
   │   ├── wp-admin/
   │   ├── wp-content/
   │   ├── wp-includes/
   │   └── wp-config.php
   ```

**Wat je moet doen:**
- Als er een `/admin` map is die je eerder hebt aangemaakt:
  - Kopieer ALLE WordPress bestanden naar deze map
- WordPress blijft ook gewoon in de hoofdmap staan voorlopig

**Let op:** Deze methode werkt als Strato automatisch subdomeinen naar submappen wijst.

#### Optie B: Via DNS A-Record (Voor gevorderden)

Als optie A niet werkt of je wilt een schonere oplossing:

1. Ga in Strato naar **"DNS Beheer"** of **"DNS Instellingen"**
2. Zoek naar je domein `bikerfun.nl`
3. Voeg een nieuw **A-record** toe:

```
Type:     A
Name:     admin
Value:    [Hetzelfde IP-adres als je hoofddomein]
TTL:      3600
```

*Het IP-adres vind je bij je huidige domein instellingen of via `ping bikerfun.nl` in command prompt*

4. Sla op en wacht 15-30 minuten voor DNS propagatie

---

### Stap 6: Test de Nieuwe URL

1. Open een browser (eventueel in incognito/privé modus)
2. Ga naar: `https://admin.bikerfun.nl/wp-admin`
3. Log in met je WordPress gegevens

**✅ Als het werkt:**
- Je ziet je WordPress dashboard
- Ga naar **WooCommerce → Products**
- Controleer of al je producten zichtbaar zijn

**❌ Als het NIET werkt:**
- Wacht nog 15-30 minuten (DNS propagatie)
- Check of je de URL's correct hebt aangepast in stap 4
- Controleer of `admin.bikerfun.nl` naar de juiste map wijst

---

## 🔒 FASE 3: WordPress Frontend Blokkeren

**Doel:** Voorkomen dat klanten `admin.bikerfun.nl` kunnen bezoeken (alleen jij via wp-admin).

### Stap 7: Frontend Blokkeren

1. Log in op WordPress: `admin.bikerfun.nl/wp-admin`
2. Ga naar **Plugins → Nieuwe plugin toevoegen**
3. Zoek naar: **"WP Headless"** of **"Headless Mode"**
4. Installeer en activeer de plugin

**OF handmatige methode:**

1. Ga naar **Weergave → Thema-editor** (Appearance → Theme Editor)
2. Open het bestand **`functions.php`** (rechts in de lijst)
3. Voeg ONDERAAN het bestand toe (voor de laatste `?>` als die er is):

```php
// Blokkeer frontend, alleen admin en API toegankelijk
add_action('template_redirect', function() {
    // Als gebruiker NIET ingelogd is en NIET de API gebruikt
    if (!is_user_logged_in() && !is_admin()) {
        // Check of het GEEN API request is
        if (strpos($_SERVER['REQUEST_URI'], '/wp-json/') === false) {
            // Redirect naar hoofddomein
            wp_redirect('https://bikerfun.nl');
            exit;
        }
    }
});
```

4. Klik op **"Bestand bijwerken"**

**✅ Test het:**
- Open een NIEUWE incognito browser tab
- Ga naar `admin.bikerfun.nl`
- Je zou moeten worden doorgestuurd NAAR `bikerfun.nl` OF een 403 foutmelding zien
- Log je in op `admin.bikerfun.nl/wp-admin` → Dit moet WEL werken

---

## 🔑 FASE 4: WooCommerce API Keys Aanmaken

### Stap 8: REST API Activeren

1. Log in op WordPress: `admin.bikerfun.nl/wp-admin`
2. Ga naar **WooCommerce → Instellingen** (WooCommerce → Settings)
3. Klik bovenaan op de tab **"Geavanceerd"** (Advanced)
4. Klik op de sub-tab **"REST API"**
5. Klik op de knop **"Sleutel toevoegen"** (Add key)

---

### Stap 9: API Key Configureren

Vul de volgende gegevens in:

```
Beschrijving:
└─ Bikerfun Next.js Website

Gebruiker:
└─ [Selecteer je admin account]

Rechten:
└─ Lezen/Schrijven (Read/Write)
```

**Waarom "Lezen/Schrijven"?**
- *Lezen:* Producten ophalen voor de website
- *Schrijven:* Orders aanmaken vanuit de website

Klik op **"API-sleutel genereren"** (Generate API key)

---

### Stap 10: API Credentials Opslaan

**⚠️ ZEER BELANGRIJK:**

Je ziet nu een scherm met twee lange codes:

```
Consumer key:
ck_1234567890abcdef1234567890abcdef12345678

Consumer secret:
cs_1234567890abcdef1234567890abcdef12345678
```

**LET OP:**
- Je kunt de **Consumer secret** maar **ÉÉN KEER** zien!
- **Kopieer BEIDE codes** en bewaar ze veilig
- Als je ze vergeet, moet je nieuwe keys aanmaken

**Waar bewaren:**
1. Open een tekstbestand (Kladblok/Notepad)
2. Kopieer en plak BEIDE keys
3. Sla op als: `bikerfun-api-keys.txt`
4. Bewaar op een veilige plek

**Of gebruik een password manager:**
- 1Password
- Bitwarden
- LastPass

---

### Stap 11: Keys Doorgeven aan Developer

**Stuur de volgende informatie naar je developer:**

```
WooCommerce Subdomein:
admin.bikerfun.nl

Consumer Key:
ck_[jouw key hier]

Consumer Secret:
cs_[jouw key hier]
```

**Verstuur dit via:**
- ✅ Beveiligde email
- ✅ Password manager (shared vault)
- ✅ Encrypted bestand
- ❌ NIET via WhatsApp of SMS
- ❌ NIET in een publieke chat

---

## 🧪 FASE 5: Testen

### Stap 12: Test API Werking

Om te controleren of de API werkt:

1. Open een browser
2. Ga naar:
   ```
   https://admin.bikerfun.nl/wp-json/wc/v3/products
   ```

**Je zou moeten zien:**
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Sorry, you cannot list resources."
}
```

**✅ Dit is GOED!** Het betekent:
- De API werkt
- Maar authenticatie is vereist (wat we willen)

**❌ Als je andere foutmeldingen ziet:**
- "404 Not Found" → WooCommerce is niet geïnstalleerd of REST API staat uit
- "500 Server Error" → Mogelijk een WordPress configuratie probleem
- Neem contact op met je developer

---

### Stap 13: Checklist Afvinken

Controleer of alles klaar is:

```
□ Subdomein admin.bikerfun.nl is aangemaakt bij Strato
□ WordPress is verplaatst naar admin.bikerfun.nl
□ admin.bikerfun.nl/wp-admin is toegankelijk voor mij
□ Alle producten zijn zichtbaar in WooCommerce
□ Frontend van admin.bikerfun.nl is geblokkeerd voor bezoekers
□ REST API keys zijn aangemaakt
□ Consumer Key en Consumer Secret zijn veilig opgeslagen
□ Keys zijn verstuurd naar developer via beveiligde methode
```

---

## 📞 Hulp Nodig?

### Strato Support:
- **Telefoon:** 088 - 3000 300
- **Email:** klantenservice@strato.nl
- **LiveChat:** Via Strato Control Panel

### Veelgestelde Vragen:

**Q: Kan ik nog bij mijn WordPress admin?**  
A: Ja! Via `admin.bikerfun.nl/wp-admin`

**Q: Zien klanten mijn oude WordPress site?**  
A: Nee, alleen de nieuwe moderne website op `bikerfun.nl`

**Q: Wat als ik per ongeluk iets verkeerd doe?**  
A: Je hebt een backup gemaakt in stap 4. Deze kun je altijd herstellen.

**Q: Kan ik nog nieuwe producten toevoegen?**  
A: Ja! Gewoon inloggen op `admin.bikerfun.nl/wp-admin` en producten beheren zoals altijd.

**Q: Moet ik iets wijzigen aan mijn producten?**  
A: Nee! Alle producten blijven exact hetzelfde, alleen de frontend wordt vervangen.

---

## ✅ Klaar!

Zodra je deze stappen hebt doorlopen:
1. Stuur de API keys naar je developer
2. De developer zal de nieuwe website verbinden met WooCommerce
3. Na deployment zie je de mooie nieuwe website op `bikerfun.nl`
4. Jij beheert producten gewoon via `admin.bikerfun.nl/wp-admin`

**Veel succes!** 🚀

# 🔄 Alternatief: Duplicator Plugin (Voor Grote Websites)

**Gebruik dit als:**
- Je website backup groter is dan 512 MB
- All-in-One WP Migration gratis versie niet werkt
- Je een gratis alternatief wilt zonder limitaties

---

## 📦 FASE 2 Alternatief: Duplicator Methode

### Stap 4-ALT: Backup maken met Duplicator

1. Log in op je huidige WordPress: `bikerfun.nl/wp-admin`
2. Installeer de plugin **"Duplicator"** (gratis, geen limiet)
   - Ga naar **Plugins → Nieuwe plugin**
   - Zoek **"Duplicator – WordPress Migration Plugin"**
   - Klik **"Nu installeren"** en **"Activeren"**

3. **Maak een package aan:**
   - Ga naar **Duplicator → Packages**
   - Klik op **"Create New"**
   - Naam: `bikerfun-backup`
   - Klik **"Next"**
   - Wacht op Scan (kan 1-2 minuten duren)
   - Klik **"Build"**
   - Wacht tot package compleet is (kan 5-10 minuten duren)

4. **Download 2 bestanden:**
   - `installer.php` (klik om te downloaden)
   - `[package-naam]_archive.zip` (klik om te downloaden)

**Bewaar beide bestanden op je computer!**

---

### Stap 5-ALT: Nieuwe WordPress Installeren

**Zelfde als in hoofdinstructies:**

1. Log in bij Strato Control Panel
2. Installeer WordPress op `admin.bikerfun.nl` via 1-click installer
3. Noteer de admin gegevens (je hebt ze nodig!)

---

### Stap 6-ALT: Importeren met Duplicator

**⚠️ BELANGRIJK: Dit is iets technischer dan All-in-One WP Migration**

#### Methode A: Via FTP (Aanbevolen)

1. **Download een FTP client:**
   - FileZilla (gratis): https://filezilla-project.org/

2. **FTP gegevens ophalen bij Strato:**
   - Log in bij Strato Control Panel
   - Ga naar **"FTP Toegang"** of **"FTP Accounts"**
   - Noteer:
     - Host: `ftp.strato.nl` (of specifiek voor jouw pakket)
     - Gebruikersnaam: [staat in Strato]
     - Wachtwoord: [maak aan of reset]
     - Poort: 21

3. **Verbind met FTP:**
   - Open FileZilla
   - Vul FTP gegevens in
   - Klik **"Verbinden"**

4. **Navigeer naar subdomein map:**
   - Zoek de map van `admin.bikerfun.nl`
   - Meestal: `/admin/` of `/domains/admin.bikerfun.nl/` of `/httpdocs/admin/`

5. **Upload Duplicator bestanden:**
   - Sleep **`installer.php`** naar de subdomein map
   - Sleep **`[package-naam]_archive.zip`** naar de subdomein map
   - Wacht tot upload compleet is

6. **Start de installer:**
   - Ga in je browser naar: `https://admin.bikerfun.nl/installer.php`
   - Volg de wizard:
     - Accepteer terms
     - Klik **"Next"**
     - Vul database gegevens in (zie Strato voor MySQL credentials)
     - Klik **"Test Connection"**
     - Als groen, klik **"Next"**
     - Wacht tot import compleet is (5-15 minuten)

7. **Log in op nieuwe website:**
   - Gebruik je **OUDE** WordPress login (van bikerfun.nl)
   - URL: `https://admin.bikerfun.nl/wp-admin`

8. **Verwijder installer bestanden (BELANGRIJK!):**
   - WordPress toont een waarschuwing
   - Klik op de knop om installer bestanden te verwijderen
   - Of verwijder via FTP: `installer.php` en alle `installer-*.php` bestanden

---

#### Methode B: Via cPanel File Manager (Als Strato dit heeft)

1. Log in bij Strato Control Panel
2. Open **"File Manager"** of **"Webspace"**
3. Navigeer naar subdomein map (`/admin/` of `/admin.bikerfun.nl/`)
4. Klik **"Upload"**
5. Upload beide Duplicator bestanden:
   - `installer.php`
   - `[package-naam]_archive.zip`
6. Ga naar `https://admin.bikerfun.nl/installer.php`
7. Volg stappen 6-8 van Methode A hierboven

---

## ✅ Voordelen van Duplicator

| **Voordeel** | **Waarom** |
|--------------|------------|
| ✅ **Gratis** | Geen limiet op bestandsgrootte |
| ✅ **Compleet** | Migreert hele site inclusief database |
| ✅ **Betrouwbaar** | Meest gebruikte migratie plugin (5M+ installaties) |
| ✅ **Database tools** | Kan database optimaliseren tijdens migratie |

## ⚠️ Nadelen van Duplicator

| **Nadeel** | **Waarom** |
|------------|------------|
| ⚠️ **FTP kennis nodig** | Je moet bestanden uploaden via FTP |
| ⚠️ **Database credentials** | Je moet MySQL gegevens weten van Strato |
| ⚠️ **Iets complexer** | Meer stappen dan All-in-One WP Migration |

---

## 🔄 Na Import

**Ga verder met de hoofdinstructies vanaf Stap 7** (Test de Nieuwe Website)

Alle volgende stappen blijven hetzelfde:
- Frontend blokkeren
- API keys aanmaken
- Testen

---

## 💡 Hulp Nodig?

**Database gegevens niet kunnen vinden?**
- Bel Strato support: 088 - 3000 300
- Vraag: "Wat zijn mijn MySQL database credentials voor admin.bikerfun.nl?"

**FTP werkt niet?**
- Check of FTP geactiveerd is in je Strato pakket
- Reset FTP wachtwoord in Strato Control Panel

**Import blijft hangen?**
- Check of PHP memory limit hoog genoeg is (minimaal 256MB)
- Mogelijk te weinig server resources, neem contact op met Strato

---

## ✅ Klaar!

Na succesvolle import met Duplicator, ga terug naar de hoofdinstructies en vervolg vanaf **FASE 3: Frontend Blokkeren**.

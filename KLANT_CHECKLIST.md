# ✅ Bikerfun Setup - Snelle Checklist

## 📋 Wat moet je doen? (30-60 minuten)

### VOOR JE BEGINT:
- [ ] Maak een WordPress backup (via UpdraftPlus plugin)
- [ ] Zorg dat je toegang hebt tot Strato Control Panel
- [ ] Zorg dat je WordPress admin gegevens bij de hand hebt

---

### FASE 1: Subdomein Aanmaken (15 min)
1. [ ] Log in bij Strato
2. [ ] Maak subdomein `admin.bikerfun.nl` aan
3. [ ] Test of subdomein bereikbaar is

---

### FASE 2: WordPress Verplaatsen (20 min)
4. [ ] Pas WordPress URL aan naar `admin.bikerfun.nl` (Instellingen → Algemeen)
5. [ ] Verplaats/wijs bestanden naar subdomein (via File Manager of DNS)
6. [ ] Test inloggen op `admin.bikerfun.nl/wp-admin`
7. [ ] Controleer of producten zichtbaar zijn

---

### FASE 3: Frontend Blokkeren (10 min)
8. [ ] Installeer "Headless Mode" plugin OF
9. [ ] Voeg code toe aan `functions.php` (zie instructies)
10. [ ] Test: `admin.bikerfun.nl` moet geblokkeerd zijn voor bezoekers

---

### FASE 4: API Keys Aanmaken (5 min)
11. [ ] Ga naar WooCommerce → Instellingen → Geavanceerd → REST API
12. [ ] Klik "Sleutel toevoegen"
13. [ ] Vul in: Beschrijving, Gebruiker, Rechten (Lezen/Schrijven)
14. [ ] Klik "API-sleutel genereren"
15. [ ] **KOPIEER EN BEWAAR** Consumer Key en Consumer Secret

---

### FASE 5: Keys Doorgeven (5 min)
16. [ ] Sla beide keys op in tekstbestand of password manager
17. [ ] Stuur keys **BEVEILIGD** naar developer:
   ```
   WooCommerce URL: admin.bikerfun.nl
   Consumer Key: ck_...
   Consumer Secret: cs_...
   ```

---

## ✅ KLAAR!

Je ontvangt bericht van de developer wanneer de nieuwe website live gaat.

**Vragen?** Bekijk het volledige stappenplan: `STRATO_SETUP_INSTRUCTIES.md`

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
4. [ ] Maak backup met "All-in-One WP Migration" plugin
5. [ ] Installeer nieuwe WordPress op `admin.bikerfun.nl` (via Strato 1-click)
6. [ ] Installeer "All-in-One WP Migration" op NIEUWE WordPress
7. [ ] Importeer backup bestand in nieuwe WordPress
8. [ ] Test inloggen op `admin.bikerfun.nl/wp-admin` (met oude gegevens)
9. [ ] Controleer of alle producten zichtbaar zijn in WooCommerce

---

### FASE 3: Frontend Blokkeren (10 min)
10. [ ] Installeer "Headless Mode" plugin OF
11. [ ] Voeg code toe aan `functions.php` (zie instructies)
12. [ ] Test: `admin.bikerfun.nl` moet geblokkeerd zijn voor bezoekers

---

### FASE 4: API Keys Aanmaken (5 min)
13. [ ] Ga naar WooCommerce → Instellingen → Geavanceerd → REST API
14. [ ] Klik "Sleutel toevoegen"
15. [ ] Vul in: Beschrijving, Gebruiker, Rechten (Lezen/Schrijven)
16. [ ] Klik "API-sleutel genereren"
17. [ ] **KOPIEER EN BEWAAR** Consumer Key en Consumer Secret

---

### FASE 5: Keys Doorgeven (5 min)
18. [ ] Sla beide keys op in tekstbestand of password manager
19. [ ] Stuur keys **BEVEILIGD** naar developer:
   ```
   WooCommerce URL: admin.bikerfun.nl
   Consumer Key: ck_...
   Consumer Secret: cs_...
   ```

---

## ✅ KLAAR!

Je ontvangt bericht van de developer wanneer de nieuwe website live gaat.

**Vragen?** Bekijk het volledige stappenplan: `STRATO_SETUP_INSTRUCTIES.md`

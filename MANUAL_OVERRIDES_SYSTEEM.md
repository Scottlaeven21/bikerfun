# 🔒 Manual Overrides Systeem

**Datum:** 5 maart 2026  
**Status:** ✅ Geïmplementeerd

---

## 📋 Wat Is Dit?

Het Manual Overrides systeem voorkomt dat WooCommerce sync je handmatige aanpassingen in het Bikerfun dashboard overschrijft.

**Probleem opgelost:**
- ✅ Je past een motor beschrijving aan in Bikerfun → blijft behouden na sync
- ✅ Je verandert de prijs van een product → wordt niet overschreven door WooCommerce
- ✅ Je voegt custom features toe → blijven bestaan na volgende sync

---

## 🎯 Hoe Werkt Het?

### Automatische Tracking

Wanneer je een occasion of product **bewerkt** in het Bikerfun dashboard:

1. **Systeem detecteert** welke velden je hebt aangepast
2. **Velden worden gemarkeerd** als "manually overridden"
3. **Volgende sync** slaat deze velden over
4. **WooCommerce data** wordt alleen gebruikt voor niet-aangepaste velden

### Voorbeeld

```
Origineel (van WooCommerce):
- Merk: Yamaha
- Model: R1
- Prijs: €12.000
- Beschrijving: "Sportmotor uit 2020"

Je past aan in Bikerfun:
- Prijs: €11.500 ← JE WIJZIGING
- Beschrijving: "Prachtige Yamaha R1 uit 2020, rijklaar met APK" ← JE WIJZIGING

Manual Overrides: ["price", "description"]

Na volgende WooCommerce sync:
- Merk: Yamaha ← Gesynct van WooCommerce
- Model: R1 ← Gesynct van WooCommerce  
- Prijs: €11.500 ← BLIJFT JOUW WAARDE ✅
- Beschrijving: "Prachtige Yamaha..." ← BLIJFT JOUW WAARDE ✅
```

---

## 📊 Welke Velden Worden Getracked?

### Voor Occasions (Motors):
- `brand`, `model`, `year`
- `price`
- `mileage`, `transmission`, `fuel`, `power`
- `color`, `category`, `condition`
- `owners`, `service_history`, `warranty`
- `description`
- `features`, `extras`

### Voor Webshop Products:
- `name`, `description`, `short_description`
- `price`, `sale_price`, `regular_price`
- `stock_quantity`, `stock_status`
- `categories`, `tags`
- `featured`, `catalog_visibility`

---

## 🛠️ Gebruik In Admin Dashboard

### Occasions Bewerken (Automatisch)

```typescript
// In /admin/occasions/[id]/edit
1. Open een occasion
2. Wijzig velden (bijv. prijs, beschrijving)
3. Klik "Opslaan"
4. ✅ Velden worden automatisch beschermd tegen sync
```

### Webshop Products (Handmatig via SQL)

**Let op:** Webshop producten hebben geen edit interface in het admin dashboard.  
Ze worden puur via WooCommerce sync bijgewerkt.

Als je toch een veld wilt beschermen (bijv. custom prijs), gebruik SQL:

```sql
-- Voeg manual override toe voor een specifiek product
UPDATE webshop_products 
SET manual_overrides = manual_overrides || '["price", "description"]'::jsonb
WHERE woo_product_id = 123;

-- Of gebruik de helper functie
SELECT add_manual_override('webshop_products', 
  (SELECT id FROM webshop_products WHERE woo_product_id = 123), 
  'price'
);
```

**Toekomstige feature:** Edit interface voor webshop_products met automatische tracking.

### Sync Logging

Tijdens een sync zie je in de console:

```bash
✅ Occasions sync complete: 5 imported, 12 updated

⚠️  Skipped 3 manually overridden fields: ["price", "description", "features"]
⏭️  All fields manually overridden, skipping update for Yamaha R1
```

---

## 🔄 Reset Naar WooCommerce (Later Toe Te Voegen)

In toekomstige versies kan een admin per veld kiezen:

```typescript
// UI Component (nog te bouwen)
<ManualOverrideManager 
  tableName="occasions"
  recordId="uuid-123"
  overriddenFields={["price", "description"]}
  onReset={(field) => {
    // Reset specific field terug naar WooCommerce waarde
    removeManualOverride('occasions', 'uuid-123', field);
  }}
/>
```

**Functies beschikbaar:**
- `getManualOverrides(table, id)` - Haal lijst van overridden velden op
- `addManualOverride(table, id, field)` - Markeer veld als protected
- `removeManualOverride(table, id, field)` - Reset veld naar WooCommerce
- `clearManualOverrides(table, id)` - Reset alles naar WooCommerce

---

## 📥 Database Migratie

**Bestand:** `supabase/migrations/020_add_manual_overrides.sql`

**Moet worden uitgevoerd in Supabase SQL Editor!**

### Wat Doet De Migratie?

1. **Voegt `manual_overrides` kolom toe** aan `occasions` en `webshop_products`
   ```sql
   ALTER TABLE occasions 
   ADD COLUMN manual_overrides JSONB DEFAULT '[]'::jsonb;
   ```

2. **Maakt GIN indexes** voor snelle queries
   ```sql
   CREATE INDEX idx_occasions_manual_overrides 
   ON occasions USING gin (manual_overrides);
   ```

3. **Helper functies** voor override management
   - `add_manual_override(table, id, field)`
   - `remove_manual_override(table, id, field)`
   - `has_manual_override(overrides, field)`

### Uitvoeren

```bash
1. Ga naar: https://supabase.com/dashboard/project/uxepjramdcqvwafxwcxk/sql/new
2. Open: supabase/migrations/020_add_manual_overrides.sql
3. Kopieer de hele inhoud
4. Plak in SQL Editor
5. Klik "Run"
```

---

## 🔍 Technische Details

### Data Structuur

```typescript
// In database
{
  id: "uuid-123",
  brand: "Yamaha",
  model: "R1",
  price: 11500,
  description: "Aangepaste beschrijving",
  manual_overrides: ["price", "description"], // ← Dit is de magic!
  woo_product_id: 4567
}
```

### Sync Flow

```typescript
// In app/api/admin/sync-woocommerce/route.ts

// 1. Haal WooCommerce data op
const wooProduct = await wooCommerce.getProduct(id);

// 2. Check manual overrides
const { data } = await supabase
  .from('occasions')
  .select('manual_overrides')
  .eq('woo_product_id', id)
  .single();

const protected = data.manual_overrides || [];

// 3. Filter update data
const updateData = {};
Object.keys(wooData).forEach(key => {
  if (!protected.includes(key)) {  // ← Alleen niet-protected velden
    updateData[key] = wooData[key];
  }
});

// 4. Update (alleen toegestane velden)
await supabase
  .from('occasions')
  .update(updateData)
  .eq('woo_product_id', id);
```

---

## ⚠️ Belangrijke Opmerkingen

### Wat Je MOET Weten:

1. **Nieuwe items** hebben geen overrides
   - Eerste sync van WooCommerce → geen protection
   - Pas na eerste edit in Bikerfun worden velden protected

2. **Slug en WooCommerce ID** worden ALTIJD gesynct
   - Deze zijn kritisch voor de koppeling
   - Kunnen niet manually overridden worden

3. **Images** worden nog niet getracked
   - In toekomstige versie toe te voegen

4. **Bulk edits** tracken nog geen overrides
   - Alleen individuele bewerkingen via forms

### Best Practices:

✅ **DO:**
- Edit occasions in Bikerfun dashboard wanneer je custom info wilt toevoegen
- Laat de sync draaien voor basis updates (stock, status, etc.)
- Check de sync logs om te zien welke velden protected zijn

❌ **DON'T:**
- Handmatig `manual_overrides` in database aanpassen
- Vergeten dat protected velden NIET meer syncen
- Belangrijke WooCommerce updates verwachten voor protected velden

---

## 🚀 Volgende Stappen

### Voor Nu:
1. ✅ Migratie uitvoeren in Supabase
2. ✅ Test door occasion te bewerken
3. ✅ Run sync en check logs

### Toekomstige Features:
- 🔜 UI om manual overrides te beheren per occasion/product
- 🔜 "Reset naar WooCommerce" knop per veld
- 🔜 Overzicht van welke occasions protected fields hebben
- 🔜 Bulk reset optie voor specifieke velden
- 🔜 Image tracking toevoegen

---

## 🆘 Troubleshooting

### "Mijn wijziging wordt nog steeds overschreven"

**Check:**
1. Is de migratie uitgevoerd?
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'occasions' AND column_name = 'manual_overrides';
   ```

2. Zijn de overrides correct opgeslagen?
   ```sql
   SELECT id, brand, model, manual_overrides 
   FROM occasions 
   WHERE manual_overrides IS NOT NULL AND manual_overrides != '[]'::jsonb;
   ```

3. Check console logs tijdens sync:
   ```
   ⚠️  Skipped X manually overridden fields: [...]
   ```

### "Ik wil een veld terug naar WooCommerce resetten"

**Tijdelijke oplossing:**
```sql
-- Reset één veld
UPDATE occasions 
SET manual_overrides = manual_overrides - 'price'
WHERE id = 'jouw-uuid';

-- Reset alles
UPDATE occasions 
SET manual_overrides = '[]'::jsonb
WHERE id = 'jouw-uuid';
```

---

## 📞 Support

Bij vragen of problemen:
1. Check de sync logs in console
2. Bekijk `manual_overrides` kolom in Supabase
3. Test met één occasion eerst voordat je bulk sync doet

---

**✅ Systeem is ready to use!**  
**🔒 Je edits zijn nu beschermd tegen sync overwrites!**

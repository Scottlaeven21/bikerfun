# 🗄️ Supabase Migrations Voor WooCommerce Sync

**Datum:** 2 maart 2026  
**Status:** ⚠️ REQUIRED - Migrations moeten worden uitgevoerd

---

## ❌ **Problemen Die Dit Oplost:**

### **1. Occasions: Missing `woo_product_id` Column**
```
Error: Could not find the 'woo_product_id' column of 'occasions' in the schema cache
```

**Fix:** Voeg `woo_product_id` kolom toe aan `occasions` tabel

### **2. Products: Duplicate SKU Constraint**
```
Error: duplicate key value violates unique constraint "webshop_products_sku_key"
```

**Fix:** Verwijder unique constraint op `sku`, gebruik `woo_product_id` als unique identifier

---

## 🚀 **Automatisch Runnen (Methode 1)**

### **Via Script:**

```bash
npx tsx scripts/run-woo-sync-migrations.ts
```

**Let op:** Dit werkt mogelijk niet als Supabase RPC niet beschikbaar is.

---

## 📝 **Handmatig Runnen (Methode 2 - AANBEVOLEN)**

### **Stap 1: Ga Naar Supabase Dashboard**

1. Open: https://supabase.com/dashboard
2. Selecteer je project: **Bikerfun**
3. Ga naar: **SQL Editor** (in linker sidebar)

### **Stap 2: Run Migration 1 - Add woo_product_id to Occasions**

Klik **"New Query"** en plak:

```sql
-- Add woo_product_id column to occasions table for WooCommerce sync
-- This allows us to track which WooCommerce product corresponds to each occasion

ALTER TABLE occasions 
ADD COLUMN IF NOT EXISTS woo_product_id INTEGER UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_occasions_woo_product_id ON occasions(woo_product_id);

-- Add comment
COMMENT ON COLUMN occasions.woo_product_id IS 'WooCommerce product ID for sync tracking';
```

**Klik "Run"** → Zou moeten geven: `Success. No rows returned`

### **Stap 3: Run Migration 2 - Fix Products SKU Constraint**

Klik **"New Query"** en plak:

```sql
-- Fix duplicate SKU constraint issue
-- Make SKU nullable and drop unique constraint
-- We'll use woo_product_id as the primary unique identifier instead

-- Drop the unique constraint on SKU
ALTER TABLE webshop_products 
DROP CONSTRAINT IF EXISTS webshop_products_sku_key;

-- Make SKU nullable (it may already be, but ensure it)
ALTER TABLE webshop_products 
ALTER COLUMN sku DROP NOT NULL;

-- Add unique constraint on woo_product_id instead
-- This is the real unique identifier from WooCommerce
ALTER TABLE webshop_products
DROP CONSTRAINT IF EXISTS webshop_products_woo_product_id_key;

ALTER TABLE webshop_products
ADD CONSTRAINT webshop_products_woo_product_id_key UNIQUE (woo_product_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_webshop_products_woo_product_id ON webshop_products(woo_product_id);

-- Add comment
COMMENT ON COLUMN webshop_products.woo_product_id IS 'WooCommerce product ID - unique identifier for sync';
```

**Klik "Run"** → Zou moeten geven: `Success. No rows returned`

---

## ✅ **Verificatie**

### **Check Of Migrations Succesvol Zijn:**

Run deze query in SQL Editor:

```sql
-- Check occasions table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'occasions' AND column_name = 'woo_product_id';

-- Check webshop_products constraints
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE table_name = 'webshop_products' 
  AND constraint_type = 'UNIQUE';
```

**Verwacht:**
- `woo_product_id` kolom bestaat in `occasions`
- `webshop_products_woo_product_id_key` constraint bestaat
- `webshop_products_sku_key` constraint bestaat NIET meer

---

## 🧪 **Test Na Migrations**

Na het runnen van migrations:

1. **Ga naar:** `/admin/sync`
2. **Klik:** "Start Synchronisatie"
3. **Verwacht:**
   - ✅ 14 occasions geïmporteerd
   - ✅ ~100 producten geïmporteerd  
   - ✅ 0 fouten

---

## 📋 **Wat Gebeurt Er:**

### **Voor:**
```
occasions tabel: GEEN woo_product_id kolom ❌
→ Insert faalt met "column not found"

webshop_products: UNIQUE constraint op SKU ❌
→ Insert faalt met "duplicate key" (veel motors hebben zelfde SKU)
```

### **Na:**
```
occasions tabel: woo_product_id kolom toegevoegd ✅
→ Insert/Update werkt perfect

webshop_products: UNIQUE constraint op woo_product_id ✅
→ SKU kan duplicates hebben, woo_product_id is unique
```

---

## 🎯 **Waarom Deze Changes:**

### **`woo_product_id` Op Occasions:**
- Unieke identifier van WooCommerce
- Nodig voor update/insert logica
- Voorkomt duplicate occasions
- Maakt bidirectionele sync mogelijk

### **SKU Unique Constraint Verwijderd:**
- Veel WooCommerce producten hebben zelfde/lege SKU
- SKU is niet betrouwbaar als unique identifier
- `woo_product_id` is de echte unique key

---

## 📞 **Hulp Nodig?**

Als de migrations niet lukken:
1. Screenshot de error
2. Check Supabase logs
3. Vraag hulp in chat

---

**Laatste update:** 2 maart 2026, 17:00

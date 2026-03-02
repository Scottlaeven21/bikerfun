# 🗄️ Supabase Migrations Voor WooCommerce Sync

**Datum:** 2 maart 2026  
**Urgentie:** 🔴 CRITICAL - Sync werkt niet zonder deze migrations!

---

## ⚠️ **Waarom Nodig?**

De WooCommerce sync faalt met:

**Error 1:** `Could not find the 'woo_product_id' column of 'occasions'`  
**Error 2:** `duplicate key value violates unique constraint "webshop_products_sku_key"`

---

## 🔧 **Wat Wordt Gefixt:**

### **Migration 1: Add `woo_product_id` to Occasions**
- Voegt `woo_product_id` kolom toe aan `occasions` tabel
- Maakt deze uniek voor sync tracking
- Zonder dit kan sync occasions niet updaten

### **Migration 2: Fix Duplicate SKU Constraint**
- Verwijdert unique constraint van `sku` kolom
- Maakt `woo_product_id` de echte unique identifier
- Meerdere producten kunnen nu dezelfde SKU hebben (gebeurt in WooCommerce)

---

## 📝 **Stap 1: Ga Naar Supabase SQL Editor**

**Link:** https://supabase.com/dashboard/project/uxepjramdcqvwafxwcxk/sql/new

---

## 📋 **Stap 2: Voer Migration 015 Uit**

**Copy-paste deze SQL:**

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

**Klik:** "Run" (rechtsboven)

**Verwacht resultaat:**
```
Success. No rows returned
```

---

## 📋 **Stap 3: Voer Migration 016 Uit**

**Copy-paste deze SQL:**

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

**Klik:** "Run" (rechtsboven)

**Verwacht resultaat:**
```
Success. No rows returned
```

---

## ✅ **Stap 4: Verifieer**

**Check of kolommen bestaan:**

```sql
-- Check occasions table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'occasions' 
AND column_name = 'woo_product_id';

-- Check webshop_products constraints
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'webshop_products';
```

**Verwacht:**
- `woo_product_id` kolom bestaat in `occasions`
- `webshop_products_woo_product_id_key` constraint bestaat
- `webshop_products_sku_key` constraint bestaat NIET meer

---

## 🚀 **Stap 5: Test Sync Opnieuw**

**Na migrations:**

1. Ga naar: `https://bikerfun.nl/admin/sync`
2. Klik: "Start Synchronisatie"
3. **Verwacht:**
   - ✅ 14 occasions geïmporteerd (geen fouten)
   - ✅ ~140 producten geïmporteerd (geen duplicate SKU errors)
   - ✅ Orders gesynct

---

## 🆘 **Als Er Fouten Zijn:**

### **Error: "relation occasions does not exist"**
- Je bent in de verkeerde database
- Check dat je in het juiste Supabase project bent

### **Error: "permission denied"**
- Je hebt geen rechten om ALTER TABLE uit te voeren
- Login met owner/admin account

### **Error blijft bestaan na migrations**
- Refresh Supabase schema cache
- Wacht 1 minuut en probeer opnieuw

---

## 📞 **Hulp Nodig?**

**Stuur screenshot van:**
1. SQL Editor met error (als die er is)
2. Sync resultaten na migrations

**WhatsApp:** 06 15 45 21 08

---

**Laatste update:** 2 maart 2026, 17:00

# 🗄️ Supabase Migrations Voor WooCommerce Sync

**Datum:** 2 maart 2026  
**Urgentie:** 🔴 CRITICAL - Sync werkt niet zonder deze migrations!

---

## ⚠️ **Waarom Nodig?**

De WooCommerce sync faalt met:

**Error 1:** `Could not find the 'woo_product_id' column of 'occasions'`  
**Error 2:** `duplicate key value violates unique constraint "webshop_products_sku_key"`  
**Error 3:** `a.from is not a function` (Next.js cache issue)

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

### **Migration 3: Add Foreign Key for Orders**
- Voegt foreign key toe tussen `order_items` en `webshop_orders`
- Zonder dit kan Supabase de relatie niet vinden

---

## 📝 **Stap 1: Ga Naar Supabase SQL Editor**

**Link:** https://supabase.com/dashboard/project/uxepjramdcqvwafxwcxk/sql/new

---

## 📋 **Stap 2: Voer ALLE Migrations UIT (Kopieer & Plak)**

**Copy-paste dit COMPLETE script:**

```sql
-- ================================================================
-- MIGRATION 015: Add woo_product_id to occasions table
-- ================================================================
ALTER TABLE occasions 
ADD COLUMN IF NOT EXISTS woo_product_id INTEGER;

-- Drop old unique constraint if exists
ALTER TABLE occasions
DROP CONSTRAINT IF EXISTS occasions_woo_product_id_key;

-- Add unique constraint
ALTER TABLE occasions
ADD CONSTRAINT occasions_woo_product_id_key UNIQUE (woo_product_id);

-- Create index for faster lookups
DROP INDEX IF EXISTS idx_occasions_woo_product_id;
CREATE INDEX idx_occasions_woo_product_id ON occasions(woo_product_id);

-- Add comment
COMMENT ON COLUMN occasions.woo_product_id IS 'WooCommerce product ID for sync tracking';


-- ================================================================
-- MIGRATION 016: Fix SKU constraint for webshop_products
-- ================================================================

-- Drop ALL possible SKU constraints (different constraint names)
DO $$ 
BEGIN
    -- Try all possible constraint names
    EXECUTE 'ALTER TABLE webshop_products DROP CONSTRAINT IF EXISTS webshop_products_sku_key';
    EXECUTE 'ALTER TABLE webshop_products DROP CONSTRAINT IF EXISTS webshop_products_sku_unique';
    EXECUTE 'ALTER TABLE webshop_products DROP CONSTRAINT IF EXISTS unique_sku';
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Some constraints may not exist, continuing...';
END $$;

-- Make SKU nullable
ALTER TABLE webshop_products 
ALTER COLUMN sku DROP NOT NULL;

-- Ensure woo_product_id is unique
ALTER TABLE webshop_products
DROP CONSTRAINT IF EXISTS webshop_products_woo_product_id_key;

ALTER TABLE webshop_products
ADD CONSTRAINT webshop_products_woo_product_id_key UNIQUE (woo_product_id);

-- Create index
DROP INDEX IF EXISTS idx_webshop_products_woo_product_id;
CREATE INDEX idx_webshop_products_woo_product_id ON webshop_products(woo_product_id);

-- Add comment
COMMENT ON COLUMN webshop_products.woo_product_id IS 'WooCommerce product ID - unique identifier for sync';


-- ================================================================
-- MIGRATION 017: Add foreign key for order_items -> webshop_orders
-- ================================================================

-- Add foreign key if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'order_items_order_id_fkey' 
        AND table_name = 'order_items'
    ) THEN
        ALTER TABLE order_items
        ADD CONSTRAINT order_items_order_id_fkey 
        FOREIGN KEY (order_id) 
        REFERENCES webshop_orders(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Create index for faster joins
DROP INDEX IF EXISTS idx_order_items_order_id;
CREATE INDEX idx_order_items_order_id ON order_items(order_id);


-- ================================================================
-- FORCE SCHEMA CACHE REFRESH
-- ================================================================

-- Notify Supabase PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: Touch the tables to force cache refresh
ALTER TABLE occasions ADD COLUMN IF NOT EXISTS _cache_buster BOOLEAN DEFAULT FALSE;
ALTER TABLE occasions DROP COLUMN IF EXISTS _cache_buster;

ALTER TABLE webshop_products ADD COLUMN IF NOT EXISTS _cache_buster BOOLEAN DEFAULT FALSE;
ALTER TABLE webshop_products DROP COLUMN IF EXISTS _cache_buster;

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS _cache_buster BOOLEAN DEFAULT FALSE;
ALTER TABLE order_items DROP COLUMN IF EXISTS _cache_buster;

ALTER TABLE webshop_orders ADD COLUMN IF NOT EXISTS _cache_buster BOOLEAN DEFAULT FALSE;
ALTER TABLE webshop_orders DROP COLUMN IF EXISTS _cache_buster;
```

**Klik:** "Run" (rechtsboven)

**Verwacht resultaat:**
```
Success. No rows returned
```

---

## ✅ **Stap 3: Clear Next.js Cache**

**De migrations zijn nu klaar, maar Next.js heeft oude cache!**

**Run in terminal:**
```bash
# Stop dev server (Ctrl+C)

# Clear all caches
rm -rf .next
rm -rf node_modules/.cache

# Restart dev server
npm run dev
```

**Of op Windows:**
```powershell
# Stop dev server (Ctrl+C)

# Clear all caches
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# Restart dev server
npm run dev
```

---

## ✅ **Stap 4: Verifieer (Optioneel)**

**Check of alles goed is gegaan:**

```sql
-- Check 1: occasions.woo_product_id column
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'occasions' 
AND column_name = 'woo_product_id';

-- Check 2: webshop_products constraints (SKU moet WEG zijn)
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'webshop_products'
AND constraint_name LIKE '%sku%';

-- Check 3: order_items foreign key
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'order_items'
AND constraint_name = 'order_items_order_id_fkey';
```

**Verwacht:**
- ✅ `woo_product_id` kolom bestaat in `occasions`
- ✅ GEEN SKU constraints meer voor `webshop_products`
- ✅ `order_items_order_id_fkey` bestaat

---

## 🚀 **Stap 5: Test Sync Opnieuw**

**BELANGRIJK: Wacht 30 seconden na de migrations voordat je test!**  
(Supabase heeft tijd nodig om schema cache te refreshen)

**Test in terminal:**
```bash
npm run sync-test
```

**Of via API:**
```bash
curl -X GET http://localhost:3000/api/admin/sync-woocommerce
```

**Verwacht resultaat:**
- ✅ Occasions: 6 imported/updated (geen cache errors)
- ✅ Products: 90+ imported/updated (geen SKU errors)
- ✅ Orders: Synced (geen relationship errors)

---

## 🆘 **Troubleshooting:**

### **Error: "Could not find the 'woo_product_id' column in schema cache"**
**Oplossing:**
1. Wacht 30-60 seconden (cache refresh duurt even)
2. Test opnieuw
3. Als nog fout: herstart Next.js dev server (`npm run dev`)

### **Error: "duplicate key value violates unique constraint webshop_products_sku_key"**
**Oplossing:**
1. De constraint is niet goed verwijderd
2. Run dit handmatig:
```sql
-- Find actual constraint name
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_name = 'webshop_products' AND constraint_name LIKE '%sku%';

-- Drop it with exact name
ALTER TABLE webshop_products DROP CONSTRAINT [exact_name_hier];
```

### **Error: "Could not find relationship webshop_orders/order_items"**
**Oplossing:**
1. Foreign key niet correct aangemaakt
2. Run migration 017 opnieuw
3. Wacht 30 seconden voor cache refresh

### **Error: "a.from is not a function"**
**Oplossing:**
1. Next.js build cache is stale
2. Stop dev server (Ctrl+C)
3. Delete `.next` folder
4. Run `npm run dev` opnieuw

### **Error: "permission denied"**
- Je hebt geen rechten om ALTER TABLE uit te voeren
- Login met owner/admin account in Supabase

---

## 📞 **Hulp Nodig?**

**Stuur screenshot van:**
1. SQL Editor met error (als die er is)
2. Sync resultaten na migrations

**WhatsApp:** 06 15 45 21 08

---

**Laatste update:** 2 maart 2026, 17:41

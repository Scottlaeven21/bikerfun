# Manual Overrides - SQL Stappenplan

## Stap 1: Check of kolom al bestaat

Run dit eerst:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'occasions' 
AND column_name = 'manual_overrides';
```

**Als dit GEEN resultaat geeft** → Ga door naar Stap 2  
**Als dit WEL een resultaat geeft** → Kolom bestaat al, ga naar Stap 3

---

## Stap 2: Voeg kolommen toe (ALLEEN als ze nog niet bestaan)

Run deze queries **één voor één**:

### Query 1: Voeg kolom toe aan occasions
```sql
ALTER TABLE occasions 
ADD COLUMN manual_overrides JSONB DEFAULT '[]'::jsonb;
```

### Query 2: Voeg kolom toe aan webshop_products
```sql
ALTER TABLE webshop_products 
ADD COLUMN manual_overrides JSONB DEFAULT '[]'::jsonb;
```

---

## Stap 3: Voeg indexes toe

Run deze queries **één voor één**:

### Query 3: Index voor occasions
```sql
CREATE INDEX IF NOT EXISTS idx_occasions_manual_overrides 
ON occasions USING gin (manual_overrides);
```

### Query 4: Index voor webshop_products
```sql
CREATE INDEX IF NOT EXISTS idx_webshop_products_manual_overrides 
ON webshop_products USING gin (manual_overrides);
```

---

## Stap 4: Voeg helper functies toe

Run deze queries **één voor één**:

### Query 5: add_manual_override functie
```sql
CREATE OR REPLACE FUNCTION add_manual_override(
  table_name TEXT,
  record_id UUID,
  field_name TEXT
) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET manual_overrides = 
      CASE 
        WHEN manual_overrides ? %L THEN manual_overrides
        ELSE manual_overrides || jsonb_build_array(%L)
      END
    WHERE id = %L',
    table_name, field_name, field_name, record_id
  );
END;
$$ LANGUAGE plpgsql;
```

### Query 6: remove_manual_override functie
```sql
CREATE OR REPLACE FUNCTION remove_manual_override(
  table_name TEXT,
  record_id UUID,
  field_name TEXT
) RETURNS void AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET manual_overrides = manual_overrides - %L
    WHERE id = %L',
    table_name, field_name, record_id
  );
END;
$$ LANGUAGE plpgsql;
```

### Query 7: has_manual_override functie
```sql
CREATE OR REPLACE FUNCTION has_manual_override(
  overrides JSONB,
  field_name TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN overrides ? field_name;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

---

## Stap 5: Verificatie

Run dit om te checken of alles werkt:

```sql
SELECT 
  table_name,
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('occasions', 'webshop_products') 
AND column_name = 'manual_overrides';
```

**Verwacht resultaat:** 2 rijen met `jsonb` als data_type

---

## Als Je Nog Steeds Errors Krijgt

### Error: "column already exists"
```sql
-- Check huidige staat
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'occasions';
```

### Error: "syntax error"
- Kopieer queries **precies** zoals hierboven staat
- Run ze **één voor één**, niet allemaal tegelijk
- Zorg dat er geen extra spaties of rare karakters zijn

---

## Test Het Systeem

Na alle queries:

```sql
-- Test 1: Zie occasions met lege manual_overrides
SELECT id, brand, model, manual_overrides 
FROM occasions 
LIMIT 3;

-- Test 2: Test de add functie
SELECT add_manual_override(
  'occasions', 
  (SELECT id FROM occasions LIMIT 1), 
  'price'
);

-- Test 3: Check of het werkte
SELECT brand, model, manual_overrides 
FROM occasions 
WHERE manual_overrides != '[]'::jsonb;
```

**Verwacht resultaat voor Test 3:** Één occasion met `["price"]` in manual_overrides

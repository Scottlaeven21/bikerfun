# 🗄️ Supabase Database Setup - HANDMATIGE STAPPEN

## ⚠️ BELANGRIJK: Deze stappen EERST uitvoeren voor de CSV import!

---

## STAP 1: Open Supabase SQL Editor

1. Ga naar: **https://supabase.com/dashboard**
2. Log in met je account
3. Select project: **uxepjramdcqvwafxwcxk**
4. Klik links op: **SQL Editor**
5. Klik: **+ New Query**

---

## STAP 2: Maak webshop_products Tabel

**Kopieer en plak deze HELE SQL code in de SQL Editor:**

```sql
-- Webshop Products Table
CREATE TABLE IF NOT EXISTS public.webshop_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  woo_product_id INTEGER UNIQUE,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  regular_price DECIMAL(10,2) NOT NULL,
  on_sale BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'instock',
  manage_stock BOOLEAN DEFAULT true,
  backorders_allowed BOOLEAN DEFAULT false,
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]',
  status TEXT DEFAULT 'publish',
  featured BOOLEAN DEFAULT false,
  catalog_visibility TEXT DEFAULT 'visible',
  weight DECIMAL(10,2),
  dimensions JSONB,
  shipping_class TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webshop_products_sku ON public.webshop_products(sku);
CREATE INDEX IF NOT EXISTS idx_webshop_products_slug ON public.webshop_products(slug);
CREATE INDEX IF NOT EXISTS idx_webshop_products_status ON public.webshop_products(status);
CREATE INDEX IF NOT EXISTS idx_webshop_products_categories ON public.webshop_products USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_webshop_products_woo_id ON public.webshop_products(woo_product_id);

-- RLS Policies
ALTER TABLE public.webshop_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published products" ON public.webshop_products;
CREATE POLICY "Public can view published products"
  ON public.webshop_products
  FOR SELECT
  USING (status = 'publish');

DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.webshop_products;
CREATE POLICY "Authenticated users can manage products"
  ON public.webshop_products
  FOR ALL
  USING (auth.role() = 'authenticated');
```

**Klik: RUN** (of Ctrl+Enter)

✅ Je zou moeten zien: "Success. No rows returned"

---

## STAP 3: Maak webshop_orders Tabellen

**Klik: + New Query (nieuwe query)**

**Kopieer en plak deze SQL:**

```sql
-- Webshop Orders Table
CREATE TABLE IF NOT EXISTS public.webshop_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  mollie_payment_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'mollie',
  woo_order_id INTEGER,
  synced_to_woo BOOLEAN DEFAULT false,
  sync_error TEXT,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  billing_first_name TEXT NOT NULL,
  billing_last_name TEXT NOT NULL,
  billing_company TEXT,
  billing_address_1 TEXT NOT NULL,
  billing_address_2 TEXT,
  billing_city TEXT NOT NULL,
  billing_postcode TEXT NOT NULL,
  billing_country TEXT DEFAULT 'NL',
  shipping_first_name TEXT,
  shipping_last_name TEXT,
  shipping_company TEXT,
  shipping_address_1 TEXT,
  shipping_address_2 TEXT,
  shipping_city TEXT,
  shipping_postcode TEXT,
  shipping_country TEXT DEFAULT 'NL',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_total DECIMAL(10,2) DEFAULT 0,
  tax_total DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  customer_note TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.webshop_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.webshop_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.webshop_products(id) ON DELETE SET NULL,
  woo_product_id INTEGER,
  product_name TEXT NOT NULL,
  product_sku TEXT,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_webshop_orders_mollie_id ON public.webshop_orders(mollie_payment_id);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_email ON public.webshop_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_webshop_orders_status ON public.webshop_orders(status);
CREATE INDEX IF NOT EXISTS idx_webshop_order_items_order_id ON public.webshop_order_items(order_id);

-- RLS Policies
ALTER TABLE public.webshop_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webshop_order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.webshop_orders;
CREATE POLICY "Authenticated users can view orders"
  ON public.webshop_orders FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.webshop_orders;
CREATE POLICY "Authenticated users can manage orders"
  ON public.webshop_orders FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.webshop_order_items;
CREATE POLICY "Authenticated users can view order items"
  ON public.webshop_order_items FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.webshop_order_items;
CREATE POLICY "Authenticated users can manage order items"
  ON public.webshop_order_items FOR ALL
  USING (auth.role() = 'authenticated');
```

**Klik: RUN**

✅ Je zou moeten zien: "Success. No rows returned"

---

## STAP 4: Verificeer Tabellen

**Run deze query om te checken:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'webshop%';
```

**Je zou moeten zien:**
- webshop_products ✅
- webshop_orders ✅
- webshop_order_items ✅

---

## STAP 5: Run CSV Import

**Nu terug naar terminal/Cursor:**

```bash
npm run import:products
```

Dit import ~696 producten van WooCommerce naar Supabase!

---

## ❓ HULP NODIG?

**Zie je errors in Supabase?**
- Check of alle SQL correct gekopieerd is
- Check of er geen type errors zijn

**CSV import faalt?**
- Check of data folder bestaat
- Check of woocommerce-products.csv bestaat

**Vragen?**
- Screenshot de error
- Ik help je verder!

---

**STATUS:** 📋 Volg deze stappen, dan kunnen we daarna de CSV importeren!

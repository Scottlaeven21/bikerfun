# 🛒 Checkout Database Fix

## Probleem
De checkout API gaf een **500 error** omdat:
1. ❌ Verkeerde kolomnamen (bijv. `customer_name`, `billing_address` als JSON)
2. ❌ RLS policies blokkeerden anonymous users (checkout zonder login)

## Oplossing - Uitgevoerd ✅

### 1. Checkout API gefixed
De code gebruikt nu de **correcte database kolommen**:
- `billing_first_name`, `billing_last_name`, `billing_address_1`, etc.
- `shipping_total` in plaats van `shipping_cost`
- Automatische `order_number` generatie via database functie

### 2. Database Migration - **JIJ MOET DIT NOG UITVOEREN!**

**Stap 1:** Ga naar **Supabase Dashboard**
- https://supabase.com/dashboard/project/uxepjramdcqvwafxwcxk

**Stap 2:** Ga naar **SQL Editor** (linkermenu)

**Stap 3:** Kopieer en plak deze SQL en klik **RUN**:

```sql
-- Fix RLS policies for webshop orders
-- Anonymous users need to be able to create orders during checkout

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.webshop_orders;
DROP POLICY IF EXISTS "Authenticated users can manage order items" ON public.webshop_order_items;

-- Allow anonymous users to INSERT orders (for checkout)
CREATE POLICY "Anonymous users can create orders"
  ON public.webshop_orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to INSERT order items (for checkout)
CREATE POLICY "Anonymous users can create order items"
  ON public.webshop_order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role (API) to do everything
CREATE POLICY "Service role can manage orders"
  ON public.webshop_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage order items"
  ON public.webshop_order_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admin) can UPDATE/DELETE orders
CREATE POLICY "Authenticated users can update orders"
  ON public.webshop_orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON public.webshop_orders
  FOR DELETE
  TO authenticated
  USING (true);
```

**Stap 4:** Verifieer
- Je zou moeten zien: "Success. No rows returned"
- **Geen errors!**

---

## Test de Checkout

**Na deployment (over ~2 minuten):**

1. Ga naar `bikerfun.nl/products`
2. Voeg een product toe aan winkelwagen
3. Ga naar checkout
4. Vul testgegevens in
5. Klik op **"Bestelling Plaatsen"**

**Verwacht resultaat:**
✅ Redirect naar Mollie betaalpagina
✅ Order aangemaakt in Supabase `webshop_orders` tabel

---

## Wat is er gefixed?

### Code Aanpassingen:
```typescript
// VOOR (❌ Fout):
{
  customer_name: "John Doe",
  billing_address: { ... }, // JSONB object
  shipping_cost: 6.95
}

// NA (✅ Correct):
{
  billing_first_name: "John",
  billing_last_name: "Doe",
  billing_address_1: "Hoofdstraat 123",
  billing_city: "Amsterdam",
  shipping_total: 6.95,
  order_number: "BF-20260226-001" // Auto-generated
}
```

### Database Permissions:
- ✅ **Anonymous users** kunnen nu orders aanmaken (checkout)
- ✅ **Authenticated users** (admin) kunnen orders beheren
- ✅ **Service role** (API) heeft volledige toegang

---

## Verificatie

Na de migration kun je checken of alles werkt:

1. **Check policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'webshop_orders';
   ```

2. **Test order insert:**
   ```sql
   SELECT generate_order_number(); -- Should return something like BF-20260226-001
   ```

---

**Zodra je de SQL hebt uitgevoerd in Supabase, werkt de checkout!** 🎉

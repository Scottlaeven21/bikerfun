# 🚀 Button Animaties - Quick Reference

## Snelle Class Referentie

| Class | Effect | Gebruik | Prioriteit |
|-------|--------|---------|------------|
| `.btn-shimmer` | Glinsterend licht | Hover | ⭐⭐⭐⭐ |
| `.btn-ripple` | Click golf | Click | ⭐⭐⭐⭐⭐ |
| `.btn-3d` | Diepte effect | Hover/Active | ⭐⭐⭐⭐ |
| `.btn-glow` | Gloeiend licht | Hover | ⭐⭐⭐ |
| `.btn-pulse` | Pulseren | Altijd | ⚠️ Spaarzaam! |
| `.btn-loading` | Spinner | Loading state | ⭐⭐⭐⭐⭐ |
| `.btn-success` | Scale | Success state | ⭐⭐⭐⭐ |
| `.btn-primary` | Color shift | Hover | ⭐⭐⭐⭐ |
| `.btn-secondary` | Slide up | Hover | ⭐⭐⭐⭐ |
| `.btn-form` | Subtle scale | Hover/Active | ⭐⭐⭐ |

---

## 🎯 Voorgedefinieerde Combinaties

### Voor Product Buttons
```html
<!-- Add to Cart -->
<button class="btn-shimmer btn-ripple btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Toevoegen aan winkelwagen
</button>

<!-- Buy Now -->
<button class="btn-shimmer btn-glow btn-3d bg-slate-900 text-white px-8 py-4 rounded-lg">
  Direct kopen
</button>
```

### Voor Checkout/Payment
```html
<!-- Ultimate Attention -->
<button class="btn-shimmer btn-glow btn-pulse btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Afrekenen
</button>
```

### Voor Forms
```html
<!-- Login/Register -->
<button class="btn-shimmer btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Inloggen
</button>

<!-- With Loading State -->
<button class="${loading ? 'btn-loading' : 'btn-shimmer btn-3d'} bg-red-600 text-white px-8 py-4 rounded-lg">
  {loading ? 'Laden...' : 'Verzenden'}
</button>
```

### Voor Kleine Buttons (Quantity, Icons)
```html
<!-- Plus/Minus -->
<button class="btn-ripple px-3 py-1 hover:bg-gray-100 hover:scale-110">
  +
</button>

<!-- Remove -->
<button class="btn-ripple hover:scale-110 text-red-600">
  <svg>...</svg>
</button>
```

### Voor Hero CTA's
```html
<!-- Primary CTA -->
<a href="/products" class="btn-primary bg-biker-yellow text-biker-black px-10 py-4 rounded-full">
  BEKIJK AANBOD
</a>

<!-- Secondary CTA -->
<a href="/contact" class="btn-secondary bg-transparent text-white px-10 py-4 rounded-full border-2 border-white">
  CONTACT
</a>
```

---

## ⚡ Snelle Beslisboom

```
Start hier
    │
    ├─ Kleine button (+/-, icons)?
    │   └─ Gebruik: btn-ripple + hover:scale-110
    │
    ├─ Form submit?
    │   └─ Gebruik: btn-shimmer btn-3d (+ btn-loading voor state)
    │
    ├─ Product actie (add to cart, buy)?
    │   ├─ Primary: btn-shimmer btn-ripple btn-3d
    │   └─ Secondary: btn-shimmer btn-glow btn-3d
    │
    ├─ Checkout/Payment?
    │   └─ Gebruik: btn-shimmer btn-glow btn-pulse btn-3d
    │
    └─ Hero/Landing CTA?
        ├─ Primary: btn-primary
        └─ Secondary: btn-secondary
```

---

## 🎨 Combinatie Matrix

| Button Type | Base | Hover | Click | State |
|-------------|------|-------|-------|-------|
| **Product - Add to Cart** | Red BG | Shimmer + 3D | Ripple | Success |
| **Product - Buy Now** | Dark BG | Shimmer + Glow + 3D | Ripple | - |
| **Checkout** | Red BG | Shimmer + Glow + 3D | Ripple | Pulse |
| **Form Submit** | Red BG | Shimmer + 3D | - | Loading |
| **Quantity Control** | Border | Scale | Ripple | - |
| **Remove/Delete** | Icon | Scale | Ripple | - |
| **Hero Primary** | Yellow BG | Primary | - | - |
| **Hero Secondary** | Transparent | Secondary | - | - |

---

## 💡 Cheat Sheet

### DO ✅
```tsx
// Combineer effecten voor belangrijke buttons
className="btn-shimmer btn-ripple btn-3d"

// Gebruik conditional classes voor states
className={`btn-shimmer btn-3d ${loading ? 'btn-loading' : ''}`}

// Gebruik ripple voor alle clickable items
className="btn-ripple hover:scale-110"

// Gebruik pulse alleen voor urgente acties
className="btn-pulse" // Maximum 1-2 per pagina!
```

### DON'T ❌
```tsx
// Niet te veel effecten combineren
className="btn-shimmer btn-ripple btn-3d btn-glow btn-pulse" // Te veel!

// Niet pulse op meerdere buttons
<button className="btn-pulse">Button 1</button>
<button className="btn-pulse">Button 2</button> // Nee!

// Niet animaties op disabled buttons
<button disabled className="btn-shimmer"> // Werkt niet goed

// Niet conflicterende transitions
style={{ transition: 'all 0.1s' }} className="btn-3d" // Conflict!
```

---

## 🏃‍♂️ Copy-Paste Templates

### Template 1: Standard Product Button
```tsx
<button 
  onClick={handleAddToCart}
  className="btn-shimmer btn-ripple btn-3d bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold"
>
  Toevoegen aan winkelwagen
</button>
```

### Template 2: Premium Checkout Button
```tsx
<Link
  href="/checkout"
  className="btn-shimmer btn-glow btn-pulse btn-3d bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-center block"
>
  Afrekenen
</Link>
```

### Template 3: Form Button with Loading
```tsx
const [loading, setLoading] = useState(false);

<button
  type="submit"
  disabled={loading}
  className={`w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold btn-shimmer btn-3d ${
    loading ? 'btn-loading' : ''
  }`}
>
  {loading ? 'Bezig met laden...' : 'Verzenden'}
</button>
```

### Template 4: Quantity Control
```tsx
<div className="flex items-center border rounded-lg overflow-hidden">
  <button 
    onClick={() => decrease()}
    className="px-3 py-1 hover:bg-gray-100 btn-ripple hover:scale-110"
  >
    -
  </button>
  <span className="px-4 py-1 border-x">{quantity}</span>
  <button 
    onClick={() => increase()}
    className="px-3 py-1 hover:bg-gray-100 btn-ripple hover:scale-110"
  >
    +
  </button>
</div>
```

### Template 5: Hero CTA Buttons
```tsx
<div className="flex gap-4">
  <Link
    href="/products"
    className="btn-primary bg-biker-yellow text-biker-black px-10 py-4 rounded-full font-bold uppercase"
  >
    BEKIJK AANBOD
  </Link>
  <Link
    href="/contact"
    className="btn-secondary bg-transparent text-white px-10 py-4 rounded-full font-bold uppercase border-2 border-white"
  >
    CONTACT
  </Link>
</div>
```

### Template 6: Success Feedback
```tsx
const [added, setAdded] = useState(false);

<button
  onClick={() => {
    addToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }}
  className={`btn-shimmer btn-ripple btn-3d bg-red-600 text-white px-8 py-4 rounded-lg ${
    added ? 'btn-success' : ''
  }`}
>
  {added ? '✓ Toegevoegd!' : 'Toevoegen'}
</button>
```

---

## 🎨 BikerFun Kleuren

```tsx
// Primary Colors
bg-biker-yellow    // #f5c80d
text-biker-black   // #000000

// Standard Colors
bg-red-600         // Product actions
bg-slate-900       // Premium actions
bg-green-600       // Success
bg-gray-900        // Forms
```

---

## 🔥 Meest Gebruikte Combinaties

### Top 5 Most Used
1. `btn-shimmer btn-ripple btn-3d` - Product buttons (80%)
2. `btn-shimmer btn-3d` - Form buttons (60%)
3. `btn-ripple hover:scale-110` - Small buttons (90%)
4. `btn-shimmer btn-glow btn-pulse btn-3d` - Checkout (100%)
5. `btn-loading` - Loading states (100%)

---

## 📱 Responsive Tips

```tsx
// Mobile-first approach
<button className="
  btn-shimmer btn-3d 
  px-4 py-2           // Mobile
  sm:px-6 sm:py-3     // Tablet
  md:px-8 md:py-4     // Desktop
  text-sm sm:text-base md:text-lg
">
  Responsive Button
</button>
```

---

## 🎯 Performance Checklist

- ✅ Gebruik hardware-accelerated properties (transform, opacity)
- ✅ Avoid: width, height, top, left animaties
- ✅ Gebruik will-change spaarzaam
- ✅ Test op echte apparaten
- ✅ Monitor FPS in DevTools
- ✅ Respecteer prefers-reduced-motion

---

## 🚀 Testen

```bash
# Open de demo pagina
http://localhost:3000/button-demo

# Test scenarios:
1. Hover over alle buttons
2. Click en kijk naar ripple
3. Test loading states
4. Test op mobile (DevTools)
5. Test keyboard navigation
6. Test with reduced motion
```

---

## 📚 Meer Info

- **Full Documentation:** `BUTTON_ANIMATIONS.md`
- **Changelog:** `BUTTON_ANIMATIONS_CHANGELOG.md`
- **Demo Page:** `/button-demo`
- **Source Code:** `app/globals.css`

---

**BikerFun 🏍️ - Vrijheid begint op twee wielen**

# 🎨 Button Animaties - BikerFun Website

Dit document bevat alle moderne button animaties die beschikbaar zijn op de BikerFun website.

## 📚 Overzicht van Animaties

### 1. **Shimmer Effect** - `.btn-shimmer`
Een glinsterend lichteffect dat over de button beweegt bij hover.

**Gebruik:**
```jsx
<button className="btn-shimmer bg-red-600 text-white px-8 py-4 rounded-lg">
  Toevoegen aan winkelwagen
</button>
```

**Best voor:** Primaire CTA buttons, belangrijke actie buttons

---

### 2. **Ripple Effect** - `.btn-ripple`
Een golf-effect dat verschijnt wanneer je op de button klikt.

**Gebruik:**
```jsx
<button className="btn-ripple px-4 py-2 hover:bg-gray-100">
  +
</button>
```

**Best voor:** Kleine interactieve buttons, quantity controls, icoon buttons

---

### 3. **3D Button Effect** - `.btn-3d`
Een diepte-effect met schaduw die beweegt bij hover en drukken.

**Gebruik:**
```jsx
<button className="btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Direct kopen
</button>
```

**Best voor:** Belangrijke actie buttons, koop buttons, submit buttons

---

### 4. **Glow Effect** - `.btn-glow`
Een gloeiend licht effect rondom de button bij hover.

**Gebruik:**
```jsx
<button className="btn-glow bg-slate-900 text-white px-8 py-4 rounded-lg">
  Direct kopen
</button>
```

**Best voor:** Dark themed buttons, premium features, checkout buttons

---

### 5. **Pulse Animation** - `.btn-pulse`
Een zachte pulserende animatie die constant loopt (let op: gebruik spaarzaam!).

**Gebruik:**
```jsx
<Link href="/checkout" className="btn-pulse bg-red-600 text-white px-8 py-4 rounded-lg">
  Afrekenen
</Link>
```

**Best voor:** Urgente actie buttons, limited time offers, checkout buttons

**⚠️ Waarschuwing:** Gebruik alleen voor zeer belangrijke buttons die continue aandacht nodig hebben.

---

### 6. **Loading Animation** - `.btn-loading`
Een draaiende spinner voor loading states.

**Gebruik:**
```jsx
<button 
  className={`bg-red-600 text-white px-8 py-4 rounded-lg ${loading ? 'btn-loading' : ''}`}
  disabled={loading}
>
  {loading ? 'Bezig met laden...' : 'Doorgaan naar Betaling'}
</button>
```

**Best voor:** Submit buttons, async operations, form submissions

---

### 7. **Success Animation** - `.btn-success`
Een korte scale animatie voor success feedback.

**Gebruik:**
```jsx
<button 
  className={`bg-red-600 text-white px-8 py-4 rounded-lg ${added ? 'btn-success' : ''}`}
>
  {added ? '✓ Toegevoegd!' : 'Toevoegen aan winkelwagen'}
</button>
```

**Best voor:** Success states, "Added to cart" feedback

---

### 8. **Primary Button** - `.btn-primary`
De standaard primary button met een smooth hover transition.

**Gebruik:**
```jsx
<Link href="/occasions" className="btn-primary bg-biker-yellow text-biker-black px-10 py-4 rounded-full">
  BEKIJK AANBOD
</Link>
```

**Best voor:** Hero CTAs, belangrijke navigatie links

---

### 9. **Secondary Button** - `.btn-secondary`
Een secondary button met een slide-up fill effect.

**Gebruik:**
```jsx
<Link href="/contact" className="btn-secondary bg-transparent text-white px-10 py-4 rounded-full border-2 border-white">
  CONTACT
</Link>
```

**Best voor:** Secondary CTAs, outline buttons

---

### 10. **Form Button** - `.btn-form`
Een subtle scale effect voor form submit buttons.

**Gebruik:**
```jsx
<button type="submit" className="btn-form bg-gray-900 text-white px-6 py-3 rounded-lg">
  Verzenden
</button>
```

**Best voor:** Form submits, login/register buttons

---

## 🎯 Combinatie Voorbeelden

### Ultieme Product Button (Shimmer + Ripple + 3D)
```jsx
<button className="btn-shimmer btn-ripple btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Toevoegen aan winkelwagen
</button>
```

### Premium Checkout Button (Shimmer + Glow + Pulse + 3D)
```jsx
<Link href="/checkout" className="btn-shimmer btn-glow btn-pulse btn-3d bg-red-600 text-white px-8 py-4 rounded-lg">
  Afrekenen
</Link>
```

### Subtle Interactive Button (Ripple only)
```jsx
<button className="btn-ripple px-3 py-1 hover:bg-gray-100">
  +
</button>
```

---

## 🎨 Kleurenschema BikerFun

```css
--biker-yellow: #f5c80d
--biker-black: #000000
--biker-dark: #0f0f0f
--biker-gray: #2a2a2a
--biker-muted: #bdbdbd
```

---

## 📱 Responsive Considerations

Alle animaties zijn geoptimaliseerd voor:
- ✅ Desktop hover states
- ✅ Mobile touch interactions
- ✅ Tablet/hybrid devices
- ✅ Reduced motion preferences

---

## 🎭 Best Practices

### ✅ DO's
- Gebruik meerdere effecten voor belangrijke buttons (shimmer + 3d + ripple)
- Gebruik pulse animatie alleen voor zeer belangrijke acties
- Combineer glow effect met donkere achtergronden
- Gebruik loading states bij async operations
- Test animaties op echte apparaten

### ❌ DON'Ts
- Gebruik niet teveel pulse animaties op één pagina
- Vermijd zware animaties op kleine buttons
- Geen animaties op disabled buttons
- Niet combineren met conflicterende transitions
- Geen animaties die de UX verstoren

---

## 🔧 Technische Details

### Performance
Alle animaties gebruiken:
- CSS transforms (hardware accelerated)
- Will-change voor optimale performance
- Cubic-bezier easing voor natuurlijke bewegingen

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Accessibility
- Respecteert `prefers-reduced-motion`
- Keyboard navigation vriendelijk
- Screen reader vriendelijk
- Focus states behouden

---

## 📝 Implementatie Locaties

De animaties zijn al toegepast op:

1. **Product Pages**
   - Add to cart buttons (shimmer + ripple + 3d)
   - Buy now buttons (shimmer + glow + 3d)
   - Quantity controls (ripple)

2. **Cart & Checkout**
   - Checkout button (shimmer + glow + pulse + 3d)
   - Continue shopping (shimmer + 3d)
   - Payment button (shimmer + glow + 3d + loading)

3. **Auth Forms**
   - Login button (shimmer + 3d + loading)
   - Register button (shimmer + 3d + loading)

4. **Cart Items**
   - Quantity buttons (ripple + scale)
   - Remove buttons (ripple + scale)

---

## 🚀 Toekomstige Uitbreidingen

Mogelijke nieuwe animaties:
- Gradient shift effect
- Particle burst on click
- Neon glow effect (voor speciale promo's)
- Slide reveal with icon
- Morphing shape animations

---

## 🎨 Custom Animations Maken

Alle animaties zijn gedefinieerd in `app/globals.css` in de `@layer components` sectie.

Voorbeeld van een nieuwe animatie toevoegen:

```css
@layer components {
  .btn-custom {
    position: relative;
    transition: all 0.3s ease;
  }
  
  .btn-custom:hover {
    /* Jouw custom hover state */
  }
  
  @keyframes custom-animation {
    /* Jouw custom keyframes */
  }
}
```

---

**Gemaakt voor BikerFun** 🏍️  
*Vrijheid begint op twee wielen*

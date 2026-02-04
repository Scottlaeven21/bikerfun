# 📁 Bikerfun Project Structure

Complete overzicht van de projectstructuur en belangrijkste bestanden.

```
bikerfun-shop/
├── app/                                    # Next.js App Router
│   ├── (admin)/                           # Admin route group
│   │   ├── layout.tsx                     # Admin layout met sidebar
│   │   └── admin/
│   │       ├── page.tsx                   # Admin dashboard
│   │       ├── products/
│   │       │   └── page.tsx               # Producten beheer
│   │       ├── categories/
│   │       │   └── page.tsx               # Categorieën beheer
│   │       └── orders/
│   │           └── page.tsx               # Bestellingen beheer
│   │
│   ├── (auth)/                            # Auth route group
│   │   ├── layout.tsx                     # Auth layout (centered)
│   │   ├── login/
│   │   │   └── page.tsx                   # Login pagina
│   │   └── register/
│   │       └── page.tsx                   # Registratie pagina
│   │
│   ├── (dashboard)/                       # User dashboard route group
│   │   ├── layout.tsx                     # Dashboard layout
│   │   └── dashboard/
│   │       └── page.tsx                   # Bestelgeschiedenis
│   │
│   ├── (shop)/                            # Public shop route group
│   │   ├── layout.tsx                     # Shop layout met navbar/footer
│   │   ├── page.tsx                       # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx                   # Product listing
│   │   │   └── [slug]/
│   │   │       ├── page.tsx               # Product detail
│   │   │       └── not-found.tsx          # Product niet gevonden
│   │   ├── cart/
│   │   │   └── page.tsx                   # Winkelwagen
│   │   └── checkout/
│   │       ├── page.tsx                   # Checkout formulier
│   │       └── success/
│   │           └── page.tsx               # Checkout success
│   │
│   ├── api/                               # API Routes
│   │   ├── checkout/
│   │   │   └── route.ts                   # Stripe checkout session
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts               # Stripe webhook handler
│   │
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Root page (tijdelijk)
│   ├── globals.css                        # Global styles
│   ├── loading.tsx                        # Global loading state
│   ├── error.tsx                          # Global error boundary
│   └── not-found.tsx                      # 404 pagina
│
├── components/                            # React components
│   ├── auth/                              # Auth componenten
│   │   ├── login-form.tsx                 # Login formulier
│   │   └── register-form.tsx              # Registratie formulier
│   │
│   ├── cart/                              # Winkelwagen componenten
│   │   └── cart-item.tsx                  # Cart item component
│   │
│   ├── layout/                            # Layout componenten
│   │   ├── navbar.tsx                     # Navigatie bar
│   │   ├── navbar-client.tsx              # Client wrapper voor navbar
│   │   └── footer.tsx                     # Footer
│   │
│   └── products/                          # Product componenten
│       ├── product-card.tsx               # Product card (grid item)
│       └── add-to-cart-button.tsx         # Add to cart functionaliteit
│
├── hooks/                                 # Custom React hooks
│   └── use-cart.ts                        # Zustand cart store
│
├── lib/                                   # Libraries & utilities
│   ├── supabase/                          # Supabase clients
│   │   ├── client.ts                      # Browser client
│   │   ├── server.ts                      # Server client
│   │   └── middleware.ts                  # Middleware helper
│   │
│   ├── stripe/                            # Stripe setup
│   │   ├── client.ts                      # Stripe.js loader
│   │   └── server.ts                      # Stripe server client
│   │
│   └── utils/                             # Utility functies
│       └── format.ts                      # Formatters (price, date, slug)
│
├── supabase/                              # Supabase migrations
│   └── migrations/
│       ├── 001_initial_schema.sql         # Database schema
│       ├── 002_row_level_security.sql     # RLS policies
│       └── 003_seed_data.sql              # Seed data
│
├── types/                                 # TypeScript types
│   ├── database.ts                        # Database types
│   └── index.ts                           # Exported types
│
├── .env.local                             # Environment variables (niet in git)
├── .env.local.example                     # Environment template
├── .gitignore                             # Git ignore regels
├── middleware.ts                          # Next.js middleware
├── next.config.ts                         # Next.js configuratie
├── package.json                           # NPM dependencies
├── postcss.config.mjs                     # PostCSS config
├── tailwind.config.ts                     # Tailwind config
├── tsconfig.json                          # TypeScript config
├── README.md                              # Project README
├── SETUP.md                               # Setup handleiding
├── FEATURES.md                            # Features overzicht
└── PROJECT_STRUCTURE.md                   # Dit bestand
```

## 🗂️ Belangrijke Bestanden Uitgelegd

### Root Configuratie

- **`next.config.ts`**: Next.js configuratie, image domains
- **`middleware.ts`**: Route guards voor auth/admin
- **`tailwind.config.ts`**: Kleuren, fonts, theme extensies
- **`tsconfig.json`**: TypeScript compiler opties

### Database (Supabase)

- **`001_initial_schema.sql`**: Tabellen, columns, indexes, triggers
- **`002_row_level_security.sql`**: RLS policies voor beveiliging
- **`003_seed_data.sql`**: Test data (categorieën, producten)

### Type Definities

- **`types/database.ts`**: Supabase table types
- **`types/index.ts`**: Cart, Checkout types

### API Routes

- **`app/api/checkout/route.ts`**: 
  - POST: Maak Stripe checkout session
  - Valideer cart items
  - Bereken totalen

- **`app/api/webhooks/stripe/route.ts`**:
  - POST: Verwerk Stripe events
  - Maak orders aan na betaling
  - Update order status

### State Management

- **`hooks/use-cart.ts`**: 
  - Zustand store voor winkelwagen
  - Persist in localStorage
  - Totalen berekeningen

### Layouts

- **`app/layout.tsx`**: Root layout (metadata, globals.css)
- **`app/(shop)/layout.tsx`**: Shop layout (navbar + footer)
- **`app/(auth)/layout.tsx`**: Auth layout (centered form)
- **`app/(dashboard)/layout.tsx`**: Dashboard layout (protected)
- **`app/(admin)/layout.tsx`**: Admin layout (sidebar + protected)

### Server vs Client Components

#### Server Components (default)
- Product listings
- Product detail
- Order history
- Admin tables
- Homepage

#### Client Components ('use client')
- Forms (login, register, checkout)
- Cart (state + interactions)
- Add to cart button
- Navbar (voor cart count)

## 🔑 Key Features per Route

### Public Routes
- `/` - Homepage met featured products
- `/products` - Product catalogus met filters
- `/products/[slug]` - Product detail
- `/cart` - Winkelwagen
- `/checkout` - Checkout flow

### Auth Required
- `/dashboard` - User bestelgeschiedenis
- `/checkout` - Checkout (optioneel authenticated)

### Admin Only
- `/admin` - Admin dashboard
- `/admin/products` - Product CRUD
- `/admin/categories` - Category CRUD
- `/admin/orders` - Order management

## 📦 Dependencies

### Core
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety

### Backend
- `@supabase/supabase-js` - Database & auth
- `@supabase/ssr` - Server-side rendering
- `stripe` - Payment processing

### Frontend
- `@stripe/stripe-js` - Stripe.js wrapper
- `zustand` - State management
- `tailwindcss` - Styling

## 🎨 Styling Convention

- **Tailwind classes** voor styling
- **Mobile-first** responsive design
- **Consistent spacing**: 4, 6, 8, 12, 16, 24
- **Color palette**: 
  - Primary: Red (red-600)
  - Background: Slate (slate-900)
  - Text: Gray scale

## 🔒 Security Features

1. **RLS in Supabase**: Per-table access control
2. **Middleware**: Route protection
3. **Webhook signature**: Stripe event verification
4. **Environment variables**: Secrets uit codebase
5. **Server-only secrets**: Service role key
6. **Input validation**: Forms + API routes

## 📈 Performance Optimizations

- Server Components waar mogelijk
- Image optimization (Next.js Image)
- Code splitting per route
- Lazy loading images
- Persistent cart state
- Efficient database queries

## 🧪 Testing Strategie

### Manual Testing
- Gebruik Stripe test cards
- Test alle flows (cart → checkout → success)
- Verifieer admin permissions
- Check responsive design

### Toekomstig
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

## 📱 Responsive Breakpoints

```css
sm:  640px  /* Tablet portrait */
md:  768px  /* Tablet landscape */
lg:  1024px /* Desktop */
xl:  1280px /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🚀 Deployment Checklist

- [ ] All migrations uitgevoerd in Supabase
- [ ] Environment variables ingesteld
- [ ] Stripe webhook geconfigureerd
- [ ] Admin user aangemaakt
- [ ] Test orders geplaatst
- [ ] Build succesvol (`npm run build`)
- [ ] Deployed naar Vercel
- [ ] DNS configured
- [ ] SSL certificate active

---

**Questions?** Check SETUP.md voor gedetailleerde instructies!

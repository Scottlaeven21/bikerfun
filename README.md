# Bikerfun Shop 🏍️

Modern e-commerce platform voor motor en biker lifestyle producten.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

### 3. Set up Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL migrations in `supabase/migrations/`
3. Copy your project URL and anon key to `.env.local`

### 4. Set up Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the dashboard
3. Add them to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (shop)/            # Public shop
│   ├── (dashboard)/       # User dashboard
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities & clients
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
└── supabase/             # Database migrations
```

## Features

- ✅ Product catalog with categories
- ✅ Shopping cart
- ✅ Stripe checkout
- ✅ User authentication
- ✅ Order management
- ✅ Admin dashboard
- ✅ Row Level Security
- ✅ SEO optimized

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add all environment variables in Vercel dashboard.

## License

MIT

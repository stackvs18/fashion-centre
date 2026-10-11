# FASHION — Premium Everyday Clothing

A full-stack Next.js 14+ e-commerce website for **FASHION**, a new-age premium clothing brand.  
Built with mock data (no database required to run).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| 3D | @react-three/fiber + @react-three/drei |
| State | Zustand (with localStorage persistence) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Fonts | Inter + Cormorant Garamond (Google Fonts) |
| Toasts | react-hot-toast |

---

## Features

- ⚡ **Marquee strip** — infinite scrolling announcement bar
- 🧭 **Navbar** — scroll-aware, collapses on scroll-down, mobile drawer
- 🏠 **Hero** — full-viewport, parallax scroll effect, dual CTAs
- 🪙 **3D Coin** — WebGL spinning gold coin with FASHION branding
- 🛍️ **Product Catalog** — filter by size/color/price/fit, sort, infinite scroll
- 🖼️ **Product Cards** — multi-photo carousel (swipe mobile / arrows desktop)
- 🛒 **Cart** — Zustand + localStorage, sidebar + full cart page with promo codes
- 📦 **Checkout** — 4-step: Shipping → Delivery → Payment → Review
- 👤 **Account** — Profile, Orders, Addresses, Wishlist, Settings tabs
- 🔍 **Search** — full-screen overlay with live local search
- 📄 **About + Privacy** — editorial layouts, sticky TOC
- 🍪 **Cookie Consent** — GDPR-style banner
- 📱 **Mobile-first** — bottom nav, bottom sheets, swipe gestures
- 🗺️ **Sitemap + robots.txt** — auto-generated

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/fashion.git
cd fashion

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (fonts, providers, global UI)
│   ├── page.tsx            # Home page
│   ├── tops/               # Tops catalog
│   ├── bottoms/            # Bottoms catalog
│   ├── cart/               # Cart page
│   ├── checkout/           # Multi-step checkout
│   ├── account/            # Account dashboard
│   ├── about/              # About Us
│   └── privacy/            # Privacy Policy
├── components/
│   ├── layout/             # Navbar, Footer, CartSidebar, BottomNav, SearchOverlay
│   ├── home/               # HeroSection, CoinAnimation, FeaturedCatalogGrid, Reels
│   ├── product/            # ProductCard, ProductCarousel, FilterPanel, CatalogLayout
│   └── ui/                 # Button, Badge, Skeleton, Modal, BottomSheet
├── data/                   # Mock products (20) and orders
├── hooks/                  # useScrollDirection, useMediaQuery
├── lib/                    # utils.ts (cn, formatPrice)
├── store/                  # Zustand: cartStore, filterStore, uiStore
└── types/                  # TypeScript interfaces
```

---

## Available Pages

| Route | Page |
|---|---|
| `/` | Home (Hero, Catalog Grid, Banners, 3D Coin, Reels) |
| `/tops` | Tops catalog with filters |
| `/bottoms` | Bottoms catalog with filters |
| `/cart` | Cart with promo codes |
| `/checkout` | 4-step checkout |
| `/account` | Account dashboard |
| `/about` | About Us |
| `/privacy` | Privacy Policy |

---

## Mock Data

All product data lives in `src/data/products.ts`. 20 products:

- **10 Tops**: Crew Tee, Linen Shirt, Graphic Tee, Polo, Sweatshirt, Linen Tee, Camp Collar, Henley, Hoodie, Linen Tee
- **10 Bottoms**: Cargo Pants, Wide-leg Trousers, Joggers, Slim Chino, Linen Shorts, Pleated Trousers, Track Pants, Selvedge Denim, Sweat Shorts, Barrel-leg Denim

Each product has 4 Unsplash images, multiple sizes, colors, and realistic Indian rupee pricing.

---

## Environment Variables

No environment variables are required to run the project locally. All data is mocked.

For future integrations, create `.env.local`:

```env
# Stripe (future)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Razorpay (future)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Database (future)
DATABASE_URL=

# NextAuth (future)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

**Deploy to Vercel:**

```bash
npx vercel --prod
```

---

## Roadmap

- [ ] Database integration (Prisma + PostgreSQL/Neon)
- [ ] Authentication (NextAuth.js with Google + Email)
- [ ] Stripe payment integration
- [ ] Razorpay for Indian payments (UPI, Net Banking)
- [ ] Product detail pages
- [ ] Admin dashboard
- [ ] Wishlist persistence

---

## License

© 2025 FASHION Pvt. Ltd. All rights reserved.

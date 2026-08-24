# EMBERA — Crafted for the Extraordinary.

A premium restaurant platform. Designed & developed by **CodedByAli**.

Two connected applications, one Postgres database, no hardcoded/mocked data:

1. **Customer site** — cinematic dark-luxury design, real 3D dish carousel,
   live menu with search/filter/sort, cart, checkout, order tracking,
   reservations, gallery, reviews.
2. **Admin dashboard** — a fully separate SaaS-style app at `/admin` with
   RBAC, live charts, and CRUD over every part of the business.

Everything in the admin writes to the same database the customer site reads
from — change a dish's price in `/admin/menu` and it updates on `/menu`
immediately; place an order and it appears in `/admin/orders`; change an
order's status there and the customer's `/order/[id]` tracking page updates
within 8 seconds (polling) with no page refresh.

## What's built

**Customer-facing**
- `/` — hero, live 3D carousel (Three.js/R3F) of featured dishes, feature
  grid, live reviews carousel, reservation CTA
- `/menu` + `/menu/[slug]` — real search/filter/sort against Postgres,
  dish customization (spice level, sides, extras) with dynamic pricing,
  related dishes, guest reviews
- `/cart`, `/checkout` — persisted cart (Zustand + localStorage), checkout
  form with server-side re-validated pricing, real order creation
- `/order/[id]` — animated status tracker, synced with admin
- `/reservations` — real table-availability check, prevents double-booking
- `/gallery` — masonry grid, category filter, lightbox
- `/about`, `/experience`, `/contact` — editorial pages, working contact form
- `/login` — customer sign in / register (NextAuth + bcrypt)

**Admin (`/admin`, fully separate shell, RBAC-protected)**
- `/admin/login` — separate admin auth
- `/admin` — dashboard home: revenue, orders, customers, reservations, AOV,
  pending orders, today's revenue, popular dish, live Recharts
- `/admin/orders` — live order list, one-click status changes
- `/admin/menu`, `/admin/categories` — full dish/category CRUD
- `/admin/reservations` — confirm / cancel / reschedule, table view
- `/admin/customers` + profile pages — order history, lifetime spend
- `/admin/reviews` — approve / feature / delete, auto-recalculates dish ratings
- `/admin/gallery` — add / feature / delete images
- `/admin/messages` — contact inbox, read/unread, reply-by-email
- `/admin/analytics` — deeper charts: category revenue, top dishes, status mix
- `/admin/users` — Super Admin-only user + permission management
- `/admin/settings` — CMS: edit site copy/contact/SEO without touching code

**Backend**
- Prisma schema covering every model in the spec, with real relations
- NextAuth with two credential flows (admin role-based, customer)
- Every admin mutation is a server action gated by `requireAdmin()` —
  permission checks run server-side, not just hidden in the UI
- Zod validation on every form/action
- `middleware.ts` blocks unauthenticated access to `/admin/*`
- Dynamic `sitemap.xml`, `robots.txt`, Restaurant JSON-LD schema
- 404, global error boundary, loading skeletons

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — a Postgres connection string. Easiest local option:
  ```bash
  docker run --name embera-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=embera -p 5432:5432 -d postgres:16
  # DATABASE_URL="postgresql://postgres:postgres@localhost:5432/embera"
  ```
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- Cloudinary or Supabase Storage keys — only needed if you wire up direct
  file upload in the admin gallery/menu forms (they currently accept image
  URLs directly, which works fully without any storage provider)

### 3. Database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin`
for the dashboard.

### Seeded logins

| Role     | URL             | Email                  | Password           |
|----------|-----------------|--------------------------|---------------------|
| Admin    | `/admin/login`  | admin@embera.com        | Embera@Admin123     |
| Manager  | `/admin/login`  | manager@embera.com      | Embera@Manager123   |
| Customer | `/login`        | guest@example.com       | Customer@123        |

### Production build

```bash
npm run build
npm start
```

## Project structure

```
prisma/
  schema.prisma           # every data model, real relations
  seed.ts                  # realistic seed data
src/
  app/
    (site)/                 # customer routes — Navbar/Footer/Cart chrome
    admin/
      (auth)/login/          # admin login — no dashboard chrome
      (dashboard)/            # every protected admin route + shared layout
    api/                       # menu search, categories, orders, auth
    sitemap.ts, robots.ts        # SEO
  components/
    site/                        # Navbar, Hero, FoodCarousel3D, DishCard, ...
    admin/                        # Sidebar, Topbar, Charts, tables, modals
  lib/
    prisma.ts                     # Prisma client singleton
    auth.ts, auth-guard.ts         # NextAuth config, RBAC helper
    data.ts, data-admin.ts          # server-side data fetchers
    actions/                         # server actions — the real backend
      orders.ts, reservations.ts, contact.ts        (customer-facing)
      admin-menu.ts, admin-operations.ts, admin-misc.ts  (admin CRUD)
    validations/                      # Zod schemas
  hooks/use-cart.ts                    # Zustand cart store
  types/                                 # shared types + NextAuth augmentation
  middleware.ts                          # protects /admin/*
```

## How data flows (per the spec's requirement)

- **Admin edits a dish** → `updateDish()` server action → Prisma write →
  `revalidatePath("/menu")` → customer menu shows the change on next load.
- **Customer places an order** → `createOrder()` re-validates prices against
  the DB (never trusts client-sent prices) → writes `Order` + `OrderItem` →
  creates an admin `Notification` → order appears in `/admin/orders`.
- **Admin changes order status** → `updateOrderStatus()` → the customer's
  `/order/[id]` page polls `/api/orders/[id]` every 8s and reflects the new
  status with no manual refresh.
- **Reservation request** → checks real table availability for that date/time
  before creating the row, so two parties can never be seated on the same
  table at the same time.

## Notes on this environment

- Images are real Unsplash photography as placeholders — swap them per-dish
  or per-gallery-image from the admin (URL field) once you have your own
  shots, or wire up Cloudinary/Supabase for direct upload.
- This project targets **Next.js 14.2.35** (the final patched 14.x release —
  Next 14 reached end-of-life in Oct 2025). For a new production build in
  2026 consider starting on Next.js 15/16 instead; the App Router patterns
  used here carry over directly.
- `npm install`'s `postinstall` runs `prisma generate`, which needs normal
  internet access to Prisma's engine CDN — standard on any real machine/CI,
  just flagged here because it's the one step this sandboxed build
  environment couldn't verify end-to-end.

# Roseburg Tracker — Business Directory Mockup

Design handoff mockup for the paid Business Directory feature on [roseburgtracker.com](https://roseburgtracker.com).

---

## Scope

Build a paid business directory for Roseburg Tracker:

- Self-service business signup with Stripe subscriptions (Monthly $10 / Annual $100)
- Directory listing page with search and category filtering
- Individual business detail pages
- Featured business cards auto-injected into the main news feed (round-robin / weighted rotation)
- Admin dashboard for managing listings, approvals, and rotation settings

---

## What's Implemented (Design Only)

This repo is a **static UI mockup** — all data is mock, no backend is wired.

| Route | Description |
|---|---|
| `/directory` | Main directory page — hero, search/filter, business card grid, load more |
| `/directory/signup` | 3-step signup form — business info, plan selection, Stripe placeholder |
| `/directory/listing/[id]` | Individual listing detail — logo, description, contact, map placeholder, related listings |
| `/feed-preview` | Homepage feed mockup showing featured business card injection every 5 posts |
| `/admin/directory` | Admin dashboard — stats cards, listings table (approve/edit/pause/pin/delete), rotation settings |

### Design system
- Colors: `#b45309` (RT amber/brown primary), white background, `#f9fafb` surface
- Fonts: DM Serif Display (headings) + Inter (body/UI) — matching roseburgtracker.com exactly
- Category tags: amber = Business, blue = Service, green = Organization
- Mobile-first responsive layout at all breakpoints

---

## What the Developer Needs to Build

### 1. Stripe Subscriptions
- **Reuse** the existing Stripe integration from the main `roseburgtracker.com` codebase
- Create a `createCheckoutSession` server action triggered from `/directory/signup` Step 3
- Products: Monthly recurring ($10/mo) and Annual recurring ($100/yr)
- Webhook handler: `checkout.session.completed` → activate listing; `invoice.payment_failed` → set status `lapsed`; `customer.subscription.deleted` → set status `lapsed`
- Look for `// TODO: wire to Stripe` comments in `/app/directory/signup/page.tsx`

### 2. Database Schema
Add to the existing database:

```sql
CREATE TABLE directory_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,        -- max 35 words enforced in UI
  categories      TEXT[] NOT NULL,      -- ['Business', 'Service', 'Organization']
  address         TEXT NOT NULL,
  phone           TEXT NOT NULL,
  website         TEXT,
  logo_url        TEXT,                 -- Cloudflare R2 / S3 URL
  plan            TEXT NOT NULL,        -- 'monthly' | 'annual'
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'paused' | 'lapsed'
  featured        BOOLEAN DEFAULT false,
  stripe_customer_id      TEXT,
  stripe_subscription_id  TEXT,
  last_payment    DATE,
  last_featured_at TIMESTAMPTZ,         -- for rotation engine
  feed_weight     INT DEFAULT 1,        -- 1 = monthly, 2 = annual
  pending_approval BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rotation_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  injection_interval  INT DEFAULT 5,    -- inject a business card every N posts
  weight_multiplier   INT DEFAULT 2,    -- annual plan weight vs. monthly
  show_featured_badge BOOLEAN DEFAULT true,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Rotation Engine
The feed injection algorithm:

1. Query active listings ordered by `last_featured_at ASC`
2. Build a weighted pool: repeat each listing's ID `feed_weight` times in the pool
3. Pick the first entry from the sorted+weighted pool
4. After rendering, fire a background job to update `last_featured_at = NOW()` for that listing
5. Inject a `FeaturedBusinessCard` component every `injection_interval` news posts
6. Admin can override by pinning a listing (add `pinned_until TIMESTAMPTZ` column)

See `/app/feed-preview/page.tsx` and `/app/admin/directory/page.tsx` → Rotation Settings for design reference and inline dev notes.

### 4. File Uploads
- Wire the logo upload in `/directory/signup` Step 1 to Cloudflare R2 or S3
- Presigned URL upload, store the resulting URL in `directory_listings.logo_url`
- Look for `// TODO: wire file upload to storage` in `/app/directory/signup/page.tsx`

### 5. Authentication / Authorization
- Admin routes (`/admin/directory`) must require admin auth
- Reuse the existing auth system from the main Roseburg Tracker codebase (NextAuth / Clerk)
- Look for `// TODO: protect this route` in `/app/admin/directory/page.tsx`

### 6. Map Integration
- Replace map placeholders in `/directory/listing/[id]` with a real embed
- Options: Google Maps Embed API, Mapbox GL JS, or react-leaflet
- Look for `// TODO: embed Google Maps / Mapbox` comments

### 7. Search & Filtering
- Replace client-side mock filter in `/directory/page.tsx` with a real DB query
- Consider full-text search (Postgres `tsvector` or Algolia) for keyword search
- Look for `// TODO: replace with DB search query` comments

### 8. Email Notifications
- Send confirmation email when listing is approved
- Send renewal reminder 7 days before subscription renewal
- Send lapse notice when payment fails

---

## Running Locally

```bash
npm install
npm run dev
# open http://localhost:3000 — redirects to /directory
```

Build check:

```bash
npm run build
```

---

## File Structure

```
app/
  components/
    Nav.tsx           # Site navigation (matches roseburgtracker.com)
    Footer.tsx        # Site footer
    BusinessCard.tsx  # Directory listing card
    CategoryTag.tsx   # Color-coded category pill
  lib/
    mockData.ts       # All mock businesses + news posts (replace with DB queries)
  directory/
    page.tsx          # /directory — main listing page
    signup/
      page.tsx        # /directory/signup — 3-step signup form
    listing/
      [id]/
        page.tsx      # /directory/listing/[id] — detail page
  feed-preview/
    page.tsx          # /feed-preview — feed injection mockup
  admin/
    directory/
      page.tsx        # /admin/directory — admin dashboard
  globals.css         # Tailwind + Google Fonts + RT design system utilities
  layout.tsx
  page.tsx            # Redirects / -> /directory
tailwind.config.ts    # RT brand colors, fonts, shadows — ready to merge into main site
README.md
```

---

## Design Notes

- All `// TODO: wire to Stripe`, `// TODO: fetch from DB`, and `// TODO: protect this route` comments mark exact integration points for the developer
- The Tailwind config (`tailwind.config.ts`) defines the full RT design system — colors, fonts, shadows — ready to copy/merge into the main codebase
- Category tag colors: amber (Business), blue (Service), green (Organization) — consistent across all pages
- The `rt-btn-primary`, `rt-btn-outline`, `rt-card`, `rt-input`, `rt-label` CSS component classes in `globals.css` should be merged into the main site's stylesheet
- The `BusinessCard` component is designed to work in both the directory grid and the feed injection context

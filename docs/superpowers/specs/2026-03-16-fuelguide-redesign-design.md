# FuelGuide Redesign — Design Specification

**Date:** 2026-03-16
**Author:** Norbert Strijker + Claude
**Status:** Draft

---

## 1. Goal

Restructure FuelGuide from a single-page search tool into a full multi-page, multi-language web application with proper SEO architecture, improved design, and an AI-powered learning loop for unknown machines.

## 2. Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Navigation | Hybrid: search prominent, category tiles subtle | Fast for users who know their model, browsable for those who don't |
| URL structure | `/[locale]/[category]/[machine-slug]` | Strong SEO signals, clean breadcrumbs, category grouping |
| Visual style | Warm & illustrative (Mailchimp/Notion style) | Accessible for non-technical audience, builds trust |
| UI framework | shadcn/ui + Tailwind CSS | Professional, customizable, works natively with Next.js |
| Product cards | Integrated in result, "Recommended" badge on best tier | Feels like advice rather than sales |
| AI fallback | Claude API as safety net + learning loop | Grows the database automatically from real search data |
| Priority | Structure first, then design polish | URL structure is hardest to change later (SEO impact) |
| Languages | NL + DE + EN simultaneously (next-intl) | DE is 8x larger market, EN is long-term play |
| Source label | Not shown to visitors | Users want an answer, not a disclaimer about data source |
| Product images | Affiliate API photos, AI illustration as fallback | Real photos where available, no empty pages |
| Language detection | Browser Accept-Language header, no cookie | Simple, sufficient for the use case |

## 3. Page Architecture & Routing

### 3.1 URL Structure

```
fuelguide.app/
├── /nl/                                → Dutch homepage
├── /nl/grasmaaiers/                    → Category overview
├── /nl/grasmaaiers/honda-hrg-416       → Machine detail page
├── /de/                                → German homepage
├── /de/rasenmaeher/                    → Translated category slug
├── /de/rasenmaeher/honda-hrg-416       → Same machine, German content
├── /en/                                → English homepage
├── /en/lawn-mowers/
├── /en/lawn-mowers/honda-hrg-416
└── ...
```

### 3.2 Next.js App Router Structure

```
app/
├── [locale]/
│   ├── layout.js              → Shared layout (header, footer, language switcher)
│   ├── page.js                → Homepage per language
│   ├── [categorie]/
│   │   ├── page.js            → Category overview
│   │   └── [machine]/
│   │       └── page.js        → Machine detail page
│   └── not-found.js           → 404 page per language
├── api/
│   └── zoek/route.js          → Search API (existing, improved; includes AI fallback)
└── middleware.js               → Language detection + redirect
```

### 3.3 Middleware Routing Logic

- Detects `Accept-Language` header on first visit
- NL/BE browser → redirect to `/nl/`
- DE/AT/CH browser → redirect to `/de/`
- All others → redirect to `/en/`
- If locale already in URL: no redirect

### 3.4 Category Slug Mapping

Category slugs are translated per language. Machine slugs are universal.

| Category | NL | DE | EN |
|----------|----|----|-----|
| Grasmaaiers | grasmaaiers | rasenmaeher | lawn-mowers |
| Kettingzagen | kettingzagen | kettensaegen | chainsaws |
| Bladblazers | bladblazers | laubblaesers | leaf-blowers |
| Heggenscharen | heggenscharen | heckenscheren | hedge-trimmers |
| Bosmaaiers | bosmaaiers | freischneider | brush-cutters |
| Generatoren | generatoren | generatoren | generators |

Machine slugs (e.g. `honda-hrg-416`) are the same across all locales.

### 3.6 Category Slug Config (`lib/categories.js`)

Central config used for routing, breadcrumbs, language switching, and sitemap generation:

```js
export const CATEGORIES = {
  grasmaaiers: {
    slugs: { nl: 'grasmaaiers', de: 'rasenmaeher', en: 'lawn-mowers' },
    names: { nl: 'Grasmaaiers', de: 'Rasenmäher', en: 'Lawn Mowers' },
  },
  kettingzagen: {
    slugs: { nl: 'kettingzagen', de: 'kettensaegen', en: 'chainsaws' },
    names: { nl: 'Kettingzagen', de: 'Kettensägen', en: 'Chainsaws' },
  },
  // ... same pattern for all categories
}

// Reverse lookup: given a locale slug, find the category key
export function categoryFromSlug(slug, locale) { ... }

// Translate: given a category key, get the slug for a target locale
export function categorySlug(key, locale) { ... }
```

### 3.5 Navigation

- **Header:** Logo (links to home) | Compact search field | Language switcher (NL/DE/EN flags)
- **Breadcrumbs** on category and machine pages: Home > Grasmaaiers > Honda HRG 416
- **Footer:** Links to all categories, language choice, copyright
- **hreflang tags** on every page linking language versions to each other

## 4. Page Designs

### 4.1 Homepage

Top to bottom:

1. **Header** — Logo left, compact search right, language switcher far right
2. **Hero** — Large title, subtitle, prominent search bar with example buttons that trigger search on click
3. **Trust signals** — Single row: "80+ models · Free · Instant answer" (translated per language)
4. **Category tiles** — 4-5 tiles in grid with illustration + name + model count. Click navigates to category page
5. **How it works** — 3-step explanation with illustrations (not numbers)
6. **Footer** — Category links, language choice, copyright

### 4.2 Category Overview Page (`/nl/grasmaaiers/`)

1. **Breadcrumbs** — Home > Grasmaaiers
2. **Title + intro** — "Grasmaaiers — welke brandstof?" + short SEO text (2-3 sentences)
3. **Search bar** — Filtered to this category
4. **Machine list** — Cards per machine: brand, model, motor type badge (2-stroke/4-stroke), product image (if available), link to detail page
5. **Sortable** by brand (A-Z)

### 4.3 Machine Detail Page (`/nl/grasmaaiers/honda-hrg-416`)

This is the most important page — this is where revenue is generated.

1. **Breadcrumbs** — Home > Grasmaaiers > Honda HRG 416
2. **Machine header** — Name large, category, motor type badge, product image (affiliate API or AI fallback)
3. **Fuel advice block** — Prominent colored block:
   - "This machine uses **unleaded petrol (E10)**"
   - Or: "Mix petrol with 2-stroke oil at ratio **1:50**"
   - This is the answer — large, clear, unmissable
4. **Specifications** — Grid: motor type, mix ratio, E10 compatibility, build year
5. **Product cards** (basic/better/best):
   - "Best" card gets "Recommended" badge and subtle highlight
   - Product image above each card (when available)
   - Short bullet points instead of running text
   - Affiliate button: "Bekijk op bol.com" / "Auf Amazon.de ansehen" / "View on Amazon"
   - **Empty state:** When no products exist for a motortype+market combination, show generic fuel advice text only (e.g. "Use E10 unleaded petrol") without product cards. No broken UI.
6. **Related models** — "Other [brand] machines" with links (internal SEO linking)
7. **Share button** — "Share this advice" (copies URL)

### 4.4 Fallback Page (AI Estimate)

Same layout as machine detail page. No visual distinction for the visitor. The source (AI vs database) is tracked internally only, not shown to users.

### 4.5 Search Flow

1. Visitor searches "Honda HRG 416"
2. API returns result + category slug + machine slug
3. Frontend redirects to `/nl/grasmaaiers/honda-hrg-416`
4. Multiple results: show suggestions, click redirects to detail page
5. Not found + AI fallback: result is shown inline on the search page (no redirect, since there is no permanent URL yet). The AI estimate is saved to `ai_schattingen`. Once approved by Norbert, the machine gets a permanent detail page URL.

Database results lead to a shareable URL with full SEO value. AI fallback results are shown inline until approved.

## 5. AI Fallback & Learning Loop

### 5.1 Flow

```
Visitor searches "Makita DCS 5030"
    ↓
1. Database lookup → not found
    ↓
2. Rule-based fallback → returns result with betrouwbaarheid field
   - 'hoog': known brand + known category → use this result, skip AI
   - 'middel': known category, unknown brand → use this result, skip AI
   - 'laag': motortype === 'onbekend' → trigger AI fallback
    ↓
3. (Only when betrouwbaarheid === 'laag')
   Claude API call (Haiku) → "chainsaw, 2-stroke, 50:1, E10 compatible"
    ↓
4. Show result to visitor (same layout as database result)
    ↓
5. Save to `ai_schattingen` table with status "pending_review"
```

The AI fallback is only triggered when the rule-based system cannot determine the motor type at all (`motortype === 'onbekend'`). When rules produce a result with high or medium confidence, the AI is not called.

### 5.2 New Database Table: `ai_schattingen`

| Field | Type | Purpose |
|-------|------|---------|
| id | uuid | PK |
| invoer | text | Original search query |
| merk | text | Determined by AI |
| modelnummer | text | Determined by AI |
| categorie | text | Determined by AI |
| motortype | text | 2-takt / 4-takt |
| mengverhouding | text | e.g. "1:50" |
| e10_geschikt | boolean | |
| ai_response_raw | jsonb | Full API response for audit |
| status | text | `pending_review` / `approved` / `rejected` |
| created_at | timestamp | |

### 5.3 Review Flow

- Norbert reviews `pending_review` entries periodically
- **Approved** → copied to `machines` table as permanent record
- **Rejected** → ignored, kept as log
- Review happens via Supabase dashboard — no admin UI needed in phase 1

### 5.4 Cost

- Claude API (Haiku): ~$0.001 per query
- Only called when database + rules produce no result
- At 100 unknown searches/month: ~$0.10/month

## 6. Internationalization (next-intl)

### 6.1 Translation Files

```
messages/
├── nl.json    → Dutch translations
├── de.json    → German translations
└── en.json    → English translations
```

### 6.2 What Gets Translated

| Element | Example NL | Example DE | Example EN |
|---------|-----------|-----------|-----------|
| UI text | "Zoeken" | "Suchen" | "Search" |
| Category slugs | grasmaaiers | rasenmaeher | lawn-mowers |
| Category names | Grasmaaiers | Rasenmäher | Lawn Mowers |
| Fuel advice | "Ongelode benzine (E10)" | "Bleifreies Benzin (E10)" | "Unleaded petrol (E10)" |
| Quality labels | Basis / Beter / Best | Basis / Besser / Beste | Basic / Better / Best |
| Trust signals | "80+ modellen · Gratis" | "80+ Modelle · Kostenlos" | "80+ models · Free" |
| SEO meta texts | Unique per language | Unique per language | Unique per language |

### 6.3 What Does NOT Get Translated

- Machine slugs: `honda-hrg-416` is universal
- Brand names: Honda, Stihl, Husqvarna stay the same
- Model numbers: HRG 416, MS 250 stay the same
- Prices: come from `producten` table filtered by `markt`

### 6.4 Affiliate Routing Per Language

| Locale | Affiliate partner | Button text |
|--------|-------------------|-------------|
| `/nl/` | bol.com | "Bekijk op bol.com" |
| `/de/` | Amazon.de | "Auf Amazon.de ansehen" |
| `/en/` | Amazon.com | "View on Amazon" |

Products are filtered by `markt = locale`. Each language needs separate product records with the correct affiliate URL.

### 6.5 Language Switcher

- Flags in header: NL / DE / EN
- Click switches to same page in other language
- e.g. `/nl/grasmaaiers/honda-hrg-416` → `/de/rasenmaeher/honda-hrg-416`
- Category slug mapping stored in central config file

## 7. Component Structure

```
components/
├── Header.js            → Logo, compact search, language switcher
├── Footer.js            → Category links, language choice, copyright
├── Breadcrumbs.js       → Home > Category > Machine
├── SearchBar.js         → Search bar + example buttons (reusable)
├── CategoryGrid.js      → Tiles on homepage (illustration + name + count)
├── MachineCard.js       → Card in category overview (brand, model, badge, image)
├── FuelAdvice.js        → Prominent advice block on detail page
├── ProductCards.js       → Basic/Better/Best cards with affiliate links
├── RelatedMachines.js   → "Other [brand] machines" links
└── HowItWorks.js        → 3-step explanation with illustrations
```

## 8. Data Flow

### 8.1 Homepage
- Category tiles: server-side fetch from Supabase (count per category)
- Search bar: client-side fetch to `/api/zoek`

### 8.2 Category Overview
- Server-side: all machines in that category from Supabase
- Statically generatable with `generateStaticParams` → fast load, good for SEO

### 8.3 Machine Detail Page
- Server-side: machine + products from Supabase
- Uses `generateStaticParams` for all known machines → Google sees full HTML
- `dynamicParams = false` — unknown slugs return 404. Only approved machines get detail pages.
- AI fallback results are shown inline on the search page, not on their own URL (see section 4.5)

### 8.4 Search API
- Existing logic, improved
- Returns URL of detail page so frontend can redirect
- After search result: redirect to detail page instead of inline display

## 9. Product Images

### 9.1 Strategy

- **Primary:** Affiliate API images (bol.com / Amazon) for models sold there
- **Fallback:** AI-generated category illustration (e.g. generic "green lawn mower")
- **Storage:** Image URLs stored in `machines` table (new `afbeelding_url` field) or fetched dynamically from affiliate API

### 9.2 Implementation

- Add `afbeelding_url` (nullable text) field to `machines` table
- When populating database: fetch product image from affiliate partner
- When no image available: show category-level fallback illustration
- Fallback illustrations generated once per category using AI image generation

## 10. Technical Changes Summary

### 10.1 New Dependencies
- `tailwindcss` + `@tailwindcss/typography`
- `shadcn/ui` components (installed per-component)
- `next-intl` for internationalization
- `@anthropic-ai/sdk` for AI fallback

### 10.2 Database Changes
- New table: `ai_schattingen` (AI estimates with review status)
- New field on `machines`: `afbeelding_url` (nullable text)
- New field on `machines`: `slug` (text, unique, e.g. "honda-hrg-416")

**Slug generation rule:** `lowercase(merk)-lowercase(modelnummer)` with spaces replaced by hyphens, special characters removed. Examples:
- Honda HRG 416 → `honda-hrg-416`
- Stihl MS 250 → `stihl-ms-250`
- Husqvarna 125B → `husqvarna-125b`

Existing records must be backfilled with generated slugs via a migration script before the new routing goes live.

### 10.3 Files to Create
- `middleware.js` — language detection + redirect
- `messages/nl.json`, `messages/de.json`, `messages/en.json` — translations
- `lib/categories.js` — category slug mapping per language
- `app/[locale]/layout.js` — shared layout with header/footer
- `app/[locale]/page.js` — homepage
- `app/[locale]/[categorie]/page.js` — category overview
- `app/[locale]/[categorie]/[machine]/page.js` — machine detail
- `lib/supabase-server.js` — server-side Supabase client (singleton, used by all server components and API routes)
- All components listed in section 7

### 10.4 Files to Remove
- `app/page.js` — replaced by `app/[locale]/page.js`
- `app/page.module.css` — replaced by Tailwind classes
- `app/globals.css` — replaced by Tailwind base styles

## 11. SEO

### 11.1 Sitemap

Generated dynamically via `app/sitemap.js` using Next.js built-in sitemap support. Includes:
- All locale homepages (`/nl/`, `/de/`, `/en/`)
- All category pages per locale
- All machine detail pages per locale
- hreflang alternates linking translations

### 11.2 Robots.txt

Generated via `app/robots.js`:
- Allow all crawlers
- Reference sitemap URL
- Disallow `/api/` routes

### 11.3 Meta Tags

Each page generates unique meta title and description per locale:
- Homepage: "FuelGuide — Juiste brandstof voor jouw machine"
- Category: "Grasmaaiers brandstof — welke benzine of olie?"
- Machine: "Honda HRG 416 brandstof — E10 ongelode benzine"

## 12. Implementation Order

1. **Tailwind + shadcn/ui setup** — replace CSS modules with Tailwind
2. **next-intl setup** — locale routing, translation files, middleware
3. **Page architecture** — create [locale]/[categorie]/[machine] routes
4. **Components** — build all components listed in section 7
5. **Search flow** — update API to return redirect URLs, implement redirect
6. **AI fallback + learning loop** — Claude API integration, ai_schattingen table
7. **Product images** — affiliate API integration, fallback illustrations
8. **SEO** — sitemap, hreflang tags, meta per page
9. **Design polish** — illustrations, animations, mobile testing

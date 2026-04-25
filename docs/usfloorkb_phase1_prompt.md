# Claude Code Prompt — US Floor, Kitchen & Bath Web Application (Phase 1)

> Copy everything below this line and paste it into Claude Code as your initial project prompt. Place the four reference files (`scan__2_.pdf`, `logo.avif`, and the two screenshots) inside a `/reference/` folder at the project root before starting.

---

## 1. Project Overview

You are building **Phase 1** of a web application for **U.S. Floor, Kitchen & Bath**, a family-owned remodeling and flooring company located at 30092 Santa Margarita Pkwy #G, Rancho Santa Margarita, CA 92688 (Tel: 949-589-9226, web: usfloorkb.com).

The company currently runs its entire order workflow on **paper forms** (see `/reference/scan__2_.pdf`). Salespeople hand-write an Invoice, then re-copy the same information onto a Work Order, then again onto a Daily Work Order for the installer, and finally onto a Vendor Order Form for each material supplier. This is slow, error-prone, and provides no visibility into business performance.

Your job is to replace the paper process with a **smart, role-based web application** that:

1. Captures order information **once** (in a single Invoice form) and **auto-generates** the three downstream documents (Work Order, Daily Work Order, Vendor Order Form) as printable / PDF outputs.
2. Tracks **who entered each order** (mandatory salesperson dropdown) so the owner can see sales-by-salesperson.
3. Tracks **where the customer came from** (Advertising Source field) so the owner can see which marketing channels actually convert.
4. Provides an **Admin dashboard** with charts, financial totals, and an **AI-powered business analysis** feature backed by the Claude API.
5. Gives **salespeople a restricted panel** that only exposes the order-entry form and their own order history — never company-wide financials.

Phase 2 (out of scope for this build, but design the schema so it slots in cleanly): a materials catalog so salespeople pick from a dropdown instead of free-text.

---

## 2. Tech Stack & Architectural Decisions

Use the following stack unless you have a strong reason to deviate. If you deviate, document why in the README.

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript** | Single repo for UI + API, server actions for forms, runs anywhere Node runs |
| Styling | **Tailwind CSS** + **shadcn/ui** components | Fast, on-brand theming via CSS variables (see § 6) |
| Database | **PostgreSQL** via **Supabase** | Hosted Postgres, built-in row-level auth, free tier sufficient for one shop |
| ORM | **Prisma** | Type-safe queries, easy migrations |
| Auth | **Supabase Auth** with email/password + role claim (`admin` \| `salesperson`) | Roles drive routing and RLS |
| Email | **Brevo** (transactional API + SMTP) | Free tier covers 300 emails/day; better deliverability than Supabase's built-in mailer |
| Inbound email | **HostGator cPanel mailbox** (existing, unchanged) | The shop already has a working mailbox at `info@usfloorkb.com` on HostGator; we send via Brevo from that same address and replies route back to HostGator |
| PDF generation | **@react-pdf/renderer** (server-side) | Renders the four documents to identical-looking PDFs |
| Charts | **Recharts** | Plays well with React, sufficient for revenue / source / salesperson charts |
| AI analysis | **Anthropic Claude API** (`claude-opus-4-7` for analysis, `claude-haiku-4-5` for cheap summaries) | Per the user spec |
| Deployment | **Render** (app) + **Supabase** (DB) | Predictable flat-rate hosting, git-push deploys, no serverless cold-starts |
| Forms | **React Hook Form** + **Zod** | Validation matches the schema |

**Important architecture notes:**

- Treat **Invoice** as the single source of truth. Work Order, Daily Work Order, and Vendor Order are *projections* (database views or derived render templates) of the same `orders` row plus its child `order_areas`, `order_materials`, and `order_options` tables. **Never store the same field twice.**
- Use **soft deletes** (`deleted_at` column) on every business entity. A flooring shop will inevitably ask "what was on invoice 6514 again?"
- Generate **invoice numbers server-side** in a transaction (don't trust client). Continue from **6515** (the paper invoice in the reference PDF was 6514).
- All money fields stored as `INTEGER cents`, never as float.

---

## 3. User Roles & Routing

Two roles, two distinct app shells:

### `admin` role (the owner / manager)
- Routes: `/admin/*`
- Sees: dashboard with charts, full invoice list, salesperson management, advertising-source management, AI business-analysis page, settings.
- Can do: everything a salesperson can do, plus user management, edit/void any invoice, run AI analysis, export CSV.

### `salesperson` role
- Routes: `/sales/*`
- Sees: a "New Order" form, "My Orders" list (only orders where `salesperson_id = me`), simple search.
- For their own orders, sees **all four document tabs**: Invoice, Work Order, Daily Work Order, Vendor Order(s). The Daily Work Order and Vendor Order tabs render without prices for everyone (they have no prices on the paper originals); the Work Order shows prices to admin only.
- Cannot see: other salespeople's orders, company-wide totals, financial summaries, advertising-source analytics, the AI analysis page, the user-management page.
- Can do: create new invoices, **edit any field on their own orders at any time** (no field is locked while the order exists), and **void** their own orders. They cannot permanently delete anything — only admins can hard-delete.

A logged-out user only sees `/login`. After login, redirect by role. Hard-block cross-role access on the server (middleware + RLS), never trust the client.

---

## 4. Data Model (Prisma schema)

Generate this schema. Field names must match exactly because the PDF templates depend on them.

```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String    // managed by Supabase Auth in practice
  fullName        String
  role            Role
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  // a User who is a salesperson is referenced from Order.salespersonId
  ordersAsSalesperson Order[] @relation("SalespersonOrders")
}

enum Role {
  admin
  salesperson
}

model AdvertisingSource {
  id        String   @id @default(uuid())
  name      String   @unique  // e.g. "Google", "Yelp", "Referral - John Smith", "Drive-by"
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  orders    Order[]
}

model Customer {
  id           String   @id @default(uuid())
  firstName    String
  lastName     String
  addressLine1 String
  city         String
  state        String   @default("CA")
  zip          String
  phoneHome    String?
  phoneWork    String?
  phoneExt     String?
  email        String?
  // Ship-to often differs from sold-to (per the paper invoice, both are captured)
  shipFirstName    String?
  shipLastName     String?
  shipAddressLine1 String?
  shipCity         String?
  shipState        String?
  shipZip          String?
  shipPhone        String?
  createdAt    DateTime @default(now())
  orders       Order[]
}

model Order {
  id                  String    @id @default(uuid())
  invoiceNumber       Int       @unique  // server-assigned, starts at 6515
  status              OrderStatus  @default(draft)
  dateOfSale          DateTime  @default(now())

  customerId          String
  customer            Customer  @relation(fields: [customerId], references: [id])

  salespersonId       String
  salesperson         User      @relation("SalespersonOrders", fields: [salespersonId], references: [id])

  advertisingSourceId String?
  advertisingSource   AdvertisingSource? @relation(fields: [advertisingSourceId], references: [id])

  // Top-of-invoice category checkboxes (Cabinet, Carpet, Vinyl, Wood, Ceramic, Counter Top, Fireplace, Shower)
  hasCabinet      Boolean @default(false)
  hasCarpet       Boolean @default(false)
  hasVinyl        Boolean @default(false)
  hasWood         Boolean @default(false)
  hasCeramic      Boolean @default(false)
  hasCounterTop   Boolean @default(false)
  hasFireplace    Boolean @default(false)
  hasShower       Boolean @default(false)

  // Money fields in CENTS
  taxCents        Int  @default(0)
  depositCents    Int  @default(0)
  // total / subtotal / balance are computed; persist for historical accuracy
  subtotalCents   Int  @default(0)
  totalCents      Int  @default(0)
  balanceCents    Int  @default(0)

  basedOn         String?  // "Square Yards" | "Square Feet" | "Total"
  remarks         String?

  balanceTerm     BalanceTerm?  // cash | cod | finance

  // Work-order-specific fields (filled in after invoice is created)
  availabilityDate   DateTime?
  deliveryDate       DateTime?
  installerName      String?
  installationDate   DateTime?
  orderTakenByUserId String?

  // Floor condition (work order)
  subfloorType    SubfloorType?  // wood | concrete | softConcrete | other
  installSubfloor Boolean?
  pullOldFloor    Boolean?
  oldFloorType    String?  // tile, marble, wood, vinyl, carpet, other
  oldFloorSize    String?

  // Carpet-specific (work order)
  removeOldCarpetAndPad Boolean?
  removeOldTagStrip     Boolean?
  newTackStripType      String?   // wood | concrete
  hasSteps              Boolean?
  numSteps              Int?
  emptyHouse            Boolean?
  heavyFurniture        Boolean?
  heavyFurnitureType    String?

  // Installation method (work order)
  installMethod   InstallMethod?  // glueDown | nailDown | click | clip | other

  specialInstructions String?

  areas       OrderArea[]
  materials   OrderMaterial[]
  moldings    OrderMolding[]
  fixtures    OrderFixture[]
  showerSpec  OrderShower?
  tileSpec    OrderTileStone?
  removals    OrderRemoval[]
  vendorOrders VendorOrder[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
}

enum OrderStatus {
  draft
  finalized
  installed
  paid
  voided
}

enum BalanceTerm { cash cod finance }
enum SubfloorType { wood concrete softConcrete other }
enum InstallMethod { glueDown nailDown click clip other }

// One row per area-of-the-house line on the invoice (Living Room, Kitchen, etc.)
model OrderArea {
  id          String  @id @default(uuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  areaName    AreaName  // enum below — matches the paper invoice rows
  quantity    Int?     // the "#" column
  description String?
  lineTotalCents Int  @default(0)
}

enum AreaName {
  livingRoom
  diningRoom
  familyRoom
  hall
  bedroom
  closet
  entrance
  bathroom
  den
  kitchen
  stairs
  office
  laundry
  other  // free text via OrderArea.description
}

// One row per material/style line (work order pages 2 and 4)
model OrderMaterial {
  id          String  @id @default(uuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  lineNumber  Int     // 1, 2, 3, 4 — matches paper form

  // PHASE 2 HOOK: when the materials catalog ships, this points at a Material row.
  // In Phase 1 it stays null; the free-text fields below are authoritative.
  // In Phase 2, when materialId is set, the free-text fields become a snapshot
  // taken at order-creation time (so editing the catalog later doesn't mutate
  // historical orders).
  materialId  String?
  // material    Material? @relation(...)  ← uncomment in Phase 2

  millStyle   String?
  size        String?
  color       String?
  refNumber   String?
  pad         String?
  areas       String?  // free-text "where it goes"
  carpetType  CarpetType?  // plush | berber | glueDown | plushWP | berberWP
  unitOfMeasure String? // "sqft" | "sqyd" | "linft" | "each" — captured as free text in Phase 1, becomes an enum mapped to Material.defaultUom in Phase 2
  quantity    Float?   // numeric quantity of the unit above; nullable in Phase 1
  unitPriceCents Int?  // optional in Phase 1; useful for the Phase 1 invoice-line total and required in Phase 2
  lineTotalCents Int?  // server-computed when quantity * unitPrice are present

  // Vendor-order-form additions:
  vendorName  String?
  poNumber    String?
  willCallDate DateTime?
  vendorDeliveryDate DateTime?
}

enum CarpetType { plush berber glueDown plushWP berberWP }

model OrderMolding {
  id        String  @id @default(uuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  type      MoldingType
  quantity  String?  // free text — paper form has a blank line, not always numeric
  isReplaceExisting Boolean  @default(false)
  rubberCoverColor  RubberCoverColor?  // gold | silver | glue | none
}

enum MoldingType {
  baseShoe
  baseboard
  rubberCover4in
  quarterRound
  endMolding
  tMolding
  reducer
  wallBase
  stairNosing
  metalStrip
  filmOnly
  filmAndFoam
  silentStep
  bullNose
}

enum RubberCoverColor { gold silver glue none }

model OrderFixture {
  id      String  @id @default(uuid())
  orderId String
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  type    FixtureType
  notes   String?
}

enum FixtureType { stove fridge washer dryer waterbed piano organ stool other }

// One Order has at most one shower spec block (Daily Work Order page)
model OrderShower {
  id                   String  @id @default(uuid())
  orderId              String  @unique
  order                Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  shower_walls_sqft    Float?
  wall_material        String?
  shower_pan           String?
  shower_pan_material  String?
  soap_box_material    String?
  bench                String?
  bathroom_floor_sqft  Float?
  bathroom_floor_material String?
  schluter             String?
  grout_color          String?
  vertical             Boolean?
  horizontal           Boolean?
}

model OrderTileStone {
  id           String  @id @default(uuid())
  orderId      String  @unique
  order        Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  hasTile      Boolean  @default(false)
  hasMarble    Boolean  @default(false)
  hasTravertine Boolean @default(false)
  hasSlate     Boolean  @default(false)
  hasTumbleMarble Boolean @default(false)
  hasBacksplash Boolean @default(false)
  hasFloor     Boolean  @default(false)
  hasFireplace Boolean  @default(false)
  hasShowerTile Boolean @default(false)
  hasWalls     Boolean  @default(false)
  hasCounterTop Boolean @default(false)
  hasStone     Boolean  @default(false)
  hasSlab      Boolean  @default(false)
  wonderboard  Boolean?
  slipSheet    Boolean?
  seal         Boolean?
  groutColor   String?
}

model OrderRemoval {
  id      String  @id @default(uuid())
  orderId String
  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  type    RemovalType
}

enum RemovalType {
  tile
  glueDownCarpet
  poolTable
  stone
  stool
  bigScreenTV
  wood
  refrigerator
  piano
  vinyl
  washer
  stove
  laminate
  dryer
  other
}

// One row per vendor PO generated from the order
model VendorOrder {
  id          String  @id @default(uuid())
  orderId     String
  order       Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // PHASE 2 HOOK: in Phase 1 vendors are free text typed by the salesperson.
  // The first time a vendor name is used, write it into the Vendor table below
  // (auto-create-if-missing) and set vendorId. This means by the time Phase 2
  // ships, you already have a clean vendor list to bind contacts/addresses to —
  // no backfill needed.
  vendorId    String?
  vendor      Vendor? @relation(fields: [vendorId], references: [id])

  vendorName  String   // kept as the display string; Phase 2 reads from Vendor.name when vendorId is set
  poNumber    String
  sidemark    String?
  faxEmailDate DateTime?
  willCallDate DateTime?
  deliveryDate DateTime?
  deliveryAddress String?
  // Snapshot of the materials that went on this PO (so editing the master order doesn't change a sent PO)
  lineItems   Json
  status      VendorOrderStatus @default(draft)
  createdAt   DateTime @default(now())
}

enum VendorOrderStatus { draft sent received cancelled }

// PHASE 2-READY STUB. Phase 1 only ever auto-creates rows from typed vendor
// names on VendorOrders — there is no Vendor admin UI yet. Phase 2 adds CRUD,
// contacts, default delivery addresses, and pricing terms. Keep this minimal
// shape so the Phase 2 migration is purely additive.
model Vendor {
  id        String   @id @default(uuid())
  name      String   @unique  // matched case-insensitively when auto-creating
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  vendorOrders VendorOrder[]
}
```

Run `prisma migrate dev --name init` then seed:

- One admin user (`admin@usfloorkb.com`, prompt for password during seed)
- Three example salespeople (so dropdowns aren't empty on first login)
- A starter list of advertising sources: `Google`, `Yelp`, `Drive-by`, `Referral`, `Repeat Customer`, `Facebook`, `Instagram`, `Other`
- The next invoice number sequence starting at `6515`

---

## 5. The Four Documents — Generation Rules

The single Invoice form captures **everything**. The three downstream documents are generated views. Match the paper layouts in `/reference/scan__2_.pdf` closely enough that the staff feel at home, but cleaner.

### 5.1 Invoice (page 1 of the PDF)
- Header: company logo, address block, **Date of Sale**, **Invoice Number** (auto), **Deposit / Use Toward Material**, **Adv. Source** dropdown.
- Sold-to and Ship-to blocks (Ship-to defaults to Sold-to with a "Same as Sold To" toggle).
- **Mandatory: Salesperson dropdown** — populated from active `User`s with `role = salesperson`. Field is required at form submission. Show a clear error if missing.
- Category checkbox row: Cabinet, Carpet, Vinyl, Wood, Ceramic, Counter Top, Fireplace, Shower.
- Area table — one row per area of the home (see `AreaName` enum). Columns: Area, #, Description, Total.
- Footer: Based-on (Square Yards/Square Feet/Total) + Remarks, Total, Tax, Sub-Total, Deposit, Balance, Balance Terms (Cash / COD / Finance) — all as the form shows.
- Footer fine print (legal language about deposit / cancellation / mechanic's lien) is rendered as static text matching the original.

### 5.2 Work Order (page 2)
Auto-populated from the same Order. Adds:
- Order Date, Availability, Deliv (delivery), Order Taken By, Sales Person, Installer, Installation Date.
- Material lines 1–4 (Mil/Style, Size, Color, Ref#, Pad, Areas).
- Floor Condition section, Fixtures, Moldings, Installation Method, Carpet section, Special Instructions.
- **Pricing/totals are visible to admin only** when previewing this document; salespeople see a pricing-redacted version (the paper Work Order has no prices — match that for salespeople).

### 5.3 Daily Work Order (page 3)
Stripped-down, installer-facing. Only:
- Ship-to + invoice number + installation date + installer + size.
- Subfloor type, Shower spec block, Wood/Click-Float/Nail-down rows, Tile/Stone block, Removal & Appliances block.
- **No prices ever**, regardless of role. This is the sheet the installer takes to the job.

### 5.4 Vendor Order Form (page 4)
One per vendor. The user picks which material lines go on this PO; system bundles them.
- Header: U.S. Floor letterhead, Vendor, P.O.#, Fax/Email Date, Sidemark.
- Items table (Style, Color, Size) + Moldings list.
- Will-Call / Delivery dates and Delivery Address.
- Footer note: "Please, fax or e-mail order confirmation ASAP."

### Generation UI

On the Order detail page, provide four tabs:

```
[ Invoice ]  [ Work Order ]  [ Daily Work Order ]  [ Vendor Order(s) ]
```

All four tabs are visible to **admin** on every order, and to **salespeople** on their own orders. The Daily Work Order has no prices regardless of role (matching the paper original — it's the installer's sheet). The Work Order shows prices to admin only; salespeople see a pricing-redacted version.

Each tab has:
- A live preview (rendered as styled HTML matching the PDF look).
- A **"Download PDF"** button (server-rendered via `@react-pdf/renderer`).
- A **"Print"** button (`window.print()` on a print-stylesheet view).

For Vendor Orders, show a "**+ New Vendor PO**" button that opens a wizard: pick vendor name, pick which `OrderMaterial` rows belong on this PO, set will-call/delivery dates, generate. Each generated PO is saved as a `VendorOrder` row with a JSON snapshot of the line items so subsequent edits to the master order don't silently mutate a PO that's already been sent.

---

## 6. Visual Design System (extracted from the live site + logo)

The look comes from `usfloorkb.com` and the company logo. Implement as Tailwind theme + CSS variables.

### Color tokens

```css
:root {
  /* Primary brand greens */
  --usfkb-green-900: #0E3F12;   /* deepest, used for the dark CTA button on the live site */
  --usfkb-green-700: #1B6B1F;   /* primary brand green — logo + headlines */
  --usfkb-green-500: #2E8B2F;   /* bright accent green ("30+ Years..." line) */
  --usfkb-green-100: #E6F2E6;   /* tinted background for selected nav, hover states */

  /* Neutrals — match the marble background feel */
  --usfkb-stone-50:  #FAFAF7;   /* page background (warm off-white) */
  --usfkb-stone-100: #F1F0EB;   /* card background */
  --usfkb-stone-200: #DEDCD3;   /* dividers */
  --usfkb-stone-700: #4A4A45;   /* secondary text */
  --usfkb-stone-900: #1A1A17;   /* body text (near-black, never pure #000) */

  /* Semantic */
  --usfkb-warning: #B8860B;
  --usfkb-danger:  #A52A2A;
  --usfkb-success: var(--usfkb-green-700);
}
```

Map these into Tailwind via `tailwind.config.ts`:

```ts
extend: {
  colors: {
    brand: {
      DEFAULT: 'var(--usfkb-green-700)',
      dark:    'var(--usfkb-green-900)',
      light:   'var(--usfkb-green-500)',
      tint:    'var(--usfkb-green-100)',
    },
    stone: { /* ...the stone scale above */ },
  }
}
```

### Typography
- **Headings**: a clean geometric sans, **Inter** (close to the live site's headline face, free via Google Fonts, renders cleanly on all platforms). Weight 700 for H1, 600 for H2.
- **Body**: same family, weight 400, 16px base, 1.55 line-height.
- **Numbers in tables / invoice totals**: tabular figures (`font-variant-numeric: tabular-nums;`). Use a slightly heavier weight (500) for monetary amounts.

### Logo & layout cues
- Use the green house outline logo (`/reference/logo.avif` — convert to SVG for crisp scaling). It should appear on every printed document and in the top-left of the app shell.
- The app shell mirrors the website's header bar: light/marble background, gray nav bar with white text, **bright green CTA in the top-right** ("New Order" for sales, "Run AI Analysis" for admin).
- Cards on a soft stone background, 1px stone-200 borders, 6–8px radius. Buttons: brand green, white text, no gradient.
- Print stylesheets: black text on white, no background fills, logo top-left, invoice number bold red (matches the "6514" red on the original — use `#B91C1C`).

### Component-level rules
- Required form fields show a subtle brand-green left border, not a red asterisk, until they're submitted empty (then they switch to a red border with a one-line message below).
- The salesperson dropdown is **always** the first field in the Invoice form, and is sticky at the top while the form scrolls on mobile.
- All money inputs use a masked input that displays `$1,234.56` but stores cents.

---

## 7. Admin Dashboard

Default landing for `admin` users at `/admin`.

### Top KPI strip (cards in a 4-column grid, stack on mobile):
1. **Revenue this month** (sum of `totalCents` for non-voided orders in current month) with delta vs prior month.
2. **Open balance** (sum of `balanceCents` for orders not in `paid` or `voided`).
3. **New orders this month** (count) with delta.
4. **Top salesperson this month** (name + revenue).

### Charts (Recharts, all filterable by date range — default last 90 days):
- **Revenue over time** — line chart, daily/weekly toggle.
- **Revenue by salesperson** — horizontal bar chart, sorted descending. Click a bar to filter the orders table to that salesperson.
- **Orders by advertising source** — donut chart with count and revenue tooltips. This is the chart the owner cares about most — make sure it's clear and legible.
- **Category mix** (Cabinet / Carpet / Vinyl / Wood / Ceramic / Counter Top / Fireplace / Shower) — stacked bar by month, so the owner can see seasonality.

### Recent orders table
Below the charts: paginated list of the last 50 orders. Columns: Invoice #, Date, Customer, Salesperson, Adv. Source, Total, Balance, Status, Actions (View / Edit / Void / **Delete**). The Delete action is admin-only, opens a confirmation dialog, and requires typing the invoice number to proceed. Search by invoice number, customer name, or salesperson.

### Settings sub-pages
- `/admin/users` — add/deactivate salespeople and other admins.
- `/admin/sources` — add/deactivate advertising sources.
- `/admin/ai-analysis` — see § 8.

---

## 8. AI Business Analysis (Claude API)

A page at `/admin/ai-analysis` only the admin can reach.

### UX
- A **"Run analysis"** button. Below it, a date-range picker (default: trailing 90 days) and a textarea labeled "Anything specific you want me to look at? (optional)".
- When the admin clicks Run, the server gathers an aggregated, anonymized snapshot of orders in that range and POSTs it to the Claude API with a system prompt focused on small-business advice.
- Render the streamed response as Markdown in a card. Save each analysis to a `ai_analysis_runs` table so the admin can scroll back through past reports.

### What the snapshot contains (server-side aggregation — never raw customer PII)
- Total revenue, order count, average order value.
- Revenue by salesperson (name + amount + order count).
- Revenue by advertising source (source + amount + order count + conversion implied as `revenue / orders`).
- Category mix (% of revenue per category checkbox).
- Top 10 areas-of-home by frequency and by revenue.
- Open balance and aging buckets (0–30, 31–60, 61–90, 90+ days).
- Voided / cancelled rate.

### System prompt template

```
You are a small-business advisor for U.S. Floor, Kitchen & Bath, a family-owned
flooring and remodeling shop in Rancho Santa Margarita, CA. The owner is going to
hand you an aggregated snapshot of the last {N} days of business. Your job is to:

1. Briefly summarize what's working (1-2 paragraphs).
2. Flag concerns worth investigating (concentration risk on one salesperson,
   under-performing ad sources, growing open balance, etc.).
3. Give 3 specific, actionable recommendations the owner could try this month.
   Each recommendation should be concrete (which lever, expected effect,
   how to measure).
4. Keep the tone direct and practical — they are tradespeople, not analysts.
   No buzzwords, no consultant-speak.

Snapshot follows.
```

Use `claude-opus-4-7` for this endpoint. Stream the response to the client. Cache the API key in `ANTHROPIC_API_KEY` on the server only; never expose it to the browser.

---

## 9. Salesperson Panel

`/sales` — landing page is "**New Order**" (the Invoice form), because that's what they actually log in to do.

Other pages:
- `/sales/orders` — only their own orders, with status pills and a search box.
- `/sales/orders/[id]` — view and **edit** their own order. Every field on the order is editable at any time; nothing locks based on status. They see all four document tabs: Invoice, Work Order (without prices), Daily Work Order, Vendor Order(s). They can generate, preview, download, and print any of them.
- `/sales/profile` — change password, see their own monthly sales total (a single small card — they get to see *their own* number, but nothing about other salespeople or the company total).

Hard rules enforced server-side:
- A salesperson cannot set `salespersonId` to anyone but themselves.
- A salesperson cannot see, edit, void, or delete an order they didn't create.
- A salesperson **can void** their own orders (sets `status = voided`); voiding is reversible by an admin.
- A salesperson **cannot permanently delete** anything. Only admins can hard-delete (and only via a confirmation flow that requires typing the invoice number).
- Supabase Row-Level Security policies must enforce all of the above (don't rely on the API layer alone).

---

## 10. Authentication & Onboarding

- Login page at `/login`. Email + password.
- **All auth-related and transactional emails route through Brevo, not Supabase's built-in mailer.** See § 10a for setup. Configure Supabase Auth's SMTP settings to point at Brevo's SMTP relay so password resets, magic links, and email confirmations all use the company's branded sender.
- "Forgot password" flow uses Supabase Auth → Brevo SMTP → user's inbox.
- First-run setup: if there are zero users in the database, the seed script creates the admin and prints credentials to the terminal **once**. Force a password change on first login.
- Session timeout: 8 hours of inactivity, then re-auth.
- Admin can invite a new salesperson by email; the invite link sets a password and assigns the `salesperson` role. Invite emails are sent via Brevo's transactional API (not Supabase's invite flow), so they use the branded template described in § 10a.

---

## 10a. Email Setup (Brevo outbound, HostGator inbound)

The shop's email goal is simple: every email the app sends should come from `info@usfloorkb.com` (the address staff and customers already know), and replies to those emails should reach the owner.

The setup has two moving parts:

- **Outbound** (Brevo) — the app sends mail *from* `info@usfloorkb.com` via Brevo's transactional API and SMTP relay.
- **Inbound** (HostGator, already in place) — `info@usfloorkb.com` is a real cPanel mailbox on HostGator. The owner already logs in to receive mail at this address. **We do not touch this.**

This was confirmed by DNS lookup at the start of the project. The MX record points to `mx.usfloorkb.com` (a self-referential MX) and the SPF record includes `websitewelcome.com` — both hallmarks of HostGator's bundled cPanel email. If the hosting situation has changed since the project started, re-run the investigation in § 10a.0 before deploying.

### 10a.0 DNS state at project start (for reference)

```
$ dig MX usfloorkb.com +short
30 mx.usfloorkb.com.

$ dig TXT usfloorkb.com +short
"v=spf1 ip4:66.96.128.0/18 include:websitewelcome.com ?all"
"globalsign-domain-verification=87A05ACF9AEAF6E23B1E2BA4A5BD9EE7"
```

Read like this:
- **MX → `mx.usfloorkb.com`**: HostGator cPanel email (this is HostGator's standard pattern). The owner has a real mailbox; do not change MX.
- **SPF `ip4:66.96.128.0/18 include:websitewelcome.com`**: authorizes HostGator's mail servers to send from this domain. Must be preserved when we add Brevo (see § 10a.1).
- **SPF terminator `?all`**: "neutral" — unusually permissive. Recommend changing to `~all` (softfail) when we update SPF for Brevo. Document this to the owner before changing.
- **GlobalSign TXT**: SSL certificate verification token, unrelated to mail. Leave alone.

If a future re-deployment finds a different MX record (e.g., the owner switched to Google Workspace), the inbound situation has changed and the deployer should re-evaluate before publishing any DNS changes.

### Why not Supabase's built-in mailer
Supabase's bundled email service is rate-limited to ~3 emails/hour, sends from a generic `@supabase.co` address, and lands in spam often. For a business-facing app, that's not acceptable for password resets that staff need to use immediately.

### Sender address strategy

All app-generated email is sent **from** `info@usfloorkb.com`. This is the address staff already use and customers already recognize from the website. Replies route through HostGator to the existing mailbox the owner already checks.

A few notes on this choice:
- The "From" name is always **U.S. Floor, Kitchen & Bath** (not a person's name) so customers don't get confused when staff turnover happens.
- For salesperson invite emails specifically, set `Reply-To: info@usfloorkb.com` explicitly even though it matches the From — defensive against any future change.
- If we ever want different addresses for different mail types (e.g. `quotes@`, `installs@`), they can be added in Brevo as additional verified senders later. Phase 1 keeps it simple: one sender, one address, one inbox.

### What Brevo handles (outbound only)
1. **Password reset emails** (triggered by Supabase Auth, sent via Brevo SMTP)
2. **Salesperson invite emails** (triggered by our app, sent via Brevo's transactional API)
3. **Email confirmations** for new accounts (Supabase Auth → Brevo SMTP)
4. **Future Phase 2+ touchpoints**: order confirmations to customers, vendor PO email delivery — all via the same Brevo client

### 10a.1 DNS changes required (the only DNS work for email)

Three TXT records — one is a careful merge with the existing SPF, two are new. **Do not change MX records.**

**1. SPF — modify existing record (replace, do not duplicate)**

There is currently exactly one SPF record. SPF rules forbid having more than one — if you add a second, all SPF lookups fail, breaking deliverability for both HostGator and Brevo. The existing record must be **edited in place** to add Brevo's include:

| | Value |
|---|---|
| **Current** | `v=spf1 ip4:66.96.128.0/18 include:websitewelcome.com ?all` |
| **New** | `v=spf1 ip4:66.96.128.0/18 include:websitewelcome.com include:spf.brevo.com ~all` |

Two things changed:
- Added `include:spf.brevo.com` (authorizes Brevo to send mail as this domain).
- Changed `?all` → `~all`. The `?all` ("neutral") terminator is unusually weak — it tells receivers to take no action on senders that don't match. `~all` ("softfail") is the modern standard and improves deliverability for both HostGator and Brevo. **Mention this change to the owner before deploying** — if HostGator outbound mail starts landing in spam after the change (very unlikely), revert to `?all`.

**2. DKIM — add new record per Brevo's dashboard instructions**

Brevo provides the exact name and value in their domain-verification dashboard after `usfloorkb.com` is added to the account. It will look roughly like:

```
Type: TXT  Host: mail._domainkey.usfloorkb.com  Value: k=rsa; p=MIGfMA0GCSqG... (long key)
```

**3. DMARC — add new record (recommended)**

```
Type: TXT  Host: _dmarc.usfloorkb.com  Value: v=DMARC1; p=none; rua=mailto:info@usfloorkb.com
```

`p=none` means "monitor only, don't reject" — safe starting policy. The `rua=mailto:` directive sends weekly aggregate reports to `info@`, which is useful for the owner to see whether anyone is spoofing the domain (they almost certainly won't; this is hygiene). After 30 days of clean reports, the policy can be tightened to `p=quarantine`.

### DNS change procedure

1. Log in to wherever DNS for `usfloorkb.com` is managed (likely the same domain registrar — possibly HostGator itself, or whoever the domain was registered with).
2. Add `usfloorkb.com` to the Brevo dashboard, get the DKIM value.
3. **Edit** the existing SPF record (do not add a second one).
4. **Add** the new DKIM TXT record at `mail._domainkey.usfloorkb.com`.
5. **Add** the new DMARC TXT record at `_dmarc.usfloorkb.com`.
6. Wait 1–4 hours for propagation. Verify with:
   ```bash
   dig TXT usfloorkb.com +short          # should show updated SPF
   dig TXT mail._domainkey.usfloorkb.com +short  # should show DKIM
   dig TXT _dmarc.usfloorkb.com +short   # should show DMARC
   ```
7. Click "Verify" in Brevo's domain dashboard.
8. Test the full loop (see § 10a.2).

### 10a.2 Verification checklist (run before going live)

- [ ] `dig MX usfloorkb.com +short` still returns `30 mx.usfloorkb.com.` (MX unchanged — HostGator still receives inbound)
- [ ] `dig TXT usfloorkb.com +short` shows the new merged SPF, single line, with both includes
- [ ] DKIM TXT record resolves and Brevo dashboard shows the domain as "verified"
- [ ] DMARC TXT record resolves
- [ ] Test inbound: send an email from a personal account to `info@usfloorkb.com`, confirm it arrives in the HostGator mailbox (no regression from existing behavior)
- [ ] Test outbound: trigger a password reset from the staging app; the email arrives, **From: U.S. Floor, Kitchen & Bath \<info@usfloorkb.com\>**, lands in inbox not spam, with no SPF/DKIM warnings in the email headers (check "Show original" in Gmail or equivalent)
- [ ] **Test the loop:** reply to that password-reset email; the reply arrives at the HostGator mailbox via the unchanged MX
- [ ] Test outbound from HostGator: send an email from the cPanel webmail to a personal account, confirm it still delivers cleanly (validates that the SPF merge didn't break HostGator)

Only when all eight items pass does the app go live.

### Configuration

Two integration points:

**(a) Supabase Auth → Brevo SMTP** for built-in flows (password reset, email confirmation)

In the Supabase dashboard, under Authentication → SMTP Settings, configure:

| Field | Value |
|---|---|
| Sender email | `info@usfloorkb.com` (must be verified in Brevo first — see § 10a domain verification) |
| Sender name | `U.S. Floor, Kitchen & Bath` |
| SMTP host | `smtp-relay.brevo.com` |
| SMTP port | `587` |
| SMTP username | (Brevo SMTP login — looks like `xxxxxx@smtp-brevo.com`) |
| SMTP password | (Brevo SMTP key — generated in Brevo dashboard under SMTP & API → SMTP) |

**(b) Our app → Brevo Transactional API** for app-triggered emails (salesperson invites, future custom emails)

Use Brevo's official SDK:

```bash
npm install @getbrevo/brevo
```

Wrap it in `/src/lib/email.ts`:

```typescript
// /src/lib/email.ts
import * as Brevo from '@getbrevo/brevo';

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

const SENDER = {
  email: process.env.EMAIL_FROM ?? 'info@usfloorkb.com',
  name: 'U.S. Floor, Kitchen & Bath',
};

type SendEmailArgs = {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string; // plaintext fallback — always include
};

export async function sendEmail({ to, toName, subject, htmlContent, textContent }: SendEmailArgs) {
  const message = new Brevo.SendSmtpEmail();
  message.sender = SENDER;
  message.to = [{ email: to, name: toName }];
  message.subject = subject;
  message.htmlContent = htmlContent;
  message.textContent = textContent ?? stripHtml(htmlContent);
  return apiInstance.sendTransacEmail(message);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}
```

### Email templates

Keep templates as React components in `/src/emails/` (one file per email type). Render them to HTML strings server-side using `@react-email/render`:

```bash
npm install @react-email/components @react-email/render
```

Required templates for Phase 1:
- `SalespersonInviteEmail.tsx` — sent when admin invites a new salesperson. Includes a one-time signup link with a token valid for 72 hours.
- `PasswordResetEmail.tsx` — used by Supabase via SMTP, but provide a custom HTML template uploaded into the Supabase Auth → Email Templates UI so the styling matches.
- `EmailConfirmEmail.tsx` — same pattern as password reset.

All three templates use the brand colors from § 6 (forest green header, warm stone background, the green house logo at top), and end with a plain-text postscript: "U.S. Floor, Kitchen & Bath · 30092 Santa Margarita Pkwy #G · Rancho Santa Margarita, CA 92688 · 949-589-9226".

### Environment variables to add

```env
# Brevo
BREVO_API_KEY=xkeysib-...           # transactional API key
EMAIL_FROM=info@usfloorkb.com       # must match a verified Brevo sender on the verified domain

# Supabase SMTP fields are configured in Supabase dashboard, not env vars,
# but document the SMTP credentials in the team password manager.
```

### Local development

Don't actually send email from local dev — it pollutes Brevo logs and wastes the daily quota. Two options:

1. Set `BREVO_API_KEY` to an empty string locally; the email helper logs the message to the console instead of sending.
2. Or use **Mailpit** (`docker run -p 1025:1025 -p 8025:8025 axllent/mailpit`) and point the local `.env` SMTP settings at `localhost:1025` to catch all outgoing mail in a local UI.

Document option 2 in the README — it's the better dev experience.

### Cost expectation

Free tier (300 emails/day) covers this shop indefinitely. If usage ever exceeds it, Brevo's "Starter" plan is $9/month for 20,000 emails — still well under the cost of a single missed customer.

---

## 11. PDF Generation Details

Use `@react-pdf/renderer` server-side (via a Next.js Route Handler at `/api/orders/[id]/pdf?doc=invoice|workorder|dailyworkorder|vendor&vendorOrderId=...`).

- Page size: US Letter, 0.5" margins.
- Embed the Inter font.
- Logo as SVG at top-left, 1.25" wide.
- Each document type gets its own React component in `/src/pdf/`:
  - `InvoicePDF.tsx`
  - `WorkOrderPDF.tsx`
  - `DailyWorkOrderPDF.tsx`
  - `VendorOrderPDF.tsx`
- Filename pattern when downloaded: `USFKB-{invoiceNumber}-{document}.pdf` (e.g. `USFKB-6515-invoice.pdf`).
- Render order metadata (created date, who downloaded, doc type) to a footer line in 8pt stone-700 text — useful for paper trails.

---

## 12. Validation, Edge Cases, & Hardening

- **Invoice number race condition**: assign `invoiceNumber` inside a Postgres transaction using a sequence (`CREATE SEQUENCE invoice_number_seq START 6515`). Don't compute `MAX(invoice_number) + 1` in app code.
- **Money math**: every total/subtotal/balance recomputation happens server-side on save. Client shows a preview but is not trusted.
- **Concurrent edits**: include `updatedAt` on the form; if it doesn't match on submit, show a "this order was changed by someone else, refresh" banner.
- **Soft deletes vs. void vs. permanent delete**: filter `deletedAt IS NULL` everywhere.
  - **Voiding** sets `status = voided` and keeps the order fully visible in lists with a "Voided" pill. Excluded from financial totals. Both salespeople (own orders) and admins can void. Voiding is reversible — admins can change the status back.
  - **Permanent delete** sets `deletedAt` (and is followed by a hard delete only via a separate purge job, never inline). **Only admins** can permanently delete, and only via a confirmation dialog that requires typing the exact invoice number to proceed.
  - Deleting a customer sets `deletedAt` on the customer row but preserves order history (orders keep a snapshot of the customer's name + address in case the customer is later purged).
- **Audit log** (lightweight): an `audit_log` table that records `(actorUserId, action, entityType, entityId, diff, createdAt)` for every Order create/update/void and every User role change. Admin can view it under `/admin/audit`.
- **Empty states**: every list view has a friendly empty state that tells the user how to get started, not just "No data".
- **Mobile**: the salesperson panel must be fully usable on a phone — they may be on a job site. Admin dashboard can be desktop-first.
- **Accessibility**: every form field has a real `<label>`. Tab order is sane. Color is never the only signal (the Adv. Source donut chart needs labels too).

---

## 13. Project Structure

```
/usfloorkb-app
├── /reference            ← put scan__2_.pdf, logo.avif, screenshots here
├── /prisma
│   ├── schema.prisma
│   └── seed.ts
├── /src
│   ├── /app
│   │   ├── (auth)/login/page.tsx
│   │   ├── (admin)/admin/...
│   │   ├── (sales)/sales/...
│   │   └── api/...
│   ├── /components
│   │   ├── /ui          ← shadcn primitives
│   │   ├── /forms       ← OrderForm, CustomerForm, etc.
│   │   ├── /charts      ← RevenueByPersonChart, etc.
│   │   └── /layout      ← AppShell, Sidebar, TopBar
│   ├── /pdf             ← React-PDF document components
│   ├── /emails          ← React Email templates (SalespersonInvite, PasswordReset, etc.)
│   ├── /lib
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── money.ts     ← cents helpers
│   │   ├── claude.ts    ← Anthropic client
│   │   ├── email.ts     ← Brevo client wrapper
│   │   └── rls.ts       ← row-level security policies as code
│   └── /styles
│       └── globals.css  ← CSS variables from § 6
├── tailwind.config.ts
├── next.config.ts
├── render.yaml           ← Render Blueprint: web service + env vars (see § 13a)
├── Dockerfile            ← optional, for local parity with Render's container build
├── .env.example          ← DATABASE_URL, DIRECT_URL, ANTHROPIC_API_KEY, SUPABASE_*, NEXTAUTH_SECRET, BREVO_API_KEY, EMAIL_FROM
└── README.md             ← setup, seed, deploy, "where Phase 2 plugs in"
```

---

## 13a. Render Deployment Setup

Deployment target is **Render** (`render.com`). The app runs as a single Web Service; the database lives on Supabase (separate vendor, free tier).

### `render.yaml` Blueprint

Generate a `render.yaml` at the repo root so deployment is reproducible — one click from a fresh Render account:

```yaml
services:
  - type: web
    name: usfloorkb
    runtime: node
    plan: starter           # $7/month; bump to standard if installers report slowness
    region: oregon          # closest US-West region to Orange County
    buildCommand: npm ci && npx prisma generate && npm run build
    startCommand: npm run start
    healthCheckPath: /api/health
    autoDeploy: true        # deploy on push to main
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false         # set manually in Render dashboard — pooled Supabase URL (port 6543)
      - key: DIRECT_URL
        sync: false         # set manually — direct Supabase URL (port 5432) for Prisma migrations
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: BREVO_API_KEY
        sync: false
      - key: EMAIL_FROM
        value: info@usfloorkb.com
      - key: NEXTAUTH_SECRET
        generateValue: true
      - key: NEXTAUTH_URL
        sync: false         # set to https://usfloorkb.onrender.com or the custom domain
```

### Required `package.json` scripts

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p ${PORT:-3000}",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

The `-p ${PORT:-3000}` is important — Render injects `$PORT` and the app must bind to it.

### Health check endpoint

Add `/api/health` returning `{ ok: true }` plus a 200 status. Render uses this to decide whether the service is live; without it, the first deploy will be marked unhealthy and traffic won't route.

### Database migrations on deploy

Migrations run as a separate one-off step, not on every boot (running them on boot causes race conditions when Render spins up a new instance during a deploy). Document in the README:

```bash
# Run from local machine, pointed at production DATABASE_URL:
npm run db:migrate
```

Optional: add a Render "Job" that runs `npm run db:migrate` on demand from the dashboard.

### Persistent file storage

Render's filesystem is **ephemeral** — anything written to disk disappears on redeploy. This matters for two things:

1. **PDF downloads** — generate on-the-fly and stream to the response; never cache on disk.
2. **Logo SVG and other static assets** — ship them in the repo under `/public`, never write them at runtime.

If we ever need persistent file storage (for example, customer-uploaded photos in a future phase), use Supabase Storage — not Render's disk.

### Custom domain

Once the app is live at `usfloorkb.onrender.com`, the owner can map a subdomain like `app.usfloorkb.com`. Render handles HTTPS automatically via Let's Encrypt. Document the DNS records required (one CNAME) in the README.

### Cost expectation

Document this in the README so the owner has no surprises:

| Service | Cost | Notes |
|---|---|---|
| Render Web Service (Starter) | $7/month | Single instance, 512MB RAM, sufficient for this shop |
| Supabase | $0/month | Free tier covers 500MB DB and 50k MAU — far above what this shop needs |
| Brevo | $0/month | Free tier: 300 emails/day. Upgrade to Starter ($9/mo, 20k emails) only if needed |
| HostGator email | (already paid, part of existing hosting) | Inbound mailbox for `info@usfloorkb.com`. No new cost — the shop is already paying for this. |
| Anthropic API | $5–25/month | Pay-as-you-go; depends on AI Analysis usage. Budget for ~10 admin runs/month |
| **Total new spend** | **~$12–32/month** | |

---

## 14. Phase 2 Readiness — Don't Build It, But Be Ready For It

**Phase 2 will add a materials catalog** so salespeople pick from a typeahead instead of typing material specs into free-text fields. We are explicitly **not building it now** — we want 30–60 days of real Phase 1 usage to learn how staff actually describe materials before we model them. But Phase 1 should make that future work as small a delta as possible.

### Schema hooks already in place
- `OrderMaterial.materialId` — nullable foreign key, unused in Phase 1, ready for Phase 2.
- `VendorOrder.vendorId` + a `Vendor` table that auto-populates from typed vendor names.
- `OrderMaterial.unitOfMeasure`, `quantity`, `unitPriceCents`, `lineTotalCents` — capture-as-you-go fields so we have real-world distributions to design against.

### What Phase 1 must actively do to feed Phase 2

These are not nice-to-haves; they're the data Phase 2's design depends on. Build them in:

1. **Auto-create `Vendor` rows on first use.** When a salesperson types a vendor name on a Vendor Order (e.g. "Mohawk Industries"), the server checks `Vendor.name` case-insensitively and either reuses or creates the row. Set `vendorId` on the `VendorOrder`. By the time Phase 2 ships, the vendor list is already clean and deduplicated — no migration script needed.

2. **Auto-create `MaterialSuggestion` rows on every saved order line.** Add this small table:
   ```prisma
   model MaterialSuggestion {
     id          String   @id @default(uuid())
     // Normalized fingerprint: lowercased, trimmed, single-spaced concatenation
     // of millStyle + color + size + carpetType. Used for dedup + frequency counting.
     fingerprint String   @unique
     millStyle   String?
     color       String?
     size        String?
     carpetType  CarpetType?
     unitOfMeasure String?
     usageCount  Int      @default(1)
     lastVendorName String?
     lastUnitPriceCents Int?
     firstSeenAt DateTime @default(now())
     lastSeenAt  DateTime @default(now())
   }
   ```
   Every time an `OrderMaterial` is saved with non-empty style/color/size, upsert into this table by fingerprint, increment `usageCount`, refresh `lastSeenAt`, and snapshot the most recent vendor + price. **In Phase 1 nothing reads from this table** — it's a passive log. In Phase 2, the materials catalog is seeded directly from the top-N rows of `MaterialSuggestion`, ranked by `usageCount`. The owner gets a one-click "import top 100 most-used materials into the catalog" button on day 1 of Phase 2.

3. **Add a typeahead-style autocomplete to material fields in Phase 1, backed by `MaterialSuggestion`.** This is the one piece of Phase 2 UX we *do* build now, because it pays for itself immediately:
   - On the order form, the Mill/Style, Color, and Size inputs query `MaterialSuggestion` for matches as the user types and offer the top 5 suggestions.
   - Picking a suggestion fills in all four fields (style, color, size, carpetType) and pre-fills vendor name + unit price if available.
   - Free-text entry is still allowed — autocomplete is purely an accelerator.
   - This single feature dramatically improves Phase 1 usability *and* improves the data quality `MaterialSuggestion` is collecting (because consistent picks reinforce themselves).

4. **Track unit-of-measure usage explicitly.** When the salesperson enters a material, capture which unit they're thinking in (`sqft` / `sqyd` / `linft` / `each`) via a small dropdown. This lives in `OrderMaterial.unitOfMeasure`. By the time Phase 2 ships, you'll have hard data on which UoM dominates per category (e.g., carpet → sqyd, vinyl → sqft) and can set sensible defaults on `Material.defaultUom`.

5. **Audit-log every material-line save.** The existing `audit_log` table from § 12 already covers Order create/update; make sure each OrderMaterial change writes its own row with a diff. Phase 2 may want to retroactively bind historical orders to catalog entries, and the audit log is the source of truth for "what did the line say at the moment it was saved".

### Extension points scaffolded but inert

These are stubs in the code that Phase 1 ships but doesn't activate. Marking them clearly now means Phase 2 is a checklist of "uncomment + fill in", not "refactor".

- **`/admin/materials` route stub.** Create the route file with a placeholder page that says "Materials catalog — coming in Phase 2." This pins down the URL and the nav slot.
- **`/admin/vendors` route stub.** Same idea — Phase 1 lets vendors auto-accumulate, Phase 2 adds the CRUD UI here.
- **`Material` Prisma model commented out.** Drop the following into `schema.prisma` as a comment block right above `OrderMaterial`. The Phase 2 migration is then literally "uncomment, run `prisma migrate`, ship":
   ```prisma
   // PHASE 2 — DO NOT UNCOMMENT IN PHASE 1
   // model Material {
   //   id              String   @id @default(uuid())
   //   sku             String?  @unique
   //   name            String
   //   category        String   // "carpet" | "vinyl" | "wood" | "tile" | "stone" | "cabinet" | "countertop" | "molding" | "other"
   //   defaultVendorId String?
   //   defaultVendor   Vendor?  @relation(fields: [defaultVendorId], references: [id])
   //   defaultUom      String   // "sqft" | "sqyd" | "linft" | "each"
   //   defaultUnitPriceCents Int?
   //   defaultCostCents Int?
   //   isActive        Boolean  @default(true)
   //   notes           String?
   //   createdAt       DateTime @default(now())
   //   updatedAt       DateTime @updatedAt
   //   orderMaterials  OrderMaterial[]
   // }
   ```
- **`OrderMaterial.material` relation commented out.** When Phase 2 uncomments `Material`, also uncomment the relation on `OrderMaterial` (already noted in the schema above).
- **Feature flag.** Add a single `FEATURES.materialsCatalog` flag in `/src/lib/features.ts`, hardcoded to `false`. The autocomplete from item 3 above does *not* depend on this flag (it's based on `MaterialSuggestion`, which is always on). Phase 2 flips the flag to `true` and the `/admin/materials` page swaps from "coming soon" to the real CRUD.

### What we'll know at the end of Phase 1

After 30–60 days of real use, the owner can answer:
- Which materials get re-used? (`MaterialSuggestion` ordered by `usageCount`)
- Which vendors are actually doing volume? (`Vendor` joined to `VendorOrder` count + sum)
- Which units of measure dominate per category?
- How much do prices drift between repeat orders of the same material?

Those answers shape the Phase 2 prompt — which is the right way to build a catalog instead of guessing the schema in advance.

### Definition of "Phase 2 readiness" complete in Phase 1

- [ ] `OrderMaterial` includes `materialId`, `unitOfMeasure`, `quantity`, `unitPriceCents`, `lineTotalCents`.
- [ ] `Vendor` table exists; vendor names typed on Vendor Orders auto-create/match rows.
- [ ] `MaterialSuggestion` table exists; every saved `OrderMaterial` line upserts into it.
- [ ] Material-field autocomplete on the order form works against `MaterialSuggestion`.
- [ ] `/admin/materials` and `/admin/vendors` route stubs exist with "coming in Phase 2" placeholders.
- [ ] The commented-out `Material` model and relation are present in `schema.prisma`.
- [ ] `FEATURES.materialsCatalog = false` flag is wired through.
- [ ] README has a "Phase 2 plug-in instructions" section listing the exact steps to activate the catalog.

---

## 15. Build Order

Don't try to build everything at once. Ship in this order; each step should be runnable end-to-end before moving on.

1. **Scaffold + DB**: Next.js + Tailwind + Prisma + Supabase wired up. Schema migrated. Seed runs.
2. **Auth + email + role routing**: login works, admin and salesperson land in the right shells, RLS enforced. Brevo wired up: Supabase Auth points at Brevo SMTP for password reset / email confirmation; `/src/lib/email.ts` is functional; first React Email template (SalespersonInvite) renders correctly.
3. **Customer + Order CRUD (admin-only first)**: minimal Invoice form, list, detail. Server assigns invoice numbers. No PDFs yet.
4. **Salesperson panel**: same Invoice form, restricted to own orders, no totals visible elsewhere.
5. **Document generation**: Invoice → Work Order → Daily Work Order → Vendor Order, in that order, both as live HTML preview and PDF download.
6. **Phase 2 readiness plumbing** (see § 14): `Vendor` auto-create on Vendor Order save, `MaterialSuggestion` upsert on every order line, autocomplete on material fields, route stubs for `/admin/materials` and `/admin/vendors`, feature flag.
7. **Admin dashboard**: KPI strip + four charts + recent orders table.
8. **AI Analysis page** with Claude API integration.
9. **Audit log + soft deletes + polish + mobile pass + a11y pass**.
10. **README** with Phase 2 plug-in instructions: the exact steps (uncomment `Material` model, run migration, flip `FEATURES.materialsCatalog`, build CRUD on the existing `/admin/materials` route stub, add a "seed catalog from MaterialSuggestion" button).

---

## 16. Definition of Done for Phase 1

Before you call this complete, verify all of the following manually:

- [ ] Owner can log in as admin, add a new salesperson, and that person can log in immediately.
- [ ] Salesperson creates a new order, picks themselves from the salesperson dropdown (which is required), picks an advertising source, fills out the area table, and saves. Invoice number 6515 (or next) is assigned.
- [ ] Same order opens cleanly as Invoice, Work Order, Daily Work Order, and Vendor Order — each one matches the layout of the corresponding page in `/reference/scan__2_.pdf`.
- [ ] Salesperson can open one of their own orders and **edit any field**, including after it's been saved. Changes persist.
- [ ] Salesperson can **void** their own order; the order disappears from financial totals but stays visible with a "Voided" pill. Salesperson **cannot** permanently delete; the Delete action is not present in their UI and is rejected server-side if attempted.
- [ ] Admin can permanently delete an order, but only via the confirmation dialog that requires typing the invoice number.
- [ ] Salesperson can preview, download, and print all four documents (Invoice, Work Order without prices, Daily Work Order, Vendor Order) for their own orders.
- [ ] All four documents download as clean PDFs and print cleanly to physical paper.
- [ ] Admin sees the new order on the dashboard, in the right salesperson's revenue bar, and under the right advertising source in the donut chart.
- [ ] Salesperson cannot navigate to `/admin/*` (server returns 403, not just a hidden link).
- [ ] Salesperson cannot see another salesperson's orders by guessing the URL.
- [ ] AI Analysis page runs end-to-end against the Claude API and produces a useful, written analysis of the seeded data.
- [ ] Admin invites a new salesperson by email; the invite email arrives in the inbox within a minute, comes from `U.S. Floor, Kitchen & Bath <info@usfloorkb.com>`, is branded with the company logo and colors, and the signup link works on first click.
- [ ] Password reset flow works end-to-end: clicking "Forgot password" sends a reset email via Brevo SMTP from `info@usfloorkb.com` that lands in the inbox (not spam), and the reset link successfully resets the password.
- [ ] **Reply loop works:** replying to either of the above emails causes the reply to land in the existing HostGator mailbox at `info@usfloorkb.com` (the MX record was not changed; this validates that our outbound setup didn't break inbound).
- [ ] **Phase 2 readiness:** typing a vendor name on a Vendor Order creates a `Vendor` row; saving an order line upserts a `MaterialSuggestion` row; the material fields on the order form show typeahead suggestions backed by `MaterialSuggestion`; `/admin/materials` and `/admin/vendors` route stubs render a "coming in Phase 2" placeholder.
- [ ] Logo, colors, and typography match the reference screenshots well enough that a US Floor, Kitchen & Bath employee would recognize the app as theirs.
- [ ] README documents: local setup, how to seed, how to deploy to Render + Supabase, and the exact step-by-step Phase 2 activation procedure (per § 14).

When all of the above are checked off, Phase 1 is shippable.

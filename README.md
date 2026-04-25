# U.S. Floor, Kitchen & Bath — Order Management (Phase 1)

A web app that replaces U.S. Floor, Kitchen & Bath's paper invoice workflow
(`reference/scan__2_.pdf`) with a single Invoice form that auto-generates the
three downstream documents (Work Order, Daily Work Order, Vendor Order) as
printable PDFs, plus a role-based admin dashboard with a Claude-powered
business analysis page.

Full spec: [`docs/usfloorkb_phase1_prompt.md`](./docs/usfloorkb_phase1_prompt.md).
Brand & design system: [`docs/usfloorkb_design_system.md`](./docs/usfloorkb_design_system.md).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Database | Postgres via Supabase |
| ORM | Prisma 7 |
| Auth | Supabase Auth (email + role claim in `app_metadata`) |
| PDF | `@react-pdf/renderer` server-side |
| Charts | Recharts |
| AI | Anthropic Claude (`claude-opus-4-7` analysis, `claude-haiku-4-5` summaries) |
| Forms | React Hook Form + Zod |

> The spec called for Next.js 15. The scaffold pulled Next.js 16 (current
> stable). The App Router contract is unchanged; the version bump is recorded
> here for traceability.

## Local setup

1. **Install dependencies.**
   ```bash
   npm install
   ```

2. **Fill in `.env.local`.** Copy from `.env.example` and provide:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` —
     from the Supabase dashboard.
   - `SUPABASE_SERVICE_ROLE_KEY` — server-only; never ship to the browser.
   - `DATABASE_URL` — pooled connection string (port 6543, append
     `?pgbouncer=true&connection_limit=1`).
   - `DIRECT_URL` — direct connection string (port 5432) for migrations.
   - `ANTHROPIC_API_KEY` — from https://console.anthropic.com/settings/keys.

3. **Migrate the database.**
   ```bash
   npm run db:migrate -- --name init
   ```
   This runs `prisma migrate dev`, which uses `DIRECT_URL`.

4. **Apply Row-Level Security.** The policies live in `src/lib/rls.ts` as a
   SQL string. Copy that SQL into the Supabase SQL editor (or a migration)
   after the first `prisma migrate`.

5. **Seed.**
   ```bash
   npm run db:seed
   ```
   Creates the invoice number sequence (starting at 6515), eight starter
   advertising sources, three example salespeople, and one admin user. The
   admin temp password is printed to stdout once — you'll then create the
   matching user in Supabase Auth and force a password change on first login.

6. **Run.**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 — you'll be redirected to `/login`.

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:migrate` | `prisma migrate dev` (creates a new migration) |
| `npm run db:deploy` | `prisma migrate deploy` (apply migrations in CI/prod) |
| `npm run db:push` | `prisma db push` (skip migrations — dev only) |
| `npm run db:seed` | Run the seed script |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

- **App**: Vercel (Vercel auto-detects Next.js).
- **DB**: Supabase. Use Vercel's Supabase integration or set the env vars
  manually in the Vercel project.
- **Migrations**: run `npm run db:deploy` in a CI step before deploy, or apply
  via Supabase migrations.

## Build order (where we are)

The spec's § 15 build order:

1. ✅ Scaffold + DB (this commit)
2. ⏳ Auth + role routing
3. ⏳ Customer + Order CRUD (admin first)
4. ⏳ Salesperson panel
5. ⏳ Document generation (Invoice → Work Order → Daily Work Order → Vendor)
6. ⏳ Phase 2 readiness plumbing (Vendor auto-create, MaterialSuggestion, autocomplete)
7. ⏳ Admin dashboard (KPIs, charts, recent orders)
8. ⏳ AI Analysis page
9. ⏳ Audit log + soft deletes + polish + mobile + a11y
10. ⏳ Phase 2 activation steps (this README section, expanded)

## Security note

The Anthropic key shared in the original setup conversation was treated as
compromised and was **never** written to a committed file. Generate a new key
at https://console.anthropic.com/settings/keys and put it in `.env.local`
(gitignored).

## Project layout

```
.
├── docs/                    # Spec + design system
├── reference/               # Original paper forms + logo
├── prisma/
│   ├── schema.prisma        # Full schema (Order, Customer, etc.)
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/login/    # Login (stub — step 2)
│   │   ├── (admin)/admin/   # Admin shell + dashboard, users, sources, AI, audit, materials, vendors
│   │   └── (sales)/sales/   # Salesperson shell + new order, my orders, profile
│   ├── components/
│   │   ├── layout/AppShell.tsx
│   │   └── ui/Button.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── supabase-server.ts
│   │   ├── supabase-browser.ts
│   │   ├── claude.ts
│   │   ├── money.ts         # cents helpers (storage = integer cents)
│   │   ├── features.ts      # FEATURES.materialsCatalog flag (Phase 2)
│   │   ├── auth.ts
│   │   └── rls.ts           # RLS policies as a SQL string
│   ├── pdf/                 # React-PDF documents (step 5)
│   └── middleware.ts        # Session refresh + role-based route gating
└── public/
    ├── logo.svg             # Recreated from logo.avif
    └── logo-knockout.svg    # White-knockout for dark backgrounds
```

## Phase 2 plug-in (when the time comes)

Per § 14 of the spec, Phase 2 adds a materials catalog. The Phase 1 scaffold
already includes:

- `OrderMaterial.materialId` (nullable FK, currently unused).
- `Vendor` table that auto-populates from typed vendor names on Vendor POs.
- `MaterialSuggestion` table that captures every saved order line.
- `FEATURES.materialsCatalog` feature flag, hardcoded to `false`.
- Route stubs at `/admin/materials` and `/admin/vendors`.
- A commented-out `Material` Prisma model directly in `schema.prisma`.

To activate Phase 2:

1. Uncomment the `Material` model (and the relation on `OrderMaterial`) in
   `prisma/schema.prisma`.
2. `npm run db:migrate -- --name materials_catalog`.
3. Build the CRUD UI on the existing `/admin/materials` route.
4. Add a "Seed catalog from MaterialSuggestion" button that imports the top-N
   most-used rows.
5. Flip `FEATURES.materialsCatalog = true`.

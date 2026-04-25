# U.S. Floor, Kitchen & Bath — Design System & Brand Profile

Extracted from the live site (usfloorkb.com), the company logo, and the existing paper forms. This is the visual contract for any new digital product built for U.S. Floor, Kitchen & Bath.

---

## 1. Brand personality

| Trait | What it means in design |
|---|---|
| Family-owned, 30+ years | Trustworthy, not flashy. No gradients, no glassmorphism, no AI-generated whimsy. |
| Hands-on tradespeople | Clean lines, generous tap targets, plain language. The owner and installers will use this on phones with dust on them. |
| Premium home remodeling | Marble textures, deep greens, tabular figures on totals — the look of a finished kitchen, not a cheap circular. |
| Local Orange County | Warm off-white backgrounds (not stark Silicon-Valley white), confident green accents. |

---

## 2. Color palette

The brand color is the **deep forest green** in the logo and on every headline of the live site. The bright green is reserved for emphasis (the "30+ Years…" line on the homepage). Everything else is warm stone neutrals that read as marble.

```css
:root {
  /* Primary brand greens */
  --usfkb-green-900: #0E3F12;   /* deepest — primary CTA buttons */
  --usfkb-green-700: #1B6B1F;   /* primary brand green — logo + headlines */
  --usfkb-green-500: #2E8B2F;   /* bright accent — emphasis text only */
  --usfkb-green-100: #E6F2E6;   /* tint — selected states, hover backgrounds */

  /* Warm stone neutrals (the "marble" feel of the site) */
  --usfkb-stone-50:  #FAFAF7;   /* page background */
  --usfkb-stone-100: #F1F0EB;   /* card background */
  --usfkb-stone-200: #DEDCD3;   /* dividers, table borders */
  --usfkb-stone-700: #4A4A45;   /* secondary text, captions */
  --usfkb-stone-900: #1A1A17;   /* body text — never pure #000 */

  /* Semantic accents */
  --usfkb-warning: #B8860B;     /* warm amber, fits the warm palette */
  --usfkb-danger:  #A52A2A;
  --usfkb-success: var(--usfkb-green-700);

  /* Special: invoice number red on printed forms */
  --usfkb-invoice-red: #B91C1C;  /* matches the handwritten "6514" on the original */
}
```

**Rules of use:**
- Headlines and primary nav text on light backgrounds: `green-700`.
- Primary buttons: `green-900` background, white text. No hover gradient — darken by 4% on hover.
- Bright `green-500` is reserved for short emphasis lines (e.g. "30+ Years of Experience"). Don't use it for body text.
- Never put green text on a green background. The donut-chart "advertising source" slices use distinct hues (green, amber, navy, terracotta, slate, plum) — not five shades of green.
- Body copy is always `stone-900`. Captions and meta info are `stone-700`.

---

## 3. Typography

| Use | Family | Weight | Size |
|---|---|---|---|
| H1 (page title) | Inter or Geist | 700 | 32–40px |
| H2 (section) | Inter or Geist | 600 | 22–26px |
| H3 / card title | Inter or Geist | 600 | 16–18px |
| Body | Inter or Geist | 400 | 16px / 1.55 line-height |
| Labels & captions | Inter or Geist | 500 | 13–14px |
| Money / invoice numbers | Inter or Geist with `font-variant-numeric: tabular-nums` | 500 | match context |

**Why Inter / Geist:** the live site's headlines are a clean geometric sans with a slight humanist warmth. Both options match. Inter is the safer pick for broad system rendering; Geist is the on-trend option if you're already using Vercel infrastructure. Pick one and stick to it.

---

## 4. Logo usage

The logo is a **green house outline** with "U.S. Floor Kitchen Bath" stacked inside. Treat it as the company's signature.

- Always render from SVG. Don't ship the AVIF in the app.
- Minimum size: 32px tall in the app shell, 1.25" tall on printed documents.
- Clear space around the logo: at least the height of the "U.S." block on all sides.
- On dark backgrounds, use a white-knockout version. Never recolor the logo to a non-brand green.

---

## 5. Layout & components

**App shell** (mirrors the website header):
- Light marble-ish background (`stone-50`).
- Top bar: muted dark-gray strip with white nav links, a primary green CTA pinned to the top-right (the live site's "Request a Quote" — in the app this becomes "New Order" for sales, "Run AI Analysis" for admin).
- Logo top-left, links centered, CTA right.

**Cards:**
- Background `stone-100`.
- 1px border `stone-200`.
- Radius 6–8px.
- Internal padding 20–24px.
- No drop shadows, or a single subtle one (`0 1px 2px rgba(0,0,0,0.04)`). The site's overall feeling is print-like, not skeuomorphic.

**Buttons:**
- **Primary** — solid `green-900`, white text, weight 500, radius 4px, no shadow. Hover: darken 4%.
- **Secondary** — outline `green-700`, transparent background, `green-700` text. Hover: `green-100` background.
- **Tertiary / link** — underlined `green-700` text, no background.
- Tap targets minimum 44×44px on mobile. Tradespeople wear gloves.

**Forms:**
- Labels above inputs, weight 500, `stone-700`.
- Inputs have a 1px `stone-200` border, radius 4px, white background, 12px vertical padding.
- **Required fields** show a subtle 2px `green-700` left border by default — not a red asterisk. They turn to a 2px `danger` left border with a one-line error below only after a failed submit.
- The salesperson dropdown gets visual priority: it's always the first field on the order form, and on mobile it sticks to the top of the viewport while the rest of the form scrolls.
- Money inputs mask as `$1,234.56` while storing cents underneath.

**Tables:**
- Header row: `stone-100` background, weight 600, `stone-900` text.
- Borders: 1px `stone-200`, horizontal only (no vertical lines — keeps it print-like).
- Money columns right-aligned, tabular figures.
- Row hover: `green-100` background.

**Status pills:**
- `Draft` — `stone-200` background, `stone-700` text.
- `Finalized` — `green-100` background, `green-700` text.
- `Installed` — solid `green-700` background, white text.
- `Paid` — solid `green-900` background, white text.
- `Voided` — `stone-200` background, `stone-700` text with strikethrough.

---

## 6. Print stylesheet (for the four generated documents)

The Invoice, Work Order, Daily Work Order, and Vendor Order Form should look familiar to staff who've used the paper forms for 30 years. Stay close to those layouts.

- Page: US Letter, 0.5" margins.
- Background: white. No tints, no marble texture. Ink is expensive.
- Body text: pure `stone-900` (still not `#000` — it reads softer on real paper).
- Logo: top-left, 1.25" wide, in brand green.
- **Invoice number: bold `--usfkb-invoice-red` (`#B91C1C`)**, top-right, large. This matches the handwritten red number on the original paper invoice and helps staff find the right form in a stack.
- Borders on tables: 1px `stone-700` (heavier than on screen — printed lines need to hold up to a fax).
- Footer: 8pt `stone-700`, includes who downloaded the doc, when, and the document type. Useful for paper trails.

---

## 7. Charts (admin dashboard)

Recharts, with a chart palette derived from but not limited to the brand greens — five-plus categories need real differentiation.

```
Chart palette:
  Series 1 — #1B6B1F  (brand green)
  Series 2 — #B8860B  (warm amber)
  Series 3 — #2C5F8D  (slate navy)
  Series 4 — #A0522D  (terracotta)
  Series 5 — #5B5B85  (muted plum)
  Series 6 — #4A7C59  (sage)
```

- Always label slices/bars directly when there are five or fewer categories. Tooltips are an enhancement, not the only path to the data.
- Money axes use tabular figures and abbreviate at scale (`$12.4k`, not `$12,400` on a tight axis).
- Empty-state for a chart: a soft `stone-100` card with one line of plain text — "No orders yet in this date range."

---

## 8. Voice & microcopy

- Plain English. "New Order", not "Initiate Order Workflow".
- Money is always shown with the dollar sign and two decimals (`$1,234.56`), even for whole-dollar amounts.
- Dates on screen: `Apr 25, 2026`. Dates on printed documents: `04/25/2026` (matches what staff write by hand).
- Empty states give one concrete next step: "No orders yet — start by entering one above."
- Confirmation dialogs name the thing being changed: "Void invoice #6515 for the Smith family?" — never "Are you sure?"

---

## 9. Quick reference card

If a developer only reads one section, this is it:

- **Primary green: `#0E3F12`** (CTA), **`#1B6B1F`** (headlines).
- **Background: warm off-white `#FAFAF7`**, never pure white.
- **Body text: `#1A1A17`**, never pure black.
- **Logo: green house outline, SVG, top-left.**
- **Invoice number on prints: bold `#B91C1C`**, top-right.
- **Salesperson dropdown is the first and most-emphasized field on every order form. Required.**
- **Money is stored as cents, displayed as `$1,234.56`.**
- **No gradients. No drop shadows beyond a 4% subtle one. No emojis.**

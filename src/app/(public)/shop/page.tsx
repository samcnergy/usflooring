import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { LineCategory } from "@prisma/client";
import { CategoryTabs, SearchBox, MaterialGrid, CATEGORY_LABELS } from "./ShopClient";
import { StyleQuiz } from "./StyleQuiz";
import { STYLE_PRESETS } from "./stylePresets";

export { STYLE_PRESETS };

export const metadata = {
  title: "Shop Materials | US Floor Design Center",
  description: "Browse flooring, tile, countertops, cabinets, and fixtures. See real materials in our showroom.",
};

const PUBLIC_CATEGORIES = Object.keys(CATEGORY_LABELS).filter((c) => c !== "labor") as LineCategory[];

async function getMaterials(cat?: string, q?: string, style?: string) {
  const stylePreset = style ? STYLE_PRESETS[style] : null;

  return prisma.material.findMany({
    where: {
      isActive: true,
      category: cat
        ? { equals: cat as LineCategory }
        : stylePreset
        ? { in: stylePreset.categories as LineCategory[] }
        : { in: PUBLIC_CATEGORIES },
      ...(q ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { style: { contains: q, mode: "insensitive" } },
          { color: { contains: q, mode: "insensitive" } },
          { sizeSpec: { contains: q, mode: "insensitive" } },
        ],
      } : stylePreset && !cat ? {
        OR: [
          // Products explicitly tagged with this style palette take priority
          { styleTags: { has: style } },
          // Fall back to keyword matching for untagged products
          ...stylePreset.keywords.map((kw) => ({
            OR: [
              { name: { contains: kw, mode: "insensitive" as const } },
              { style: { contains: kw, mode: "insensitive" as const } },
              { color: { contains: kw, mode: "insensitive" as const } },
            ],
          })),
        ],
      } : {}),
    },
    orderBy: [{ category: "asc" }, { brand: "asc" }, { name: "asc" }],
    take: 200,
    select: {
      id: true, name: true, brand: true, style: true, color: true,
      sizeSpec: true, category: true, defaultUnit: true,
      defaultUnitPriceCents: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  });
}

async function getCategoryCounts() {
  const rows = await prisma.material.groupBy({
    by: ["category"],
    where: { isActive: true, category: { in: PUBLIC_CATEGORIES } },
    _count: { id: true },
  });
  return Object.fromEntries(rows.map((r) => [r.category, r._count.id]));
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; style?: string }>;
}) {
  const { cat, q, style } = await searchParams;
  const activeStyle = style && STYLE_PRESETS[style] ? style : undefined;
  const stylePreset = activeStyle ? STYLE_PRESETS[activeStyle] : null;

  const [materials, counts] = await Promise.all([
    getMaterials(cat, q, activeStyle),
    getCategoryCounts(),
  ]);

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>

      {/* Style Quiz - shown when no style is selected yet */}
      {!activeStyle && !cat && !q && (
        <Suspense>
          <StyleQuiz />
        </Suspense>
      )}

      {/* Style banner - shown when a style is active */}
      {stylePreset && (
        <div style={{
          margin: "48px 0 0",
          padding: "32px 40px",
          background: "var(--pub-ink)",
          borderRadius: 2,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 32, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {stylePreset.palette.map((c) => (
                <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--pub-brass)", letterSpacing: "0.06em", marginBottom: 6 }}>
              {stylePreset.label.toUpperCase()} STYLE
            </div>
            <p style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-stone)", margin: 0 }}>
              {stylePreset.description}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/shop" style={{
              fontSize: 13, color: "rgba(241,238,231,0.6)",
              textDecoration: "none", borderBottom: "1px solid rgba(241,238,231,0.3)",
              paddingBottom: 2,
            }}>
              See all styles
            </a>
            <a href="/request-a-visit" style={{
              background: "var(--pub-stone)", color: "var(--pub-forest)",
              fontSize: 13, fontWeight: 500, padding: "10px 18px",
              textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap",
            }}>
              Talk to a designer
            </a>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "48px 0 32px", borderBottom: "1px solid var(--pub-line)", marginBottom: 32, marginTop: activeStyle ? 32 : 0 }}>
        <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Materials</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h1 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 38,
            color: "var(--pub-ink)", lineHeight: 1.15,
          }}>
            {stylePreset ? `${stylePreset.label} materials.` : "Browse our catalog."}
          </h1>
          <p style={{ fontSize: 14, color: "var(--pub-muted)", maxWidth: "40ch", lineHeight: 1.65, paddingBottom: 4 }}>
            Every material is available in the showroom. Come in and see it in person before you decide.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <Suspense>
          <CategoryTabs current={cat ?? ""} counts={counts} styleParam={activeStyle} />
        </Suspense>
        <Suspense>
          <SearchBox defaultValue={q ?? ""} />
        </Suspense>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: "var(--pub-muted)", marginBottom: 24 }}>
        {materials.length} {materials.length === 1 ? "material" : "materials"}
        {stylePreset ? ` matching ${stylePreset.label} style` : ""}
        {cat ? ` in ${CATEGORY_LABELS[cat] ?? cat}` : ""}
        {q ? ` matching "${q}"` : ""}
      </p>

      {/* Grid */}
      <MaterialGrid materials={materials} />

      {/* CTA banner */}
      <div style={{
        margin: "72px 0 80px",
        background: "var(--pub-forest)", borderRadius: 2,
        padding: "48px 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 32, flexWrap: "wrap",
      }}>
        <div>
          <p style={{ fontFamily: "var(--pub-serif)", fontSize: 26, color: "var(--pub-stone)", marginBottom: 10, fontWeight: 400 }}>
            Not sure what to choose?
          </p>
          <p style={{ fontSize: 15, color: "rgba(241,238,231,0.75)", lineHeight: 1.65, maxWidth: "44ch" }}>
            Come to the showroom and see every material in person. Our designers will help you find what fits your space, your style, and your budget.
          </p>
        </div>
        <a href="/request-a-visit" style={{
          background: "var(--pub-stone)", color: "var(--pub-forest)",
          fontSize: 14, fontWeight: 500, padding: "14px 28px",
          textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap",
        }}>
          Schedule a visit
        </a>
      </div>
    </div>
  );
}

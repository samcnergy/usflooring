// MaterialSuggestion ingestion (write-only Phase 2 data accumulator) +
// autocomplete query (read path used by the brand/style/color typeahead).

import type { Prisma } from "@prisma/client";
import { LineCategory, UnitOfMeasure } from "@prisma/client";
import { prisma } from "./prisma";

type LineSnapshot = {
  category: LineCategory;
  brand: string | null;
  style: string | null;
  color: string | null;
  sizeSpec: string | null;
  unit: UnitOfMeasure | null;
  unitPriceCents: number | null;
};

export function makeFingerprint(li: LineSnapshot): string | null {
  const parts = [
    li.category,
    (li.brand ?? "").toLowerCase().trim(),
    (li.style ?? "").toLowerCase().trim(),
    (li.color ?? "").toLowerCase().trim(),
    (li.sizeSpec ?? "").toLowerCase().trim(),
    li.unit ?? "",
  ];
  // Skip if there's no identifying info beyond the category
  const nonCategory = parts.slice(1).filter(Boolean);
  if (nonCategory.length === 0) return null;
  return parts.join("|").replace(/\s+/g, " ");
}

/**
 * Upserts MaterialSuggestion rows for every line item with identifying info.
 * Failures here are logged but never bubble — a missing suggestion never
 * blocks a real order save.
 */
export async function ingestSuggestions(opts: {
  tx?: Prisma.TransactionClient;
  lineItems: LineSnapshot[];
  vendorName?: string | null;
}): Promise<void> {
  const client = opts.tx ?? prisma;
  for (const li of opts.lineItems) {
    const fingerprint = makeFingerprint(li);
    if (!fingerprint) continue;
    try {
      const existing = await client.materialSuggestion.findUnique({
        where: { fingerprint },
      });
      if (existing) {
        await client.materialSuggestion.update({
          where: { fingerprint },
          data: {
            usageCount: existing.usageCount + 1,
            lastSeenAt: new Date(),
            lastVendorName: opts.vendorName ?? existing.lastVendorName,
            lastUnitPriceCents: li.unitPriceCents ?? existing.lastUnitPriceCents,
          },
        });
      } else {
        await client.materialSuggestion.create({
          data: {
            fingerprint,
            category: li.category,
            brand: li.brand,
            style: li.style,
            color: li.color,
            sizeSpec: li.sizeSpec,
            unit: li.unit,
            lastVendorName: opts.vendorName ?? null,
            lastUnitPriceCents: li.unitPriceCents,
          },
        });
      }
    } catch (e) {
      console.error("MaterialSuggestion upsert failed:", e);
    }
  }
}

// ---------- Autocomplete queries ----------

export type SuggestionRow = {
  brand: string | null;
  style: string | null;
  color: string | null;
  sizeSpec: string | null;
  unit: UnitOfMeasure | null;
  unitPriceCents: number | null;
  vendorName: string | null;
  usageCount: number;
  category: LineCategory;
};

export async function suggestBrand(opts: {
  q: string;
  category?: LineCategory;
  limit?: number;
}): Promise<SuggestionRow[]> {
  const where: Prisma.MaterialSuggestionWhereInput = {
    brand: { contains: opts.q, mode: "insensitive" },
    ...(opts.category ? { category: opts.category } : {}),
  };
  const rows = await prisma.materialSuggestion.findMany({
    where,
    orderBy: { usageCount: "desc" },
    take: opts.limit ?? 5,
    select: {
      brand: true, style: true, color: true, sizeSpec: true, unit: true,
      lastUnitPriceCents: true, lastVendorName: true,
      usageCount: true, category: true,
    },
  });
  return rows.map((r) => ({
    brand: r.brand,
    style: r.style,
    color: r.color,
    sizeSpec: r.sizeSpec,
    unit: r.unit,
    unitPriceCents: r.lastUnitPriceCents,
    vendorName: r.lastVendorName,
    usageCount: r.usageCount,
    category: r.category,
  }));
}

export async function suggestStyle(opts: {
  q: string;
  category?: LineCategory;
  brand?: string;
  limit?: number;
}): Promise<SuggestionRow[]> {
  const where: Prisma.MaterialSuggestionWhereInput = {
    style: { contains: opts.q, mode: "insensitive" },
    ...(opts.category ? { category: opts.category } : {}),
    ...(opts.brand ? { brand: { equals: opts.brand, mode: "insensitive" } } : {}),
  };
  const rows = await prisma.materialSuggestion.findMany({
    where,
    orderBy: { usageCount: "desc" },
    take: opts.limit ?? 5,
    select: {
      brand: true, style: true, color: true, sizeSpec: true, unit: true,
      lastUnitPriceCents: true, lastVendorName: true,
      usageCount: true, category: true,
    },
  });
  return rows.map((r) => ({
    brand: r.brand, style: r.style, color: r.color, sizeSpec: r.sizeSpec, unit: r.unit,
    unitPriceCents: r.lastUnitPriceCents, vendorName: r.lastVendorName,
    usageCount: r.usageCount, category: r.category,
  }));
}

export async function suggestColor(opts: {
  q: string;
  category?: LineCategory;
  brand?: string;
  style?: string;
  limit?: number;
}): Promise<SuggestionRow[]> {
  const where: Prisma.MaterialSuggestionWhereInput = {
    color: { contains: opts.q, mode: "insensitive" },
    ...(opts.category ? { category: opts.category } : {}),
    ...(opts.brand ? { brand: { equals: opts.brand, mode: "insensitive" } } : {}),
    ...(opts.style ? { style: { equals: opts.style, mode: "insensitive" } } : {}),
  };
  const rows = await prisma.materialSuggestion.findMany({
    where,
    orderBy: { usageCount: "desc" },
    take: opts.limit ?? 5,
    select: {
      brand: true, style: true, color: true, sizeSpec: true, unit: true,
      lastUnitPriceCents: true, lastVendorName: true,
      usageCount: true, category: true,
    },
  });
  return rows.map((r) => ({
    brand: r.brand, style: r.style, color: r.color, sizeSpec: r.sizeSpec, unit: r.unit,
    unitPriceCents: r.lastUnitPriceCents, vendorName: r.lastVendorName,
    usageCount: r.usageCount, category: r.category,
  }));
}

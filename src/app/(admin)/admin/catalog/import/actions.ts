"use server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import type { LineCategory, UnitOfMeasure } from "@prisma/client";
import * as XLSX from "xlsx";

// ── Parse ──────────────────────────────────────────────────────────────────

export type ExcelParseResult = {
  ok: true;
  type: "excel";
  headers: string[];
  rawRows: string[][];
};

export type PdfParseResult = {
  ok: true;
  type: "pdf";
  text: string;
  lines: string[];
};

export type ParseError = { ok: false; message: string };

export type ParseResult = ExcelParseResult | PdfParseResult | ParseError;

export async function parseFileAction(_prev: unknown, formData: FormData): Promise<ParseResult> {
  await requireRole("admin");

  const file = formData.get("file") as File | null;
  if (!file || !file.name) return { ok: false, message: "No file selected." };
  if (file.size > 10 * 1024 * 1024) return { ok: false, message: "File must be under 10 MB." };

  const ext = file.name.split(".").pop()?.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (ext === "csv" || ext === "xlsx" || ext === "xls") {
    try {
      const wb = XLSX.read(buffer, { type: "buffer" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const all = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
      if (all.length === 0) return { ok: false, message: "File is empty." };
      const headers = (all[0] as unknown[]).map((h) => String(h ?? "").trim());
      const rawRows = all.slice(1).map((r) => (r as unknown[]).map((c) => String(c ?? "").trim()));
      const nonEmpty = rawRows.filter((r) => r.some((c) => c !== ""));
      return { ok: true, type: "excel", headers, rawRows: nonEmpty };
    } catch {
      return { ok: false, message: "Could not parse the file. Make sure it's a valid Excel or CSV." };
    }
  }

  if (ext === "pdf") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfMod = await import("pdf-parse") as any;
      const pdfParse = pdfMod.default ?? pdfMod;
      const { text } = await pdfParse(buffer);
      const lines = text.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 2);
      return { ok: true, type: "pdf", text, lines };
    } catch {
      return { ok: false, message: "Could not extract text from the PDF." };
    }
  }

  return { ok: false, message: "Unsupported file type. Use .xlsx, .csv, or .pdf." };
}

// ── Bulk import ────────────────────────────────────────────────────────────

export type ImportProduct = {
  name: string;
  brand?: string;
  style?: string;
  color?: string;
  sizeSpec?: string;
  sku?: string;
  category?: string;
  unit?: string;
  priceCents?: number | null;
  costCents?: number | null;
  notes?: string;
};

export type ImportResult = { ok: true; count: number } | { ok: false; message: string };

const VALID_CATEGORIES: LineCategory[] = [
  "carpet", "vinyl", "wood", "ceramic", "tile", "stone",
  "cabinet", "counterTop", "fireplace", "shower", "molding", "labor", "fixture", "other",
];

const VALID_UNITS: UnitOfMeasure[] = [
  "sqft", "sqyd", "slab", "box", "piece", "linearFt", "each", "hour", "lump",
];

export async function bulkImportMaterialsAction(
  vendorId: string,
  products: ImportProduct[]
): Promise<ImportResult> {
  const me = await requireRole("admin");

  if (!vendorId) return { ok: false, message: "Vendor is required." };
  if (products.length === 0) return { ok: false, message: "No products to import." };
  if (products.length > 500) return { ok: false, message: "Maximum 500 products per import." };

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId }, select: { id: true } });
  if (!vendor) return { ok: false, message: "Vendor not found." };

  const created = await prisma.$transaction(
    products.map((p) => {
      const cat = p.category && VALID_CATEGORIES.includes(p.category as LineCategory)
        ? (p.category as LineCategory)
        : "other";
      const unit = p.unit && VALID_UNITS.includes(p.unit as UnitOfMeasure)
        ? (p.unit as UnitOfMeasure)
        : null;
      return prisma.material.create({
        data: {
          name: p.name,
          brand: p.brand || null,
          style: p.style || null,
          color: p.color || null,
          sizeSpec: p.sizeSpec || null,
          sku: p.sku || null,
          category: cat,
          defaultUnit: unit,
          defaultUnitPriceCents: p.priceCents ?? null,
          defaultCostCents: p.costCents ?? null,
          notes: p.notes || null,
          defaultVendorId: vendorId,
        },
      });
    })
  );

  await audit({
    actorUserId: me.id,
    action: "BULK_IMPORT_MATERIALS",
    entityType: "Material",
    entityId: vendorId,
    diff: { count: created.length, vendorId },
  });

  return { ok: true, count: created.length };
}

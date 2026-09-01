import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LineCategory } from "@prisma/client";

// Returns catalog products (no cost data for salespeople).
// GET /api/catalog/search?q=...&category=...&limit=10
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") ?? "").trim();
  const category = sp.get("category") ?? undefined;
  const limit = Math.min(Number(sp.get("limit") ?? "10"), 30);

  const materials = await prisma.material.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as LineCategory } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
              { style: { contains: q, mode: "insensitive" } },
              { color: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ brand: "asc" }, { name: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      brand: true,
      style: true,
      color: true,
      sizeSpec: true,
      sku: true,
      category: true,
      defaultUnit: true,
      // Price loaded for everyone (salesperson sets their own price, this is just a suggestion)
      defaultUnitPriceCents: true,
      // Cost is NOT returned — admin sees it in the detail page, never the API
      defaultVendor: { select: { id: true, name: true } },
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  });

  return NextResponse.json({ materials });
}

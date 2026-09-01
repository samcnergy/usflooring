"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { dollarsToCents } from "@/lib/money";
import type { LineCategory, UnitOfMeasure } from "@prisma/client";

const materialSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(200),
  brand: z.string().trim().max(120).optional(),
  style: z.string().trim().max(120).optional(),
  color: z.string().trim().max(120).optional(),
  sizeSpec: z.string().trim().max(120).optional(),
  sku: z.string().trim().max(80).optional(),
  category: z.string().min(1, "Category required"),
  defaultVendorId: z.string().optional(),
  defaultUnit: z.string().optional(),
  defaultUnitPriceRaw: z.string().optional(),
  defaultCostRaw: z.string().optional(),
  notes: z.string().trim().max(2000).optional(),
  imageUrl: z.string().trim().max(500).optional(),
  imageSourceType: z.enum(["upload", "link"]).optional(),
});

export type CatalogState =
  | { ok: true; id?: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

function parseMaterialForm(formData: FormData) {
  return materialSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    brand: String(formData.get("brand") ?? "") || undefined,
    style: String(formData.get("style") ?? "") || undefined,
    color: String(formData.get("color") ?? "") || undefined,
    sizeSpec: String(formData.get("sizeSpec") ?? "") || undefined,
    sku: String(formData.get("sku") ?? "") || undefined,
    category: String(formData.get("category") ?? ""),
    defaultVendorId: String(formData.get("defaultVendorId") ?? "") || undefined,
    defaultUnit: String(formData.get("defaultUnit") ?? "") || undefined,
    defaultUnitPriceRaw: String(formData.get("defaultUnitPriceRaw") ?? "") || undefined,
    defaultCostRaw: String(formData.get("defaultCostRaw") ?? "") || undefined,
    notes: String(formData.get("notes") ?? "") || undefined,
    imageUrl: String(formData.get("imageUrl") ?? "") || undefined,
    imageSourceType: (String(formData.get("imageSourceType") ?? "") || undefined) as "upload" | "link" | undefined,
  });
}

export async function createMaterialAction(_prev: CatalogState, formData: FormData): Promise<CatalogState> {
  const me = await requireRole("admin");
  const parsed = parseMaterialForm(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  let priceCents: number | null = null;
  let costCents: number | null = null;
  try {
    if (d.defaultUnitPriceRaw) priceCents = dollarsToCents(d.defaultUnitPriceRaw);
    if (d.defaultCostRaw) costCents = dollarsToCents(d.defaultCostRaw);
  } catch {
    return { ok: false, message: "Invalid price or cost value." };
  }

  const created = await prisma.material.create({
    data: {
      name: d.name,
      brand: d.brand ?? null,
      style: d.style ?? null,
      color: d.color ?? null,
      sizeSpec: d.sizeSpec ?? null,
      sku: d.sku ?? null,
      category: d.category as LineCategory,
      defaultVendorId: d.defaultVendorId ?? null,
      defaultUnit: d.defaultUnit ? (d.defaultUnit as UnitOfMeasure) : null,
      defaultUnitPriceCents: priceCents,
      defaultCostCents: costCents,
      notes: d.notes ?? null,
      ...(d.imageUrl
        ? {
            images: {
              create: {
                url: d.imageUrl,
                sourceType: d.imageSourceType ?? "link",
                isPrimary: true,
              },
            },
          }
        : {}),
    },
  });

  await audit({ actorUserId: me.id, action: "create", entityType: "Material", entityId: created.id, diff: { name: d.name } });
  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog/${created.id}`);
}

export async function updateMaterialAction(id: string, _prev: CatalogState, formData: FormData): Promise<CatalogState> {
  const me = await requireRole("admin");
  const parsed = parseMaterialForm(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  let priceCents: number | null = null;
  let costCents: number | null = null;
  try {
    if (d.defaultUnitPriceRaw) priceCents = dollarsToCents(d.defaultUnitPriceRaw);
    if (d.defaultCostRaw) costCents = dollarsToCents(d.defaultCostRaw);
  } catch {
    return { ok: false, message: "Invalid price or cost value." };
  }

  await prisma.material.update({
    where: { id },
    data: {
      name: d.name,
      brand: d.brand ?? null,
      style: d.style ?? null,
      color: d.color ?? null,
      sizeSpec: d.sizeSpec ?? null,
      sku: d.sku ?? null,
      category: d.category as LineCategory,
      defaultVendorId: d.defaultVendorId ?? null,
      defaultUnit: d.defaultUnit ? (d.defaultUnit as UnitOfMeasure) : null,
      defaultUnitPriceCents: priceCents,
      defaultCostCents: costCents,
      notes: d.notes ?? null,
    },
  });

  // If a new image URL was provided, add it (don't overwrite existing images)
  if (d.imageUrl) {
    await prisma.materialImage.create({
      data: {
        materialId: id,
        url: d.imageUrl,
        sourceType: d.imageSourceType ?? "link",
        isPrimary: false,
      },
    });
  }

  await audit({ actorUserId: me.id, action: "update", entityType: "Material", entityId: id });
  revalidatePath("/admin/catalog");
  revalidatePath(`/admin/catalog/${id}`);
  redirect(`/admin/catalog/${id}`);
}

export async function setMaterialActiveAction(id: string, isActive: boolean) {
  const me = await requireRole("admin");
  await prisma.material.update({ where: { id }, data: { isActive } });
  await audit({ actorUserId: me.id, action: isActive ? "reactivate" : "deactivate", entityType: "Material", entityId: id });
  revalidatePath("/admin/catalog");
  revalidatePath(`/admin/catalog/${id}`);
}

export async function deleteImageAction(imageId: string, materialId: string) {
  await requireRole("admin");
  await prisma.materialImage.delete({ where: { id: imageId } });
  revalidatePath(`/admin/catalog/${materialId}`);
}

export async function setPrimaryImageAction(imageId: string, materialId: string) {
  await requireRole("admin");
  await prisma.$transaction([
    prisma.materialImage.updateMany({ where: { materialId }, data: { isPrimary: false } }),
    prisma.materialImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
  ]);
  revalidatePath(`/admin/catalog/${materialId}`);
}

// Product requests
export async function approveRequestAction(requestId: string, materialId: string) {
  const me = await requireRole("admin");
  await prisma.productRequest.update({
    where: { id: requestId },
    data: { status: "fulfilled", fulfilledById: materialId, fulfilledAt: new Date() },
  });
  await audit({ actorUserId: me.id, action: "approve_product_request", entityType: "ProductRequest", entityId: requestId });
  revalidatePath("/admin/catalog/requests");
}

export async function rejectRequestAction(requestId: string) {
  const me = await requireRole("admin");
  await prisma.productRequest.update({ where: { id: requestId }, data: { status: "rejected" } });
  await audit({ actorUserId: me.id, action: "reject_product_request", entityType: "ProductRequest", entityId: requestId });
  revalidatePath("/admin/catalog/requests");
}

"use server";

import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LineCategory } from "@prisma/client";

const schema = z.object({
  category: z.string().optional(),
  brand: z.string().trim().max(120).optional(),
  style: z.string().trim().max(120).optional(),
  color: z.string().trim().max(120).optional(),
  sizeSpec: z.string().trim().max(120).optional(),
  vendorName: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type RequestState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function submitProductRequestAction(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const me = await requireRole("salesperson");
  const parsed = schema.safeParse({
    category: String(formData.get("category") ?? "") || undefined,
    brand: String(formData.get("brand") ?? "") || undefined,
    style: String(formData.get("style") ?? "") || undefined,
    color: String(formData.get("color") ?? "") || undefined,
    sizeSpec: String(formData.get("sizeSpec") ?? "") || undefined,
    vendorName: String(formData.get("vendorName") ?? "") || undefined,
    notes: String(formData.get("notes") ?? "") || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  if (!d.brand && !d.style && !d.notes) {
    return { ok: false, message: "Please describe what product you're looking for." };
  }

  await prisma.productRequest.create({
    data: {
      requestedById: me.id,
      category: d.category ? (d.category as LineCategory) : null,
      brand: d.brand ?? null,
      style: d.style ?? null,
      color: d.color ?? null,
      sizeSpec: d.sizeSpec ?? null,
      vendorName: d.vendorName ?? null,
      notes: d.notes ?? null,
    },
  });

  return { ok: true };
}

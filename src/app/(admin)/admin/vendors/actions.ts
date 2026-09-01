"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

const vendorSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  contactName: z.string().trim().max(120).optional(),
  email: z.string().trim().email("Invalid email").max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional(),
  address: z.string().trim().max(300).optional(),
  website: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type VendorState =
  | { ok: true; id?: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

function parseVendorForm(formData: FormData) {
  return vendorSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    contactName: String(formData.get("contactName") ?? "") || undefined,
    email: String(formData.get("email") ?? "") || undefined,
    phone: String(formData.get("phone") ?? "") || undefined,
    address: String(formData.get("address") ?? "") || undefined,
    website: String(formData.get("website") ?? "") || undefined,
    notes: String(formData.get("notes") ?? "") || undefined,
  });
}

export async function createVendorAction(_prev: VendorState, formData: FormData): Promise<VendorState> {
  const me = await requireRole("admin");
  const parsed = parseVendorForm(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }
  const existing = await prisma.vendor.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { ok: false, message: "A vendor with that name already exists." };

  const data = {
    name: parsed.data.name,
    contactName: parsed.data.contactName ?? null,
    email: parsed.data.email || null,
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
    website: parsed.data.website ?? null,
    notes: parsed.data.notes ?? null,
  };
  const created = await prisma.vendor.create({ data });
  await audit({ actorUserId: me.id, action: "create", entityType: "Vendor", entityId: created.id, diff: data });
  revalidatePath("/admin/vendors");
  redirect(`/admin/vendors/${created.id}`);
}

export async function updateVendorAction(id: string, _prev: VendorState, formData: FormData): Promise<VendorState> {
  const me = await requireRole("admin");
  const parsed = parseVendorForm(formData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }
  const data = {
    name: parsed.data.name,
    contactName: parsed.data.contactName ?? null,
    email: parsed.data.email || null,
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
    website: parsed.data.website ?? null,
    notes: parsed.data.notes ?? null,
  };
  await prisma.vendor.update({ where: { id }, data });
  await audit({ actorUserId: me.id, action: "update", entityType: "Vendor", entityId: id, diff: data });
  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/vendors/${id}`);
  redirect(`/admin/vendors/${id}`);
}

export async function setVendorActiveAction(id: string, isActive: boolean) {
  const me = await requireRole("admin");
  await prisma.vendor.update({ where: { id }, data: { isActive } });
  await audit({ actorUserId: me.id, action: isActive ? "reactivate" : "deactivate", entityType: "Vendor", entityId: id });
  revalidatePath("/admin/vendors");
  revalidatePath(`/admin/vendors/${id}`);
}

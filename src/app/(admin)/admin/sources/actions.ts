"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

const addInput = z.object({ name: z.string().trim().min(1, "Name required").max(120) });

export type AddState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function addSourceAction(_prev: AddState, formData: FormData): Promise<AddState> {
  const me = await requireRole("admin");
  const parsed = addInput.safeParse({ name: String(formData.get("name") ?? "") });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }
  const existing = await prisma.advertisingSource.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    return { ok: false, message: "A source with that name already exists." };
  }
  const created = await prisma.advertisingSource.create({ data: { name: parsed.data.name } });
  await audit({
    actorUserId: me.id,
    action: "create",
    entityType: "AdvertisingSource",
    entityId: created.id,
    diff: { name: created.name },
  });
  revalidatePath("/admin/sources");
  return { ok: true };
}

export async function setSourceActiveAction(id: string, isActive: boolean) {
  const me = await requireRole("admin");
  await prisma.advertisingSource.update({ where: { id }, data: { isActive } });
  await audit({
    actorUserId: me.id,
    action: isActive ? "reactivate" : "deactivate",
    entityType: "AdvertisingSource",
    entityId: id,
  });
  revalidatePath("/admin/sources");
}

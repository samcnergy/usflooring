"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import type { SaveScopeState } from "@/components/ScopeOfWork";

export async function saveScopeAction(
  _prev: SaveScopeState,
  formData: FormData,
): Promise<SaveScopeState> {
  const me = await requireRole("admin");
  const orderId = String(formData.get("orderId") ?? "");
  const scope = String(formData.get("scopeOverride") ?? "").trim();
  if (!orderId) return { ok: false, message: "Missing orderId" };
  await prisma.order.update({
    where: { id: orderId },
    data: { scopeOverride: scope || null },
  });
  await audit({
    actorUserId: me.id,
    action: scope ? "scope_override_set" : "scope_override_clear",
    entityType: "Order",
    entityId: orderId,
  });
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function resetScopeAction(orderId: string): Promise<void> {
  const me = await requireRole("admin");
  await prisma.order.update({ where: { id: orderId }, data: { scopeOverride: null } });
  await audit({
    actorUserId: me.id,
    action: "scope_override_clear",
    entityType: "Order",
    entityId: orderId,
  });
  revalidatePath(`/admin/orders/${orderId}`);
}

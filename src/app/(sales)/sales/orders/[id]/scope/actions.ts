"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import type { SaveScopeState } from "@/components/ScopeOfWork";

async function ownsOrder(orderId: string, salespersonId: string) {
  const o = await prisma.order.findFirst({
    where: { id: orderId, salespersonId, deletedAt: null },
    select: { id: true },
  });
  return !!o;
}

export async function saveOwnScopeAction(
  _prev: SaveScopeState,
  formData: FormData,
): Promise<SaveScopeState> {
  const me = await requireRole("salesperson");
  const orderId = String(formData.get("orderId") ?? "");
  if (!orderId || !(await ownsOrder(orderId, me.id))) {
    return { ok: false, message: "You can't edit the scope of an order that isn't yours." };
  }
  const scope = String(formData.get("scopeOverride") ?? "").trim();
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
  revalidatePath(`/sales/orders/${orderId}`);
  return { ok: true };
}

export async function resetOwnScopeAction(orderId: string): Promise<void> {
  const me = await requireRole("salesperson");
  if (!(await ownsOrder(orderId, me.id))) return;
  await prisma.order.update({ where: { id: orderId }, data: { scopeOverride: null } });
  await audit({
    actorUserId: me.id,
    action: "scope_override_clear",
    entityType: "Order",
    entityId: orderId,
  });
  revalidatePath(`/sales/orders/${orderId}`);
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseOrderForm } from "@/lib/order-form-parser";
import { createOrder, updateOrder, voidOrder, getOrder } from "@/lib/order";
import { audit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import type { ActionState } from "@/components/forms/InvoiceForm.shared";

async function ownsOrder(orderId: string, salespersonId: string) {
  const o = await prisma.order.findFirst({
    where: { id: orderId, salespersonId, deletedAt: null },
    select: { id: true },
  });
  return !!o;
}

export async function createOwnOrderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole("salesperson");
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  // Force salespersonId to be the current user — never trust the form.
  parsed.data.salespersonId = me.id;
  const order = await createOrder(parsed.data);
  await audit({
    actorUserId: me.id,
    action: "create",
    entityType: "Order",
    entityId: order.id,
    diff: { invoiceNumber: order.invoiceNumber, totalCents: order.totalCents },
  });
  revalidatePath("/sales/orders");
  redirect(`/sales/orders/${order.id}`);
}

export async function updateOwnOrderAction(orderId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole("salesperson");
  if (!(await ownsOrder(orderId, me.id))) {
    return { ok: false, message: "You can't edit an order that isn't yours." };
  }
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  parsed.data.salespersonId = me.id;
  await updateOrder(orderId, parsed.data);
  await audit({ actorUserId: me.id, action: "update", entityType: "Order", entityId: orderId });
  revalidatePath(`/sales/orders/${orderId}`);
  revalidatePath("/sales/orders");
  redirect(`/sales/orders/${orderId}`);
}

export async function voidOwnOrderAction(orderId: string) {
  const me = await requireRole("salesperson");
  if (!(await ownsOrder(orderId, me.id))) {
    throw new Error("You can't void an order that isn't yours.");
  }
  const order = await getOrder(orderId);
  if (!order) return;
  await voidOrder(orderId);
  await audit({ actorUserId: me.id, action: "void", entityType: "Order", entityId: orderId });
  revalidatePath(`/sales/orders/${orderId}`);
  revalidatePath("/sales/orders");
}

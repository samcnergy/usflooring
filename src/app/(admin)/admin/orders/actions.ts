"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseOrderForm } from "@/lib/order-form-parser";
import { createOrder, updateOrder, voidOrder, unvoidOrder, softDeleteOrder, getOrder } from "@/lib/order";
import { audit } from "@/lib/audit";
import type { ActionState } from "@/components/forms/InvoiceForm.shared";

export async function createOrderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole("admin");
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  const order = await createOrder(parsed.data);
  await audit({
    actorUserId: me.id,
    action: "create",
    entityType: "Order",
    entityId: order.id,
    diff: { invoiceNumber: order.invoiceNumber, totalCents: order.totalCents },
  });
  revalidatePath("/admin/orders");
  return { ok: true, orderId: order.id };
}

export async function updateOrderAction(orderId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const me = await requireRole("admin");
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  await updateOrder(orderId, parsed.data);
  await audit({
    actorUserId: me.id,
    action: "update",
    entityType: "Order",
    entityId: orderId,
  });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true, orderId };
}

export async function voidOrderAction(orderId: string) {
  const me = await requireRole("admin");
  await voidOrder(orderId);
  await audit({ actorUserId: me.id, action: "void", entityType: "Order", entityId: orderId });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function unvoidOrderAction(orderId: string) {
  const me = await requireRole("admin");
  await unvoidOrder(orderId);
  await audit({ actorUserId: me.id, action: "unvoid", entityType: "Order", entityId: orderId });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function deleteOrderAction(orderId: string, typedInvoiceNumber: string) {
  const me = await requireRole("admin");
  const order = await getOrder(orderId);
  if (!order) return;
  if (typedInvoiceNumber.trim() !== String(order.invoiceNumber)) {
    throw new Error(
      `Invoice number does not match. Type "${order.invoiceNumber}" exactly to confirm deletion.`,
    );
  }
  await softDeleteOrder(orderId);
  await audit({
    actorUserId: me.id,
    action: "delete",
    entityType: "Order",
    entityId: orderId,
    diff: { invoiceNumber: order.invoiceNumber },
  });
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

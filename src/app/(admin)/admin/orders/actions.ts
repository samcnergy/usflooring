"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseOrderForm } from "@/lib/order-form-parser";
import { createOrder, updateOrder, voidOrder, unvoidOrder, softDeleteOrder, getOrder } from "@/lib/order";
import type { ActionState } from "@/components/forms/InvoiceForm";

export async function createOrderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("admin");
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  const order = await createOrder(parsed.data);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${order.id}`);
}

export async function updateOrderAction(orderId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole("admin");
  const parsed = parseOrderForm(formData);
  if (!parsed.ok) return parsed;
  await updateOrder(orderId, parsed.data);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${orderId}`);
}

export async function voidOrderAction(orderId: string) {
  await requireRole("admin");
  await voidOrder(orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function unvoidOrderAction(orderId: string) {
  await requireRole("admin");
  await unvoidOrder(orderId);
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export async function deleteOrderAction(orderId: string, typedInvoiceNumber: string) {
  await requireRole("admin");
  // Confirmation gate: caller must type the exact invoice number.
  const order = await getOrder(orderId);
  if (!order) return;
  if (typedInvoiceNumber.trim() !== String(order.invoiceNumber)) {
    throw new Error(
      `Invoice number does not match. Type "${order.invoiceNumber}" exactly to confirm deletion.`,
    );
  }
  await softDeleteOrder(orderId);
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseWorkOrderForm } from "@/lib/work-order-form-parser";
import { updateWorkOrder } from "@/lib/work-order";
import { audit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import type { WorkOrderActionState } from "@/components/forms/WorkOrderForm";

export async function updateOwnWorkOrderAction(
  orderId: string,
  _prev: WorkOrderActionState,
  formData: FormData,
): Promise<WorkOrderActionState> {
  const me = await requireRole("salesperson");
  const owns = await prisma.order.findFirst({
    where: { id: orderId, salespersonId: me.id, deletedAt: null },
    select: { id: true },
  });
  if (!owns) return { ok: false, message: "You can't edit an order that isn't yours." };

  const parsed = parseWorkOrderForm(formData);
  if (!parsed.ok) return parsed;
  await updateWorkOrder(orderId, parsed.data);
  await audit({
    actorUserId: me.id,
    action: "update",
    entityType: "Order.workOrder",
    entityId: orderId,
  });
  revalidatePath(`/sales/orders/${orderId}`);
  redirect(`/sales/orders/${orderId}?doc=workorder`);
}

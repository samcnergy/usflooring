"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { parseWorkOrderForm } from "@/lib/work-order-form-parser";
import { updateWorkOrder } from "@/lib/work-order";
import { audit } from "@/lib/audit";
import type { WorkOrderActionState } from "@/components/forms/WorkOrderForm";

export async function updateWorkOrderAction(
  orderId: string,
  _prev: WorkOrderActionState,
  formData: FormData,
): Promise<WorkOrderActionState> {
  const me = await requireRole("admin");
  const parsed = parseWorkOrderForm(formData);
  if (!parsed.ok) return parsed;
  await updateWorkOrder(orderId, parsed.data);
  await audit({
    actorUserId: me.id,
    action: "update",
    entityType: "Order.workOrder",
    entityId: orderId,
  });
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}?doc=workorder`);
}

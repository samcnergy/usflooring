"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createVendorOrder } from "@/lib/vendor-order";
import { audit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  vendorName: z.string().trim().min(1).max(120),
  poNumber:   z.string().trim().min(1).max(60),
  sidemark:   z.string().trim().optional().nullable().transform((v) => v || null),
  faxEmailDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  willCallDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  deliveryDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  deliveryAddress: z.string().trim().optional().nullable().transform((v) => v || null),
  materialLineIds: z.array(z.string().uuid()).min(1),
});

export type CreateVendorState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function createOwnVendorOrderAction(
  orderId: string,
  _prev: CreateVendorState,
  formData: FormData,
): Promise<CreateVendorState> {
  const me = await requireRole("salesperson");
  const owns = await prisma.order.findFirst({
    where: { id: orderId, salespersonId: me.id, deletedAt: null },
    select: { id: true },
  });
  if (!owns) return { ok: false, message: "You can't create a PO for an order that isn't yours." };

  const materialLineIds = formData.getAll("materialLineIds").map(String).filter(Boolean);
  const parsed = inputSchema.safeParse({
    vendorName: String(formData.get("vendorName") ?? ""),
    poNumber:   String(formData.get("poNumber") ?? ""),
    sidemark:   String(formData.get("sidemark") ?? ""),
    faxEmailDate: String(formData.get("faxEmailDate") ?? ""),
    willCallDate: String(formData.get("willCallDate") ?? ""),
    deliveryDate: String(formData.get("deliveryDate") ?? ""),
    deliveryAddress: String(formData.get("deliveryAddress") ?? ""),
    materialLineIds,
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }
  const vo = await createVendorOrder({ orderId, ...parsed.data });
  await audit({
    actorUserId: me.id,
    action: "create",
    entityType: "VendorOrder",
    entityId: vo.id,
    diff: { vendorName: vo.vendorName, poNumber: vo.poNumber, lineCount: parsed.data.materialLineIds.length },
  });
  revalidatePath(`/sales/orders/${orderId}`);
  redirect(`/sales/orders/${orderId}?doc=vendor`);
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { createVendorOrder } from "@/lib/vendor-order";
import { audit } from "@/lib/audit";

const inputSchema = z.object({
  vendorName: z.string().trim().min(1, "Vendor name is required").max(120),
  poNumber:   z.string().trim().min(1, "P.O. number is required").max(60),
  sidemark:   z.string().trim().optional().nullable().transform((v) => v || null),
  faxEmailDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  willCallDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  deliveryDate: z.string().trim().optional().transform((v) => (v ? new Date(v) : null)),
  deliveryAddress: z.string().trim().optional().nullable().transform((v) => v || null),
  lineItemIds: z.array(z.string().uuid()).min(1, "Pick at least one line item"),
});

export type CreateVendorState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function createVendorOrderAction(
  orderId: string,
  _prev: CreateVendorState,
  formData: FormData,
): Promise<CreateVendorState> {
  const me = await requireRole("admin");
  const lineItemIds = formData.getAll("lineItemIds").map(String).filter(Boolean);
  const parsed = inputSchema.safeParse({
    vendorName: String(formData.get("vendorName") ?? ""),
    poNumber:   String(formData.get("poNumber") ?? ""),
    sidemark:   String(formData.get("sidemark") ?? ""),
    faxEmailDate: String(formData.get("faxEmailDate") ?? ""),
    willCallDate: String(formData.get("willCallDate") ?? ""),
    deliveryDate: String(formData.get("deliveryDate") ?? ""),
    deliveryAddress: String(formData.get("deliveryAddress") ?? ""),
    lineItemIds,
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
    diff: { vendorName: vo.vendorName, poNumber: vo.poNumber, lineCount: parsed.data.lineItemIds.length },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}?doc=vendor`);
}

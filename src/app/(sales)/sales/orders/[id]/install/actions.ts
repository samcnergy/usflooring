"use server";

import { requireRole } from "@/lib/auth";
import { getOrder, upsertInstallNote } from "@/lib/order";
import { LineCategory } from "@prisma/client";
import type { SaveInstallNoteState } from "@/components/InstallationInstruction";

export async function saveOwnInstallNoteAction(
  prev: SaveInstallNoteState,
  formData: FormData,
): Promise<SaveInstallNoteState> {
  const me = await requireRole("salesperson");
  const orderId = String(formData.get("orderId") ?? "");
  const category = String(formData.get("category") ?? "") as LineCategory;
  const notes = String(formData.get("notes") ?? "");

  if (!orderId || !category) {
    return { ok: false, category, message: "Missing order or category." };
  }

  // Verify ownership
  const order = await getOrder(orderId);
  if (!order || order.salespersonId !== me.id) {
    return { ok: false, category, message: "Order not found." };
  }

  try {
    await upsertInstallNote(orderId, category, notes);
    return { ok: true, category };
  } catch {
    return { ok: false, category, message: "Failed to save. Please try again." };
  }
}

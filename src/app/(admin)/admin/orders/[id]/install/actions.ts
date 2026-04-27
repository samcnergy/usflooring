"use server";

import { requireRole } from "@/lib/auth";
import { upsertInstallNote } from "@/lib/order";
import { LineCategory } from "@prisma/client";
import type { SaveInstallNoteState } from "@/components/InstallationInstruction";

export async function saveInstallNoteAction(
  prev: SaveInstallNoteState,
  formData: FormData,
): Promise<SaveInstallNoteState> {
  await requireRole("admin");
  const orderId = String(formData.get("orderId") ?? "");
  const category = String(formData.get("category") ?? "") as LineCategory;
  const notes = String(formData.get("notes") ?? "");

  if (!orderId || !category) {
    return { ok: false, category, message: "Missing order or category." };
  }

  try {
    await upsertInstallNote(orderId, category, notes);
    return { ok: true, category };
  } catch {
    return { ok: false, category, message: "Failed to save. Please try again." };
  }
}

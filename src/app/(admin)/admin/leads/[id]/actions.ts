"use server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";

export async function assignLeadAction(
  leadId: string,
  assignedToId: string | null
): Promise<void> {
  const actor = await requireRole("admin");
  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      assignedToId: assignedToId || null,
      status: assignedToId ? "assigned" : "new",
      statusHistory: {
        create: {
          status: assignedToId ? "assigned" : "new",
          changedById: actor.id,
          note: assignedToId ? "Assigned to salesperson" : "Unassigned",
        },
      },
    },
  });
  revalidatePath(`/admin/leads/${lead.id}`);
  revalidatePath("/admin/leads");
}

export async function updateLeadStatusAction(
  leadId: string,
  status: LeadStatus,
  note?: string
): Promise<void> {
  const actor = await requireRole("admin");
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status,
      statusHistory: {
        create: { status, changedById: actor.id, note: note || null },
      },
    },
  });
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin/leads");
}

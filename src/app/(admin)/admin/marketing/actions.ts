"use server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ContactType, ContactStatus, OutreachMethod } from "@prisma/client";

// ── Create contact ─────────────────────────────────────────────────────────

const contactSchema = z.object({
  name:         z.string().trim().min(1, "Name is required").max(200),
  phone:        z.string().trim().max(30).optional(),
  email:        z.string().trim().email("Invalid email").max(200).optional().or(z.literal("")),
  type:         z.enum(["pastCustomer", "lostLead", "coldContact"]),
  status:       z.enum(["new", "contacted", "interested", "notInterested", "converted"]).default("new"),
  notes:        z.string().trim().max(2000).optional(),
  sourceId:     z.string().optional().nullable(),
  orderId:      z.string().optional().nullable(),
  nextFollowUp: z.string().optional().nullable(),
});

export type ContactFormState =
  | { ok: true; id: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function createContactAction(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const me = await requireRole("admin");

  const parsed = contactSchema.safeParse({
    name:         formData.get("name"),
    phone:        formData.get("phone") || undefined,
    email:        formData.get("email") || undefined,
    type:         formData.get("type"),
    status:       formData.get("status") || "new",
    notes:        formData.get("notes") || undefined,
    sourceId:     formData.get("sourceId") || null,
    orderId:      formData.get("orderId") || null,
    nextFollowUp: formData.get("nextFollowUp") || null,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  const contact = await prisma.marketingContact.create({
    data: {
      name:         d.name,
      phone:        d.phone || null,
      email:        d.email || null,
      type:         d.type as ContactType,
      status:       d.status as ContactStatus,
      notes:        d.notes || null,
      sourceId:     d.sourceId || null,
      orderId:      d.orderId || null,
      nextFollowUp: d.nextFollowUp ? new Date(d.nextFollowUp) : null,
      createdById:  me.id,
    },
  });

  await audit({ actorUserId: me.id, action: "CREATE_MARKETING_CONTACT", entityType: "MarketingContact", entityId: contact.id });
  redirect(`/admin/marketing/contacts/${contact.id}`);
}

export async function updateContactAction(
  id: string,
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const me = await requireRole("admin");

  const parsed = contactSchema.safeParse({
    name:         formData.get("name"),
    phone:        formData.get("phone") || undefined,
    email:        formData.get("email") || undefined,
    type:         formData.get("type"),
    status:       formData.get("status") || "new",
    notes:        formData.get("notes") || undefined,
    sourceId:     formData.get("sourceId") || null,
    orderId:      formData.get("orderId") || null,
    nextFollowUp: formData.get("nextFollowUp") || null,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  await prisma.marketingContact.update({
    where: { id },
    data: {
      name:         d.name,
      phone:        d.phone || null,
      email:        d.email || null,
      type:         d.type as ContactType,
      status:       d.status as ContactStatus,
      notes:        d.notes || null,
      sourceId:     d.sourceId || null,
      orderId:      d.orderId || null,
      nextFollowUp: d.nextFollowUp ? new Date(d.nextFollowUp) : null,
    },
  });

  await audit({ actorUserId: me.id, action: "UPDATE_MARKETING_CONTACT", entityType: "MarketingContact", entityId: id });
  redirect(`/admin/marketing/contacts/${id}`);
}

// ── Log outreach ───────────────────────────────────────────────────────────

const outreachSchema = z.object({
  date:    z.string().min(1, "Date is required"),
  method:  z.enum(["call", "email", "text", "inPerson", "other"]),
  notes:   z.string().trim().max(2000).optional(),
  outcome: z.string().trim().max(500).optional(),
  nextFollowUp: z.string().optional().nullable(),
  status:  z.enum(["new", "contacted", "interested", "notInterested", "converted"]).optional(),
});

export type LogState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function logOutreachAction(
  contactId: string,
  _prev: LogState,
  formData: FormData
): Promise<LogState> {
  const me = await requireRole("admin");

  const parsed = outreachSchema.safeParse({
    date:         formData.get("date"),
    method:       formData.get("method"),
    notes:        formData.get("notes") || undefined,
    outcome:      formData.get("outcome") || undefined,
    nextFollowUp: formData.get("nextFollowUp") || null,
    status:       formData.get("status") || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  await prisma.$transaction(async (tx) => {
    await tx.outreachLog.create({
      data: {
        contactId,
        date:    new Date(d.date),
        method:  d.method as OutreachMethod,
        notes:   d.notes || null,
        outcome: d.outcome || null,
        createdById: me.id,
      },
    });
    // Update contact's follow-up date and status if provided
    const update: Record<string, unknown> = {};
    if (d.nextFollowUp) update.nextFollowUp = new Date(d.nextFollowUp);
    if (d.status) update.status = d.status;
    if (Object.keys(update).length) {
      await tx.marketingContact.update({ where: { id: contactId }, data: update });
    }
  });

  revalidatePath(`/admin/marketing/contacts/${contactId}`);
  revalidatePath("/admin/marketing");
  return { ok: true };
}

// ── Log material sent ──────────────────────────────────────────────────────

const materialSchema = z.object({
  date:        z.string().min(1, "Date is required"),
  description: z.string().trim().min(1, "Description is required").max(500),
  url:         z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  notes:       z.string().trim().max(1000).optional(),
});

export async function logMaterialSendAction(
  contactId: string,
  _prev: LogState,
  formData: FormData
): Promise<LogState> {
  const me = await requireRole("admin");

  const parsed = materialSchema.safeParse({
    date:        formData.get("date"),
    description: formData.get("description"),
    url:         formData.get("url") || undefined,
    notes:       formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  await prisma.materialSend.create({
    data: {
      contactId,
      date:        new Date(d.date),
      description: d.description,
      url:         d.url || null,
      notes:       d.notes || null,
      createdById: me.id,
    },
  });

  revalidatePath(`/admin/marketing/contacts/${contactId}`);
  return { ok: true };
}

// ── Delete log entries ─────────────────────────────────────────────────────

export async function deleteOutreachLogAction(logId: string, contactId: string) {
  await requireRole("admin");
  await prisma.outreachLog.delete({ where: { id: logId } });
  revalidatePath(`/admin/marketing/contacts/${contactId}`);
}

export async function deleteMaterialSendAction(sendId: string, contactId: string) {
  await requireRole("admin");
  await prisma.materialSend.delete({ where: { id: sendId } });
  revalidatePath(`/admin/marketing/contacts/${contactId}`);
}

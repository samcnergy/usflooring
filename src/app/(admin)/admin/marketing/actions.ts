"use server";

import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { sendCampaign } from "@/lib/email";

// ── Create / update campaign ───────────────────────────────────────────────

const campaignSchema = z.object({
  name:         z.string().trim().min(1, "Internal name is required").max(200),
  subject:      z.string().trim().min(1, "Subject line is required").max(500),
  body:         z.string().trim().min(1, "Email body is required"),
  promoDetails: z.string().trim().max(500).optional(),
  promoCode:    z.string().trim().max(100).optional(),
  expiresAt:    z.string().optional().nullable(),
});

export type CampaignFormState =
  | { ok: true; id: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function createCampaignAction(
  _prev: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  const me = await requireRole("admin");

  const parsed = campaignSchema.safeParse({
    name:         formData.get("name"),
    subject:      formData.get("subject"),
    body:         formData.get("body"),
    promoDetails: formData.get("promoDetails") || undefined,
    promoCode:    formData.get("promoCode") || undefined,
    expiresAt:    formData.get("expiresAt") || null,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const d = parsed.data;
  const campaign = await prisma.campaign.create({
    data: {
      name:         d.name,
      subject:      d.subject,
      body:         d.body,
      promoDetails: d.promoDetails || null,
      promoCode:    d.promoCode || null,
      expiresAt:    d.expiresAt ? new Date(d.expiresAt) : null,
      createdById:  me.id,
    },
  });

  redirect(`/admin/marketing/${campaign.id}`);
}

export async function updateCampaignAction(
  id: string,
  _prev: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  await requireRole("admin");

  const parsed = campaignSchema.safeParse({
    name:         formData.get("name"),
    subject:      formData.get("subject"),
    body:         formData.get("body"),
    promoDetails: formData.get("promoDetails") || undefined,
    promoCode:    formData.get("promoCode") || undefined,
    expiresAt:    formData.get("expiresAt") || null,
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing || existing.status === "sent") {
    return { ok: false, message: "Cannot edit a campaign that has already been sent." };
  }

  const d = parsed.data;
  await prisma.campaign.update({
    where: { id },
    data: {
      name:         d.name,
      subject:      d.subject,
      body:         d.body,
      promoDetails: d.promoDetails || null,
      promoCode:    d.promoCode || null,
      expiresAt:    d.expiresAt ? new Date(d.expiresAt) : null,
    },
  });

  redirect(`/admin/marketing/${id}`);
}

// ── Send campaign ──────────────────────────────────────────────────────────

export type SendResult =
  | { ok: true; sent: number; failed: number }
  | { ok: false; message: string };

export async function sendCampaignAction(id: string): Promise<SendResult> {
  const me = await requireRole("admin");

  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return { ok: false, message: "Campaign not found." };
  if (campaign.status === "sent") return { ok: false, message: "This campaign has already been sent." };
  if (!process.env.RESEND_API_KEY) return { ok: false, message: "Email service not configured. Add RESEND_API_KEY to your environment variables." };

  // Gather all unique customer emails (deduplicated)
  const customers = await prisma.customer.findMany({
    where: { email: { not: null }, deletedAt: null },
    select: { email: true, firstName: true },
    distinct: ["email"],
  });

  const recipients = customers
    .filter((c): c is { email: string; firstName: string } => !!c.email)
    .map((c) => ({ email: c.email, firstName: c.firstName }));

  if (recipients.length === 0) {
    return { ok: false, message: "No customers with email addresses found in the database." };
  }

  // Mark as sending
  await prisma.campaign.update({ where: { id }, data: { status: "sending" } });

  try {
    const { sent, failed } = await sendCampaign(
      recipients,
      campaign.subject,
      campaign.body,
      campaign.promoDetails,
      campaign.promoCode,
      campaign.expiresAt
    );

    await prisma.campaign.update({
      where: { id },
      data: {
        status:        failed === recipients.length ? "failed" : "sent",
        sentAt:        new Date(),
        recipientCount: sent,
      },
    });

    await audit({
      actorUserId: me.id,
      action:      "SEND_CAMPAIGN",
      entityType:  "Campaign",
      entityId:    id,
      diff:        { sent, failed, total: recipients.length },
    });

    revalidatePath("/admin/marketing");
    revalidatePath(`/admin/marketing/${id}`);
    return { ok: true, sent, failed };
  } catch (e) {
    await prisma.campaign.update({ where: { id }, data: { status: "failed" } });
    console.error("Campaign send error:", e);
    return { ok: false, message: "An error occurred while sending. Check server logs." };
  }
}

export async function deleteCampaignAction(id: string) {
  await requireRole("admin");
  const c = await prisma.campaign.findUnique({ where: { id }, select: { status: true } });
  if (c?.status === "sending") return;
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/admin/marketing");
  redirect("/admin/marketing");
}

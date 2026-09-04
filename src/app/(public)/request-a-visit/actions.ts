"use server";
import { prisma } from "@/lib/prisma";
import type { LeadPropertyType, LeadTimeframe } from "@prisma/client";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "success"; leadId: string }
  | { status: "error"; message: string };

export async function submitLeadAction(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const firstName    = (formData.get("firstName") as string)?.trim();
  const lastName     = (formData.get("lastName") as string)?.trim();
  const email        = (formData.get("email") as string)?.trim();
  const phone        = (formData.get("phone") as string)?.trim();
  const addressLine1 = (formData.get("addressLine1") as string)?.trim();
  const city         = (formData.get("city") as string)?.trim();
  const state        = (formData.get("state") as string)?.trim() || "CA";
  const zip          = (formData.get("zip") as string)?.trim();

  if (!firstName || !lastName || !email || !phone) {
    return { status: "error", message: "Please fill in all required contact fields." };
  }
  if (!addressLine1 || !city || !zip) {
    return { status: "error", message: "Please fill in your full service address." };
  }

  const jobTypesRaw = (formData.get("jobTypes") as string) ?? "";
  const jobType = jobTypesRaw.trim() || "other";

  const timeframe = formData.get("timeframe") as LeadTimeframe | null;
  const description = (formData.get("description") as string)?.trim();

  if (!timeframe) return { status: "error", message: "Please select a timeframe." };
  if (!description) return { status: "error", message: "Please describe your project." };

  const propertyType  = (formData.get("propertyType") as LeadPropertyType) || "own";
  const hasStructural = formData.get("hasStructural") === "yes";
  const sqftRaw       = formData.get("sqft") as string;
  const sqft          = sqftRaw ? parseInt(sqftRaw, 10) : undefined;
  const budgetRange   = (formData.get("budgetRange") as string)?.trim() || undefined;

  // Find or create Customer record
  let customerId: string | undefined;
  try {
    const existing = await prisma.customer.findFirst({
      where: { email, deletedAt: null },
      select: { id: true },
    });
    if (existing) {
      customerId = existing.id;
    } else {
      const newCustomer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          phoneHome: phone,
          addressLine1,
          city,
          state,
          zip,
        },
      });
      customerId = newCustomer.id;
    }
  } catch (err) {
    console.error("Customer upsert failed:", err);
  }

  const lead = await prisma.lead.create({
    data: {
      jobType,
      propertyType,
      sqft: sqft && !isNaN(sqft) ? sqft : undefined,
      hasStructural,
      description,
      budgetRange,
      timeframe,
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      city,
      state,
      zip,
      customerId,
      statusHistory: {
        create: { status: "new" },
      },
    },
  });

  // Send emails - best-effort, never fail the submission
  try {
    const { notifyAdminNewLead, sendCustomerConfirmation } = await import("@/lib/email");
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      await notifyAdminNewLead(adminEmail, lead);
    }
    if (process.env.RESEND_API_KEY) {
      await sendCustomerConfirmation({ email, firstName });
    }
  } catch (err) {
    console.error("Lead email notification failed:", err);
  }

  return { status: "success", leadId: lead.id };
}

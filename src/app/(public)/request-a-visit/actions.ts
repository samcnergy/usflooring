"use server";
import { prisma } from "@/lib/prisma";
import type { LeadJobType, LeadPropertyType, LeadQualityLevel, LeadTimeframe } from "@prisma/client";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "success"; leadId: string }
  | { status: "error"; message: string };

export async function submitLeadAction(
  _prev: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName  = (formData.get("lastName") as string)?.trim();
  const email     = (formData.get("email") as string)?.trim();
  const phone     = (formData.get("phone") as string)?.trim();

  if (!firstName || !lastName || !email || !phone) {
    return { status: "error", message: "Please fill in all required contact fields." };
  }

  const jobType     = formData.get("jobType") as LeadJobType | null;
  const timeframe   = formData.get("timeframe") as LeadTimeframe | null;
  const description = (formData.get("description") as string)?.trim();

  if (!jobType) return { status: "error", message: "Please select a job type." };
  if (!timeframe) return { status: "error", message: "Please select a timeframe." };
  if (!description) return { status: "error", message: "Please describe your project." };

  const propertyType  = (formData.get("propertyType") as LeadPropertyType) || "own";
  const qualityLevel  = (formData.get("qualityLevel") as LeadQualityLevel) || undefined;
  const hasStructural = formData.get("hasStructural") === "yes";
  const sqftRaw       = formData.get("sqft") as string;
  const sqft          = sqftRaw ? parseInt(sqftRaw, 10) : undefined;
  const budgetRange   = (formData.get("budgetRange") as string)?.trim() || undefined;
  const photoNote     = (formData.get("photoNote") as string)?.trim() || undefined;
  const addressLine1  = (formData.get("addressLine1") as string)?.trim() || undefined;
  const city          = (formData.get("city") as string)?.trim() || undefined;
  const state         = (formData.get("state") as string)?.trim() || "CA";
  const zip           = (formData.get("zip") as string)?.trim() || undefined;

  const lead = await prisma.lead.create({
    data: {
      jobType,
      propertyType,
      sqft: sqft && !isNaN(sqft) ? sqft : undefined,
      qualityLevel: qualityLevel || undefined,
      hasStructural,
      description,
      budgetRange,
      timeframe,
      photoNote,
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      city,
      state,
      zip,
      statusHistory: {
        create: { status: "new" },
      },
    },
  });

  // Fire admin notification email — best-effort, don't fail the submission
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      const { notifyAdminNewLead } = await import("@/lib/email");
      await notifyAdminNewLead(adminEmail, lead);
    }
  } catch (err) {
    console.error("Lead notification email failed:", err);
  }

  return { status: "success", leadId: lead.id };
}

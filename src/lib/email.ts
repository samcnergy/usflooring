import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "US Floor <marketing@usfloordesign.com>";

export type CampaignRecipient = { email: string; firstName: string };

function buildHtml(body: string, promoDetails?: string | null, promoCode?: string | null, expiresAt?: Date | null): string {
  const formattedBody = body
    .split("\n")
    .map((l) => `<p style="margin:0 0 12px 0;color:#374151;line-height:1.6;">${l || "&nbsp;"}</p>`)
    .join("");

  const promoBlock = promoDetails
    ? `
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:20px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#92400e;">Special Offer</p>
      <p style="margin:0 0 8px 0;font-size:16px;color:#92400e;">${promoDetails}</p>
      ${promoCode ? `<p style="margin:8px 0 0 0;font-size:14px;color:#78350f;">Use code: <strong style="font-family:monospace;background:#fff;padding:2px 8px;border-radius:4px;border:1px solid #d97706;">${promoCode}</strong></p>` : ""}
      ${expiresAt ? `<p style="margin:8px 0 0 0;font-size:12px;color:#92400e;">Offer expires ${expiresAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
    </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:#1a1a2e;padding:24px 32px;">
      <p style="margin:0;font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.3px;">U.S. Floor, Kitchen &amp; Bath</p>
    </div>
    <!-- Body -->
    <div style="padding:32px;">
      ${formattedBody}
      ${promoBlock}
    </div>
    <!-- Footer -->
    <div style="background:#f3f4f6;padding:20px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
        U.S. Floor, Kitchen &amp; Bath · Orange County, CA<br>
        You are receiving this email because you are a valued customer.<br>
        To unsubscribe, reply to this email with "Unsubscribe" in the subject line.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function personalize(template: string, firstName: string): string {
  return template.replace(/\{\{firstName\}\}/gi, firstName);
}

const JOB_TYPE_LABELS: Record<string, string> = {
  flooring: "Flooring", kitchen: "Kitchen", bathroom: "Bathroom",
  wholeHome: "Whole-home", other: "Other",
};

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: "As soon as possible", withinMonth: "Within the next month",
  oneToThreeMonths: "1–3 months", threeToSixMonths: "3–6 months", flexible: "Just planning ahead",
};

export async function notifyAdminNewLead(
  adminEmail: string,
  lead: {
    id: string; firstName: string; lastName: string; email: string; phone: string;
    jobType: string; timeframe: string; description: string; sqft?: number | null;
    budgetRange?: string | null; city?: string | null;
  }
): Promise<void> {
  const resend = getResend();
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/admin/leads/${lead.id}`;
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New lead: ${lead.firstName} ${lead.lastName} — ${JOB_TYPE_LABELS[lead.jobType] ?? lead.jobType}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:system-ui,sans-serif;background:#f9fafb;margin:0;padding:0;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
<div style="background:#2F4A38;padding:20px 28px;"><p style="margin:0;color:#F1EEE7;font-size:17px;font-weight:600;">New Lead — U.S. Floor, Kitchen &amp; Bath</p></div>
<div style="padding:24px 28px;">
<table style="width:100%;border-collapse:collapse;font-size:14px;">
<tr><td style="padding:6px 0;color:#6b7280;width:140px;">Name</td><td style="padding:6px 0;color:#111;">${lead.firstName} ${lead.lastName}</td></tr>
<tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;color:#111;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
<tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;color:#111;">${lead.phone}</td></tr>
<tr><td style="padding:6px 0;color:#6b7280;">Project type</td><td style="padding:6px 0;color:#111;">${JOB_TYPE_LABELS[lead.jobType] ?? lead.jobType}</td></tr>
<tr><td style="padding:6px 0;color:#6b7280;">Timeframe</td><td style="padding:6px 0;color:#111;">${TIMEFRAME_LABELS[lead.timeframe] ?? lead.timeframe}</td></tr>
${lead.sqft ? `<tr><td style="padding:6px 0;color:#6b7280;">Sq ft</td><td style="padding:6px 0;color:#111;">${lead.sqft.toLocaleString()} sq ft</td></tr>` : ""}
${lead.city ? `<tr><td style="padding:6px 0;color:#6b7280;">City</td><td style="padding:6px 0;color:#111;">${lead.city}</td></tr>` : ""}
${lead.budgetRange ? `<tr><td style="padding:6px 0;color:#6b7280;">Budget</td><td style="padding:6px 0;color:#111;">${lead.budgetRange}</td></tr>` : ""}
</table>
<div style="margin-top:16px;padding:14px;background:#f3f4f6;border-radius:6px;">
<p style="margin:0 0 6px 0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Project description</p>
<p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${lead.description.replace(/\n/g, "<br>")}</p>
</div>
<div style="margin-top:20px;"><a href="${adminUrl}" style="display:inline-block;background:#2F4A38;color:#F1EEE7;padding:12px 20px;text-decoration:none;border-radius:4px;font-size:14px;">Review &amp; assign this lead →</a></div>
</div></div></body></html>`,
  });
}

export async function sendCustomerConfirmation({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}): Promise<void> {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Thank you for choosing US Floor Design Center",
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
  <div style="background:#2F4A38;padding:24px 32px;">
    <p style="margin:0;color:#F1EEE7;font-size:18px;letter-spacing:0.05em;text-transform:uppercase;">US Floor Design Center</p>
  </div>
  <div style="padding:36px 32px;">
    <p style="margin:0 0 16px 0;font-size:22px;color:#1E2320;font-weight:400;font-family:Georgia,serif;">Thank you, ${firstName}.</p>
    <p style="margin:0 0 16px 0;font-size:15px;color:#4B4A45;line-height:1.7;">
      We received your project request and a representative will contact you shortly to schedule your showroom visit.
    </p>
    <p style="margin:0 0 16px 0;font-size:15px;color:#4B4A45;line-height:1.7;">
      We look forward to working with you.
    </p>
    <p style="margin:32px 0 0 0;font-size:14px;color:#8C8577;">
      US Floor Design Center<br>
      Rancho Santa Margarita, CA
    </p>
  </div>
</div>
</body></html>`,
  });
}

export async function sendCampaign(
  recipients: CampaignRecipient[],
  subject: string,
  body: string,
  promoDetails?: string | null,
  promoCode?: string | null,
  expiresAt?: Date | null
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  // Batch into groups of 50 (Resend batch limit)
  const BATCH = 50;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH);
    try {
      const resend = getResend();
      const emails = chunk.map((r) => ({
        from: FROM,
        to: r.email,
        subject,
        html: buildHtml(personalize(body, r.firstName), promoDetails, promoCode, expiresAt),
      }));
      const { data, error } = await resend.batch.send(emails);
      if (error) {
        console.error("Resend batch error:", error);
        failed += chunk.length;
      } else {
        sent += data?.data?.length ?? chunk.length;
      }
    } catch (e) {
      console.error("Resend send error:", e);
      failed += chunk.length;
    }
    // Small delay between batches to respect rate limits
    if (i + BATCH < recipients.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  return { sent, failed };
}

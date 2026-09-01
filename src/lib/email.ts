import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "US Floor <marketing@usflooring.com>";

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

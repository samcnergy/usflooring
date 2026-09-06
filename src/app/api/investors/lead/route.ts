import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const REQUIRED = ["full_name", "email", "phone", "target_area", "purchase_price", "timeline", "has_agent", "consent"];

function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `<tr><td style="padding:6px 12px;color:#6D7276;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 12px;font-size:14px;color:#1A1D1F;vertical-align:top">${value}</td></tr>`;
}

function buildHtml(d: Record<string, string>) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;background:#F4F5F6;margin:0;padding:32px 0">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-top:4px solid #D03238">
    <div style="padding:32px 32px 0">
      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6D7276">US Floor Design Center</p>
      <h1 style="margin:0 0 24px;font-size:22px;color:#1A1D1F">New investor inquiry</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #DCDDDF">
      ${row("Name", d.full_name)}
      ${row("Email", d.email)}
      ${row("Phone", d.phone)}
      ${row("Target area", d.target_area)}
      ${row("Purchase price", d.purchase_price)}
      ${row("Reno budget", d.reno_budget)}
      ${row("Financing", d.financing)}
      ${row("Experience", d.experience)}
      ${row("Timeline", d.timeline)}
      ${row("Has agent", d.has_agent)}
      ${row("Property address", d.property_address)}
    </table>
    ${d.notes ? `<div style="padding:16px 32px;border-top:1px solid #DCDDDF"><p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#6D7276">Notes</p><p style="margin:0;font-size:14px;color:#1A1D1F;line-height:1.5">${d.notes.replace(/\n/g, "<br>")}</p></div>` : ""}
    <div style="padding:24px 32px;border-top:1px solid #DCDDDF;background:#F4F5F6">
      <p style="margin:0;font-size:12px;color:#6D7276">Submitted from usfloordesign.com/investors</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: if filled, silently accept without sending
  if (data.website) return NextResponse.json({ ok: true });

  // Timestamp: reject submissions faster than 3 seconds
  const elapsed = Date.now() - Number(data._t || 0);
  if (elapsed < 3000) return NextResponse.json({ ok: true });

  // Server-side required field validation
  const missing = REQUIRED.filter((f) => !data[f]?.trim());
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", fields: missing }, { status: 422 });
  }

  const { error } = await resend.emails.send({
    from: "US Floor Design Center <noreply@usfloordesign.com>",
    to: "info@usfloordesign.com",
    replyTo: data.email,
    subject: `Investor inquiry: ${data.full_name} — ${data.target_area}`,
    html: buildHtml(data),
  });

  if (error) {
    console.error("Resend error", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

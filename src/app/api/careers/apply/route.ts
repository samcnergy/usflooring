import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const REQUIRED = [
  "full_name",
  "email",
  "phone",
  "role",
  "city",
  "work_auth",
  "saturdays",
  "followup",
  "consent",
];

export async function POST(req: NextRequest) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const get = (key: string) => (fd.get(key) as string | null)?.trim() ?? "";

  if (get("website")) return NextResponse.json({ ok: true });

  const elapsed = Date.now() - Number(get("_t") || 0);
  if (elapsed < 3000) return NextResponse.json({ ok: true });

  const missing = REQUIRED.filter((f) => !get(f));
  if (missing.length) {
    return NextResponse.json({ ok: false, error: "missing_fields", fields: missing }, { status: 422 });
  }

  const resumeFile = fd.get("resume") as File | null;
  const attachments: Array<{ filename: string; content: Buffer }> = [];

  if (resumeFile && resumeFile.size > 0) {
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "file_too_large" }, { status: 422 });
    }
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(resumeFile.type)) {
      return NextResponse.json({ ok: false, error: "invalid_file_type" }, { status: 422 });
    }
    const buf = await resumeFile.arrayBuffer();
    attachments.push({ filename: resumeFile.name, content: Buffer.from(buf) });
  }

  const from =
    process.env.RESEND_FROM_EMAIL ??
    "US Floor Design Center <noreply@usfloordesign.com>";

  const [notify] = await Promise.allSettled([
    resend.emails.send({
      from,
      to: "info@usfloordesign.com",
      replyTo: get("email"),
      subject: `Application: ${get("full_name")} — ${get("role")}`,
      html: buildHtml({
        full_name: get("full_name"),
        email: get("email"),
        phone: get("phone"),
        role: get("role"),
        city: get("city"),
        work_auth: get("work_auth"),
        saturdays: get("saturdays"),
        followup: get("followup"),
        work_history: get("work_history"),
        linkedin: get("linkedin"),
      }),
      ...(attachments.length ? { attachments } : {}),
    }),
    resend.emails.send({
      from,
      to: get("email"),
      subject: "We received your application — US Floor Design Center",
      html: autoReplyHtml(get("full_name")),
    }),
  ]);

  if (notify.status === "rejected" || notify.value?.error) {
    console.error(
      "Resend error",
      notify.status === "rejected" ? notify.reason : notify.value.error,
    );
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function buildHtml(d: Record<string, string>) {
  return `
    <h2 style="font-family:sans-serif">New application: ${d.full_name} - ${d.role}</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      <tr style="background:#f4f4f4"><td><b>Name</b></td><td>${d.full_name}</td></tr>
      <tr><td><b>Email</b></td><td><a href="mailto:${d.email}">${d.email}</a></td></tr>
      <tr style="background:#f4f4f4"><td><b>Phone</b></td><td>${d.phone}</td></tr>
      <tr><td><b>Role</b></td><td>${d.role}</td></tr>
      <tr style="background:#f4f4f4"><td><b>City</b></td><td>${d.city}</td></tr>
      <tr><td><b>Work authorization</b></td><td>${d.work_auth}</td></tr>
      <tr style="background:#f4f4f4"><td><b>Available Saturdays</b></td><td>${d.saturdays}</td></tr>
    </table>
    <h3 style="font-family:sans-serif;margin-top:24px">Follow-up answer</h3>
    <p style="font-family:sans-serif;font-size:14px;max-width:640px">${d.followup.replace(/\n/g, "<br>")}</p>
    ${d.work_history ? `<h3 style="font-family:sans-serif">Prior work</h3><p style="font-family:sans-serif;font-size:14px;max-width:640px">${d.work_history.replace(/\n/g, "<br>")}</p>` : ""}
    ${d.linkedin ? `<p style="font-family:sans-serif;font-size:14px"><b>Link:</b> <a href="${d.linkedin}">${d.linkedin}</a></p>` : ""}
  `;
}

function autoReplyHtml(name: string) {
  return `
    <p style="font-family:sans-serif">Hi ${name},</p>
    <p style="font-family:sans-serif">We received your application and will be in touch within one week.</p>
    <p style="font-family:sans-serif">We get back to everyone who applies, including the people we are not moving forward with.</p>
    <p style="font-family:sans-serif">
      US Floor Design Center<br>
      30092 Santa Margarita Pkwy, Suite G<br>
      Rancho Santa Margarita, CA 92688<br>
      info@usfloordesign.com
    </p>
  `;
}

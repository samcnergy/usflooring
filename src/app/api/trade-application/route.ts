import { NextResponse } from "next/server";
import { notifyTradeApplication } from "@/lib/email";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, company, email, phone, type, license, message } = body as Record<string, string>;

  if (!name?.trim() || !company?.trim() || !email?.trim() || !type?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    await notifyTradeApplication({
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone?.trim() ?? "",
      type: type.trim(),
      license: license?.trim() ?? "",
      message: message?.trim() ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Trade application email error:", err);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 500 });
  }
}

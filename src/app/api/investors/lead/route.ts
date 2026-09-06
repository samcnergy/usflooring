// TODO [DECIDE]: Wire this to your email or CRM destination before going live.
// Currently returns 200 so the form UI works end-to-end.
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();

  // req.url is the internal server URL (e.g. http://localhost:10000/...) when
  // running behind a reverse proxy like Render. Use the forwarded headers to
  // reconstruct the public origin so the redirect lands on the right host.
  const proto = req.headers.get("x-forwarded-proto") ?? new URL(req.url).protocol.replace(":", "");
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? new URL(req.url).host;
  const url   = new URL("/login", `${proto}://${host}`);

  return NextResponse.redirect(url, { status: 303 });
}

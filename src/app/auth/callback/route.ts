// Auth callback route — Supabase redirects here after verifying an invitation
// or magic-link token when using PKCE flow. We exchange the code for a session
// then send the user to the reset-password page so they can set their password.

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Optional forwarding target (e.g. ?next=/admin)
  const next = searchParams.get("next");

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // For invite flow: send to reset-password so the user sets their password.
      // For any other flow that passes ?next=, honour it.
      const destination = next ?? "/reset-password";
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // Something went wrong — send to login with an error hint.
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}

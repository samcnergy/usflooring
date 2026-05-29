import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// TEMPORARY diagnostic endpoint — delete after use.
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "MISSING";
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const hasSvcKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Try to list users to confirm service role works
  let bobbyExists = false;
  let bobbyConfirmed = false;
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const bobby = data?.users?.find((u) => u.email === "bobby@usfloorkb.com");
    bobbyExists = !!bobby;
    bobbyConfirmed = !!bobby?.email_confirmed_at;
  } catch { /* ignore */ }

  return NextResponse.json({
    supabaseUrl: url,
    hasPublishableKey: hasKey,
    hasServiceRoleKey: hasSvcKey,
    bobbyExistsInSupabase: bobbyExists,
    bobbyEmailConfirmed: bobbyConfirmed,
  });
}

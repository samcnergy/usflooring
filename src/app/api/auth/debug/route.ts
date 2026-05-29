import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TEST_EMAIL = "bobby@usfloorkb.com";
const NEW_SIMPLE_PASS = "Welcome2026!";

// TEMPORARY diagnostic endpoint — delete after use.
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey     = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const svcKey      = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const admin = createClient(supabaseUrl, svcKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Reset Bobby's password to something simple
  const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const bobby = users?.users?.find((u) => u.email === TEST_EMAIL);

  let resetResult = "user not found";
  if (bobby) {
    const { error } = await admin.auth.admin.updateUserById(bobby.id, {
      password: NEW_SIMPLE_PASS,
    });
    resetResult = error ? `reset error: ${error.message}` : "password reset OK";
  }

  // Now try signing in with the new password
  const anon = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: NEW_SIMPLE_PASS,
  });

  return NextResponse.json({
    supabaseUrl,
    bobbyId: bobby?.id ?? null,
    resetResult,
    signInResult: signInErr ? `FAIL: ${signInErr.message}` : `OK — role: ${signIn.user?.app_metadata?.role}`,
    newPassword: NEW_SIMPLE_PASS,
  });
}

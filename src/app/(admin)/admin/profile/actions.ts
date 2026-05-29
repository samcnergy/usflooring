"use server";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { requireRole } from "@/lib/auth";
import type { PasswordState } from "@/components/PasswordChangeForm";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function changePasswordAction(
  _prev: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  await requireRole("admin");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword     = String(formData.get("newPassword")     ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8) {
    return { ok: false, message: "New password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { ok: false, message: "New passwords do not match." };
  }

  // Get the authenticated user's email from the current session.
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, message: "Not authenticated." };

  // Verify the current password by attempting a sign-in (doesn't touch the session).
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error: signInError } = await anonClient.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  if (signInError) return { ok: false, message: "Current password is incorrect." };

  // Update to the new password.
  const { error: updateError } = await getSupabaseAdmin().auth.admin.updateUserById(user.id, {
    password: newPassword,
  });
  if (updateError) return { ok: false, message: updateError.message };

  return { ok: true };
}

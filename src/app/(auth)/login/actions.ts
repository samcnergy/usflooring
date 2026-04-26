"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Email and password are required.")}`);
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const role = data.user?.app_metadata?.role as "admin" | "salesperson" | undefined;

  if (role === "admin") redirect("/admin");
  if (role === "salesperson") redirect("/sales");

  // User exists but has no role claim. Sign them back out so they can't
  // wedge themselves into a half-state.
  await supabase.auth.signOut();
  redirect(
    `/login?error=${encodeURIComponent(
      "Your account has no role assigned. Contact the admin.",
    )}`,
  );
}

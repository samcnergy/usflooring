"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { audit } from "@/lib/audit";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

const inviteInput = z.object({
  email: z.string().email("Invalid email"),
  fullName: z.string().trim().min(1, "Full name required").max(120),
  role: z.enum(["admin", "salesperson"]),
});

export type InviteState =
  | { ok: true; email: string; tempPassword: string }
  | { ok: false; errors?: Record<string, string>; message?: string }
  | null;

export async function inviteUserAction(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const me = await requireRole("admin");

  const parsed = inviteInput.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    fullName: String(formData.get("fullName") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[i.path.join(".")] = i.message;
    return { ok: false, errors };
  }

  const { email, fullName, role } = parsed.data;

  // Already exists?
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "A user with that email already exists." };
  }

  // Generate a secure temporary password — 16 url-safe characters.
  // The user can change it from their Profile page after first login.
  const tempPassword = randomBytes(12).toString("base64url").slice(0, 16);

  const supabaseAdmin = getSupabaseAdmin();

  // Create the account with email already confirmed so the user can log in
  // immediately with the temp password — no email link required.
  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata:  { full_name: fullName },
    app_metadata:   { role },
  });
  if (error) return { ok: false, message: error.message };

  const dbUser = await prisma.user.create({
    data: { email, fullName, role },
  });

  await audit({
    actorUserId: me.id,
    action: "invite",
    entityType: "User",
    entityId: dbUser.id,
    diff: { email, role },
  });

  revalidatePath("/admin/users");
  return { ok: true, email, tempPassword };
}

// ── Change email ─────────────────────────────────────────────────────────────

export type EmailChangeState =
  | { ok: true }
  | { ok: false; message: string }
  | null;

export async function changeEmailAction(
  _prev: EmailChangeState,
  formData: FormData,
): Promise<EmailChangeState> {
  await requireRole("admin");

  const userId   = String(formData.get("userId") ?? "").trim();
  const newEmail = String(formData.get("newEmail") ?? "").trim().toLowerCase();

  if (!userId || !newEmail) return { ok: false, message: "Missing fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return { ok: false, message: "Invalid email address." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.email.startsWith("deleted_")) return { ok: false, message: "User not found." };
  if (user.email === newEmail) return { ok: false, message: "That is already their email." };

  // Make sure the new email isn't taken.
  const clash = await prisma.user.findUnique({ where: { email: newEmail } });
  if (clash) return { ok: false, message: "That email is already in use." };

  // Update Supabase auth first (find by old email).
  const supabaseAdmin = getSupabaseAdmin();
  const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.data.users.find((u) => u.email === user.email);
  if (authUser) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(authUser.id, {
      email: newEmail,
    });
    if (error) return { ok: false, message: `Supabase error: ${error.message}` };
  }

  await prisma.user.update({ where: { id: userId }, data: { email: newEmail } });
  revalidatePath("/admin/users");
  return { ok: true };
}

// ── Delete user (soft-delete) ─────────────────────────────────────────────────

export async function deleteUserAction(userId: string): Promise<void> {
  const me = await requireRole("admin");
  if (userId === me.id) throw new Error("You cannot delete your own account.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  // Already deleted if email starts with the tombstone prefix.
  if (!user || user.email.startsWith("deleted_")) return;

  // Hard-delete from Supabase auth so the account is fully revoked.
  const supabaseAdmin = getSupabaseAdmin();
  const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const authUser = list.data.users.find((u) => u.email === user.email);
  if (authUser) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.id);
  }

  // We can't hard-delete the User row because Order.salespersonId has a FK to it
  // and we want the salesperson name to keep appearing on existing invoices.
  // Instead, tombstone the email (preserves uniqueness) and deactivate the user
  // so they can never log in again — no schema migration required.
  const tombstone = `deleted_${Date.now()}_${user.email}`;
  await prisma.user.update({
    where: { id: userId },
    data: { email: tombstone, isActive: false },
  });

  await audit({
    actorUserId: me.id,
    action: "delete",
    entityType: "User",
    entityId: userId,
    diff: { email: user.email, fullName: user.fullName },
  });

  revalidatePath("/admin/users");
}

// ── Toggle active ─────────────────────────────────────────────────────────────

export async function setUserActiveAction(userId: string, isActive: boolean) {
  const me = await requireRole("admin");
  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  await audit({
    actorUserId: me.id,
    action: isActive ? "reactivate" : "deactivate",
    entityType: "User",
    entityId: userId,
  });
  revalidatePath("/admin/users");
}

export async function changeUserRoleAction(userId: string, role: "admin" | "salesperson") {
  const me = await requireRole("admin");
  if (userId === me.id) {
    throw new Error("You cannot change your own role.");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.user.update({ where: { id: userId }, data: { role } });

  // Sync the JWT claim in Supabase so the proxy sees the new role.
  const supabaseAdmin = getSupabaseAdmin();
  const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const su = list.data.users.find((u) => u.email === user.email);
  if (su) {
    await supabaseAdmin.auth.admin.updateUserById(su.id, {
      app_metadata: { ...(su.app_metadata ?? {}), role },
    });
  }

  await audit({
    actorUserId: me.id,
    action: "role_change",
    entityType: "User",
    entityId: userId,
    diff: { from: user.role, to: role },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

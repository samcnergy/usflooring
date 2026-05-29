"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  | { ok: true; email: string }
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

  const supabaseAdmin = getSupabaseAdmin();

  // Send a real invitation email — the user clicks the link and sets their own password.
  const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });
  if (error) return { ok: false, message: error.message };

  // Set the role in app_metadata (can only be done after the user exists).
  if (invited?.user?.id) {
    await supabaseAdmin.auth.admin.updateUserById(invited.user.id, {
      app_metadata: { role },
      user_metadata: { full_name: fullName },
    });
  }

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
  return { ok: true, email };
}

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

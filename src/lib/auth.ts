// Auth helpers. Wraps Supabase session lookup + role resolution.
// Hard rule (§3): never trust the client for role — always re-derive on the
// server from the session and the User row.

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./supabase-server";
import { prisma } from "./prisma";
import type { Role } from "@prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  // isActive=false covers both deactivated and deleted users (deleted users have
  // their email mutated to "deleted_<ts>_<original>" and isActive set to false).
  if (!dbUser || !dbUser.isActive) return null;
  return {
    id: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.fullName,
    role: dbUser.role,
  };
}

export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== role) {
    // Cross-role access is hard-blocked, not soft-redirected.
    redirect("/login");
  }
  return user;
}

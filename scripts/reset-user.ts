// One-off admin tool: ensures a user exists in BOTH Supabase Auth and the
// Prisma User table with the given email, role, and password.
//
//   npx tsx scripts/reset-user.ts <email> <role> <password>
//
// e.g.
//   npx tsx scripts/reset-user.ts admin@usfloorkb.com admin 'NewPass123!'
//
// Idempotent: if the user already exists in either store, it's updated.
// If missing, it's created.

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });

const [emailArg, roleArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !roleArg || !passwordArg) {
  console.error("Usage: tsx scripts/reset-user.ts <email> <admin|salesperson> <password>");
  process.exit(2);
}
const email = emailArg.trim().toLowerCase();
const role = roleArg as Role;
if (role !== "admin" && role !== "salesperson") {
  console.error(`Invalid role: ${roleArg}. Use 'admin' or 'salesperson'.`);
  process.exit(2);
}

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL must be set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
}
const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`\nResetting ${email} → role=${role}`);

  // 1. Find or create the Supabase Auth user. Paginate if needed.
  let existing: { id: string; email?: string; app_metadata?: Record<string, unknown> } | undefined;
  let page = 1;
  while (true) {
    const list = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
    if (list.error) throw list.error;
    existing = list.data.users.find((u) => u.email?.toLowerCase() === email);
    if (existing) break;
    if (list.data.users.length < 200) break; // last page
    page++;
  }

  let supabaseId: string;
  if (existing) {
    console.log(`  Supabase Auth: existing user ${existing.id}`);
    const upd = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: passwordArg,
      email_confirm: true,
      app_metadata: { ...(existing.app_metadata ?? {}), role },
    });
    if (upd.error) throw upd.error;
    supabaseId = existing.id;
  } else {
    const created = await supabaseAdmin.auth.admin.createUser({
      email,
      password: passwordArg,
      email_confirm: true,
      app_metadata: { role },
    });
    if (created.error) throw created.error;
    supabaseId = created.data.user!.id;
    console.log(`  Supabase Auth: created ${supabaseId}`);
  }

  // 2. Upsert the Prisma User row (matched by email).
  const dbUser = await prisma.user.upsert({
    where: { email },
    update: { role, isActive: true },
    create: { email, fullName: deriveName(email), role },
  });
  console.log(`  Prisma User:   ${dbUser.id} (${dbUser.fullName}) role=${dbUser.role}`);

  console.log(`\n✅ DONE. Log in at https://usflooring.onrender.com with:`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${passwordArg}`);
}

function deriveName(email: string): string {
  const local = email.split("@")[0];
  return local
    .split(/[._-]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

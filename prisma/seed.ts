// Seeds the bare minimum:
//   - invoice number sequence (starts at 6515)
//   - eight starter advertising sources
//   - one admin + three example salespeople, in BOTH the Prisma `User` table
//     AND Supabase Auth (so the seeded accounts can actually log in).
//
// Run with `npm run db:seed` after `prisma migrate dev`. The temp passwords
// for each seeded auth user are printed to stdout ONCE. Change them on first
// login.
//
// Idempotent: re-running won't create duplicate rows or duplicate auth users.

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import { randomBytes } from "node:crypto";

loadDotenv({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL must be set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

// Service-role admin client. Only used in seed/admin server code.
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function genPassword() {
  return randomBytes(9).toString("base64url"); // ~12 chars, URL-safe
}

type SeedAccount = { email: string; fullName: string; role: Role };

async function upsertAccount(acct: SeedAccount): Promise<{ created: boolean; tempPassword?: string }> {
  // 1. Mirror row in the Prisma User table (idempotent on email).
  await prisma.user.upsert({
    where: { email: acct.email },
    update: { fullName: acct.fullName, role: acct.role, isActive: true },
    create: { email: acct.email, fullName: acct.fullName, role: acct.role },
  });

  // 2. Supabase Auth user. listUsers is paginated, but we filter by email below.
  const existing = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (existing.error) throw existing.error;
  const found = existing.data.users.find((u) => u.email === acct.email);

  if (found) {
    // Make sure the role claim is up-to-date even if the row already exists.
    await supabaseAdmin.auth.admin.updateUserById(found.id, {
      app_metadata: { ...(found.app_metadata ?? {}), role: acct.role },
    });
    return { created: false };
  }

  const tempPassword = genPassword();
  const created = await supabaseAdmin.auth.admin.createUser({
    email: acct.email,
    password: tempPassword,
    email_confirm: true, // skip email verification for seeded accounts
    app_metadata: { role: acct.role },
    user_metadata: { full_name: acct.fullName },
  });
  if (created.error) throw created.error;

  return { created: true, tempPassword };
}

async function main() {
  // 1. Invoice sequence (idempotent — keeps existing value if present).
  await prisma.$executeRawUnsafe(
    `CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 6515 MINVALUE 6515`,
  );

  // 2. Advertising sources.
  const sources = [
    "Google",
    "Yelp",
    "Drive-by",
    "Referral",
    "Repeat Customer",
    "Facebook",
    "Instagram",
    "Other",
  ];
  for (const name of sources) {
    await prisma.advertisingSource.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 3. Accounts (admin + 3 salespeople).
  const accounts: SeedAccount[] = [
    { email: "admin@usfloorkb.com",  fullName: "U.S. Floor Admin", role: Role.admin },
    { email: "sam@usfloorkb.com",    fullName: "Sam McNergy",      role: Role.salesperson },
    { email: "alex@usfloorkb.com",   fullName: "Alex Garcia",      role: Role.salesperson },
    { email: "jordan@usfloorkb.com", fullName: "Jordan Lee",       role: Role.salesperson },
  ];

  const newCreds: { email: string; pw: string }[] = [];
  for (const acct of accounts) {
    const result = await upsertAccount(acct);
    if (result.created && result.tempPassword) {
      newCreds.push({ email: acct.email, pw: result.tempPassword });
    }
  }

  if (newCreds.length > 0) {
    console.log("\n========================================");
    console.log("SEED — newly created Supabase Auth users");
    console.log("Save these temp passwords; you'll need them to log in.");
    console.log("Change each password on first login.");
    console.log("----------------------------------------");
    for (const { email, pw } of newCreds) {
      console.log(`  ${email.padEnd(28)}  ${pw}`);
    }
    console.log("========================================\n");
  } else {
    console.log("Seed complete. No new auth users created (all already existed).");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

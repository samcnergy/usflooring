// Seeds the bare minimum: invoice sequence, advertising sources, one admin,
// three example salespeople. Run with `npm run db:seed` (after `prisma migrate`).
//
// The admin password is generated and printed to stdout ONCE. Per § 10 of the
// spec, the admin must change it on first login.

import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv } from "dotenv";
import { randomBytes } from "node:crypto";

loadDotenv({ path: ".env.local" });

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL must be set");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function genPassword() {
  return randomBytes(9).toString("base64url"); // ~12 chars, URL-safe
}

async function main() {
  // Invoice number sequence. Idempotent — keeps existing value if already created.
  await prisma.$executeRawUnsafe(
    `CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 6515 MINVALUE 6515`,
  );

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

  const adminEmail = "admin@usfloorkb.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const tempPw = genPassword();
    await prisma.user.create({
      data: {
        email: adminEmail,
        fullName: "U.S. Floor Admin",
        role: Role.admin,
      },
    });
    console.log("\n========================================");
    console.log("ADMIN USER CREATED");
    console.log("  email:    ", adminEmail);
    console.log("  temp pwd: ", tempPw);
    console.log("Create the matching user in Supabase Auth with this password,");
    console.log("then change it on first login.");
    console.log("========================================\n");
  }

  const salespeople = [
    { email: "sam@usfloorkb.com", fullName: "Sam McNergy" },
    { email: "alex@usfloorkb.com", fullName: "Alex Garcia" },
    { email: "jordan@usfloorkb.com", fullName: "Jordan Lee" },
  ];
  for (const p of salespeople) {
    await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { email: p.email, fullName: p.fullName, role: Role.salesperson },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

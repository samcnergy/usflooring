import { defineConfig } from "@prisma/config";
import { config as loadDotenv } from "dotenv";

// Load .env.local for CLI commands (prisma migrate, prisma db seed). The Next.js
// runtime loads it automatically, but the Prisma CLI does not.
loadDotenv({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Used by `prisma migrate` / `prisma db push`. We point at DIRECT_URL because
  // pgbouncer (Supabase pooled URL) doesn't support the prepared statements
  // migrations issue.
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});

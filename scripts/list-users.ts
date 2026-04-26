import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: ".env.local" });

async function main() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const r = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (r.error) throw r.error;
  console.log("Total users returned:", r.data.users.length);
  for (const u of r.data.users) {
    const role = (u.app_metadata as Record<string, unknown> | undefined)?.role ?? "(none)";
    console.log(`  id=${u.id.slice(0, 8)} email=${u.email} role=${role}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

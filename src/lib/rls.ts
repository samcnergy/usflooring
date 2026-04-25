// Row-Level Security policies as code. These are the policies we install on
// the Supabase database; the app layer does not relax them. See § 9 of the spec.
//
// To apply: copy the SQL below into a Supabase migration (or psql) once
// `prisma migrate dev` has created the tables. We keep it here, in TypeScript,
// so the policies are reviewed alongside the app code that depends on them.

export const RLS_SQL = `
-- Enable RLS on every business table that holds tenant-scoped data.
ALTER TABLE "Order"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderArea"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderMaterial"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderMolding"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderFixture"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderShower"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderTileStone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderRemoval"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VendorOrder"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog"       ENABLE ROW LEVEL SECURITY;

-- Helper: read role from the JWT 'role' claim that we set in Supabase Auth.
-- (We mirror it from the User table on signup / role change.)
CREATE OR REPLACE FUNCTION app_role() RETURNS TEXT
  LANGUAGE sql STABLE AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')
$$;

-- Helper: the User.id of the current session.
CREATE OR REPLACE FUNCTION app_user_id() RETURNS UUID
  LANGUAGE sql STABLE AS $$
  SELECT u.id FROM "User" u WHERE u.email = auth.jwt() ->> 'email' LIMIT 1
$$;

-- Order: admins see everything; salespeople see only their own.
CREATE POLICY "order_select_admin"  ON "Order" FOR SELECT USING (app_role() = 'admin');
CREATE POLICY "order_select_salesperson" ON "Order" FOR SELECT USING (
  app_role() = 'salesperson' AND "salespersonId" = app_user_id()
);
CREATE POLICY "order_insert_salesperson" ON "Order" FOR INSERT WITH CHECK (
  (app_role() = 'admin') OR
  (app_role() = 'salesperson' AND "salespersonId" = app_user_id())
);
CREATE POLICY "order_update_admin"  ON "Order" FOR UPDATE USING (app_role() = 'admin');
CREATE POLICY "order_update_salesperson" ON "Order" FOR UPDATE USING (
  app_role() = 'salesperson' AND "salespersonId" = app_user_id()
) WITH CHECK ("salespersonId" = app_user_id());
-- Hard delete: admin only.
CREATE POLICY "order_delete_admin"  ON "Order" FOR DELETE USING (app_role() = 'admin');

-- The child tables inherit visibility from their parent Order.
-- (Repeat the same pattern for OrderArea, OrderMaterial, etc — see TODO below.)
`;

// TODO: expand the per-child-table policies before going to production.

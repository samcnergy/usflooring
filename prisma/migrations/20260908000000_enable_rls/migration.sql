-- Enable Row Level Security on all public tables exposed to PostgREST.
-- All data access in this app goes through Prisma (direct Postgres connection
-- as the postgres superuser, which bypasses RLS). Enabling RLS with no
-- permissive policies blocks any direct anon-key / PostgREST access to
-- these tables while leaving server-side Prisma queries unaffected.

ALTER TABLE public."Campaign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LeadStatusHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Material" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MaterialImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProductRequest" ENABLE ROW LEVEL SECURITY;

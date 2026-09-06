// Refreshes the Supabase session on every navigation and hard-blocks
// cross-role access by URL. Next.js 16 renamed `middleware` → `proxy`; the
// contract (single named export, optional `config` with `matcher`) is the same.
// Detailed RLS lives in src/lib/rls.ts.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.app_metadata?.role as "admin" | "salesperson" | undefined;
  const path = req.nextUrl.pathname;

  // Public routes (no session required).
  const isPublic =
    path === "/" ||
    path === "/login" ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path.startsWith("/request-a-visit") ||
    path.startsWith("/shop") ||
    path.startsWith("/services") ||
    path.startsWith("/projects") ||
    path.startsWith("/showroom") ||
    path.startsWith("/trade") ||
    path.startsWith("/warranty") ||
    path.startsWith("/showroom") ||
    path.startsWith("/academy") ||
    path.startsWith("/blog") ||
    path.startsWith("/faq") ||
    path.startsWith("/about") ||
    path.startsWith("/investors") ||
    path.startsWith("/press") ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/investors");

  if (isPublic) return res;

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (path.startsWith("/admin") && role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (path.startsWith("/sales") && role !== "salesperson") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.avif|.*\\.ico|.*\\.woff2?|.*\\.zip).*)",
  ],
};

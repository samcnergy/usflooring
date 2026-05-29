import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("admin");
  return (
    <AppShell
      navLinks={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/users", label: "Salespeople" },
        { href: "/admin/sources", label: "Ad Sources" },
        { href: "/admin/audit", label: "Audit" },
        { href: "/admin/profile", label: "Profile" },
      ]}
      ctaHref="/admin/ai-analysis"
      ctaLabel="Run AI Analysis"
      userLabel={user.fullName}
    >
      {children}
    </AppShell>
  );
}

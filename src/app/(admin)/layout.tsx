import { AppShell } from "@/components/layout/AppShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navLinks={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/users", label: "Salespeople" },
        { href: "/admin/sources", label: "Ad Sources" },
        { href: "/admin/audit", label: "Audit" },
      ]}
      ctaHref="/admin/ai-analysis"
      ctaLabel="Run AI Analysis"
    >
      {children}
    </AppShell>
  );
}

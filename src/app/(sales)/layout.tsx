import { AppShell } from "@/components/layout/AppShell";
import { requireRole } from "@/lib/auth";

export default async function SalesLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("salesperson");
  return (
    <AppShell
      navLinks={[
        { href: "/sales", label: "New Order" },
        { href: "/sales/orders", label: "My Orders" },
        { href: "/sales/profile", label: "Profile" },
      ]}
      ctaHref="/sales"
      ctaLabel="New Order"
      userLabel={user.fullName}
    >
      {children}
    </AppShell>
  );
}

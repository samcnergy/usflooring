import { AppShell } from "@/components/layout/AppShell";

export default function SalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      navLinks={[
        { href: "/sales", label: "New Order" },
        { href: "/sales/orders", label: "My Orders" },
        { href: "/sales/profile", label: "Profile" },
      ]}
      ctaHref="/sales"
      ctaLabel="New Order"
    >
      {children}
    </AppShell>
  );
}

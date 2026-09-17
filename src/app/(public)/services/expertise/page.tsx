import Link from "next/link";

export const metadata = {
  title: "Expertise",
  description: "Specialized flooring and finish services across medical offices, retail, kitchens, bathrooms, and more.",
};

const ITEMS = [
  { label: "Medical Offices", href: "/services/expertise/medical-offices" },
  { label: "Retail Buildout", href: "/services/expertise/retail-buildout" },
  { label: "Investor Services", href: "/services/expertise/investor-services" },
  { label: "Kitchen Remodel", href: "/services/expertise/kitchen-remodel" },
  { label: "Bathroom Remodel", href: "/services/expertise/bathroom-remodel" },
  { label: "Backyard", href: "/services/expertise/backyard" },
  { label: "Windows and Doors", href: "/services/expertise/windows-and-doors" },
];

export default function ExpertisePage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Services</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Expertise</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>Specialized services for the spaces and projects where results matter most.</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-8) 0", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--s-5) 0", borderBottom: "1px solid var(--line)", color: "var(--text)", textDecoration: "none", fontSize: "var(--t-body-lg)", fontFamily: "var(--font-body)" }}>
                {item.label}
                <span style={{ color: "var(--text-muted)", fontSize: "var(--t-body)" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

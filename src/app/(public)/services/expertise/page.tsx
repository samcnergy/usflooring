import Link from "next/link";

export const metadata = {
  title: "Expertise",
  description: "Residential and commercial design-build across South Orange County: medical offices, retail buildouts, investment properties, kitchens, bathrooms, backyards, and windows and doors.",
};

const ITEMS = [
  { label: "Medical Offices", href: "/services/expertise/medical-offices", desc: "Design-build for clinics, dental suites, and healthcare offices." },
  { label: "Retail Buildout", href: "/services/expertise/retail-buildout", desc: "Interior buildouts and finishes for storefronts and commercial tenants." },
  { label: "Investor Services", href: "/services/expertise/investor-services", desc: "Renovation and turnover work for rental and investment properties." },
  { label: "Kitchen Remodel", href: "/services/expertise/kitchen-remodel", desc: "Cabinetry, countertops, flooring, and layout changes, designed and built by one team." },
  { label: "Bathroom Remodel", href: "/services/expertise/bathroom-remodel", desc: "Tile, stone, vanities, and fixtures, from powder rooms to primary suites." },
  { label: "Backyard", href: "/services/expertise/backyard", desc: "Outdoor surfaces and living areas for Southern California homes." },
  { label: "Windows and Doors", href: "/services/expertise/windows-and-doors", desc: "Replacement windows and doors, planned and installed by one team." },
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
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>Residential and commercial projects, handled by the same team from pre-construction through warranty.</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-8) 0", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
            {ITEMS.map((item) => (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--s-5) 0", borderBottom: "1px solid var(--line)", color: "var(--text)", textDecoration: "none", fontSize: "var(--t-body-lg)", fontFamily: "var(--font-body)" }}>
                <span>
                  <span style={{ display: "block" }}>{item.label}</span>
                  <span style={{ display: "block", fontSize: "var(--t-body)", color: "var(--text-muted)", marginTop: 4 }}>{item.desc}</span>
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "var(--t-body)" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

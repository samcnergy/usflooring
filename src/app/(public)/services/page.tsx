import Link from "next/link";

export const metadata = {
  title: "Services — US Floor Design Center",
  description: "Full design-build projects, room and finish renovations, professional planning, and aftercare. Orange County's complete kitchen and bath studio.",
};

const TIERS = [
  {
    label: "Full design-build",
    headline: "Complete renovation, one team.",
    description: "For projects that start with a blank slate or major structural changes. We handle everything from design and permitting through final installation — one accountable team, no handoffs.",
    services: [
      "Whole-home renovation",
      "Complete kitchen remodeling",
      "Complete bathroom remodeling",
      "Structural layout changes",
      "Multigenerational and aging-in-place renovation",
    ],
    cta: { label: "Start a design-build project", href: "/request-a-visit?type=design-build" },
    accent: "var(--pub-forest)",
    accentText: "var(--pub-stone)",
  },
  {
    label: "Room and finish projects",
    headline: "Update the room without rebuilding it.",
    description: "For projects where the layout stays but the surfaces change. New cabinets, countertops, flooring, or tile — each with installation by our own crew.",
    services: [
      "Cabinets and cabinet installation",
      "Countertops",
      "Flooring",
      "Tile and backsplashes",
      "Vanities",
      "Kitchen and bathroom refresh packages",
    ],
    cta: { label: "Request a room refresh", href: "/request-a-visit?type=refresh" },
    accent: "var(--pub-ink)",
    accentText: "var(--pub-stone)",
  },
  {
    label: "Professional planning",
    headline: "Get clarity before you commit.",
    description: "Not ready to start construction? Book a planning session to understand the scope, see the options, and get a proposal before any materials are ordered.",
    services: [
      "In-home design consultation",
      "Space planning and layout",
      "3D visualization",
      "Material and color consultation",
      "Pre-purchase remodeling assessment",
    ],
    cta: { label: "Schedule a planning session", href: "/request-a-visit?type=planning" },
    accent: "var(--pub-brass)",
    accentText: "#fff",
  },
  {
    label: "Aftercare",
    headline: "We stand behind the work.",
    description: "Every completed project comes with a written warranty and a direct line to us — not a call center. For clients who want ongoing coverage, an optional annual home-care plan is available.",
    services: [
      "Written warranty on all projects",
      "Product warranty coordination",
      "Post-project inspection",
      "Priority service response",
      "Optional annual home-care plan",
    ],
    cta: { label: "Learn about our warranty", href: "/request-a-visit?type=warranty" },
    accent: "var(--pub-muted)",
    accentText: "#fff",
  },
];

const SPECIALIZATIONS = [
  {
    label: "Aging-in-place and multigenerational",
    desc: "Grab bars, curbless showers, wider doorways, and layout changes that work for every stage of life — without looking institutional.",
  },
  {
    label: "Condo and HOA-coordinated remodeling",
    desc: "We handle the HOA submission paperwork, coordinate access with building management, and schedule work to comply with noise and hours restrictions.",
  },
  {
    label: "Water-efficient and energy-conscious",
    desc: "Low-flow fixtures, insulated panels, and material selections that reduce utility costs — with documentation for rebate applications where applicable.",
  },
  {
    label: "Indoor/outdoor integration",
    desc: "Continuous flooring from interior to exterior, covered outdoor kitchens, and transition details that hold up to California weather.",
  },
  {
    label: "Pre-purchase remodeling assessment",
    desc: "Before you close on a home, we walk the property and give you a realistic scope and cost range for the changes you are planning — so you can negotiate or budget accordingly.",
  },
  {
    label: "Post-remodel home care",
    desc: "An optional annual visit to inspect grout, caulk, and finish conditions — and address small issues before they become expensive ones.",
  },
  {
    label: "Refresh packages",
    desc: "A defined scope at a fixed price range: paint, hardware, lighting, and a few new surfaces. For clients who want a meaningful update without a full renovation.",
  },
];

const CONSULTATION_TYPES = [
  {
    name: "Showroom discovery",
    format: "In-store · 60 min",
    deliverable: "Product direction and initial budget range",
    cost: "Complimentary",
  },
  {
    name: "In-home measurement",
    format: "At the property · 90 min",
    deliverable: "Measurements, site assessment, and scope review",
    cost: "Contact for pricing",
  },
  {
    name: "Complete design package",
    format: "Showroom + property",
    deliverable: "Layout, 3D visualization, finish schedule, and full project proposal",
    cost: "Contact for pricing",
  },
];

export default function ServicesPage() {
  return (
    <div>

      {/* Page header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Services</div>
            <h1 style={{
              fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
              lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "16ch", marginBottom: 20,
            }}>
              Find the right level of service for your project.
            </h1>
            <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "52ch" }}>
              A $3,000 flooring job and a $150,000 whole-home renovation both deserve a clear path. These four tiers are designed so any customer can immediately see what fits their situation.
            </p>
          </div>
        </div>
      </div>

      {/* Service tiers */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          {TIERS.map((tier, i) => (
            <div key={tier.label} style={{
              display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64,
              padding: "72px 0",
              borderBottom: i < TIERS.length - 1 ? "1px solid var(--pub-line)" : "none",
              alignItems: "start",
            }}>
              {/* Left column */}
              <div>
                <div style={{
                  display: "inline-block", fontSize: 11, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                  background: tier.accent, color: tier.accentText,
                  padding: "4px 10px", borderRadius: 2, marginBottom: 20,
                }}>
                  {tier.label}
                </div>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 28,
                  color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 14,
                }}>
                  {tier.headline}
                </h2>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.7, marginBottom: 28, maxWidth: "32ch" }}>
                  {tier.description}
                </p>
                <Link href={tier.cta.href} style={{
                  display: "inline-block",
                  background: "var(--pub-forest)", color: "var(--pub-stone)",
                  fontSize: 13, padding: "12px 22px", textDecoration: "none", borderRadius: 2,
                }}>
                  {tier.cta.label}
                </Link>
              </div>

              {/* Right column — service list */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                paddingTop: 8,
              }}>
                {tier.services.map((s) => (
                  <div key={s} style={{
                    padding: "18px 20px", border: "1px solid var(--pub-line)", borderRadius: 2,
                    fontSize: 15, color: "var(--pub-ink)", lineHeight: 1.45,
                    display: "flex", alignItems: "flex-start", gap: 10,
                  }}>
                    <span style={{ color: "var(--pub-brass)", flexShrink: 0, marginTop: 2 }}>&#10003;</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Specializations</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 14 }}>
                  Situations that require a different approach.
                </h2>
                <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "30ch" }}>
                  These are not separate service lines — they are capabilities we bring to any project that needs them.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {SPECIALIZATIONS.map((s) => (
                  <div key={s.label} style={{
                    padding: "22px 24px", background: "#fff",
                    border: "1px solid var(--pub-line)", borderRadius: 2,
                  }}>
                    <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 8, lineHeight: 1.35 }}>
                      {s.label}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.65, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation types */}
      <div style={{ background: "var(--pub-ink)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Professional planning</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
              <div>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30,
                  color: "var(--pub-stone)", lineHeight: 1.3, marginBottom: 14,
                }}>
                  Three consultation types. Each one has a defined deliverable.
                </h2>
                <p style={{ fontSize: 15, color: "rgba(241,238,231,0.65)", lineHeight: 1.7 }}>
                  Not a vague "get a quote" — each consultation has a format, a time commitment, a specific deliverable, and a clear next step.
                </p>
              </div>
              <div>
                {CONSULTATION_TYPES.map((c, i) => (
                  <div key={c.name} style={{
                    padding: "24px 0",
                    borderBottom: i < CONSULTATION_TYPES.length - 1 ? "1px solid rgba(241,238,231,0.15)" : "none",
                    display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: 24, alignItems: "start",
                  }}>
                    <div>
                      <div style={{ fontFamily: "var(--pub-serif)", fontSize: 18, color: "var(--pub-stone)", marginBottom: 4 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(241,238,231,0.45)", letterSpacing: "0.04em" }}>
                        {c.format}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: "rgba(241,238,231,0.7)", lineHeight: 1.6, margin: 0 }}>
                      {c.deliverable}
                    </p>
                    <div style={{ fontSize: 14, color: "var(--pub-brass)", fontWeight: 500 }}>
                      {c.cost}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 32 }}>
                  <Link href="/request-a-visit" style={{
                    display: "inline-block",
                    background: "var(--pub-stone)", color: "var(--pub-forest)",
                    fontSize: 14, fontWeight: 500, padding: "13px 24px",
                    textDecoration: "none", borderRadius: 2,
                  }}>
                    Schedule a consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

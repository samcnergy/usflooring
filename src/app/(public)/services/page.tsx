import Link from "next/link";

export const metadata = {
  title: "Services | US Floor Design Center",
  description: "Design, remodel, delivery, and warranty - one team from first conversation to finished project. Orange County kitchen and bath specialists.",
};

const SERVICES = [
  {
    id: "design",
    label: "Design",
    headline: "We figure out what you actually want before anything is ordered.",
    body: "Every project starts in the showroom. You walk through real materials - tile, stone, cabinet doors, flooring - and our designers help you narrow it down. We do space planning, layout drawings, and 3D visualization so you can see the finished room before construction begins. No guessing. No surprises when the samples arrive.",
    details: [
      "In-showroom material consultation",
      "Space planning and layout drawings",
      "3D visualization of the finished space",
      "Finish schedule and material selection",
      "Full project proposal before anything is ordered",
    ],
  },
  {
    id: "remodel",
    label: "Remodel",
    headline: "Our crew does the work. No handoffs to subcontractors you have never met.",
    body: "We handle kitchens, bathrooms, and every surface in between - flooring, tile, countertops, cabinets, vanities, and backsplashes. Whether the layout is staying the same or changing completely, the same team that designed it is the one installing it. That is the only way to hold both accountable.",
    details: [
      "Complete kitchen and bathroom remodeling",
      "Flooring installation",
      "Tile and backsplash",
      "Cabinets and countertops",
      "Structural layout changes when needed",
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    headline: "One point of contact from permit to punch list.",
    body: "We coordinate everything - scheduling, material lead times, permit submissions, and site access. You get one person to call, not a chain of contractors pointing at each other. We set a timeline at the start, communicate when things shift, and do not consider the job done until the space is clean and complete.",
    details: [
      "Project scheduling and timeline management",
      "Permit coordination where required",
      "Material sourcing and delivery logistics",
      "Single point of contact throughout",
      "Final walkthrough before handoff",
    ],
  },
  {
    id: "warranty",
    label: "Warranty",
    headline: "Written warranty on every project. A direct line when something needs attention.",
    body: "Every completed project comes with a written warranty covering our workmanship. If something is not right, you call us - not a call center, not a different contractor. We also coordinate product warranties from the manufacturers we work with. For clients who want ongoing coverage, an optional annual inspection is available to catch small issues before they become expensive ones.",
    details: [
      "Written workmanship warranty on all projects",
      "Manufacturer warranty coordination",
      "Post-project inspection walkthrough",
      "Direct contact - no third-party service routing",
      "Optional annual home-care inspection",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}>
                Services
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--t-h1)",
              lineHeight: 1.10,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              marginBottom: "var(--s-5)",
            }}>
              We handle every phase of a renovation, from the first showroom conversation to the written warranty when the job is done.
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "56ch" }}>
              One team. One point of contact. Design, materials, installation, and post-project support - all under one roof in Orange County.
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed kitchen photo */}
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services-kitchen.png"
          alt="Kitchen remodel by US Floor Design Center"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "var(--surface-scrim)",
          opacity: 0.45,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "flex-end",
        }}>
          <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: `0 var(--gutter) var(--s-7)`, width: "100%" }}>
            <p style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              fontWeight: 400,
              lineHeight: 1.14,
              color: "var(--text-invert)",
              maxWidth: "32ch",
              margin: 0,
            }}>
              From the first sketch to the finished room - one team, one point of contact.
            </p>
          </div>
        </div>
      </div>

      {/* Four service sections */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.label}
              id={s.id}
              style={{
                display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "var(--s-10)",
                padding: "var(--s-9) 0",
                borderBottom: i < SERVICES.length - 1 ? "1px solid var(--line)" : "none",
                alignItems: "start",
              }}
            >
              {/* Left */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
                  <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                  <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {s.label}
                  </span>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "var(--t-h2)",
                  color: "var(--text)",
                  lineHeight: 1.14,
                  letterSpacing: "-0.01em",
                  marginBottom: "var(--s-5)",
                }}>
                  {s.headline}
                </h2>
                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, margin: 0 }}>
                  {s.body}
                </p>
              </div>

              {/* Right - detail list */}
              <div style={{ paddingTop: "var(--s-9)" }}>
                {s.details.map((d, j) => (
                  <div
                    key={d}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: "var(--s-4)",
                      padding: "var(--s-4) 0",
                      borderBottom: j < s.details.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <span style={{ color: "var(--red)", fontSize: "var(--t-label)", flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    <span style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.35 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{
            padding: "var(--s-9) 0", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            gap: "var(--s-6)", flexWrap: "wrap",
          }}>
            <div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "var(--t-h2)",
                color: "var(--text-invert)",
                lineHeight: 1.14,
                letterSpacing: "-0.01em",
                marginBottom: "var(--s-4)",
              }}>
                Ready to start?
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "44ch", margin: 0 }}>
                Come into the showroom or request a visit. The first conversation is free and there is no obligation to proceed.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--red)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                textDecoration: "none",
                borderRadius: "var(--radius)",
                whiteSpace: "nowrap",
              }}>
                Plan a visit
              </Link>
              <Link href="/shop" style={{
                display: "inline-block",
                border: "1px solid var(--line-invert)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                textDecoration: "none",
                borderRadius: "var(--radius)",
                whiteSpace: "nowrap",
              }}>
                Browse materials
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

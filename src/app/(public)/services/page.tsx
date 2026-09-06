import Link from "next/link";

export const metadata = {
  title: "Services | US Floor Design Center",
  description: "Design, remodel, delivery, and warranty - one team from first conversation to finished project. Orange County kitchen and bath specialists.",
};

const SERVICES = [
  {
    number: "01",
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
    number: "02",
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
    number: "03",
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
    number: "04",
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
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Services</div>
            <h1 style={{
              fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
              lineHeight: 1.15, color: "var(--pub-ink)", whiteSpace: "nowrap", marginBottom: 20,
            }}>
              Design. Remodel. Delivery. Warranty.
            </h1>
            <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "50ch" }}>
              Four phases. One team. We handle every part of a renovation - from the first conversation in the showroom to the written warranty when the job is done.
            </p>
          </div>
        </div>
      </div>

      {/* Full-bleed kitchen photo */}
      <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/project-modern-kitchen.png"
          alt="Modern kitchen remodel by US Floor Design Center"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(30,35,32,0.15) 0%, rgba(30,35,32,0.55) 100%)",
          display: "flex", alignItems: "flex-end",
        }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px 48px", width: "100%" }}>
            <p style={{ fontFamily: "var(--pub-serif)", fontSize: 22, color: "#F1EEE7", lineHeight: 1.3, maxWidth: "32ch", margin: 0 }}>
              From the first sketch to the finished room - one team, one point of contact.
            </p>
          </div>
        </div>
      </div>

      {/* Four service sections */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.label}
              style={{
                display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 80,
                padding: "80px 0",
                borderBottom: i < SERVICES.length - 1 ? "1px solid var(--pub-line)" : "none",
                alignItems: "start",
              }}
            >
              {/* Left */}
              <div>
                <div style={{
                  fontFamily: "var(--pub-serif)", fontSize: 64, color: "var(--pub-line)",
                  lineHeight: 1, marginBottom: 16,
                }}>
                  {s.number}
                </div>
                <div style={{
                  fontFamily: "var(--pub-serif)", fontSize: 64, fontWeight: 400,
                  color: "var(--pub-ink)", lineHeight: 1, marginBottom: 20,
                }}>
                  {s.label}
                </div>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26,
                  color: "var(--pub-ink)", lineHeight: 1.35, marginBottom: 16,
                }}>
                  {s.headline}
                </h2>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.75, margin: 0 }}>
                  {s.body}
                </p>
              </div>

              {/* Right - detail list */}
              <div style={{ paddingTop: 90 }}>
                {s.details.map((d, j) => (
                  <div
                    key={d}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 16,
                      padding: "18px 0",
                      borderBottom: j < s.details.length - 1 ? "1px solid var(--pub-line)" : "none",
                    }}
                  >
                    <span style={{ color: "var(--pub-brass)", fontSize: 13, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    <span style={{ fontSize: 15, color: "var(--pub-ink)", lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--pub-ink)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            padding: "80px 0", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            gap: 32, flexWrap: "wrap",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30,
                color: "var(--pub-stone)", lineHeight: 1.3, marginBottom: 10,
              }}>
                Ready to start?
              </p>
              <p style={{ fontSize: 15, color: "rgba(241,238,231,0.65)", lineHeight: 1.7, maxWidth: "44ch", margin: 0 }}>
                Come into the showroom or request a visit. The first conversation is free and there is no obligation to proceed.
              </p>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--pub-stone)", color: "var(--pub-forest)",
                fontSize: 14, fontWeight: 500, padding: "14px 28px",
                textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap",
              }}>
                Plan a visit
              </Link>
              <Link href="/shop" style={{
                display: "inline-block",
                border: "1px solid rgba(241,238,231,0.3)", color: "var(--pub-stone)",
                fontSize: 14, padding: "14px 28px",
                textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap",
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

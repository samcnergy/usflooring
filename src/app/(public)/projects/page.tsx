import Link from "next/link";

export const metadata = {
  title: "Projects | US Floor Design Center",
  description: "Real kitchens and bathrooms designed and built by our team in Orange County. See the before, the process, and the finished result.",
};

const DISCOVERY_PACKAGE = [
  { item: "In-home measurement", detail: "We measure the space, document what's there, and identify any structural constraints before any product is specified." },
  { item: "Needs and lifestyle assessment", detail: "A structured conversation about how the room is actually used, who uses it, and what's not working about the current layout." },
  { item: "Preliminary layout", detail: "A scaled drawing of the proposed floor plan showing cabinet runs, appliance placement, and traffic flow." },
  { item: "Product direction", detail: "Specific material and finish recommendations from our showroom - not a general style board but actual products at real price points." },
  { item: "Investment range", detail: "A written cost range broken down by phase - materials, labor, permitting - so you know what you are committing to before anything is ordered." },
  { item: "Preliminary schedule", detail: "A project timeline showing lead times, installation sequence, and expected completion window." },
  { item: "3D concept", detail: "A rendered view of the proposed design so you can see the finished room before a single cabinet is ordered." },
  { item: "Credit toward construction", detail: "The full discovery fee is credited toward the construction contract if you proceed with us." },
];

const CASE_STUDIES = [
  {
    id: "rsm-kitchen-2024",
    city: "Rancho Santa Margarita",
    homeStyle: "1990s California tract home",
    title: "A closed kitchen opened to the living room",
    objective: "The owners wanted to remove the wall between the kitchen and family room, relocate the range, and replace all surfaces with a transitional finish package.",
    investmentRange: "$85,000 – $110,000",
    duration: { planned: "10 weeks", actual: "11 weeks" },
    scope: "Full design-build - structural, plumbing relocation, cabinetry, countertops, flooring, and appliances.",
    designNote: "We discovered during measurement that the wall contained a structural beam. Relocating the beam added three weeks of lead time for the engineer, which is why actual duration exceeded the plan. The client was informed at the discovery phase before any construction began.",
    materials: ["Custom shaker cabinets - painted white", "Calacatta quartz countertops", "Large-format porcelain tile floor", "White oak island with waterfall edge"],
    testimonial: {
      quote: "The discovery package was the best money we spent on this project. We knew exactly what we were getting into before we signed anything.",
      name: "M. and D. T.",
      city: "Rancho Santa Margarita",
    },
  },
  {
    id: "mv-primary-bath-2024",
    city: "Mission Viejo",
    homeStyle: "2005 planned community",
    title: "Primary bath converted from builder standard to spa layout",
    objective: "Replace the original builder-grade finishes, relocate the shower to allow a larger footprint, and add a freestanding soaking tub.",
    investmentRange: "$42,000 – $58,000",
    duration: { planned: "6 weeks", actual: "6 weeks" },
    scope: "Room and finish with plumbing relocation - tile, shower glass, vanity, freestanding tub, and fixture replacement.",
    designNote: "The preliminary layout identified that relocating the shower drain only 18 inches allowed the shower to gain 12 square feet without touching the exterior wall. That detail, caught at measurement, avoided a much larger structural scope.",
    materials: ["Bouquet Canyon limestone-look tile", "Freestanding soaking tub - matte white", "Floating double vanity - walnut", "Matte black fixtures throughout"],
    testimonial: {
      quote: "They found an issue with the original plumbing that two other contractors missed. The discovery process more than paid for itself.",
      name: "K. and J. R.",
      city: "Mission Viejo",
    },
  },
];

export default function ProjectsPage() {
  return (
    <div>

      {/* Page header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Projects</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "14ch",
              }}>
                Real rooms. Real numbers. Real results.
              </h1>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "48ch", paddingBottom: 4 }}>
                Every case study on this page shows the original problem, what we found during the design phase, the decisions we made together, and what the project actually cost and took. No stock photography. No ranges so wide they are meaningless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case studies */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          {CASE_STUDIES.map((cs, i) => (
            <div key={cs.id} style={{
              padding: "72px 0",
              borderBottom: "1px solid var(--pub-line)",
            }}>
              {/* Study header */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 11, color: "var(--pub-brass)", letterSpacing: "0.08em",
                  textTransform: "uppercase", border: "1px solid var(--pub-line)",
                  padding: "3px 10px", borderRadius: 2,
                }}>
                  {cs.city}
                </span>
                <span style={{
                  fontSize: 11, color: "var(--pub-muted)", letterSpacing: "0.08em",
                  textTransform: "uppercase", border: "1px solid var(--pub-line)",
                  padding: "3px 10px", borderRadius: 2,
                }}>
                  {cs.homeStyle}
                </span>
              </div>

              <h2 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 32,
                color: "var(--pub-ink)", lineHeight: 1.25, marginBottom: 32,
                maxWidth: "22ch",
              }}>
                {cs.title}
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>

                {/* Before / after placeholder */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {["Before", "After"].map((label) => (
                    <div key={label}>
                      <div style={{
                        aspectRatio: "4/3", background: label === "Before"
                          ? "linear-gradient(135deg,#C8C0B0 0%,#B8B0A0 100%)"
                          : "linear-gradient(135deg,#D4A870 0%,#EDE6D6 100%)",
                        borderRadius: 2, marginBottom: 8,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 12, color: "rgba(30,35,32,0.4)", letterSpacing: "0.06em" }}>
                          {label.toUpperCase()} PHOTO
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--pub-muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Project details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Client objective
                    </div>
                    <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.65, margin: 0 }}>{cs.objective}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Scope
                    </div>
                    <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.65, margin: 0 }}>{cs.scope}</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Investment range
                      </div>
                      <div style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-ink)" }}>
                        {cs.investmentRange}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Duration
                      </div>
                      <div style={{ fontSize: 14, color: "var(--pub-ink)", lineHeight: 1.5 }}>
                        Planned: {cs.duration.planned}<br />
                        Actual: {cs.duration.actual}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design note - the value of the discovery phase */}
              <div style={{
                marginTop: 36, padding: "24px 28px",
                background: "rgba(169,134,63,0.07)", border: "1px solid rgba(169,134,63,0.25)",
                borderRadius: 2,
              }}>
                <div style={{ fontSize: 11, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Found during the design phase
                </div>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.65, margin: 0 }}>{cs.designNote}</p>
              </div>

              {/* Materials and testimonial */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginTop: 36 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                    Materials selected
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {cs.materials.map((m) => (
                      <li key={m} style={{ fontSize: 14, color: "var(--pub-ink)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--pub-brass)", flexShrink: 0 }}>&#10003;</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  padding: "24px", background: "var(--pub-stone)",
                  border: "1px solid var(--pub-line)", borderRadius: 2,
                }}>
                  <p style={{ fontFamily: "var(--pub-serif)", fontSize: 18, color: "var(--pub-ink)", lineHeight: 1.6, margin: "0 0 14px", fontStyle: "italic" }}>
                    &ldquo;{cs.testimonial.quote}&rdquo;
                  </p>
                  <p style={{ fontSize: 13, color: "var(--pub-muted)", margin: 0 }}>
                    {cs.testimonial.name} - {cs.testimonial.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Discovery Package */}
      <div style={{ background: "var(--pub-ink)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "80px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 72, alignItems: "start" }}>

              {/* Left - pitch */}
              <div>
                <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>
                  Design discovery package
                </div>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 32,
                  color: "var(--pub-stone)", lineHeight: 1.3, marginBottom: 18,
                }}>
                  The most expensive mistake in remodeling is skipping the planning.
                </h2>
                <p style={{ fontSize: 15, color: "rgba(241,238,231,0.7)", lineHeight: 1.75, marginBottom: 18 }}>
                  Every case study above contains at least one thing we found during measurement or design that changed the scope, the budget, or both. A client who does not go through a proper discovery phase finds those things after the crew is already on-site - when fixing them costs three times as much.
                </p>
                <p style={{ fontSize: 15, color: "rgba(241,238,231,0.7)", lineHeight: 1.75, marginBottom: 28 }}>
                  Our structured discovery package documents the space, assesses the real scope, and produces a set of deliverables you can take to any contractor. If you build with us, the full fee is credited toward construction.
                </p>
                <Link href="/request-a-visit?type=discovery" style={{
                  display: "inline-block",
                  background: "var(--pub-stone)", color: "var(--pub-forest)",
                  fontSize: 14, fontWeight: 500, padding: "14px 24px",
                  textDecoration: "none", borderRadius: 2,
                }}>
                  Schedule a discovery session
                </Link>
              </div>

              {/* Right - deliverables */}
              <div>
                <div style={{ fontSize: 12, color: "rgba(241,238,231,0.45)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                  What the package includes
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {DISCOVERY_PACKAGE.map((d, i) => (
                    <div key={d.item} style={{
                      padding: "20px 0",
                      borderBottom: i < DISCOVERY_PACKAGE.length - 1 ? "1px solid rgba(241,238,231,0.1)" : "none",
                      display: "grid", gridTemplateColumns: "1.1fr 1.6fr", gap: 24,
                    }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "var(--pub-brass)", flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                        <span style={{ fontSize: 15, color: "var(--pub-stone)", lineHeight: 1.45 }}>{d.item}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "rgba(241,238,231,0.55)", lineHeight: 1.65, margin: 0 }}>
                        {d.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 28, padding: "18px 22px",
                  border: "1px solid rgba(169,134,63,0.4)", borderRadius: 2,
                  background: "rgba(169,134,63,0.08)",
                }}>
                  <p style={{ fontSize: 14, color: "var(--pub-brass)", margin: 0, lineHeight: 1.6 }}>
                    <strong>Credit toward construction.</strong> The full discovery fee applies to your construction contract if you proceed with us. You are not paying for a sales pitch - you are paying for deliverables you own regardless of who builds the project.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

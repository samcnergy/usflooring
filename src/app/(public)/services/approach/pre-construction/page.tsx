import Link from "next/link";

export const metadata = {
  title: "Pre-construction | US Floor Design Center",
  description: "Plan the work before the work begins. Our pre-construction process turns an idea into a project that can be priced, scheduled, and carried out.",
};

const STEPS = [
  {
    name: "Project discovery",
    desc: "We discuss what you want to change, what matters most to you, your budget range, and your desired completion date. We also ask about access, occupancy, and any building or HOA requirements.",
  },
  {
    name: "Site review",
    desc: "We measure and review existing conditions relevant to the proposed work. If something needs further inspection or confirmation, we identify it before treating it as a settled part of the plan.",
  },
  {
    name: "Scope development",
    desc: "We document the work we expect to perform, the materials and services involved, and any items that remain undecided. We distinguish confirmed details from allowances or assumptions so you can see where the price may change.",
  },
  {
    name: "Budget and schedule planning",
    desc: "We consider product lead times, the order of work, required approvals, and the time needed for key decisions. We then review the proposed scope, budget, and schedule with you.",
  },
];

export default function PreConstructionPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Services · Approach
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>
              Pre-construction
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>
              Plan the Work Before the Work Begins
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>

          {/* Intro */}
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-4)" }}>
              Pre-construction is where we turn an idea into a project that can be priced, scheduled, and carried out. It gives us a chance to understand the space and resolve questions before materials are ordered or work is scheduled.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              The effort we put in here helps reduce surprises later. It also gives you a clearer picture of the choices that will shape the final cost and timeline.
            </p>
          </div>

          {/* Steps */}
          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-7)" }}>
              Our Pre-construction Process
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "var(--s-4)", alignItems: "start" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", color: "var(--red)", fontWeight: 400, lineHeight: 1, paddingTop: 3 }}>
                    {i + 1}
                  </span>
                  <div style={{ fontSize: "var(--t-body)", lineHeight: 1.6 }}>
                    <strong style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)" }}>{step.name}.</strong>{" "}
                    <span style={{ color: "var(--text-muted)" }}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What to expect */}
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>
              What You Can Expect
            </h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-4)" }}>
              At the end of pre-construction, you should understand the proposed work, the main cost drivers, the likely sequence of work, and the decisions needed to move ahead. We use that plan to guide design, purchasing, approvals, and project management.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>When this stage is complete.</strong>{" "}
              We move forward when the scope and planning assumptions have been reviewed with you and the next design or approval decisions are clear.
            </p>
          </div>

        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--s-6)", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text-invert)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-4)" }}>
                Ready to start?
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "44ch", margin: 0 }}>
                Come into the showroom or request a visit. The first conversation is free and there is no obligation to proceed.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{ display: "inline-block", background: "var(--red)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>
                Plan a visit
              </Link>
              <Link href="/services/approach" style={{ display: "inline-block", border: "1px solid var(--line-invert)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>
                Our Approach
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

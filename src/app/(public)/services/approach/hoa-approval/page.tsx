import Link from "next/link";

export const metadata = {
  title: "HOA Approval | US Floor Design Center",
  description: "Help navigating the HOA approval process. We organize the project information needed for the application and coordinate responses to project-related questions.",
};

const STEPS = [
  {
    name: "Identify the requirements",
    desc: "We ask for the current HOA guidelines and application materials. We review the requirements that relate to the proposed work and note any submission deadlines or restrictions.",
  },
  {
    name: "Prepare project documents",
    desc: "We assemble the information we are responsible for providing, which may include material details, specifications, drawings, or contractor information relevant to your application.",
  },
  {
    name: "Coordinate the submission",
    desc: "We work with you to confirm who must submit or sign the application, then track its status and respond to requests for project information.",
  },
  {
    name: "Review conditions of approval",
    desc: "If the HOA approves the project with conditions, we review how those conditions affect materials, access, work hours, cost, or schedule.",
  },
  {
    name: "Update the project plan",
    desc: "We document the approval and applicable conditions before scheduling work that depends on it.",
  },
];

export default function HoaApprovalPage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Services · Approach</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>HOA Approval</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>Help Navigating the Approval Process</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-4)" }}>
              If your property is governed by a homeowners association, your project may need approval before work begins. HOA rules can affect materials, appearance, installation methods, delivery access, work hours, and scheduling.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              We help organize the project information needed for the application and coordinate responses to project-related questions. The HOA makes the approval decision and controls its review timeline.
            </p>
          </div>

          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-7)" }}>Our HOA Coordination Process</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "var(--s-4)", alignItems: "start" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", color: "var(--red)", fontWeight: 400, lineHeight: 1, paddingTop: 3 }}>{i + 1}</span>
                  <div style={{ fontSize: "var(--t-body)", lineHeight: 1.6 }}>
                    <strong style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)" }}>{step.name}.</strong>{" "}
                    <span style={{ color: "var(--text-muted)" }}>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>What We Need From You</h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-5)" }}>
              Please provide the current HOA rules, application forms, contact information, and any correspondence you have already received. You may also need to sign forms, pay HOA fees, or communicate directly with the association where its rules require the owner to do so.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-5)" }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>Planning around HOA review.</strong>{" "}
              We include HOA review in the project schedule as early as possible. Because review periods and decisions are set by the association, we confirm the required authorization before proceeding with work that depends on its approval.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>When this stage is complete.</strong>{" "}
              HOA coordination is complete when the required decision has been documented and any approval conditions have been incorporated into the project plan.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--s-6)", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text-invert)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-4)" }}>Ready to start?</h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "44ch", margin: 0 }}>Come into the showroom or request a visit. The first conversation is free and there is no obligation to proceed.</p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{ display: "inline-block", background: "var(--red)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>Plan a visit</Link>
              <Link href="/services/approach" style={{ display: "inline-block", border: "1px solid var(--line-invert)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>Our Approach</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Delivery | US Floor Design Center",
  description: "From approved plan to finished project. We coordinate materials, the work included in your project, and the final handoff.",
};

const STEPS = [
  {
    name: "Confirm readiness",
    desc: "We verify the approved scope, material status, site access, and any conditions that must be met before work begins.",
  },
  {
    name: "Coordinate materials and work",
    desc: "We arrange the required deliveries and coordinate the project work in the planned sequence. If an availability or site issue changes that plan, we communicate the options.",
  },
  {
    name: "Review the result",
    desc: "Our team checks the completed work against the approved scope and records anything that needs additional attention.",
  },
  {
    name: "Walk through the project with you",
    desc: "We review the finished work together, answer your questions, and make a clear list of any remaining items.",
  },
  {
    name: "Close out the project",
    desc: "We track final items to resolution or an agreed completion plan, then provide applicable product, care, and warranty information.",
  },
];

export default function DeliveryPage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Services · Approach</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Delivery</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>From Approved Plan to Finished Project</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-4)" }}>
              Delivery is the point where planning becomes a finished result. We coordinate the arrival of approved materials, the work included in your project, and the final handoff so you know what has been completed and what comes next.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              A smooth delivery depends on details established earlier: accurate selections, a clear scope, a workable schedule, and access to the site. Our team checks those details before each major step.
            </p>
          </div>

          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-7)" }}>Our Delivery Process</h2>
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
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>What You Receive</h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-4)" }}>
              You receive a completed project based on the approved scope and a clear account of any remaining work. We also explain how to care for the finished surfaces and whom to contact if a question comes up later.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>When delivery is complete.</strong>{" "}
              Delivery is complete when the finished work has been reviewed with you and any final items have been resolved or documented with an agreed plan.
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

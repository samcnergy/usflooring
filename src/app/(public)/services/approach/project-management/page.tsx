import Link from "next/link";

export const metadata = {
  title: "Project Management | US Floor Design Center",
  description: "One team keeping the details connected. Our project management team coordinates and gives you a clear point of contact throughout the work.",
};

const STEPS = [
  {
    name: "Prepare the working plan",
    desc: "We confirm approved selections, material lead times, site access, required approvals, and the sequence of work. We identify the decisions needed from you before each stage begins.",
  },
  {
    name: "Coordinate the project team",
    desc: "We schedule the people and deliveries required for the work included in your project. We communicate the scope and relevant site conditions so the team is working from the same plan.",
  },
  {
    name: "Monitor progress and quality",
    desc: "We compare work in progress with the approved scope, follow up on open items, and adjust coordination when conditions change.",
  },
  {
    name: "Keep you updated",
    desc: "We tell you what has been completed, what is coming next, and whether a decision or action is needed from you.",
  },
  {
    name: "Document changes",
    desc: "If you request a change or an unforeseen condition affects the plan, we explain the proposed solution and its effect on cost and timing. Changes are documented for your approval before the changed work proceeds.",
  },
];

export default function ProjectManagementPage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Services · Approach</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Project Management</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>One Team Keeping the Details Connected</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-4)" }}>
              Even a well-designed project has moving parts. Materials must arrive at the right time. Work must happen in the right order. Questions need answers before they hold up progress.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Our project management team coordinates those details and gives you a clear point of contact throughout the work. We track the approved scope, communicate what is happening, and address issues as they arise.
            </p>
          </div>

          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-7)" }}>Our Project Management Process</h2>
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
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>A Clear Record From Start to Finish</h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-4)" }}>
              Your project record connects the scope, selections, approvals, schedule, and changes. It helps us answer questions quickly and keeps everyone aligned as the work moves toward completion.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>When this stage is complete.</strong>{" "}
              Project management continues through the final review. The work is ready for closeout when the approved scope has been completed and any remaining items have been identified.
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

import Link from "next/link";

export const metadata = {
  title: "Warranty | US Floor Design Center",
  description: "Support after the project is complete. Our team is here if you have a concern after completion and will help you understand the next step.",
};

const STEPS = [
  {
    name: "Review the concern",
    desc: "We gather the details and determine which part of the project or product is involved.",
  },
  {
    name: "Check applicable coverage",
    desc: "We review the agreement and relevant manufacturer information rather than assuming every concern has the same coverage.",
  },
  {
    name: "Determine the next step",
    desc: "When appropriate, we arrange an inspection, coordinate with the relevant provider, or explain the available resolution.",
  },
  {
    name: "Follow through",
    desc: "We communicate the outcome and record any work or guidance provided to close the request.",
  },
];

export default function WarrantyApproachPage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Services · Approach</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Warranty</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>Support After the Project Is Complete</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-4)" }}>
              Our relationship does not end at the final walkthrough. If you have a concern after completion, our team will help you understand the next step and review the coverage that applies to your project.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
              Warranty coverage may come from our project agreement, a product manufacturer, or another applicable provider. The terms, exclusions, and time limits depend on the specific work and products selected.
            </p>
          </div>

          {/* How to request */}
          <div style={{ maxWidth: "68ch", padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>How to Request Warranty Support</h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              Contact US Floor Design Center with your project information and a description of the concern. Photos and the location of the issue can help us review it more quickly. We will acknowledge the request, review the project record and applicable warranty terms, and let you know whether an inspection or additional information is needed.
            </p>
          </div>

          {/* Steps */}
          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-7)" }}>Our Warranty Review Process</h2>
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
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>Care Information Matters</h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-4)" }}>
              Proper care can help protect the appearance and performance of your new materials. At project closeout, we provide available care guidance for the products used. If you are unsure how to clean or maintain a surface, contact us before using a new product or treatment.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "var(--text)", fontWeight: 700 }}>Our goal.</strong>{" "}
              You should know whom to contact, what information we need, and what will happen after you submit a concern. We aim to make the review process clear and responsive.
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--s-6)", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text-invert)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-4)" }}>Have a concern?</h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "44ch", margin: 0 }}>Contact us with your project details. We will review the applicable coverage and tell you what happens next.</p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{ display: "inline-block", background: "var(--red)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>Contact us</Link>
              <Link href="/services/approach" style={{ display: "inline-block", border: "1px solid var(--line-invert)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>Our Approach</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

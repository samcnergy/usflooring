import Link from "next/link";

export const metadata = {
  title: "Our Approach | US Floor Design Center",
  description: "A clear path from idea to completion. Our in-house design and project management teams bring over 20 years of experience to every project.",
};

const STEPS = [
  {
    name: "Discover and plan",
    desc: "We learn what you want to accomplish, review the space, and identify your budget, schedule, and requirements.",
  },
  {
    name: "Design and decide",
    desc: "We develop the layout and material selections, check the practical details, and help you approve a clear scope.",
  },
  {
    name: "Coordinate and execute",
    desc: "We align materials, people, site access, and required approvals. Your project manager tracks progress and keeps you informed.",
  },
  {
    name: "Deliver and support",
    desc: "We review the finished work with you, address remaining items, and provide applicable care and warranty information.",
  },
];

export default function ApproachPage() {
  return (
    <div>
      <style>{`
        .approach-body {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: var(--s-10);
          padding: var(--s-9) 0;
          align-items: start;
          border-bottom: 1px solid var(--line);
        }
        @media (max-width: 768px) {
          .approach-body { grid-template-columns: 1fr; gap: var(--s-6); }
        }
      `}</style>

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
              Our Approach
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>
              A Clear Path From Idea to Completion
            </p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div className="approach-body">
            <div>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.55, marginBottom: "var(--s-5)" }}>
                A successful project takes more than the right materials. It takes good decisions at the right time, a realistic plan, and people who stay accountable for the details.
              </p>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.55, margin: 0 }}>
                At US Floor Design Center, our in-house design and project management teams bring over 20 years of experience to that work. We help you define the project, make selections, coordinate approvals and execution, and finish with a careful handoff. Our goal is to move your project forward efficiently while keeping cost and quality in view.
              </p>
            </div>

            {/* Steps */}
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-6)" }}>
                How Your Project Moves Forward
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
                {STEPS.map((step, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "var(--s-4)", alignItems: "start" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", color: "var(--red)", fontWeight: 400, lineHeight: 1, paddingTop: 3 }}>
                      {i + 1}
                    </span>
                    <div style={{ fontSize: "var(--t-body)", lineHeight: 1.55 }}>
                      <strong style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)" }}>{step.name}.</strong>{" "}
                      <span style={{ color: "var(--text-muted)" }}>{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "var(--t-small)", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "var(--s-5)", fontStyle: "italic" }}>
                The exact steps depend on your project. You will know what has been decided, what happens next, and what we need from you to keep things moving.
              </p>
            </div>
          </div>

          {/* How we manage */}
          <div style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)", maxWidth: "72ch" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)" }}>
              How We Manage Time, Cost, and Quality
            </h2>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "var(--s-4)" }}>
              Early planning helps us spot issues before they become delays. Confirmed selections help us order accurately. A documented scope helps everyone understand what is included. When a change affects the price or schedule, we explain it and obtain approval before moving forward with that change.
            </p>
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
              We believe the best project experience is one where you can make informed decisions without having to manage every detail yourself.
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
                Start With a Conversation
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "48ch", margin: 0 }}>
                Tell us about your space, your goals, and your timing. We will help you identify the first decisions and a practical path forward.
              </p>
            </div>
            <Link href="/request-a-visit" style={{ display: "inline-block", background: "var(--red)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>
              Plan a visit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

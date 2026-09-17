import Link from "next/link";

export const metadata = {
  title: "Medical Offices",
  description: "Design-build for medical offices in South Orange County, with federal ADA and California accessibility requirements, code, and phased work around an active practice planned from the start.",
};

const SECTIONS = [
  {
    heading: "What a Medical Office Project Requires",
    paragraphs: [
      "Exam rooms, reception areas, and treatment spaces each carry their own layout and code considerations. An exam room needs clearances that work for patients using mobility devices, not just the equipment inside it. A reception counter needs an accessible section. Parking, entrances, and paths of travel all have to connect into a single accessible route from the street to the chair. We build these details into the design from the start, rather than treating them as a checklist to satisfy at the end.",
    ],
  },
  {
    heading: "How We Approach Accessibility and Code Compliance",
    paragraphs: [
      "California applies its own accessibility standards on top of the federal ADA, and the two don't always match. Where they differ, we build to whichever standard provides greater access, because that is what the law requires. This covers exam room clearances and turning space, accessible parking and signage, entrances and door hardware, reception counters, and restroom fixtures.",
      "We also coordinate a Certified Access Specialist (CASp) inspection as part of a medical office project when appropriate. A CASp inspection gives a practice owner documented, third-party confirmation that the space meets applicable standards. That is a meaningful protection in a state where accessibility compliance is actively enforced and litigated.",
    ],
  },
  {
    heading: "Working Within Your Practice",
    paragraphs: [
      "Medical offices rarely have the luxury of starting from an empty shell. Many medical office projects happen around an active practice, with phased work, protected patient areas, and a schedule built around your hours, not ours. We plan access, noise, and dust containment as part of the project plan, not as an afterthought once work has started.",
    ],
  },
];

const h2 = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: "var(--t-h2)",
  color: "var(--text)",
  lineHeight: 1.14,
  letterSpacing: "-0.01em",
  marginBottom: "var(--s-5)",
};

const para = { fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 var(--s-4)" };

export default function MedicalOfficesPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Medical Offices</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-5)", maxWidth: "22ch" }}>
              A Practice Space Built for Patients, Staff, and Code
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "64ch", margin: 0 }}>
              A medical office has to work harder than most commercial spaces. It needs to feel calm and professional for patients, function efficiently for staff, and meet accessibility and building code requirements that don&apos;t apply to a typical retail buildout. We design and build medical office spaces with all three in view from the first conversation.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          {SECTIONS.map((section) => (
            <div key={section.heading} style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)", maxWidth: "72ch" }}>
              <h2 style={h2}>{section.heading}</h2>
              {section.paragraphs.map((text, i) => (
                <p key={i} style={{ ...para, marginBottom: i === section.paragraphs.length - 1 ? 0 : "var(--s-4)" }}>{text}</p>
              ))}
            </div>
          ))}

          {/* Process */}
          <div style={{ padding: "var(--s-8) 0", maxWidth: "72ch" }}>
            <h2 style={h2}>Our Process</h2>
            <p style={para}>
              Every medical office project follows the same Approach we use across all our work: pre-construction planning, design, coordinated project management, and delivery, adapted to the specific requirements of a clinical space.
            </p>
            <Link href="/services/approach" style={{ color: "var(--red)", fontFamily: "var(--font-body)", fontSize: "var(--t-body)", fontWeight: 700, textDecoration: "none" }}>
              See Our Approach &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--s-6)", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ ...h2, color: "var(--text-invert)", marginBottom: "var(--s-4)" }}>
                Start With a Conversation
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "56ch", margin: 0 }}>
                Tell us about your practice, your space, and your timeline. We&apos;ll help you understand what your project involves, from layout and accessibility requirements to the practical realities of building around a working office, and identify a clear path forward.
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

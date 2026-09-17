import Link from "next/link";

// Shared layout for Expertise detail pages: header, text sections,
// process link, and the "Start With a Conversation" closing band.

export type ExpertiseSection = {
  heading: string;
  paragraphs: string[];
  list?: { title: string; text: string }[];
};

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ExpertiseSection[];
  process: string;
  cta: string;
};

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

export default function ExpertiseArticle({ eyebrow, title, intro, sections, process, cta }: Props) {
  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>{eyebrow}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-5)", maxWidth: "24ch" }}>
              {title}
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "64ch", margin: 0 }}>
              {intro}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          {sections.map((section) => (
            <div key={section.heading} style={{ padding: "var(--s-8) 0", borderBottom: "1px solid var(--line)", maxWidth: "72ch" }}>
              <h2 style={h2}>{section.heading}</h2>
              {section.paragraphs.map((text, i) => (
                <p key={i} style={{ ...para, marginBottom: i === section.paragraphs.length - 1 && !section.list ? 0 : "var(--s-4)" }}>{text}</p>
              ))}
              {section.list && (
                <ol style={{ margin: 0, paddingLeft: "var(--s-5)", listStyle: "decimal", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                  {section.list.map((item) => (
                    <li key={item.title} style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.6, paddingLeft: "var(--s-2)" }}>
                      <strong style={{ color: "var(--text)", fontWeight: 600 }}>{item.title}</strong> {item.text}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}

          {/* Process */}
          <div style={{ padding: "var(--s-8) 0", maxWidth: "72ch" }}>
            <h2 style={h2}>Our Process</h2>
            <p style={para}>{process}</p>
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
                {cta}
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

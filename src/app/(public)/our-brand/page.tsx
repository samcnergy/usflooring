import Link from "next/link";

export const metadata = {
  title: "Our Brand",
  description: "Formerly US Floor, Kitchen & Bath, now US Floor Design Center: 30 years in the same Rancho Santa Margarita location, with design and construction under one roof.",
};

const label = {
  fontSize: "var(--t-label)",
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
};

const body = { fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.45, margin: "0 0 var(--s-4)" };

const LOGOS = [
  {
    era: "Then",
    name: "US Floor, Kitchen & Bath",
    src: "/brand/us-floor-kitchen-bath-logo.jpg",
    alt: "Former US Floor, Kitchen & Bath logo: a green house roofline over the letters US",
  },
  {
    era: "Now",
    name: "US Floor Design Center",
    src: "/US_FLOOR_Logo_Primary.svg",
    alt: "US Floor Design Center logo",
  },
];

export default function OurBrandPage() {
  return (
    <div>
      <style>{`
        .brand-logos { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-6); }
        .brand-story { display: grid; grid-template-columns: 1fr 1.6fr; gap: var(--s-10); align-items: start; }
        @media (max-width: 768px) {
          .brand-logos { grid-template-columns: 1fr; }
          .brand-story { grid-template-columns: 1fr; gap: var(--s-5); }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={label}>About Us</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Our Brand</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "56ch", margin: 0 }}>
              Thirty years at the same address. A new name, and a design team under the same roof.
            </p>
          </div>
        </div>
      </div>

      {/* Then and now */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter) var(--s-8)" }}>
          <div className="brand-logos">
            {LOGOS.map((logo) => (
              <figure key={logo.era} style={{ margin: 0, border: "1px solid var(--line)" }}>
                <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--s-6)", background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo.src} alt={logo.alt} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                </div>
                <figcaption style={{ borderTop: "1px solid var(--line)", padding: "var(--s-4) var(--s-5)", background: "var(--surface-alt)" }}>
                  <div style={label}>{logo.era}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", color: "var(--text)", marginTop: 4 }}>{logo.name}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div className="brand-story" style={{ padding: "var(--s-9) 0" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={label}>Our story</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", margin: 0 }}>
                Same address. Broader reach.
              </h2>
            </div>
            <div>
              <p style={body}>
                For 30 years, this business served Orange County from the same Rancho Santa Margarita location as US Floor, Kitchen &amp; Bath. Many clients still know us by the green house logo above.
              </p>
              <p style={body}>
                Today we operate as US Floor Design Center. We added a professional design team to the group, so clients can plan and build a professionally designed home or office with one team.
              </p>
              <p style={{ ...body, marginBottom: 0 }}>
                With most construction companies, you hire a designer separately and then hand the plans to a contractor. We brought design and construction under one roof, so the people who design your space are the same people accountable for building it.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--s-6)", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text-invert)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-4)" }}>
                Visit us at the same address.
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "48ch", margin: 0 }}>
                30092 Santa Margarita Pkwy, Suite G, Rancho Santa Margarita, CA 92688
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{ display: "inline-block", background: "var(--red)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>
                Plan a visit
              </Link>
              <Link href="/leadership" style={{ display: "inline-block", border: "1px solid var(--line-invert)", color: "var(--text-invert)", fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px", textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap" }}>
                Leadership
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

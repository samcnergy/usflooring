import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MARKETS, getMarket, OC_BUS, METROLINK, METHOD_SOURCES, type Source } from "../marketsData";

export const dynamicParams = false;

export function generateStaticParams() {
  return MARKETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMarket(slug);
  if (!m) return {};
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: `/services/markets/${m.slug}` },
  };
}

const label = {
  fontSize: "var(--t-label)",
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--text-muted)",
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

const h3 = {
  fontFamily: "var(--font-display)",
  fontWeight: 400,
  fontSize: "var(--t-h3)",
  color: "var(--text)",
  marginBottom: "var(--s-3)",
};

const body = { fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.45, margin: 0 };

const small = { fontSize: "var(--t-small)", color: "var(--text-muted)", lineHeight: 1.45 };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
      <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
      <span style={label}>{children}</span>
    </div>
  );
}

function SourceLink({ s }: { s: Source }) {
  return (
    <a href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}>
      {s.label}
    </a>
  );
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMarket(slug);
  if (!m) notFound();

  const stats = [
    { n: m.population.toLocaleString("en-US"), label: "Population", note: "2020 U.S. Census" },
    ...(m.medianIncome !== null
      ? [{ n: `$${m.medianIncome.toLocaleString("en-US")}`, label: "Median household income", note: "2020–2024 ACS estimate, in 2024 dollars" }]
      : []),
    { n: `~${m.milesToSNA} mi`, label: "To John Wayne Airport", note: "Approx. straight-line distance" },
    { n: `~${m.milesToLAX} mi`, label: "To LAX", note: "Approx. straight-line distance" },
  ];

  const others = MARKETS.filter((o) => o.slug !== m.slug);

  return (
    <div>
      <style>{`
        .mkt-section {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: var(--s-10);
          padding: var(--s-9) 0;
          align-items: start;
        }
        .mkt-stats { display: grid; grid-template-columns: repeat(${stats.length}, 1fr); }
        .mkt-stat { padding: var(--s-5) var(--s-5) var(--s-6); }
        .mkt-stat:first-child { padding-left: 0; }
        .mkt-stat + .mkt-stat { border-left: 1px solid var(--line); }
        .mkt-two { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-8); }
        .mkt-others { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--s-3) var(--s-6); }
        .mkt-others a:hover { color: var(--red); }
        @media (max-width: 960px) {
          .mkt-stats { grid-template-columns: 1fr 1fr; column-gap: var(--s-5); }
          .mkt-stat, .mkt-stat:first-child { padding: var(--s-4) 0 var(--s-5); }
          .mkt-stat + .mkt-stat { border-left: none; }
          .mkt-others { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .mkt-section { grid-template-columns: 1fr; gap: var(--s-6); }
          .mkt-two { grid-template-columns: 1fr; gap: var(--s-7); }
          .mkt-others { grid-template-columns: 1fr 1fr; }
          .mkt-photo { height: 260px !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <nav aria-label="Breadcrumb" style={{ padding: "var(--s-4) 0 0", fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/services" style={{ color: "inherit", textDecoration: "none" }}>Services</Link>
            <span>/</span>
            <Link href="/services/markets" style={{ color: "inherit", textDecoration: "none" }}>Markets</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>{m.name}</span>
          </nav>
          <div style={{ padding: "var(--s-8) 0" }}>
            <Eyebrow>Markets · {m.kind}</Eyebrow>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--t-h1)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              marginBottom: "var(--s-5)",
              maxWidth: "28ch",
            }}>
              {m.headline}
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "60ch", margin: 0 }}>
              {m.lede}
            </p>
          </div>
        </div>
      </div>

      {/* Optional photo band */}
      {m.image && (
        <div className="mkt-photo" style={{ position: "relative", height: 420, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.image.src}
            alt={m.image.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: m.image.position, display: "block" }}
          />
        </div>
      )}

      {/* At a glance */}
      <div style={{ borderTop: "1px solid var(--gold)", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <h2 style={{ ...label, padding: "var(--s-5) 0 0", margin: 0 }}>{m.name} at a glance</h2>
          <div className="mkt-stats">
            {stats.map((s, i) => (
              <div key={s.label} className="mkt-stat">
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.4vw, 40px)",
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: i === 0 ? "var(--gold)" : "var(--text)",
                  marginBottom: "var(--s-2)",
                }}>
                  {s.n}
                </div>
                <div style={{ ...label, color: "var(--text)" }}>{s.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>

          {/* Local character */}
          <div className="mkt-section" style={{ borderBottom: "1px solid var(--line)" }}>
            <div>
              <Eyebrow>The area</Eyebrow>
              <h2 style={h2}>{m.character.heading}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
              {m.character.paragraphs.map((p) => <p key={p} style={body}>{p}</p>)}
            </div>
          </div>

          {/* Planning checklist */}
          <div className="mkt-section" style={{ borderBottom: "1px solid var(--line)" }}>
            <div>
              <Eyebrow>Before you build</Eyebrow>
              <h2 style={h2}>{m.planning.heading}</h2>
              <p style={body}>{m.planning.intro}</p>
            </div>
            <div>
              {m.planning.checks.map((c, j) => (
                <div
                  key={c.title}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "var(--s-4)",
                    padding: "var(--s-5) 0",
                    borderBottom: j < m.planning.checks.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <span style={{ color: "var(--red)", fontSize: "var(--t-label)", flexShrink: 0, marginTop: 3 }}>&#10003;</span>
                  <div>
                    <h3 style={{ fontSize: "var(--t-body-lg)", color: "var(--text)", lineHeight: 1.35, fontWeight: 600, margin: "0 0 4px" }}>{c.title}</h3>
                    <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", lineHeight: 1.45, margin: 0 }}>{c.detail}</p>
                  </div>
                </div>
              ))}
              <p style={{ ...small, marginTop: "var(--s-5)", padding: "var(--s-4) var(--s-5)", background: "var(--surface-alt)", borderLeft: "2px solid var(--gold)" }}>
                Zoning, coastal, historic, and association requirements depend on the specific property and proposal. Treat this list as a starting point and confirm each item with the responsible agency or association.
              </p>
            </div>
          </div>

          {/* Schools and transit */}
          <div style={{ padding: "var(--s-9) 0" }}>
            <Eyebrow>Schools and getting around</Eyebrow>
            <div className="mkt-two">
              <div>
                <h3 style={h3}>Public schools</h3>
                <p style={body}>{m.schools}</p>
              </div>
              <div>
                <h3 style={h3}>Bus and rail</h3>
                <p style={body}>{m.transit}</p>
                <p style={{ ...small, marginTop: "var(--s-3)" }}>
                  Routes and schedules change: <SourceLink s={OC_BUS} /> · <SourceLink s={METROLINK} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local sources */}
      <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-7) var(--gutter)" }}>
          <div className="mkt-two">
            <div>
              <h2 style={{ ...label, marginBottom: "var(--s-4)" }}>Local sources</h2>
              <ul style={{ ...small, margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                {m.sources.map((s) => <li key={s.href}><SourceLink s={s} /></li>)}
              </ul>
            </div>
            <div>
              <h2 style={{ ...label, marginBottom: "var(--s-4)" }}>About these figures</h2>
              <p style={{ ...small, margin: 0 }}>
                Population is the April 1, 2020 U.S. Census count.{" "}
                {m.medianIncome !== null
                  ? "Median household income is the 2020–2024 American Community Survey estimate in 2024 dollars, as shown by Census QuickFacts."
                  : "Median household income is not shown because a reliable estimate is hard to present for a community this small."}{" "}
                These are not live counts. Airport distances are approximate straight-line miles from the community&rsquo;s geographic center, not driving distances or travel times. School assignment depends on the property address. Sources checked September 2026.
              </p>
              <p style={{ ...small, marginTop: "var(--s-3)" }}>
                Distance method:{" "}
                {METHOD_SOURCES.map((s, i) => (
                  <span key={s.href}>{i > 0 && " · "}<SourceLink s={s} /></span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other markets */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-7) var(--gutter)" }}>
          <h2 style={{ ...label, marginBottom: "var(--s-5)" }}>More South Orange County markets</h2>
          <div className="mkt-others">
            {others.map((o) => (
              <Link key={o.slug} href={`/services/markets/${o.slug}`} style={{ fontSize: "var(--t-body)", color: "var(--text)", textDecoration: "none", lineHeight: 1.4 }}>
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{
            padding: "var(--s-9) 0", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            gap: "var(--s-6)", flexWrap: "wrap",
          }}>
            <div>
              <h2 style={{ ...h2, color: "var(--text-invert)", marginBottom: "var(--s-4)" }}>
                Planning a project in {m.name}?
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, maxWidth: "48ch", margin: 0 }}>
                Visit the showroom in Rancho Santa Margarita or request a visit. The first conversation is free and there is no obligation to proceed.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block", background: "var(--red)", color: "var(--text-invert)",
                fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px",
                textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap",
              }}>
                Plan a visit
              </Link>
              <Link href="/services" style={{
                display: "inline-block", border: "1px solid var(--line-invert)", color: "var(--text-invert)",
                fontSize: "var(--t-btn)", fontFamily: "var(--font-body)", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase", padding: "14px 28px",
                textDecoration: "none", borderRadius: "var(--radius)", whiteSpace: "nowrap",
              }}>
                Our services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

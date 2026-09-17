import Link from "next/link";
import { MARKETS } from "./marketsData";

export const metadata = {
  title: "South Orange County Markets",
  description: "Local planning notes for 13 South Orange County communities, from Rancho Santa Margarita to San Clemente: area character, what to verify before a project, and sources.",
  alternates: { canonical: "/projects/markets" },
};

export default function MarketsIndexPage() {
  return (
    <div>
      <style>{`
        .mkt-grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); border-left: 1px solid var(--line); }
        .mkt-card { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: var(--s-6) var(--s-5); text-decoration: none; color: var(--text); display: flex; flex-direction: column; gap: var(--s-2); transition: background var(--dur) var(--ease); }
        .mkt-card:hover { background: var(--surface-alt); }
        .mkt-card:hover .mkt-card-arrow { color: var(--red); }
        @media (max-width: 960px) { .mkt-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .mkt-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <nav aria-label="Breadcrumb" style={{ padding: "var(--s-4) 0 0", fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 8 }}>
            <Link href="/projects" style={{ color: "inherit", textDecoration: "none" }}>Our Work</Link>
            <span>/</span>
            <span style={{ color: "var(--text)" }}>Markets</span>
          </nav>
          <div style={{ padding: "var(--s-8) 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Markets
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)",
              lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--text)",
              marginBottom: "var(--s-5)", maxWidth: "24ch",
            }}>
              South Orange County, one community at a time.
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "60ch", margin: 0 }}>
              Every community around our Rancho Santa Margarita showroom has its own history, planning documents, and neighborhood rules. These guides cover what sets each area apart and what to look into before a project begins.
            </p>
          </div>
        </div>
      </div>

      {/* Market grid */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-8) var(--gutter) var(--s-9)" }}>
          <div className="mkt-grid">
            {MARKETS.map((m) => (
              <Link key={m.slug} href={`/projects/markets/${m.slug}`} className="mkt-card">
                <span style={{ fontSize: "var(--t-label)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {m.kind}
                </span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", lineHeight: 1.2 }}>
                  {m.name}
                </span>
                <span style={{ fontSize: "var(--t-small)", color: "var(--text-muted)" }}>
                  Population {m.population.toLocaleString("en-US")} (2020 Census)
                </span>
                <span className="mkt-card-arrow" style={{ fontSize: "var(--t-small)", fontWeight: 700, color: "var(--text)", marginTop: "var(--s-2)", transition: "color var(--dur) var(--ease)" }}>
                  Read the guide &rarr;
                </span>
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "var(--t-small)", color: "var(--text-muted)", lineHeight: 1.45, marginTop: "var(--s-6)", maxWidth: "80ch" }}>
            Planning, coastal, historic, and association requirements are property-specific. These guides point to public sources to verify; they are not a determination for any address.
          </p>
        </div>
      </div>
    </div>
  );
}

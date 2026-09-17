import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: { absolute: "US Floor Design Center | Residential and Commercial Design-Build in South Orange County" },
  description: "Design-build for homes, medical offices, retail spaces, and investment properties across South Orange County, from pre-construction and HOA approval to delivery and warranty.",
};

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "US Floor Design Center",
  "url": "https://usfloordesign.com",
  "description": "Design-build firm in Rancho Santa Margarita, Orange County, serving homeowners, medical practices, retailers, and real estate investors across South Orange County.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://usfloordesign.com/shop?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
};

const APPROACH = [
  { name: "Pre-construction", href: "/services/approach/pre-construction", body: "Scope, budget, and schedule are worked out before work begins, so the project can be priced and planned with fewer surprises." },
  { name: "Design", href: "/services/approach/design", body: "In-house designers turn how the space needs to work into layouts, material selections, and a finish schedule." },
  { name: "HOA Approval", href: "/services/approach/hoa-approval", body: "We organize the project information an association asks for and coordinate responses to project-related questions." },
  { name: "Project Management", href: "/services/approach/project-management", body: "One point of contact keeps materials, trades, and timelines connected while the work is underway." },
  { name: "Delivery", href: "/services/approach/delivery", body: "From approved plan to finished space: material coordination, installation, and a final walkthrough before handoff." },
  { name: "Warranty", href: "/services/approach/warranty", body: "A written warranty and a direct line back to our team if anything needs attention after completion." },
];

const EXPERTISE = [
  { name: "Medical Offices", href: "/services/expertise/medical-offices", body: "Finish work for clinics, dental suites, and healthcare offices." },
  { name: "Retail Buildout", href: "/services/expertise/retail-buildout", body: "Interior buildouts and finishes for storefronts and commercial tenants." },
  { name: "Kitchen Remodel", href: "/services/expertise/kitchen-remodel", body: "Cabinetry, countertops, flooring, and layout changes." },
  { name: "Bathroom Remodel", href: "/services/expertise/bathroom-remodel", body: "Tile, stone, vanities, and fixtures, from powder rooms to primary suites." },
  { name: "Backyard", href: "/services/expertise/backyard", body: "Outdoor surfaces and living areas for Southern California homes." },
  { name: "Windows and Doors", href: "/services/expertise/windows-and-doors", body: "Replacement windows and doors." },
];

const MARKETS = [
  ["Rancho Santa Margarita", "rancho-santa-margarita"], ["Coto de Caza", "coto-de-caza"],
  ["San Juan Capistrano", "san-juan-capistrano"], ["San Clemente", "san-clemente"],
  ["Lake Forest", "lake-forest"], ["Laguna Niguel", "laguna-niguel"], ["Laguna Hills", "laguna-hills"],
  ["Laguna Beach", "laguna-beach"], ["Aliso Viejo", "aliso-viejo"], ["Mission Viejo", "mission-viejo"],
  ["Dana Point", "dana-point"], ["Ladera Ranch", "ladera-ranch"], ["Rancho Mission Viejo", "rancho-mission-viejo"],
];

const CONSULTATIONS = [
  { name: "Showroom discovery", format: "In-store", deliverable: "Product direction and initial budget range" },
  { name: "Site measurement", format: "At the property", deliverable: "Measurements and full project assessment" },
  { name: "Complete design package", format: "Showroom + property", deliverable: "Layout, visualization, finish schedule and project proposal" },
];

const PROJECT_TILES = [
  { label: "Complete Kitchen", href: "/shop?project=kitchen", swatch: "linear-gradient(135deg,#C9A87A 0%,#DDD0BB 50%,#A07850 100%)" },
  { label: "Primary Bathroom", href: "/shop?project=primary-bath", swatch: "linear-gradient(135deg,#C8D8DC 0%,#E8E4DF 50%,#A8B8B8 100%)" },
  { label: "Guest Bathroom", href: "/shop?project=guest-bath", swatch: "linear-gradient(135deg,#D8D0C8 0%,#E8E4DE 50%,#B8B0A8 100%)" },
  { label: "Powder Room", href: "/shop?project=powder-room", swatch: "linear-gradient(135deg,#C8C4BE 0%,#E0DCD6 50%,#A8A49E 100%)" },
  { label: "Whole-Home Flooring", href: "/shop?project=flooring", swatch: "linear-gradient(135deg,#D4A870 0%,#C89858 50%,#8B5E30 100%)" },
  { label: "Laundry Room", href: "/shop?project=laundry", swatch: "linear-gradient(135deg,#D0D4D8 0%,#E4E8EC 50%,#B0B8C0 100%)" },
  { label: "Fireplace", href: "/shop?project=fireplace", swatch: "linear-gradient(135deg,#8C7868 0%,#C0A890 50%,#5C4838 100%)" },
  { label: "Outdoor Living", href: "/shop?project=outdoor", swatch: "linear-gradient(135deg,#8A9E78 0%,#C4CDB8 50%,#5A7048 100%)" },
];

export default function HomePage() {
  return (
    <div>
      <style>{`
        .hero-panel {
          width: 42%;
          background: var(--surface-scrim);
          padding: var(--s-7);
          border-bottom: 1px solid var(--gold);
        }
        .spec-bar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .article-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: var(--s-8);
          align-items: center;
          text-decoration: none;
        }
        .project-tiles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--s-4);
        }
        .process-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border-top: 1px solid var(--line);
          border-left: 1px solid var(--line);
        }
        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--line);
          border-left: 1px solid var(--line);
        }
        .expertise-card {
          display: block;
          padding: var(--s-6) var(--s-5);
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          text-decoration: none;
          transition: background var(--dur) var(--ease);
        }
        .expertise-card:hover { background: var(--surface-alt); }
        .expertise-card:hover .card-arrow { color: var(--red); }
        .process-card { display: block; text-decoration: none; transition: background var(--dur) var(--ease); }
        .process-card:hover { background: var(--surface); }
        .markets-list { display: flex; flex-wrap: wrap; gap: var(--s-2) var(--s-3); }
        .markets-list a {
          font-size: var(--t-small);
          color: var(--text-invert);
          text-decoration: none;
          border: 1px solid var(--line-invert);
          padding: 8px 14px;
          transition: border-color var(--dur) var(--ease);
        }
        .markets-list a:hover { border-color: var(--text-invert); }
        .consultation-row {
          padding: var(--s-5) 0;
          border-bottom: 1px solid var(--line-invert);
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: var(--s-7);
          align-items: start;
        }
        @media (max-width: 1100px) {
          .hero-panel { width: 60%; }
          .expertise-grid { grid-template-columns: repeat(2, 1fr); }
          .process-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .hero-panel {
            width: 100%;
          }
          .spec-bar-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .spec-bar-grid > div:nth-child(2n+1) {
            border-left: none;
          }
          .spec-bar-grid > div:nth-child(n+3) {
            border-top: 1px solid var(--line);
          }
          .article-grid {
            grid-template-columns: 1fr;
          }
          .article-grid > div:last-child {
            display: none;
          }
          .project-tiles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .process-grid {
            grid-template-columns: 1fr;
          }
          .expertise-grid {
            grid-template-columns: 1fr;
          }
          .consultation-row {
            grid-template-columns: 1fr;
            gap: var(--s-3);
          }
        }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: 720, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/project-modern-kitchen.png"
          alt="Modern kitchen interior by US Floor Design Center"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Nav legibility gradient: darkens the top of the hero behind the sticky nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to bottom, rgba(10,10,10,0.60) 0%, transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "var(--container)", width: "100%", margin: "0 auto", padding: "0 var(--gutter)" }}>
            <div className="hero-panel">
              <div style={{ width: 48, height: 2, background: "var(--red)", marginBottom: "var(--s-5)" }} />
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-hero)",
                fontWeight: 400,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "var(--text-invert)",
                marginBottom: "var(--s-4)",
              }}>
                Design-build across South Orange County.
              </h1>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-h3)",
                fontWeight: 400,
                lineHeight: 1.25,
                color: "var(--text-invert)",
                marginBottom: "var(--s-5)",
              }}>
                Homes, medical offices, retail spaces, and investment properties, planned and built by one team.
              </h2>
              <p style={{
                fontSize: "var(--t-body-lg)",
                lineHeight: 1.35,
                color: "var(--text-invert)",
                maxWidth: "60ch",
                marginBottom: "var(--s-6)",
              }}>
                From pre-construction and HOA approval to delivery and warranty, one team runs every phase from our Rancho Santa Margarita design center.
              </p>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--red)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                textDecoration: "none",
                borderRadius: "var(--radius)",
              }}>
                Start a project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Spec bar ── */}
      <div style={{ borderTop: "1px solid var(--gold)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div className="spec-bar-grid">
            {[
              { n: "30", label: "Years in Orange County" },
              { n: "800+", label: "Projects completed" },
              { n: "13", label: "South Orange County markets" },
              { n: "Licensed", label: "and insured" },
            ].map((item, i) => (
              <div key={item.n} style={{
                padding: "var(--s-5) var(--s-5)",
                borderLeft: i > 0 ? "1px solid var(--line)" : "none",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-numeral)",
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: i === 0 ? "var(--gold)" : "var(--text)",
                  marginBottom: "var(--s-2)",
                }}>
                  {item.n}
                </div>
                <div style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Expertise ── */}
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>
              Expertise
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--t-h2)",
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: "-0.01em",
            color: "var(--text)",
            marginBottom: "var(--s-4)",
            maxWidth: "24ch",
          }}>
            Residential and commercial work, handled by the same team.
          </h2>
          <p style={{
            fontSize: "var(--t-body-lg)",
            lineHeight: 1.35,
            color: "var(--text-muted)",
            maxWidth: "64ch",
            marginBottom: "var(--s-7)",
          }}>
            Practices, retailers, investors, and homeowners get the same process: a clear scope, a single point of contact, and our own crews on site.
          </p>
          <div className="expertise-grid">
            {EXPERTISE.map((e) => (
              <Link key={e.href} href={e.href} className="expertise-card">
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h3)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: "var(--text)",
                  marginBottom: "var(--s-3)",
                }}>
                  {e.name}
                </h3>
                <p style={{ fontSize: "var(--t-body)", lineHeight: 1.45, color: "var(--text-muted)", margin: "0 0 var(--s-4)" }}>
                  {e.body}
                </p>
                <span className="card-arrow" style={{ fontSize: "var(--t-small)", fontWeight: 700, color: "var(--text)", transition: "color var(--dur) var(--ease)" }}>
                  Learn more &rarr;
                </span>
              </Link>
            ))}
            <Link href="/services/expertise" className="expertise-card" style={{ background: "var(--surface-alt)" }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h3)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: "var(--text)",
                  marginBottom: "var(--s-3)",
                }}>
                  All expertise
                </h3>
                <p style={{ fontSize: "var(--t-body)", lineHeight: 1.45, color: "var(--text-muted)", margin: "0 0 var(--s-4)" }}>
                  See every project type we take on.
                </p>
                <span className="card-arrow" style={{ fontSize: "var(--t-small)", fontWeight: 700, color: "var(--text)", transition: "color var(--dur) var(--ease)" }}>
                  View all &rarr;
                </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Markets ── */}
      <section style={{ background: "var(--surface-ink)", borderBottom: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-invert-muted)",
            }}>
              Markets
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--t-h2)",
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: "-0.01em",
            color: "var(--text-invert)",
            marginBottom: "var(--s-4)",
            maxWidth: "26ch",
          }}>
            Across South Orange County, from Lake Forest to San Clemente.
          </h2>
          <p style={{
            fontSize: "var(--t-body-lg)",
            lineHeight: 1.35,
            color: "var(--text-invert-muted)",
            maxWidth: "64ch",
            marginBottom: "var(--s-7)",
          }}>
            Every city and planned community has its own planning documents, coastal or historic review, and association rules. Our market guides cover what to check before a project begins.
          </p>
          <div className="markets-list">
            {MARKETS.map(([name, slug]) => (
              <Link key={slug} href={`/services/markets/${slug}`}>{name}</Link>
            ))}
          </div>
          <div style={{ marginTop: "var(--s-7)" }}>
            <Link href="/services/markets" style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-invert)",
              textDecoration: "none",
              borderBottom: "1px solid var(--red)",
              paddingBottom: 2,
            }}>
              View all market guides
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured article ── */}
      <section style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>
              Design forecast
            </span>
          </div>
          <Link href="/blog/2027-interior-design-trends" className="article-grid">
            <div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-h2)",
                fontWeight: 400,
                lineHeight: 1.14,
                letterSpacing: "-0.01em",
                color: "var(--text)",
                marginBottom: "var(--s-4)",
              }}>
                2027 Home Design Trends
              </h2>
              <p style={{
                fontSize: "var(--t-body-lg)",
                lineHeight: 1.35,
                color: "var(--text-muted)",
                maxWidth: "50ch",
                marginBottom: "var(--s-5)",
              }}>
                The best homes of 2027 will feel less staged and more personal - comfortable, tactile, and built for how you actually live.
              </p>
              <span style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--red)",
                borderBottom: "1px solid var(--red)",
                paddingBottom: 2,
              }}>
                Read the full forecast
              </span>
            </div>
            <div style={{ position: "relative", aspectRatio: "16/9", border: "1px solid var(--line)" }}>
              <Image
                src="/blog-2027-cover.png"
                alt="2027 Interior Design Trends by US Floor Design Center"
                fill
                priority
                style={{ objectFit: "cover" }}
              />
            </div>
          </Link>
        </div>
      </section>

      {/* ── Shop by Project ── */}
      <section style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--s-7)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>
                  Design center
                </span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-h2)",
                fontWeight: 400,
                lineHeight: 1.14,
                letterSpacing: "-0.01em",
                color: "var(--text)",
              }}>
                Browse materials by space.
              </h2>
            </div>
            <Link href="/shop" style={{
              fontSize: "var(--t-small)",
              fontFamily: "var(--font-body)",
              color: "var(--text-muted)",
              textDecoration: "none",
              borderBottom: "1px solid var(--line)",
              paddingBottom: 2,
            }}>
              Browse all materials
            </Link>
          </div>
          <div className="project-tiles-grid">
            {PROJECT_TILES.map((p) => (
              <Link key={p.label} href={p.href} style={{ textDecoration: "none" }}>
                <div style={{
                  overflow: "hidden",
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                }}>
                  <div style={{ height: 120, background: p.swatch }} />
                  <div style={{ padding: "var(--s-4)" }}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--t-body-lg)",
                      fontWeight: 400,
                      color: "var(--text)",
                    }}>
                      {p.label}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>
              Our approach
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--t-h2)",
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: "-0.01em",
            color: "var(--text)",
            marginBottom: "var(--s-4)",
          }}>
            One team handles every phase, from pre-construction through warranty.
          </h2>
          <p style={{
            fontSize: "var(--t-body-lg)",
            lineHeight: 1.35,
            color: "var(--text-muted)",
            maxWidth: "68ch",
            marginBottom: "var(--s-7)",
          }}>
            The people who plan and design the project are accountable for how it is built and delivered.
          </p>

          <div className="process-grid">
            {APPROACH.map((phase) => (
              <Link key={phase.name} href={phase.href} className="process-card" style={{
                padding: "var(--s-6)",
                borderRight: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
              }}>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h3)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: "var(--text)",
                  marginBottom: "var(--s-4)",
                }}>
                  {phase.name}
                </h3>
                <p style={{
                  fontSize: "var(--t-body)",
                  lineHeight: 1.45,
                  color: "var(--text-muted)",
                  margin: 0,
                }}>
                  {phase.body}
                </p>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: "var(--s-7)" }}>
            <Link href="/request-a-visit" style={{
              display: "inline-block",
              background: "var(--red)",
              color: "var(--text-invert)",
              fontSize: "var(--t-btn)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "var(--radius)",
            }}>
              Start a project
            </Link>
          </div>
        </div>
      </section>

      {/* ── Design consultations ── */}
      <section style={{ background: "var(--surface-ink)", borderBottom: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-invert-muted)",
            }}>
              Professional planning
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--t-h2)",
            fontWeight: 400,
            lineHeight: 1.14,
            letterSpacing: "-0.01em",
            color: "var(--text-invert)",
            marginBottom: "var(--s-4)",
            maxWidth: "22ch",
          }}>
            Three ways to start, depending on where you are in the process.
          </h2>
          <p style={{
            fontSize: "var(--t-body-lg)",
            lineHeight: 1.35,
            color: "var(--text-invert-muted)",
            maxWidth: "60ch",
            marginBottom: "var(--s-7)",
          }}>
            Each consultation has a defined format, a specific deliverable, and a clear next step.
          </p>

          <div style={{ borderTop: "1px solid var(--line-invert)" }}>
            {CONSULTATIONS.map((c, i) => (
              <div key={c.name} className="consultation-row">
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h3)",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: "var(--text-invert)",
                }}>
                  {c.name}
                </div>
                <div style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-invert-muted)",
                  paddingTop: 6,
                }}>
                  {c.format}
                </div>
                <p style={{
                  fontSize: "var(--t-body)",
                  lineHeight: 1.45,
                  color: "var(--text-invert-muted)",
                  margin: 0,
                  paddingTop: 4,
                }}>
                  {c.deliverable}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "var(--s-7)" }}>
            <Link href="/request-a-visit" style={{
              display: "inline-block",
              background: "var(--red)",
              color: "var(--text-invert)",
              fontSize: "var(--t-btn)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "var(--radius)",
            }}>
              Schedule a consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

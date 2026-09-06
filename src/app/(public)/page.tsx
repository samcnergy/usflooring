import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Kitchen, Bathroom and Flooring Remodeling | US Floor Design Center",
  description: "Design-build studio in Rancho Santa Margarita, Orange County. Kitchens, bathrooms, flooring, tile, cabinets, and countertops. Visit our showroom or schedule a consultation.",
};

const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "US Floor Design Center",
  "url": "https://usfloordesign.com",
  "description": "Design-build studio in Rancho Santa Margarita, Orange County specializing in kitchen remodeling, bathroom remodeling, flooring, tile, cabinets, and countertops.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://usfloordesign.com/shop?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
};

const PROCESS = [
  { name: "Design", body: "Every project starts with a design conversation in our showroom - how the space should feel, which materials fit, what the finished room looks like before a single tile is set." },
  { name: "Select", body: "Cabinets, countertops, flooring, tile, and fixtures - all in one place. You see the real materials, our designers help you build a finish schedule that fits the space and budget." },
  { name: "Build", body: "Our own installation crews handle the work. No handoff to an outside contractor, no coordination gap, no second company - the same team accountable from design through final walkthrough." },
  { name: "Care", body: "We stand behind the work with a clear warranty and a direct line back to us - not a call center - if anything ever needs attention after the job is done." },
];

const CONSULTATIONS = [
  { name: "Showroom discovery", format: "In-store", deliverable: "Product direction and initial budget range" },
  { name: "In-home measurement", format: "At the property", deliverable: "Measurements and full project assessment" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_SCHEMA) }} />

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: 720, overflow: "hidden", display: "flex", alignItems: "stretch" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/project-modern-kitchen.png"
          alt="Modern kitchen remodel by US Floor Design Center"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Nav legibility gradient — darkens the top of the hero behind the sticky nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 140, background: "linear-gradient(to bottom, rgba(10,10,10,0.60) 0%, transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: "var(--container)", width: "100%", margin: "0 auto", padding: "0 var(--gutter)" }}>
            <div style={{
              width: "42%",
              background: "var(--surface-scrim)",
              padding: "var(--s-7)",
              borderBottom: "1px solid var(--gold)",
            }}>
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
                Design, select, and build your kitchen or bath in one place.
              </h1>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-h3)",
                fontWeight: 400,
                lineHeight: 1.25,
                color: "var(--text-invert)",
                marginBottom: "var(--s-5)",
              }}>
                Orange County showroom. One team, start to finish.
              </p>
              <p style={{
                fontSize: "var(--t-body-lg)",
                lineHeight: 1.35,
                color: "var(--text-invert)",
                maxWidth: "60ch",
                marginBottom: "var(--s-6)",
              }}>
                Visit our Rancho Santa Margarita showroom to compare cabinets, countertops, flooring, tile, and finishes with professional design guidance and installation by our own crew.
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
                Start my project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Spec bar ── */}
      <div style={{ borderTop: "1px solid var(--gold)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { n: "30", label: "Years in Orange County" },
              { n: "800+", label: "Projects completed" },
              { n: "Design + build", label: "One team, start to finish" },
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
          <Link href="/blog/2027-interior-design-trends" style={{ textDecoration: "none", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "var(--s-8)", alignItems: "center" }}>
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
                  Shop by project
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
                What are you working on?
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--s-4)" }}>
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
              How it works
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
            One team handles every phase, from design through the final walkthrough.
          </h2>
          <p style={{
            fontSize: "var(--t-body-lg)",
            lineHeight: 1.35,
            color: "var(--text-muted)",
            maxWidth: "68ch",
            marginBottom: "var(--s-7)",
          }}>
            The same people who help you choose materials in the showroom are accountable for the finished room.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--line)", borderLeft: "1px solid var(--line)" }}>
            {PROCESS.map((phase) => (
              <div key={phase.name} style={{
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
              Start my project
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
              <div key={c.name} style={{
                padding: "var(--s-5) 0",
                borderBottom: "1px solid var(--line-invert)",
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr",
                gap: "var(--s-7)",
                alignItems: "start",
              }}>
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

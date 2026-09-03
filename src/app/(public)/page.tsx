"use client";
import Link from "next/link";
import { useState } from "react";

const TRUST_SIGNALS = [
  { strong: "30 years", body: "In Orange County" },
  { strong: "Design + build", body: "One team, start to finish" },
  { strong: "Our showroom", body: "See every material in person" },
  { strong: "Licensed", body: "and insured" },
];

const PROCESS = [
  { step: "01", name: "Design", body: "Every project starts with a design conversation in our showroom — how the space should feel, which materials fit, what the finished room looks like before a single tile is set." },
  { step: "02", name: "Select", body: "Cabinets, countertops, flooring, tile, and fixtures — all in one place. You see the real materials, our designers help you build a finish schedule that fits the space and budget." },
  { step: "03", name: "Build", body: "Our own installation crews handle the work. No handoff to an outside contractor, no coordination gap, no second company — the same team accountable from design through final walkthrough." },
  { step: "04", name: "Care", body: "We stand behind the work with a clear warranty and a direct line back to us — not a call center — if anything ever needs attention after the job is done." },
];

const CONSULTATIONS = [
  { name: "Showroom discovery", format: "In-store", deliverable: "Product direction and initial budget range" },
  { name: "In-home measurement", format: "At the property", deliverable: "Measurements and full project assessment" },
  { name: "Complete design package", format: "Showroom + property", deliverable: "Layout, visualization, finish schedule and project proposal" },
];

export default function HomePage() {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  return (
    <div>

      {/* ── Hero ── */}
      <section style={{ background: "var(--pub-stone)", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64,
            alignItems: "center", padding: "80px 0 88px",
          }}>
            <div>
              <p style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 18, letterSpacing: "0.04em" }}>
                Orange County showroom — Rancho Santa Margarita, CA
              </p>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 50,
                lineHeight: 1.13, letterSpacing: "-0.01em",
                color: "var(--pub-ink)", maxWidth: "14ch",
              }}>
                Design, select, and build your kitchen or bath — in one place.
              </h1>
              <p style={{
                marginTop: 24, fontSize: 17, lineHeight: 1.7, color: "#4B4A45", maxWidth: "42ch",
              }}>
                Visit our Orange County showroom to compare cabinets, countertops, flooring, tile, and finishes — with professional design guidance and complete installation by our own crew.
              </p>
              <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 12 }}>
                <Link href="/request-a-visit" style={{
                  background: "var(--pub-forest)", color: "var(--pub-stone)",
                  fontSize: 14, fontWeight: 500, padding: "15px 28px",
                  textDecoration: "none", borderRadius: 2,
                }}>
                  Start my project
                </Link>
                <Link href="/request-a-visit?type=showroom" style={{
                  background: "transparent", color: "var(--pub-ink)",
                  fontSize: 14, fontWeight: 500, padding: "15px 28px",
                  textDecoration: "none", borderRadius: 2,
                  border: "1px solid var(--pub-ink)",
                }}>
                  Visit the showroom
                </Link>
                <Link href="/shop" style={{
                  background: "transparent", color: "var(--pub-ink)",
                  fontSize: 14, padding: "15px 28px",
                  textDecoration: "none", borderRadius: 2,
                  border: "1px solid var(--pub-line)",
                }}>
                  Shop materials
                </Link>
              </div>
            </div>

            {/* Hero visual — answers the 5 questions visually */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { q: "What do you sell?", a: "Cabinets, countertops, flooring, tile, and fixtures — all brands in one showroom." },
                { q: "Do you design?", a: "Yes. Every project starts with a design consultation. We draw the space before anything is ordered." },
                { q: "Do you install?", a: "Yes. Our own licensed installation crews do the work — no outside contractors." },
                { q: "Where is the showroom?", a: "Rancho Santa Margarita, CA. Open Monday through Saturday." },
                { q: "Why trust you?", a: "30 years in Orange County. Licensed, insured, and accountable from design through final walkthrough." },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  style={{
                    textAlign: "left", background: "#fff", border: "1px solid var(--pub-line)",
                    borderRadius: 2, padding: "14px 18px", cursor: "pointer",
                    transition: "border-color .15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--pub-ink)" }}>{item.q}</span>
                    <span style={{ fontSize: 18, color: "var(--pub-muted)", flexShrink: 0 }}>
                      {expandedQ === i ? "−" : "+"}
                    </span>
                  </div>
                  {expandedQ === i && (
                    <p style={{ marginTop: 10, fontSize: 14, color: "#4B4A45", lineHeight: 1.6, marginBottom: 0 }}>
                      {item.a}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div style={{
        borderBottom: "1px solid var(--pub-line)",
        background: "#fff",
      }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 0" }}>
            {TRUST_SIGNALS.map((item, i, arr) => (
              <div key={i} style={{
                fontSize: 13, color: "var(--pub-muted)", padding: "0 24px",
                textAlign: "center", flex: 1,
                borderLeft: i > 0 ? "1px solid var(--pub-line)" : "none",
              }}>
                <strong style={{
                  display: "block", fontFamily: "var(--pub-serif)", fontSize: 20,
                  fontWeight: 400, color: "var(--pub-ink)", marginBottom: 3,
                }}>
                  {item.strong}
                </strong>
                {item.body}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop by Project ── */}
      <section style={{ padding: "80px 0", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 12 }}>Shop by project</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34, color: "var(--pub-ink)" }}>
                What are you working on?
              </h2>
            </div>
            <Link href="/shop" style={{ fontSize: 13, color: "var(--pub-muted)", textDecoration: "none", borderBottom: "1px solid var(--pub-line)", paddingBottom: 2 }}>
              Browse all materials
            </Link>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
          }}>
            {[
              { label: "Complete Kitchen", href: "/shop?project=kitchen", swatch: "linear-gradient(135deg,#C9A87A 0%,#DDD0BB 50%,#A07850 100%)" },
              { label: "Primary Bathroom", href: "/shop?project=primary-bath", swatch: "linear-gradient(135deg,#C8D8DC 0%,#E8E4DF 50%,#A8B8B8 100%)" },
              { label: "Guest Bathroom", href: "/shop?project=guest-bath", swatch: "linear-gradient(135deg,#D8D0C8 0%,#E8E4DE 50%,#B8B0A8 100%)" },
              { label: "Powder Room", href: "/shop?project=powder-room", swatch: "linear-gradient(135deg,#C8C4BE 0%,#E0DCD6 50%,#A8A49E 100%)" },
              { label: "Whole-Home Flooring", href: "/shop?project=flooring", swatch: "linear-gradient(135deg,#D4A870 0%,#C89858 50%,#8B5E30 100%)" },
              { label: "Laundry Room", href: "/shop?project=laundry", swatch: "linear-gradient(135deg,#D0D4D8 0%,#E4E8EC 50%,#B0B8C0 100%)" },
              { label: "Fireplace", href: "/shop?project=fireplace", swatch: "linear-gradient(135deg,#8C7868 0%,#C0A890 50%,#5C4838 100%)" },
              { label: "Outdoor Living", href: "/shop?project=outdoor", swatch: "linear-gradient(135deg,#8A9E78 0%,#C4CDB8 50%,#5A7048 100%)" },
            ].map((p) => (
              <Link key={p.label} href={p.href} style={{ textDecoration: "none" }}>
                <div style={{
                  borderRadius: 2, overflow: "hidden", border: "1px solid var(--pub-line)",
                  background: "#fff",
                }}>
                  <div style={{ height: 120, background: p.swatch }} />
                  <div style={{ padding: "14px 16px" }}>
                    <span style={{ fontFamily: "var(--pub-serif)", fontSize: 16, color: "var(--pub-ink)" }}>
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
      <section style={{ padding: "80px 0", background: "#fff", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>How it works</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34, color: "var(--pub-ink)", lineHeight: 1.25, marginBottom: 14 }}>
                Design. Select. Build. Care.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--pub-muted)", maxWidth: "30ch" }}>
                Four phases. One team throughout. The same people who help you choose materials in the showroom are accountable for the finished room.
              </p>
              <Link href="/request-a-visit" style={{
                display: "inline-block", marginTop: 28,
                background: "var(--pub-forest)", color: "var(--pub-stone)",
                fontSize: 14, padding: "14px 26px", textDecoration: "none", borderRadius: 2,
              }}>
                Start my project
              </Link>
            </div>
            <div>
              {PROCESS.map((phase, i) => (
                <div key={phase.step} style={{
                  display: "grid", gridTemplateColumns: "72px 1fr", gap: 24,
                  padding: "28px 0",
                  borderBottom: i < PROCESS.length - 1 ? "1px solid var(--pub-line)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--pub-brass)", letterSpacing: "0.08em", marginBottom: 4 }}>{phase.step}</div>
                    <div style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-ink)" }}>{phase.name}</div>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4B4A45", margin: 0, paddingTop: 2 }}>{phase.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Design consultations ── */}
      <section style={{ padding: "80px 0", background: "var(--pub-ink)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Professional planning</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 32, color: "var(--pub-stone)", lineHeight: 1.3, marginBottom: 16 }}>
                Three ways to start, depending on where you are in the process.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(241,238,231,0.65)", lineHeight: 1.7 }}>
                Each consultation has a defined format, a specific deliverable, and a clear next step. You leave with something concrete — not just a conversation.
              </p>
            </div>
            <div>
              {CONSULTATIONS.map((c, i) => (
                <div key={c.name} style={{
                  padding: "22px 0",
                  borderBottom: i < CONSULTATIONS.length - 1 ? "1px solid rgba(241,238,231,0.15)" : "none",
                  display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24, alignItems: "start",
                }}>
                  <div>
                    <div style={{ fontFamily: "var(--pub-serif)", fontSize: 18, color: "var(--pub-stone)", marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(241,238,231,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.format}</div>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(241,238,231,0.7)", lineHeight: 1.6, margin: 0 }}>{c.deliverable}</p>
                </div>
              ))}
              <Link href="/request-a-visit" style={{
                display: "inline-block", marginTop: 32,
                background: "var(--pub-stone)", color: "var(--pub-forest)",
                fontSize: 14, fontWeight: 500, padding: "13px 24px",
                textDecoration: "none", borderRadius: 2,
              }}>
                Schedule a consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

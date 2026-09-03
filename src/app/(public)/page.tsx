"use client";
import Link from "next/link";
import { useState } from "react";

const PATH_OPTIONS = [
  {
    key: "remodel",
    title: "Full room remodel",
    desc: "Complete kitchen, bath, or whole-home — design through installation.",
    cta: "Request a visit",
    href: "/request-a-visit",
  },
  {
    key: "refresh",
    title: "Room refresh or finishes",
    desc: "New cabinets, countertops, flooring, or tile without a full renovation.",
    cta: "Request a visit",
    href: "/request-a-visit",
  },
  {
    key: "materials",
    title: "Just exploring materials",
    desc: "Browse flooring, tile, and fixtures. Order samples or come see them in person.",
    cta: "Browse the shop",
    href: "/shop",
  },
  {
    key: "trade",
    title: "Contractor or designer",
    desc: "Trade pricing, priority quoting, and a dedicated account contact.",
    cta: "Request a trade account",
    href: "/request-a-visit?type=trade",
  },
] as const;

const PROCESS = [
  {
    step: "01",
    name: "Design",
    desc: "Every project starts in the showroom as a design conversation — how the space should feel, which materials belong together, what the finished room looks like before anything is ordered or installed.",
  },
  {
    step: "02",
    name: "Select",
    desc: "Cabinets, countertops, flooring, tile, and fixtures — all in one place. You see the actual materials, not a screen. Our designers help you build a finish schedule that fits the space and the budget.",
  },
  {
    step: "03",
    name: "Build",
    desc: "Our own installation crews handle the work. No handoff to an outside contractor, no second company to coordinate, no gap between what was drawn and what gets built.",
  },
  {
    step: "04",
    name: "Care",
    desc: "We stand behind the work. A completed project comes with a clear warranty and a direct line to us if anything ever needs attention — not a call center, not a third party.",
  },
];

const CONSULTATIONS = [
  {
    name: "Showroom discovery",
    format: "In-store",
    deliverable: "Product direction and initial budget range",
  },
  {
    name: "In-home measurement",
    format: "At the property",
    deliverable: "Measurements and project assessment",
  },
  {
    name: "Complete design package",
    format: "Showroom + property",
    deliverable: "Layout, finish schedule, and full project proposal",
  },
];

export default function HomePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPath = PATH_OPTIONS.find((p) => p.key === selected);

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>

      {/* Hero */}
      <section style={{
        display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 72,
        alignItems: "center", padding: "88px 0 96px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 52,
            lineHeight: 1.12, letterSpacing: "-0.01em", maxWidth: "11.5ch",
            color: "var(--pub-ink)",
          }}>
            Your kitchen, designed before it&apos;s built.
          </h1>
          <p style={{
            marginTop: 26, fontSize: 17, lineHeight: 1.65, color: "#4B4A45", maxWidth: "38ch",
          }}>
            An Orange County design center for kitchens, baths, and flooring. One team plans it, selects the materials with you in our showroom, and installs it. No outside contractors. Thirty years in business.
          </p>
          <div style={{ marginTop: 38, display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="/request-a-visit" style={{
              background: "var(--pub-forest)", color: "var(--pub-stone)", fontSize: 14,
              padding: "14px 26px", textDecoration: "none", borderRadius: 2,
            }}>
              Start your design
            </Link>
            <Link href="/shop" style={{
              fontSize: 14, color: "var(--pub-ink)", textDecoration: "none",
              borderBottom: "1px solid var(--pub-brass)", paddingBottom: 2,
            }}>
              Visit the showroom
            </Link>
          </div>
        </div>
        <div style={{
          aspectRatio: "4/5", borderRadius: 2, overflow: "hidden", position: "relative",
          background: "linear-gradient(100deg,#DCD3BE 0%,#C9BD9F 38%,#EDE6D6 55%,#B7A98A 78%,#DED3B9 100%)",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(100deg, rgba(30,35,32,0.05) 0px, rgba(30,35,32,0.05) 2px, transparent 2px, transparent 16px)",
          }} />
          <div style={{
            position: "absolute", left: 20, bottom: 18, fontSize: 12, color: "var(--pub-ink)",
            background: "rgba(241,238,231,0.86)", padding: "6px 10px", borderRadius: 2,
          }}>
            Showroom material study — walnut &amp; honed quartz
          </div>
        </div>
      </section>

      {/* Proof bar */}
      <div style={{
        borderTop: "1px solid var(--pub-line)", borderBottom: "1px solid var(--pub-line)",
        padding: "26px 0", display: "flex", justifyContent: "space-between",
      }}>
        {[
          { strong: "30 years", body: "Orange County, one location" },
          { strong: "Design + build", body: "Under one accountable team" },
          { strong: "Our showroom", body: "See every material before you choose" },
          { strong: "Licensed", body: "and insured" },
        ].map((item, i, arr) => (
          <div key={i} style={{
            fontSize: 13, color: "var(--pub-muted)", padding: "0 28px",
            textAlign: i === 0 ? "left" : i === arr.length - 1 ? "right" : "center",
            flex: 1,
            borderLeft: i > 0 ? "1px solid var(--pub-line)" : "none",
          }}>
            <strong style={{
              display: "block", fontFamily: "var(--pub-serif)", fontSize: 22,
              fontWeight: 400, color: "var(--pub-ink)", marginBottom: 4,
            }}>
              {item.strong}
            </strong>
            {item.body}
          </div>
        ))}
      </div>

      {/* Start Here — path selector */}
      <section id="start-here" style={{ padding: "88px 0 0" }}>
        <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Start here</div>
        <h2 style={{
          fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34,
          maxWidth: "18ch", color: "var(--pub-ink)", marginBottom: 10,
        }}>
          Which of these sounds like you?
        </h2>
        <p style={{ fontSize: 15, color: "var(--pub-muted)", maxWidth: "48ch", marginBottom: 32 }}>
          Every project starts differently. Pick the one closest to where you are.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16,
        }}>
          {PATH_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              style={{
                border: `1px solid ${selected === opt.key ? "var(--pub-forest)" : "var(--pub-line)"}`,
                borderRadius: 2, padding: 22, cursor: "pointer",
                display: "flex", flexDirection: "column", gap: 10,
                background: selected === opt.key ? "rgba(47,74,56,0.06)" : "transparent",
                transition: "border-color .15s, background-color .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="radio"
                  name="path"
                  value={opt.key}
                  checked={selected === opt.key}
                  onChange={() => setSelected(opt.key)}
                  style={{ width: 15, height: 15, accentColor: "var(--pub-forest)" }}
                />
                <span style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)" }}>
                  {opt.title}
                </span>
              </div>
              <span style={{ fontSize: 13, lineHeight: 1.55, color: "var(--pub-muted)" }}>
                {opt.desc}
              </span>
            </label>
          ))}
        </div>

        {/* Result */}
        <div style={{
          marginTop: 24, minHeight: 56,
          display: "flex", alignItems: "center",
        }}>
          {selectedPath && (
            <Link href={selectedPath.href} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "var(--pub-forest)", color: "var(--pub-stone)",
              fontSize: 14, padding: "14px 26px", textDecoration: "none", borderRadius: 2,
            }}>
              {selectedPath.cta}
              <span style={{ fontSize: 18, lineHeight: 1 }}>&#8594;</span>
            </Link>
          )}
        </div>
      </section>

      {/* How it works — Design → Select → Build → Care */}
      <section style={{ padding: "96px 0" }}>
        <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>How it works</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
          <div>
            <h2 style={{
              fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34,
              lineHeight: 1.25, color: "var(--pub-ink)",
            }}>
              Design. Select. Build. Care.
            </h2>
            <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.7, color: "var(--pub-muted)", maxWidth: "32ch" }}>
              Four phases. One team throughout. The same people who help you choose materials in the showroom are accountable for the finished room.
            </p>
            <Link href="/request-a-visit" style={{
              display: "inline-block", marginTop: 28,
              background: "var(--pub-forest)", color: "var(--pub-stone)",
              fontSize: 14, padding: "14px 26px", textDecoration: "none", borderRadius: 2,
            }}>
              Book a showroom visit
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PROCESS.map((phase, i) => (
              <div key={phase.step} style={{
                display: "grid", gridTemplateColumns: "64px 1fr",
                gap: 24, padding: "28px 0",
                borderBottom: i < PROCESS.length - 1 ? "1px solid var(--pub-line)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--pub-brass)", letterSpacing: "0.08em", marginBottom: 4 }}>
                    {phase.step}
                  </div>
                  <div style={{ fontFamily: "var(--pub-serif)", fontSize: 20, color: "var(--pub-ink)" }}>
                    {phase.name}
                  </div>
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#4B4A45", margin: 0, paddingTop: 2 }}>
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultations */}
      <section style={{
        background: "var(--pub-ink)", borderRadius: 2,
        padding: "64px 56px", marginBottom: 88,
      }}>
        <div style={{ fontSize: 13, color: "var(--pub-brass)", letterSpacing: "0.04em", marginBottom: 14 }}>
          Professional planning
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "start" }}>
          <div>
            <h2 style={{
              fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30,
              color: "var(--pub-stone)", lineHeight: 1.3, marginBottom: 14,
            }}>
              Three ways to start, depending on where you are in the process.
            </h2>
            <p style={{ fontSize: 14, color: "rgba(241,238,231,0.65)", lineHeight: 1.7 }}>
              Each consultation has a defined format, a specific deliverable, and a clear next step. No open-ended "let us know" — you leave with something.
            </p>
          </div>
          <div>
            {CONSULTATIONS.map((c, i) => (
              <div key={c.name} style={{
                padding: "22px 0",
                borderBottom: i < CONSULTATIONS.length - 1 ? "1px solid rgba(241,238,231,0.15)" : "none",
                display: "grid", gridTemplateColumns: "1.2fr 1fr",
                gap: 24, alignItems: "start",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-stone)", marginBottom: 4 }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(241,238,231,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {c.format}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "rgba(241,238,231,0.7)", lineHeight: 1.6, margin: 0 }}>
                  {c.deliverable}
                </p>
              </div>
            ))}
            <Link href="/request-a-visit" style={{
              display: "inline-block", marginTop: 28,
              background: "var(--pub-stone)", color: "var(--pub-forest)",
              fontSize: 14, fontWeight: 500, padding: "13px 24px",
              textDecoration: "none", borderRadius: 2,
            }}>
              Schedule a consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

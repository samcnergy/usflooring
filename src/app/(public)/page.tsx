"use client";
import Link from "next/link";
import { useState } from "react";

const PATH_OPTIONS = [
  {
    key: "remodel",
    title: "Full room remodel",
    desc: "Complete kitchen, bath, or whole-home — design through installation.",
    result: { label: "Request a visit", href: "/request-a-visit" },
  },
  {
    key: "refresh",
    title: "Room refresh or finishes",
    desc: "New cabinets, countertops, flooring, or tile — without a full renovation.",
    result: { label: "Start a room & finish request", href: "/request-a-visit" },
  },
  {
    key: "materials",
    title: "Just exploring materials",
    desc: "Browse and buy flooring, tile, and fixtures on your own.",
    result: { label: "Browse the shop", href: "/shop" },
  },
  {
    key: "trade",
    title: "Contractor or designer",
    desc: "Trade pricing, priority quoting, and a dedicated account contact.",
    result: { label: "Request a trade account", href: "/request-a-visit?type=trade" },
  },
] as const;

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
            A design center for kitchens, baths, and flooring — where the plan is drawn and the room is built by one accountable team, not handed off to an outside contractor. Thirty years in Orange County, one showroom, one accountable team.
          </p>
          <div style={{ marginTop: 38, display: "flex", alignItems: "center", gap: 28 }}>
            <Link href="#start-here" style={{
              background: "var(--pub-forest)", color: "var(--pub-stone)", fontSize: 14,
              padding: "14px 26px", textDecoration: "none", borderRadius: 2,
            }}>
              Start your design
            </Link>
            <Link href="/request-a-visit" style={{
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

      {/* Pathfinder */}
      <section id="start-here" style={{ padding: "0 0 88px" }}>
        <h2 style={{
          fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 28,
          maxWidth: "16ch", color: "var(--pub-ink)",
        }}>
          Where should we start?
        </h2>
        <p style={{ marginTop: 10, fontSize: 15, color: "var(--pub-muted)", maxWidth: "48ch" }}>
          Every project starts differently — tell us which one is yours.
        </p>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 32,
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
                <span style={{ fontFamily: "var(--pub-serif)", fontSize: 18, color: "var(--pub-ink)" }}>
                  {opt.title}
                </span>
              </div>
              <span style={{ fontSize: 13, lineHeight: 1.55, color: "var(--pub-muted)" }}>
                {opt.desc}
              </span>
            </label>
          ))}
        </div>
        <p style={{ marginTop: 22, fontSize: 14, minHeight: 20 }}>
          {selectedPath && (
            <>
              Good fit →{" "}
              <Link href={selectedPath.result.href} style={{
                color: "var(--pub-ink)", borderBottom: "1px solid var(--pub-brass)",
                textDecoration: "none", paddingBottom: 1,
              }}>
                {selectedPath.result.label}
              </Link>
            </>
          )}
        </p>
      </section>

      {/* Proof bar */}
      <div id="proof" style={{
        borderTop: "1px solid var(--pub-line)", borderBottom: "1px solid var(--pub-line)",
        padding: "26px 0", display: "flex", justifyContent: "space-between",
      }}>
        {[
          { strong: "30 yrs", body: "Orange County, one location" },
          { strong: "Design + build", body: "Under one accountable team" },
          { strong: "In‑showroom", body: "See every material before you choose" },
          { strong: "Licensed", body: "& insured" },
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

      {/* Studio section */}
      <section id="studio" style={{
        padding: "96px 0", display: "grid",
        gridTemplateColumns: "0.85fr 1.15fr", gap: 80, alignItems: "start",
      }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 18 }}>
            What sets us apart
          </div>
          <h2 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34,
            lineHeight: 1.25, maxWidth: "12ch", color: "var(--pub-ink)",
          }}>
            A design studio that happens to install its own work.
          </h2>
        </div>
        <div>
          {[
            "Most kitchen and bath companies are contractors first — they build to a plan someone else drew, or skip the plan entirely. We start every project in the showroom, as a design conversation: how the space should feel, which materials belong together, what the finished room actually looks like before a single tile is set.",
            "Then our own installation crews bring it to life. No handoff to an outside contractor, no second company, no surprises between the rendering and the result — just one studio, thirty years of craft, and a room built exactly the way it was drawn.",
          ].map((text, i) => (
            <p key={i} style={{
              fontSize: 16, lineHeight: 1.75, color: "#4B4A45",
              marginBottom: i < 1 ? 20 : 0, maxWidth: "52ch",
            }}>
              {text}
            </p>
          ))}
          <Link href="/request-a-visit" style={{
            display: "inline-block", marginTop: 32,
            background: "var(--pub-forest)", color: "var(--pub-stone)",
            fontSize: 14, padding: "14px 26px", textDecoration: "none", borderRadius: 2,
          }}>
            Start a conversation
          </Link>
        </div>
      </section>

    </div>
  );
}

import Link from "next/link";
import LeaderProfiles from "./LeaderProfiles";

export const metadata = {
  title: "Leadership",
  description: "Meet Parham Shariat and Shirin Salamat, the owners of US Floor Design Center in Rancho Santa Margarita.",
};

export default function LeadershipPage() {
  return (
    <div>
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>About Us</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Leadership</h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "52ch", margin: 0 }}>The owners who run US Floor Design Center.</p>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "var(--s-9) var(--gutter)" }}>
          <LeaderProfiles />
          <div style={{ marginTop: "var(--s-8)" }}>
            <Link href="/about" style={{ color: "var(--red)", fontFamily: "var(--font-body)", fontSize: "var(--t-body)", fontWeight: 700, textDecoration: "none" }}>About US Floor Design Center →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Digital Innovations",
  description: "Digital Innovations from US Floor Design Center is coming soon.",
  robots: { index: false, follow: true },
};

export default function DigitalInnovationsPage() {
  return (
    <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
      <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
        <div style={{ padding: "var(--s-9) 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
            <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
            <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Insight</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h1)", lineHeight: 1.10, letterSpacing: "-0.01em", color: "var(--text)", marginBottom: "var(--s-4)" }}>Digital Innovations</h1>
          <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, margin: 0 }}>Coming soon.</p>
        </div>
      </div>
    </div>
  );
}

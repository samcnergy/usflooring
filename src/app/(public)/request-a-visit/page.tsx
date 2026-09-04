import LeadForm from "./LeadForm";

export const metadata = {
  title: "Request a Visit | US Floor Design Center",
  description: "Tell us about your project and we will schedule a showroom visit.",
};

export default function RequestAVisitPage() {
  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.6fr 1.4fr", gap: 80, padding: "72px 0 0" }}>
        {/* Left: intro */}
        <div style={{ paddingTop: 8 }}>
          <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>
            Request a visit
          </div>
          <h1 style={{
            fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 34,
            lineHeight: 1.25, color: "var(--pub-ink)", marginBottom: 20, maxWidth: "12ch",
          }}>
            Tell us about your project.
          </h1>
          <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "30ch" }}>
            Every project starts with a conversation. Share the details below and one of our designers will reach out to schedule a showroom visit at no cost or commitment.
          </p>
          <div style={{ marginTop: 32, borderTop: "1px solid var(--pub-line)", paddingTop: 24 }}>
            {[
              { icon: "✓", text: "No cost for the initial consultation" },
              { icon: "✓", text: "In-showroom, with real materials" },
              { icon: "✓", text: "One team from design to installation" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: "var(--pub-muted)" }}>
                <span style={{ color: "var(--pub-forest)", fontWeight: 600 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div>
          <LeadForm />
        </div>
      </div>
    </div>
  );
}

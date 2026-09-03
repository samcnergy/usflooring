import Link from "next/link";

export const metadata = {
  title: "Warranty — US Floor Design Center",
  description: "Our written warranty covers labor for 12 months and materials at the manufacturer warranty level. Plain language. No surprises.",
};

const SECTIONS = [
  {
    heading: "What is covered",
    body: [
      "Labor performed by our installation crews is covered for 12 months from the date of project completion. If something we installed fails or was installed incorrectly, we will return and correct it at no charge.",
      "Materials are covered at the manufacturer's warranty level. Every product we sell carries its own manufacturer warranty — we will coordinate the claim on your behalf, and if the manufacturer does not cover a defect, we will work with you on a resolution.",
    ],
  },
  {
    heading: "How long it lasts",
    body: [
      "Our labor warranty runs for 12 months from the date of final walkthrough. Manufacturer warranties on materials vary by product and are documented in the paperwork provided at project completion. Copies of manufacturer warranty documents are available on request.",
    ],
  },
  {
    heading: "Who handles service requests",
    body: [
      "Our own technicians handle all warranty service. Requests are not routed to a third-party call center or a subcontractor — the same team that built the project handles the follow-up.",
    ],
  },
  {
    heading: "Expected response time",
    body: [
      "We will respond to every warranty request within 24 to 48 business hours of receipt. For non-urgent concerns, we will schedule the earliest available appointment. For situations involving water, structural risk, or an unusable fixture, we will treat the request as a priority and respond the same or next business day.",
    ],
  },
  {
    heading: "What is not covered",
    body: [
      "Normal wear and tear is not covered. This includes surface scratches from daily use, grout discoloration from heavy foot traffic, finish wear on high-use hardware, and any damage caused by improper care, cleaning products not recommended for the material, or modifications made by anyone other than our crew after project completion.",
      "Damage caused by events outside our control — flooding, earthquakes, settling, or third-party work — is also excluded.",
    ],
  },
  {
    heading: "How to submit a concern",
    body: [
      "Email us with the subject line \"Warranty Request\" and include: your name, the project address, a brief description of the concern, and one or two photos if the issue is visible. We will confirm receipt within 24 hours and schedule a technician visit if one is needed.",
    ],
    cta: {
      label: "Send a warranty request",
      href: "mailto:info@usfloordesign.com?subject=Warranty%20Request",
    },
  },
];

export default function WarrantyPage() {
  return (
    <div>

      {/* Page header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Warranty</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "14ch",
              }}>
                Our warranty, in plain language.
              </h1>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "44ch", paddingBottom: 4 }}>
                A warranty is only as good as the company behind it. We write ours in plain terms because vague promises are not promises — they are escape clauses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{ background: "var(--pub-forest)", borderBottom: "1px solid rgba(241,238,231,0.15)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "24px 0", flexWrap: "wrap", gap: 16 }}>
            {[
              { label: "Labor coverage", value: "12 months" },
              { label: "Materials", value: "Manufacturer warranty" },
              { label: "Who handles it", value: "Our technician" },
              { label: "Response time", value: "24 – 48 hours" },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                flex: 1, minWidth: 140,
                padding: "0 24px",
                borderLeft: i > 0 ? "1px solid rgba(241,238,231,0.2)" : "none",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "var(--pub-serif)", fontSize: 22, color: "var(--pub-stone)", marginBottom: 4 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 12, color: "rgba(241,238,231,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warranty sections */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ maxWidth: 760, padding: "72px 0" }}>
            {SECTIONS.map((section, i) => (
              <div key={section.heading} style={{
                paddingBottom: 48,
                marginBottom: 48,
                borderBottom: i < SECTIONS.length - 1 ? "1px solid var(--pub-line)" : "none",
              }}>
                <h2 style={{
                  fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26,
                  color: "var(--pub-ink)", marginBottom: 18, lineHeight: 1.3,
                }}>
                  {section.heading}
                </h2>
                {section.body.map((para, j) => (
                  <p key={j} style={{
                    fontSize: 16, lineHeight: 1.75, color: "#4B4A45",
                    margin: 0, marginBottom: j < section.body.length - 1 ? 16 : 0,
                  }}>
                    {para}
                  </p>
                ))}
                {section.cta && (
                  <a href={section.cta.href} style={{
                    display: "inline-block", marginTop: 24,
                    background: "var(--pub-forest)", color: "var(--pub-stone)",
                    fontSize: 14, padding: "13px 24px", textDecoration: "none", borderRadius: 2,
                  }}>
                    {section.cta.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "56px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--pub-serif)", fontSize: 26, color: "var(--pub-ink)", marginBottom: 10, fontWeight: 400 }}>
                Questions about your project warranty?
              </p>
              <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.65, maxWidth: "44ch" }}>
                If something is not addressed here or you are not sure whether your concern qualifies, email us and we will give you a straight answer.
              </p>
            </div>
            <a href="mailto:info@usfloordesign.com?subject=Warranty%20Question" style={{
              background: "var(--pub-forest)", color: "var(--pub-stone)",
              fontSize: 14, fontWeight: 500, padding: "14px 28px",
              textDecoration: "none", borderRadius: 2, whiteSpace: "nowrap",
            }}>
              Contact us
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

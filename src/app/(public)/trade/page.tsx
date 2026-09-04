"use client";

import { useState } from "react";
import Link from "next/link";

const BENEFITS = [
  {
    heading: "Trade pricing",
    body: "Verified trade accounts receive wholesale or contractor pricing on all product categories - cabinets, countertops, flooring, tile, fixtures, and hardware.",
  },
  {
    heading: "Project lists and saved selections",
    body: "Organize products by client or project. Share a curated selection list with clients. Save for later, revisit, and convert to a quote when ready.",
  },
  {
    heading: "Sample and material board service",
    body: "Request samples, borrow showroom samples, or have a curated material board prepared for a specific client brief. Samples can be credited against purchase.",
  },
  {
    heading: "Specification downloads",
    body: "Download cut sheets, CAD files, installation specifications, and maintenance guides for all product lines - directly from your account dashboard.",
  },
  {
    heading: "Delivery and site coordination",
    body: "Schedule deliveries to job sites. Coordinate freight, inside delivery, and job-site staging with your account manager.",
  },
  {
    heading: "Dedicated account manager",
    body: "Trade accounts are assigned a single point of contact - not a general support queue. Call, text, or email the same person every time.",
  },
];

const WHO_QUALIFIES = [
  "Licensed general contractors",
  "Interior designers and design-build firms",
  "Architects and architectural firms",
  "Kitchen and bath designers",
  "Flooring installers and subcontractors",
  "Real estate investors and developers",
  "Property managers (5+ units)",
  "Home stagers",
];

type FormState = "idle" | "submitting" | "success" | "error";

export default function TradePage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "",
    license: "",
    message: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/trade-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px",
    border: "1px solid var(--pub-line)", borderRadius: 2,
    fontSize: 15, color: "var(--pub-ink)", background: "#fff",
    fontFamily: "var(--pub-sans)", outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, color: "var(--pub-ink)",
    marginBottom: 6, fontWeight: 500,
  };

  return (
    <div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Trade portal</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "14ch",
              }}>
                Built for designers, builders, and contractors.
              </h1>
              <div>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "42ch", marginBottom: 0 }}>
                  A dedicated trade account gives you wholesale pricing, project management tools, a direct account manager, and faster access to the materials you order regularly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>What you get</div>
                <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3 }}>
                  Six things your account includes from day one.
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {BENEFITS.map((b) => (
                  <div key={b.heading} style={{
                    padding: "22px 24px", border: "1px solid var(--pub-line)", borderRadius: 2,
                  }}>
                    <div style={{ fontFamily: "var(--pub-serif)", fontSize: 17, color: "var(--pub-ink)", marginBottom: 8, lineHeight: 1.35 }}>
                      {b.heading}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.65, margin: 0 }}>
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who qualifies */}
      <div style={{ background: "var(--pub-stone)", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Eligibility</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 16 }}>
                Who can apply.
              </h2>
              <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "36ch" }}>
                We verify credentials before activating trade pricing. If you are not sure whether you qualify, apply and we will let you know.
              </p>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {WHO_QUALIFIES.map((item) => (
                <li key={item} style={{
                  display: "flex", gap: 12, alignItems: "center",
                  padding: "14px 18px", background: "#fff",
                  border: "1px solid var(--pub-line)", borderRadius: 2,
                  fontSize: 15, color: "var(--pub-ink)",
                }}>
                  <span style={{ color: "var(--pub-brass)", flexShrink: 0 }}>&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Application form */}
      <div style={{ background: "#fff" }} id="apply">
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 80, alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 14 }}>Apply</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 16 }}>
                Open a trade account.
              </h2>
              <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "34ch", marginBottom: 24 }}>
                Submit the form and we will review your credentials within one business day. You will receive confirmation by email once your account is active.
              </p>
              <div style={{ fontSize: 14, color: "var(--pub-muted)", lineHeight: 1.7 }}>
                Have questions first?<br />
                <a href="mailto:info@usfloordesign.com?subject=Trade%20Account%20Question" style={{ color: "var(--pub-ink)" }}>
                  Email us directly
                </a>
              </div>
            </div>

            <div>
              {status === "success" ? (
                <div style={{
                  padding: "40px 36px", border: "1px solid var(--pub-line)", borderRadius: 2,
                  textAlign: "center",
                }}>
                  <div style={{ fontFamily: "var(--pub-serif)", fontSize: 26, color: "var(--pub-ink)", marginBottom: 12, fontWeight: 400 }}>
                    Application received.
                  </div>
                  <p style={{ fontSize: 15, color: "var(--pub-muted)", lineHeight: 1.7, maxWidth: "36ch", margin: "0 auto 24px" }}>
                    We will review your application and follow up by email within one business day.
                  </p>
                  <Link href="/" style={{
                    display: "inline-block",
                    background: "var(--pub-forest)", color: "var(--pub-stone)",
                    fontSize: 14, padding: "12px 22px", textDecoration: "none", borderRadius: 2,
                  }}>
                    Back to home
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Full name *</label>
                      <input required name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Company name *</label>
                      <input required name="company" value={form.company} onChange={handleChange} placeholder="Smith Design Studio" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Email address *</label>
                      <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@smithdesign.com" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone number</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(949) 555-0100" style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Trade type *</label>
                    <select required name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                      <option value="">Select your trade type</option>
                      <option value="interior-designer">Interior designer</option>
                      <option value="general-contractor">General contractor</option>
                      <option value="architect">Architect</option>
                      <option value="kitchen-bath-designer">Kitchen and bath designer</option>
                      <option value="flooring-installer">Flooring installer / subcontractor</option>
                      <option value="developer-investor">Real estate developer / investor</option>
                      <option value="property-manager">Property manager</option>
                      <option value="home-stager">Home stager</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>License number (if applicable)</label>
                    <input name="license" value={form.license} onChange={handleChange} placeholder="CA contractor license, ASID member number, etc." style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>Tell us about your work</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Projects you typically work on, volume expectations, any specific needs..."
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  {status === "error" && (
                    <p style={{ fontSize: 14, color: "#B44", margin: 0 }}>
                      Something went wrong. Email us at info@usfloordesign.com to apply directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    style={{
                      background: status === "submitting" ? "var(--pub-muted)" : "var(--pub-forest)",
                      color: "var(--pub-stone)",
                      border: "none", borderRadius: 2,
                      fontSize: 15, padding: "15px 28px",
                      cursor: status === "submitting" ? "default" : "pointer",
                      fontFamily: "var(--pub-sans)", width: "fit-content",
                    }}
                  >
                    {status === "submitting" ? "Submitting…" : "Submit application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

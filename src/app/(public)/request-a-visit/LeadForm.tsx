"use client";
import { useActionState, useState } from "react";
import { submitLeadAction, type SubmitLeadState } from "./actions";
import Link from "next/link";

const F = {
  label: { fontSize: 13, fontWeight: 500, color: "var(--pub-ink)", display: "block", marginBottom: 6 },
  input: {
    display: "block", width: "100%", padding: "10px 12px", borderRadius: 2,
    border: "1px solid var(--pub-line)", background: "#fff", fontSize: 14,
    color: "var(--pub-ink)", outline: "none", boxSizing: "border-box" as const,
    fontFamily: "var(--pub-sans)",
  },
  group: { display: "flex", flexDirection: "column" as const, gap: 4 },
  required: { color: "var(--pub-brass)", marginLeft: 2 },
} as const;

const JOB_OPTIONS = [
  { value: "flooring", label: "Flooring" },
  { value: "kitchen", label: "Kitchen" },
  { value: "bathroom", label: "Bathroom" },
  { value: "wholeHome", label: "Whole-home" },
  { value: "other", label: "Other" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderBottom: "1px solid var(--pub-line)", paddingBottom: 12, marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 22, color: "var(--pub-ink)" }}>
        {children}
      </h2>
    </div>
  );
}

export default function LeadForm() {
  const [state, action, pending] = useActionState<SubmitLeadState, FormData>(
    submitLeadAction,
    { status: "idle" }
  );
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  function toggleJob(value: string) {
    setSelectedJobs((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  if (state.status === "success") {
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", padding: "80px 0" }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--pub-forest)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", marginBottom: 16 }}>
          Thank you for choosing US Floor Design Center.
        </h1>
        <p style={{ fontSize: 16, color: "var(--pub-muted)", lineHeight: 1.65, margin: "0 auto 32px", maxWidth: "40ch" }}>
          A representative will contact you shortly to schedule your showroom visit.
        </p>
        <Link href="/" style={{
          display: "inline-block", background: "var(--pub-forest)", color: "var(--pub-stone)",
          fontSize: 14, padding: "12px 24px", textDecoration: "none", borderRadius: 2,
        }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {/* Hidden field for multi-select job types */}
      <input type="hidden" name="jobTypes" value={selectedJobs.join(",")} />

      {state.status === "error" && (
        <div style={{
          background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 2,
          padding: "12px 16px", fontSize: 14, color: "#991b1b",
        }}>
          {state.message}
        </div>
      )}

      {/* Project type */}
      <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <SectionHeading>About your project</SectionHeading>

        <div style={F.group}>
          <label style={F.label}>
            What kind of project is this?<span style={F.required}>*</span>
          </label>
          <p style={{ fontSize: 12, color: "var(--pub-muted)", marginBottom: 8 }}>
            Select all that apply.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {JOB_OPTIONS.map((opt) => {
              const checked = selectedJobs.includes(opt.value);
              return (
                <label key={opt.value} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  border: `1px solid ${checked ? "var(--pub-forest)" : "var(--pub-line)"}`,
                  background: checked ? "rgba(47,74,56,0.06)" : "transparent",
                  borderRadius: 2, padding: "10px 14px",
                  cursor: "pointer", fontSize: 14,
                  transition: "border-color .15s, background .15s",
                }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleJob(opt.value)}
                    style={{ accentColor: "var(--pub-forest)", width: 15, height: 15 }}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={F.group}>
            <label style={F.label}>Do you own or rent?<span style={F.required}>*</span></label>
            <select name="propertyType" style={F.input} defaultValue="own">
              <option value="own">I own the property</option>
              <option value="rent">I rent (have landlord approval)</option>
            </select>
          </div>
          <div style={F.group}>
            <label style={F.label}>Approximate square footage</label>
            <input name="sqft" type="number" min={1} max={50000} placeholder="e.g. 400" style={F.input} />
          </div>
        </div>

        <div style={F.group}>
          <label style={F.label}>Does the project involve structural changes?</label>
          <p style={{ fontSize: 12, color: "var(--pub-muted)", marginBottom: 8 }}>
            Moving walls, plumbing relocation, electrical work, etc.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }].map((opt) => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                <input type="radio" name="hasStructural" value={opt.value} defaultChecked={opt.value === "no"} style={{ accentColor: "var(--pub-forest)" }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Tell us more */}
      <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <SectionHeading>Tell us more</SectionHeading>

        <div style={F.group}>
          <label style={F.label}>
            Describe your project<span style={F.required}>*</span>
          </label>
          <textarea
            name="description"
            rows={5}
            placeholder="What are you hoping to change? What does the space look like now? Any specific materials, styles, or brands you have in mind?"
            required
            style={{ ...F.input, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={F.group}>
            <label style={F.label}>Budget range (optional)</label>
            <select name="budgetRange" style={F.input} defaultValue="">
              <option value="">Prefer not to say</option>
              <option value="under10k">Under $10,000</option>
              <option value="10k-25k">$10,000 to $25,000</option>
              <option value="25k-50k">$25,000 to $50,000</option>
              <option value="50k-100k">$50,000 to $100,000</option>
              <option value="over100k">$100,000 and above</option>
            </select>
          </div>
          <div style={F.group}>
            <label style={F.label}>
              When would you like to start?<span style={F.required}>*</span>
            </label>
            <select name="timeframe" style={F.input} required defaultValue="">
              <option value="" disabled>Select a timeframe</option>
              <option value="asap">As soon as possible</option>
              <option value="withinMonth">Within the next month</option>
              <option value="oneToThreeMonths">1 to 3 months</option>
              <option value="threeToSixMonths">3 to 6 months</option>
              <option value="flexible">Just planning ahead</option>
            </select>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <SectionHeading>Your contact info</SectionHeading>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={F.group}>
            <label style={F.label}>First name<span style={F.required}>*</span></label>
            <input name="firstName" type="text" required placeholder="Maria" style={F.input} />
          </div>
          <div style={F.group}>
            <label style={F.label}>Last name<span style={F.required}>*</span></label>
            <input name="lastName" type="text" required placeholder="Garcia" style={F.input} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={F.group}>
            <label style={F.label}>Email<span style={F.required}>*</span></label>
            <input name="email" type="email" required placeholder="you@example.com" style={F.input} />
          </div>
          <div style={F.group}>
            <label style={F.label}>Phone<span style={F.required}>*</span></label>
            <input name="phone" type="tel" required placeholder="(714) 555-0100" style={F.input} />
          </div>
        </div>

        <div style={F.group}>
          <label style={F.label}>Service address<span style={F.required}>*</span></label>
          <input name="addressLine1" type="text" required placeholder="Street address" style={{ ...F.input, marginBottom: 8 }} />
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
            <input name="city" type="text" required placeholder="City" style={F.input} />
            <input name="state" type="text" required placeholder="State" defaultValue="CA" style={F.input} />
            <input name="zip" type="text" required placeholder="ZIP" style={F.input} />
          </div>
        </div>
      </section>

      <div style={{ paddingTop: 8, paddingBottom: 40 }}>
        <button
          type="submit"
          disabled={pending}
          style={{
            background: pending ? "#8CAA96" : "var(--pub-forest)",
            color: "var(--pub-stone)", fontSize: 15, fontWeight: 500,
            padding: "16px 32px", border: "none", borderRadius: 2,
            cursor: pending ? "not-allowed" : "pointer",
            fontFamily: "var(--pub-sans)",
          }}
        >
          {pending ? "Sending..." : "Send my request"}
        </button>
        <p style={{ marginTop: 12, fontSize: 12, color: "var(--pub-muted)" }}>
          We review every request personally and reply within one business day.
        </p>
      </div>
    </form>
  );
}

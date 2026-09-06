"use client";

import { useState } from "react";

type FieldErrors = Record<string, string>;

const REQUIRED_FIELDS = [
  "full_name",
  "email",
  "phone",
  "target_area",
  "purchase_price",
  "timeline",
  "has_agent",
  "consent",
];

const inputStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 0,
  padding: "14px 16px",
  fontSize: "var(--t-body)",
  fontFamily: "var(--font-body)",
  width: "100%",
  boxSizing: "border-box",
  color: "var(--text)",
  background: "var(--surface)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "var(--t-label)",
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "var(--text)",
  display: "block",
  marginBottom: "var(--s-2)",
};

const fieldWrapStyle: React.CSSProperties = {
  marginBottom: "var(--s-5)",
};

const errorStyle: React.CSSProperties = {
  color: "var(--red)",
  fontSize: "var(--t-small)",
  marginTop: "var(--s-1)",
  display: "block",
};

export default function InvestorForm() {
  const [timestamp] = useState<string>(() => Date.now().toString());
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [fields, setFields] = useState({
    full_name: "",
    email: "",
    phone: "",
    target_area: "",
    purchase_price: "",
    reno_budget: "",
    financing: "",
    experience: "",
    timeline: "",
    has_agent: "",
    property_address: "",
    notes: "",
    consent: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFields((prev) => ({ ...prev, [target.name]: value }));
    if (errors[target.name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[target.name];
        return next;
      });
    }
  }

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!fields.full_name.trim()) errs.full_name = "Name is required.";
    if (!fields.email.trim()) errs.email = "Email is required.";
    if (!fields.phone.trim()) errs.phone = "Phone is required.";
    if (!fields.target_area.trim()) errs.target_area = "Target area is required.";
    if (!fields.purchase_price) errs.purchase_price = "Purchase price range is required.";
    if (!fields.timeline) errs.timeline = "Timeline is required.";
    if (!fields.has_agent) errs.has_agent = "Please indicate if you have an agent.";
    if (!fields.consent) errs.consent = "You must agree to be contacted.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Honeypot / timing check: silently succeed
    const elapsed = Date.now() - parseInt(timestamp, 10);
    if (honeypot || elapsed < 3000) {
      setSubmitted(true);
      return;
    }

    setSubmitting(true);
    try {
      // TODO [DECIDE]: configure form destination email or CRM
      const res = await fetch("/api/investors/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, _t: timestamp }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        // Catch non-ok and still show success (UI stub)
        setSubmitted(true);
      }
    } catch {
      // Endpoint may not exist yet: show success anyway as UI stub
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function focusStyle(name: string): React.CSSProperties {
    return errors[name]
      ? { ...inputStyle, border: "2px solid var(--red)" }
      : inputStyle;
  }

  if (submitted) {
    return (
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "var(--s-7) var(--s-5)",
          background: "var(--surface-alt)",
          borderLeft: "2px solid var(--red)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--t-h3)",
            lineHeight: 1.25,
            color: "var(--text)",
            marginBottom: "var(--s-3)",
          }}
        >
          We received your inquiry.
        </h3>
        <p
          style={{
            fontSize: "var(--t-body)",
            lineHeight: 1.45,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          Someone from our team will follow up within one business day. If you already shared a property address, we will look it up before we call.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      {/* Honeypot */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: "none" }}
      />
      {/* Timestamp */}
      <input type="hidden" name="_t" value={timestamp} />

      {/* Global error */}
      {globalError && (
        <div
          aria-live="polite"
          style={{
            color: "var(--text-muted)",
            fontSize: "var(--t-small)",
            marginBottom: "var(--s-4)",
          }}
        >
          {globalError}
        </div>
      )}

      {/* aria-live region for field errors */}
      <div aria-live="polite" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        {Object.values(errors).join(". ")}
      </div>

      {/* full_name */}
      <div style={fieldWrapStyle}>
        <label htmlFor="full_name" style={labelStyle}>Full Name</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          value={fields.full_name}
          onChange={handleChange}
          aria-describedby={errors.full_name ? "err-full_name" : undefined}
          style={focusStyle("full_name")}
        />
        {errors.full_name && (
          <span id="err-full_name" style={errorStyle}>{errors.full_name}</span>
        )}
      </div>

      {/* email */}
      <div style={fieldWrapStyle}>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={fields.email}
          onChange={handleChange}
          aria-describedby={errors.email ? "err-email" : undefined}
          style={focusStyle("email")}
        />
        {errors.email && (
          <span id="err-email" style={errorStyle}>{errors.email}</span>
        )}
      </div>

      {/* phone */}
      <div style={fieldWrapStyle}>
        <label htmlFor="phone" style={labelStyle}>Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={fields.phone}
          onChange={handleChange}
          aria-describedby={errors.phone ? "err-phone" : undefined}
          style={focusStyle("phone")}
        />
        {errors.phone && (
          <span id="err-phone" style={errorStyle}>{errors.phone}</span>
        )}
      </div>

      {/* target_area */}
      <div style={fieldWrapStyle}>
        <label htmlFor="target_area" style={labelStyle}>Target City or Area</label>
        <input
          id="target_area"
          name="target_area"
          type="text"
          required
          placeholder="Target city or area"
          value={fields.target_area}
          onChange={handleChange}
          aria-describedby={errors.target_area ? "err-target_area" : undefined}
          style={focusStyle("target_area")}
        />
        {errors.target_area && (
          <span id="err-target_area" style={errorStyle}>{errors.target_area}</span>
        )}
      </div>

      {/* purchase_price */}
      <div style={fieldWrapStyle}>
        <label htmlFor="purchase_price" style={labelStyle}>Purchase Price Range</label>
        <select
          id="purchase_price"
          name="purchase_price"
          required
          value={fields.purchase_price}
          onChange={handleChange}
          aria-describedby={errors.purchase_price ? "err-purchase_price" : undefined}
          style={focusStyle("purchase_price")}
        >
          <option value="">Select a range</option>
          <option value="under_500k">Under $500,000</option>
          <option value="500k_750k">$500,000 to $750,000</option>
          <option value="750k_1m">$750,000 to $1M</option>
          <option value="1m_1_5m">$1M to $1.5M</option>
          <option value="1_5m_2m">$1.5M to $2M</option>
          <option value="over_2m">Over $2M</option>
          <option value="not_sure">Not sure yet</option>
        </select>
        {errors.purchase_price && (
          <span id="err-purchase_price" style={errorStyle}>{errors.purchase_price}</span>
        )}
      </div>

      {/* reno_budget */}
      <div style={fieldWrapStyle}>
        <label htmlFor="reno_budget" style={labelStyle}>Renovation Budget</label>
        <select
          id="reno_budget"
          name="reno_budget"
          value={fields.reno_budget}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select a range (optional)</option>
          <option value="under_50k">Under $50,000</option>
          <option value="50k_100k">$50,000 to $100,000</option>
          <option value="100k_200k">$100,000 to $200,000</option>
          <option value="200k_350k">$200,000 to $350,000</option>
          <option value="over_350k">Over $350,000</option>
          <option value="advise">Want us to advise</option>
        </select>
      </div>

      {/* financing */}
      <div style={fieldWrapStyle}>
        <label htmlFor="financing" style={labelStyle}>Financing</label>
        <select
          id="financing"
          name="financing"
          value={fields.financing}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select (optional)</option>
          <option value="cash">Cash</option>
          <option value="conventional">Conventional loan</option>
          <option value="hard_money">Hard money or bridge</option>
          <option value="not_arranged">Not arranged yet</option>
        </select>
      </div>

      {/* experience */}
      <div style={fieldWrapStyle}>
        <label htmlFor="experience" style={labelStyle}>Investment Experience</label>
        <select
          id="experience"
          name="experience"
          value={fields.experience}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Select (optional)</option>
          <option value="first">This would be my first</option>
          <option value="1_3">One to three properties</option>
          <option value="4_plus">Four or more</option>
        </select>
      </div>

      {/* timeline */}
      <div style={fieldWrapStyle}>
        <label htmlFor="timeline" style={labelStyle}>Timeline</label>
        <select
          id="timeline"
          name="timeline"
          required
          value={fields.timeline}
          onChange={handleChange}
          aria-describedby={errors.timeline ? "err-timeline" : undefined}
          style={focusStyle("timeline")}
        >
          <option value="">Select a timeline</option>
          <option value="ready_now">Ready now</option>
          <option value="1_3_months">One to three months</option>
          <option value="3_6_months">Three to six months</option>
          <option value="researching">Just researching</option>
        </select>
        {errors.timeline && (
          <span id="err-timeline" style={errorStyle}>{errors.timeline}</span>
        )}
      </div>

      {/* has_agent */}
      <div style={fieldWrapStyle}>
        <label htmlFor="has_agent" style={labelStyle}>Are You Working With an Agent?</label>
        <select
          id="has_agent"
          name="has_agent"
          required
          value={fields.has_agent}
          onChange={handleChange}
          aria-describedby={errors.has_agent ? "err-has_agent" : undefined}
          style={focusStyle("has_agent")}
        >
          <option value="">Select an option</option>
          <option value="yes">Yes, I have an agent</option>
          <option value="no">No, I would like an introduction</option>
        </select>
        {errors.has_agent && (
          <span id="err-has_agent" style={errorStyle}>{errors.has_agent}</span>
        )}
      </div>

      {/* property_address */}
      <div style={fieldWrapStyle}>
        <label htmlFor="property_address" style={labelStyle}>Property Address</label>
        <input
          id="property_address"
          name="property_address"
          type="text"
          placeholder="Property address, if you have one"
          value={fields.property_address}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* notes */}
      <div style={fieldWrapStyle}>
        <label htmlFor="notes" style={labelStyle}>Anything Else We Should Know</label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Anything else we should know"
          value={fields.notes}
          onChange={handleChange}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* consent */}
      <div style={{ ...fieldWrapStyle, display: "flex", alignItems: "flex-start", gap: "var(--s-3)" }}>
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          checked={fields.consent}
          onChange={handleChange}
          aria-describedby={errors.consent ? "err-consent" : undefined}
          style={{ marginTop: 3, flexShrink: 0 }}
        />
        <div>
          <label
            htmlFor="consent"
            style={{
              fontSize: "var(--t-body)",
              fontFamily: "var(--font-body)",
              color: "var(--text)",
              cursor: "pointer",
            }}
          >
            I agree to be contacted about this inquiry.
          </label>
          {errors.consent && (
            <span id="err-consent" style={errorStyle}>{errors.consent}</span>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          background: "var(--red)",
          color: "var(--text-invert)",
          fontSize: "var(--t-btn)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "14px 28px",
          borderRadius: 0,
          border: "none",
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--red-deep)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--red)";
        }}
      >
        {submitting ? "Submitting..." : "REQUEST A FEASIBILITY STUDY"}
      </button>

      <p
        style={{
          fontSize: "var(--t-small)",
          color: "var(--text-muted)",
          textAlign: "center",
          marginTop: "var(--s-4)",
        }}
      >
        We do not share your information. There is no cost or obligation to submit this form.
      </p>
    </form>
  );
}

"use client";

import { useState, useRef, useId } from "react";

const ROLES = ["Showroom Sales Consultant", "General interest"];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "var(--t-label)",
  fontFamily: "var(--font-body)",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: "var(--s-2)",
};

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid var(--line)",
  borderRadius: 0,
  fontSize: "var(--t-body)",
  fontFamily: "var(--font-body)",
  background: "var(--surface)",
  color: "var(--text)",
  outline: "none",
  appearance: "none",
  WebkitAppearance: "none",
};

interface Props {
  defaultRole?: string;
}

export default function ApplicationForm({ defaultRole = "General interest" }: Props) {
  const id = useId();
  const tRef = useRef(String(Date.now()));
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors([]);
    setStatus("submitting");

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("_t", tRef.current);

    const resume = fd.get("resume") as File | null;
    if (resume && resume.size > 0) {
      if (resume.size > 5 * 1024 * 1024) {
        setErrors(["Resume must be under 5 MB."]);
        setStatus("error");
        return;
      }
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(resume.type)) {
        setErrors(["Resume must be a PDF or Word document (.pdf, .doc, .docx)."]);
        setStatus("error");
        return;
      }
    } else {
      fd.delete("resume");
    }

    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: fd });
      const json = await res.json();
      if (json.ok) {
        setStatus("success");
      } else {
        setErrors(
          json.fields
            ? [`Please fill in all required fields.`]
            : ["Something went wrong. Please try again."],
        );
        setStatus("error");
      }
    } catch {
      setErrors(["Network error. Please try again."]);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        style={{
          padding: "var(--s-8) var(--s-6)",
          textAlign: "center",
          background: "var(--surface-alt)",
        }}
      >
        <p
          style={{
            fontSize: "var(--t-h3)",
            fontFamily: "var(--font-display)",
            marginBottom: "var(--s-4)",
            fontWeight: 400,
          }}
        >
          Application received.
        </p>
        <p
          style={{
            fontSize: "var(--t-body)",
            color: "var(--text-muted)",
            maxWidth: "48ch",
            margin: "0 auto",
            lineHeight: 1.55,
          }}
        >
          We aim to respond to everyone within one week, including the people we are not
          moving forward with. You will hear from us.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .careers-field:focus {
          border-color: var(--red) !important;
          box-shadow: 0 0 0 1px var(--red);
        }
      `}</style>

      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <input type="hidden" name="_t" value={tRef.current} />
        <input
          type="text"
          name="website"
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ marginBottom: errors.length ? "var(--s-5)" : 0 }}
        >
          {errors.map((err, i) => (
            <p
              key={i}
              role="alert"
              style={{
                color: "var(--red)",
                fontSize: "var(--t-small)",
                marginBottom: "var(--s-2)",
              }}
            >
              {err}
            </p>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--s-5)",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor={`${id}-name`} style={labelStyle}>
              Full name *
            </label>
            <input
              id={`${id}-name`}
              name="full_name"
              type="text"
              required
              className="careers-field"
              style={baseInputStyle}
            />
          </div>

          <div>
            <label htmlFor={`${id}-email`} style={labelStyle}>
              Email *
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              required
              className="careers-field"
              style={baseInputStyle}
            />
          </div>

          <div>
            <label htmlFor={`${id}-phone`} style={labelStyle}>
              Phone *
            </label>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              required
              className="careers-field"
              style={baseInputStyle}
            />
          </div>

          <div>
            <label htmlFor={`${id}-role`} style={labelStyle}>
              Role *
            </label>
            <select
              id={`${id}-role`}
              name="role"
              required
              defaultValue={defaultRole}
              className="careers-field"
              style={{ ...baseInputStyle, cursor: "pointer" }}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-city`} style={labelStyle}>
              City you live in *
            </label>
            <input
              id={`${id}-city`}
              name="city"
              type="text"
              required
              className="careers-field"
              style={baseInputStyle}
            />
          </div>

          <div>
            <label htmlFor={`${id}-auth`} style={labelStyle}>
              Authorized to work in the United States? *
            </label>
            <select
              id={`${id}-auth`}
              name="work_auth"
              required
              defaultValue=""
              className="careers-field"
              style={{ ...baseInputStyle, cursor: "pointer" }}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor={`${id}-sat`} style={labelStyle}>
              Available to work Saturdays on a rotation? *
            </label>
            <select
              id={`${id}-sat`}
              name="saturdays"
              required
              defaultValue=""
              className="careers-field"
              style={{ ...baseInputStyle, cursor: "pointer", maxWidth: 360 }}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="discuss">Let&rsquo;s discuss</option>
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor={`${id}-followup`} style={labelStyle}>
              Tell us about a time you followed up with someone until you got an answer. *
            </label>
            <textarea
              id={`${id}-followup`}
              name="followup"
              required
              rows={5}
              className="careers-field"
              style={{ ...baseInputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor={`${id}-history`} style={labelStyle}>
              What kind of work have you done before?
            </label>
            <textarea
              id={`${id}-history`}
              name="work_history"
              rows={3}
              className="careers-field"
              style={{ ...baseInputStyle, resize: "vertical" }}
            />
          </div>

          <div>
            <label htmlFor={`${id}-resume`} style={labelStyle}>
              Resume (optional, PDF or DOC, 5 MB max)
            </label>
            <input
              id={`${id}-resume`}
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className="careers-field"
              style={{ ...baseInputStyle, padding: "8px 12px", cursor: "pointer" }}
            />
          </div>

          <div>
            <label htmlFor={`${id}-linkedin`} style={labelStyle}>
              LinkedIn or other link
            </label>
            <input
              id={`${id}-linkedin`}
              name="linkedin"
              type="url"
              placeholder="https://"
              className="careers-field"
              style={baseInputStyle}
            />
          </div>

          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              gap: "var(--s-3)",
              alignItems: "flex-start",
            }}
          >
            <input
              id={`${id}-consent`}
              name="consent"
              type="checkbox"
              required
              value="yes"
              style={{ marginTop: 4, flexShrink: 0, accentColor: "var(--red)" }}
            />
            <label
              htmlFor={`${id}-consent`}
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text)",
                lineHeight: 1.5,
                cursor: "pointer",
              }}
            >
              I agree to be contacted about this application. *
            </label>
          </div>
        </div>

        <div style={{ marginTop: "var(--s-6)" }}>
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "16px 32px",
              background: status === "submitting" ? "var(--text-muted)" : "var(--red)",
              color: "var(--text-invert)",
              border: "none",
              borderRadius: 0,
              cursor: status === "submitting" ? "default" : "pointer",
              transition: "background var(--dur) var(--ease)",
            }}
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </>
  );
}

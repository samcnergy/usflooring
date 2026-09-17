"use client";

import { useState } from "react";

const BOILERPLATE = [
  {
    id: "short",
    label: "Short — 26 words",
    text: "US Floor Design Center is a design-build firm in Rancho Santa Margarita, California, serving homeowners, medical practices, retailers, and real estate investors across South Orange County.",
  },
  {
    id: "medium",
    label: "Medium — 56 words",
    text: "US Floor Design Center is a design-build firm in Rancho Santa Margarita, California. The business has operated in Orange County for 30 years and has completed over 800 projects. It handles residential and commercial work, including medical offices, retail buildouts, investment properties, kitchens, and bathrooms, with pre-construction, design, permitting, installation, and warranty managed by one team.",
  },
  {
    id: "long",
    label: "Long — 114 words",
    text: "US Floor Design Center is a design-build firm in Rancho Santa Margarita, California, serving homeowners, medical practices, retailers, and real estate investors across South Orange County. The business has operated in Orange County for 30 years and has completed more than 800 projects. Parham Shariat and Shirin Salamat lead the business, with the same crews and supplier relationships in place and the order and scheduling systems the business had not previously had.\n\nThe company handles residential and commercial projects, including medical offices, retail buildouts, investment properties, kitchens, bathrooms, backyards, and windows and doors, covering pre-construction, design, material selection, permitting, installation, and warranty. It also produces renovation feasibility studies for investors before a property purchase.",
  },
];

export default function BoilerplatePanels() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
      {BOILERPLATE.map((item) => (
        <div
          key={item.id}
          style={{ border: "1px solid var(--line)", padding: "var(--s-5)" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--s-4)",
              gap: "var(--s-4)",
            }}
          >
            <span
              style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              {item.label}
            </span>
            <button
              onClick={() => copy(item.id, item.text)}
              style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 16px",
                background: copied === item.id ? "var(--text)" : "var(--red)",
                color: "var(--text-invert)",
                border: "none",
                borderRadius: 0,
                cursor: "pointer",
                flexShrink: 0,
                transition: "background var(--dur) var(--ease)",
              }}
            >
              {copied === item.id ? "Copied" : "Copy"}
            </button>
          </div>
          <p
            style={{
              fontSize: "var(--t-body)",
              lineHeight: 1.55,
              color: "var(--text)",
              margin: 0,
              whiteSpace: "pre-line",
            }}
          >
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

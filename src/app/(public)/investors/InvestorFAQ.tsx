"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "./faqData";

export default function InvestorFAQ() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div style={{ maxWidth: 760 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          style={{
            borderTop: "1px solid var(--line)",
            borderBottom: i === FAQ_ITEMS.length - 1 ? "1px solid var(--line)" : undefined,
          }}
        >
          <button
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "var(--s-5) 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--t-h3)",
                lineHeight: 1.25,
                color: "var(--text)",
                paddingRight: "var(--s-5)",
              }}
            >
              {item.q}
            </span>
            <span
              aria-hidden="true"
              style={{
                color: "var(--red)",
                fontSize: 20,
                fontWeight: 700,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {open === i ? "−" : "+"}
            </span>
          </button>

          {open === i && (
            <p
              style={{
                fontSize: "var(--t-body)",
                lineHeight: 1.45,
                color: "var(--text-muted)",
                padding: "0 0 var(--s-5)",
                margin: 0,
              }}
            >
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

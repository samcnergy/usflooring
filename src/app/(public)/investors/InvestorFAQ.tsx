"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Do I have to use your agent?",
    a: "No. If you already have an agent, we work with them. If you do not, we can introduce you to one from our network. You are never required to use anyone we recommend, and we are not paid by you for that introduction.",
  },
  {
    q: "What does the feasibility study cost?",
    a: "[TODO: Set study pricing before publishing. Two options: free or fee-credited. See open decisions in INVESTOR-PAGE.md.]",
  },
  {
    q: "What happens if the numbers do not work?",
    a: "Then you do not buy, and that is a good outcome. The study exists to kill bad deals before your money is in them. We would rather tell you to walk than build a renovation that does not pencil.",
  },
  {
    q: "Is the construction price fixed?",
    a: "Yes, against the scope in the study. If you change the scope after work begins, or if we open a wall and find a condition that could not be seen on walkthrough, that is handled by written change order with pricing before the work proceeds.",
  },
  {
    q: "Who pulls the permits?",
    a: "We do, as the licensed contractor of record. Plan check and inspection scheduling are ours to manage.",
  },
  {
    q: "How long does a typical renovation take?",
    a: "It depends on scope and on the city's plan check queue. Your study gives a schedule in weeks for that specific property, and we track against it.",
  },
  {
    q: "Do you work outside Orange County?",
    a: "[TODO: Confirm service area radius before publishing.]",
  },
  {
    q: "Can you manage the property after the renovation?",
    a: "We are a design and build firm, not a property manager. We can refer you to managers we have worked with.",
  },
];

export { FAQ_ITEMS };

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

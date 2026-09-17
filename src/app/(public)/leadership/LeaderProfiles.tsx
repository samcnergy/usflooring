// Owner profiles, shared by /about and /leadership so the bios stay in sync.

const LEADERS = [
  {
    name: "Parham Shariat",
    role: "Owner and Operator",
    photo: "/parham-shariat.png",
    paragraphs: [
      "Parham spent four-plus years as a senior project manager at Millennium Tile and Marble, where he managed installation projects across Southern California, before joining US Floor. Before that, between 2003 and 2012, he was involved in purchasing and renovating residential properties for sale - which is how he came to understand what a remodel actually costs, what takes time, and where things go wrong.",
      "He is also a systems builder. He built the order-management and e-commerce platform that runs this business. He has 20-plus years of executive and engineering experience, including managing mission-critical systems for a major healthcare network.",
      "He is a published author of five books, including a book on generative engine optimization - the discipline of making businesses visible in AI-generated search results. He holds AI certifications from the Wharton School.",
    ],
    tags: [
      "4+ years at Millennium Tile and Marble",
      "Residential renovation since 2003",
      "Published author - 5 books",
      "Wharton AI certifications",
      "20+ years executive and engineering",
    ],
  },
  {
    name: "Shirin Salamat",
    role: "Co-Owner",
    photo: "/shirin-salamat.png",
    paragraphs: [
      "Shirin is an attorney with 22 years of legal experience. She has been a member of the Iran Central Bar Association since 2004 and has represented multinational companies including Procter and Gamble and Werner throughout her career.",
      "At US Floor, she is responsible for vendor agreements, supplier negotiations, and the legal and contractual framework that protects the business and its customers. She also has a strong network across Orange County that contributes to the business's referral base.",
    ],
    tags: [
      "22 years legal experience",
      "Iran Central Bar Association since 2004",
      "Multinational corporate representation",
      "Orange County network",
    ],
  },
];

export default function LeaderProfiles() {
  return (
    <div className="leader-grid">
      <style>{`
        .leader-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-8); }
        @media (max-width: 768px) {
          .leader-grid { grid-template-columns: 1fr; gap: var(--s-6); }
        }
      `}</style>
      {LEADERS.map((p) => (
        <div key={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.photo}
            alt={`${p.name} - ${p.role}, US Floor Design Center`}
            style={{ width: "100%", maxWidth: 280, height: 340, objectFit: "cover", objectPosition: "center top", display: "block", marginBottom: "var(--s-5)", border: "1px solid var(--line)" }}
          />
          <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--s-3)" }}>{p.role}</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text)", marginBottom: "var(--s-5)" }}>{p.name}</h3>
          {p.paragraphs.map((text, i) => (
            <p key={i} style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: i === p.paragraphs.length - 1 ? "var(--s-6)" : "var(--s-4)" }}>
              {text}
            </p>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
            {p.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: "var(--t-small)",
                padding: "var(--s-1) var(--s-3)",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                color: "var(--text)",
              }}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

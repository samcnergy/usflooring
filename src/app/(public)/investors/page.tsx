import Link from "next/link";
import Image from "next/image";
import InvestorFAQ from "./InvestorFAQ";
import { FAQ_ITEMS } from "./faqData";
import InvestorForm from "./InvestorForm";

export const metadata = {
  title: "Real Estate Investor Renovation Services | US Floor Design Center",
  description:
    "We price the renovation before you buy. Feasibility studies, fixed construction costs, and in-house build for property investors in Orange County.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Investment property renovation and feasibility analysis",
  provider: {
    "@type": "HomeAndConstructionBusiness",
    name: "US Floor Design Center",
    areaServed: "Orange County, California",
    address: {
      "@type": "PostalAddress",
      streetAddress: "30092 Santa Margarita Pkwy, Suite G",
      addressLocality: "Rancho Santa Margarita",
      addressRegion: "CA",
      postalCode: "92688",
      addressCountry: "US",
    },
    telephone: "+16196267545",
  },
  audience: { "@type": "Audience", audienceType: "Real estate investors" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Investor services",
    itemListElement: [
      "Renovation feasibility study",
      "Fixed-price renovation",
      "Material selection and procurement",
      "Permit management",
    ],
  },
};

const STEPS = [
  {
    num: "01",
    label: "SOURCE",
    h3: "We bring you the property.",
    body: "We work with a network of agents across Orange County who send us properties before they are widely marketed. We screen for the ones where renovation actually creates value: dated kitchens and baths, poor layouts, worn flooring, deferred maintenance. Cosmetic problems on a sound building.",
  },
  {
    num: "02",
    label: "STUDY",
    h3: "We price the renovation in writing.",
    body: "You receive a feasibility study on that specific property. Scope of work room by room, material selections at showroom pricing, a fixed construction cost, a build schedule in weeks, and the permit path. It is the same document our crews build from.",
  },
  {
    num: "03",
    label: "ACQUIRE",
    h3: "You buy the property.",
    body: "You make the offer with the renovation cost already known. Your agent handles the transaction. We do not hold your funds and we are not a party to the purchase.",
  },
  {
    num: "04",
    label: "BUILD",
    h3: "We renovate it.",
    body: "One contract, one team, one schedule. Design, demolition, permits, trades, materials, and installation are handled in house. You get scheduled progress updates and a single point of contact. You never manage a subcontractor.",
  },
  {
    num: "05",
    label: "EXIT",
    h3: "You sell or you rent.",
    body: "When the work passes final walkthrough, the decision is yours. If you sell, we coordinate staging with your agent. If you hold, you own a property renovated to rental standard with a written warranty on the work.",
  },
];

const DELIVERABLE_ITEMS = [
  "Scope of work, room by room",
  "Material and finish selections, priced at showroom cost",
  "A fixed construction cost, not a range",
  "Build schedule in weeks, with the critical path identified",
  "Permit requirements and expected approval timeline",
  "Structural, electrical, and plumbing conditions found on walkthrough",
  "Photographs of existing conditions",
  "A list of the work we recommend against, and the reason",
];

const INVESTOR_CARDS = [
  {
    h3: "First property",
    body: "You have the capital and you have found the strategy. You have not run a renovation before and you would rather your first one not be the lesson.",
  },
  {
    h3: "Out of the area",
    body: "You are buying in Orange County from somewhere else. You need a licensed team on the ground who is accountable for the build and reachable by phone.",
  },
  {
    h3: "Repeat investor",
    body: "You already do this. You are tired of chasing subcontractors and reconciling four separate bids, and you want one contract and one schedule.",
  },
];

const WE_HANDLE = [
  "Property screening with our agent partners",
  "Walkthrough and written condition report",
  "Scope of work and fixed pricing",
  "Material selection and procurement",
  "Permits, plan check, and inspections",
  "Every trade, scheduled and supervised",
  "Daily site management",
  "Punch list and final walkthrough",
  "Written warranty on the work",
];

const YOU_HANDLE = [
  "The decision to buy",
  "Financing",
  "Holding costs",
  "Final approval on selections",
  "The decision to sell or rent",
];

// Section header eyebrow component (server-renderable)
function Eyebrow({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--s-3)",
        marginBottom: "var(--s-4)",
      }}
    >
      <div
        style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }}
      />
      <span
        style={{
          fontSize: "var(--t-label)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: dark ? "var(--text-invert-muted)" : "var(--text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function InvestorsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD: Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* JSON-LD: FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============================================================
          SECTION 1: HERO
      ============================================================ */}
      <section
        style={{
          position: "relative",
          height: 680,
          overflow: "hidden",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        {/* Background image */}
        <Image
          src="/kitchen-flooring.png"
          alt="Completed renovation by US Floor Design Center"
          fill
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
          priority
        />

        {/* Top gradient overlay for nav legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.60) 0%, transparent 100%)",
            zIndex: 1,
          }}
        />

        {/* Scrim panel */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "42%",
            background: "var(--surface-scrim)",
            padding: "var(--s-7)",
            borderBottom: "1px solid var(--gold)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "var(--s-5)",
          }}
        >
          {/* Red rule */}
          <div style={{ width: 48, height: 2, background: "var(--red)" }} />

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-hero)",
              lineHeight: 1.08,
              color: "var(--text-invert)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Know what the renovation costs before you buy the property.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h3)",
              lineHeight: 1.25,
              color: "var(--text-invert-muted)",
              margin: 0,
            }}
          >
            Investor services from US Floor Design Center
          </p>

          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-invert-muted)",
              margin: 0,
            }}
          >
            We work with agents across Orange County to find properties worth
            renovating, then we price the work in writing before you commit. If
            the numbers work, you buy and we build. Every estimate is backed by
            thirty years and more than 800 completed projects.
          </p>

          <div>
            <Link
              href="#inquiry"
              style={{
                display: "inline-block",
                background: "var(--red)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              REQUEST A FEASIBILITY STUDY
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: THE PROBLEM
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="THE PROBLEM" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-6)",
              maxWidth: "20ch",
              fontWeight: 400,
            }}
          >
            Most flips are lost on the renovation number, not the purchase price.
          </h2>
          <div style={{ maxWidth: "68ch" }}>
            <p
              style={{
                fontSize: "var(--t-body-lg)",
                lineHeight: 1.35,
                color: "var(--text-muted)",
                margin: "0 0 var(--s-5)",
              }}
            >
              Investors rarely overpay for the property. They lose the margin on
              a renovation that was estimated from a walkthrough, bid by three
              contractors after closing, and delivered four months late. By the
              time the real number arrives, the deal is already done and the
              holding costs are running.
            </p>
            <p
              style={{
                fontSize: "var(--t-body-lg)",
                lineHeight: 1.35,
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              We reverse that order. The renovation is scoped, priced, and
              scheduled before you write the offer, by the same people who will
              do the work.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: THE PROCESS
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-alt)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="HOW IT WORKS" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-8)",
              fontWeight: 400,
            }}
          >
            Five steps from deal to exit.
          </h2>

          {/* Steps row */}
          <div style={{ position: "relative" }}>
            {/* Horizontal connector bar */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                right: 12,
                height: 2,
                background: "var(--line)",
                zIndex: 0,
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 0,
                position: "relative",
                zIndex: 1,
              }}
            >
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  style={{
                    flex: 1,
                    paddingRight: "var(--s-6)",
                  }}
                >
                  {/* Red square marker */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      background: "var(--red)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--s-4)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--text-invert)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Step label */}
                  <div
                    style={{
                      fontSize: "var(--t-label)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--red)",
                      marginBottom: "var(--s-3)",
                    }}
                  >
                    {step.label}
                  </div>

                  {/* h3 */}
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--t-h3)",
                      lineHeight: 1.25,
                      color: "var(--text)",
                      margin: "0 0 var(--s-3)",
                      fontWeight: 400,
                    }}
                  >
                    {step.h3}
                  </h3>

                  {/* body */}
                  <p
                    style={{
                      fontSize: "var(--t-body)",
                      lineHeight: 1.45,
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: FEASIBILITY STUDY CONTENTS
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: "var(--s-9)",
              alignItems: "start",
            }}
          >
            {/* Left column */}
            <div>
              <Eyebrow label="THE DELIVERABLE" />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h2)",
                  lineHeight: 1.14,
                  color: "var(--text)",
                  margin: "0 0 var(--s-5)",
                  fontWeight: 400,
                }}
              >
                A document you can underwrite from.
              </h2>
              <p
                style={{
                  fontSize: "var(--t-body-lg)",
                  lineHeight: 1.35,
                  color: "var(--text-muted)",
                  margin: "0 0 var(--s-6)",
                }}
              >
                The study is property-specific and it is written to be read by
                you, your lender, and your agent.
              </p>

              {/* Cost of study box */}
              <div
                style={{
                  background: "var(--surface-alt)",
                  borderLeft: "2px solid var(--red)",
                  padding: "var(--s-5)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    marginBottom: "var(--s-3)",
                  }}
                >
                  COST OF STUDY
                </div>
                <p
                  style={{
                    fontSize: "var(--t-body)",
                    lineHeight: 1.45,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  The study is free. We produce it because we want the renovation, and because we would rather spend a day on a walkthrough than build a project that should not have been bought.
                </p>
              </div>
            </div>

            {/* Right column: deliverable list */}
            <div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {DELIVERABLE_ITEMS.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "var(--s-4) 0",
                      borderBottom:
                        i < DELIVERABLE_ITEMS.length - 1
                          ? "1px solid var(--line)"
                          : undefined,
                      fontSize: "var(--t-body)",
                      lineHeight: 1.45,
                      color: "var(--text)",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: SPEC TABLE
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--gold)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            {[
              {
                numeral: "30+",
                label: "Years in Orange County",
                gold: true,
              },
              { numeral: "800+", label: "Projects completed", gold: false },
              { numeral: "1", label: "Showroom you can walk", gold: false },
              {
                numeral: "In-house",
                label: "Design, build, and install",
                gold: false,
              },
            ].map((cell, i) => (
              <div
                key={i}
                style={{
                  borderLeft:
                    i > 0 ? "1px solid var(--line)" : undefined,
                  padding: "var(--s-5) var(--s-6)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--t-numeral)",
                    lineHeight: 1,
                    color: cell.gold ? "var(--gold)" : "var(--text)",
                    marginBottom: "var(--s-2)",
                    fontWeight: 400,
                  }}
                >
                  {cell.numeral}
                </div>
                <div
                  style={{
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: WHO THIS IS FOR
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-alt)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="WHO WE WORK WITH" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-8)",
              fontWeight: 400,
            }}
          >
            Three kinds of investor.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "var(--s-5)",
            }}
          >
            {INVESTOR_CARDS.map((card) => (
              <div
                key={card.h3}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: 0,
                  padding: "var(--s-6)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--t-h3)",
                    lineHeight: 1.25,
                    color: "var(--text)",
                    margin: "0 0 var(--s-4)",
                    fontWeight: 400,
                  }}
                >
                  {card.h3}
                </h3>
                <p
                  style={{
                    fontSize: "var(--t-body)",
                    lineHeight: 1.45,
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: WHAT WE HANDLE
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-ink)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="THE DIVISION OF WORK" dark />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text-invert)",
              margin: "0 0 var(--s-8)",
              fontWeight: 400,
            }}
          >
            You make the decisions. We do the rest.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {/* Left: We handle */}
            <div
              style={{
                borderRight: "1px solid var(--line-invert)",
                paddingRight: "var(--s-8)",
              }}
            >
              <div
                style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-invert)",
                  marginBottom: "var(--s-5)",
                }}
              >
                We handle
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--s-3)",
                }}
              >
                {WE_HANDLE.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--s-3)",
                      fontSize: "var(--t-body)",
                      lineHeight: 1.45,
                      color: "var(--text-invert-muted)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{ color: "var(--red)", flexShrink: 0, lineHeight: 1.45 }}
                    >
                      ◼
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: You handle */}
            <div style={{ paddingLeft: "var(--s-8)" }}>
              <div
                style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-invert-muted)",
                  marginBottom: "var(--s-5)",
                }}
              >
                You handle
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--s-3)",
                }}
              >
                {YOU_HANDLE.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "var(--s-3)",
                      fontSize: "var(--t-body)",
                      lineHeight: 1.45,
                      color: "var(--text-invert-muted)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        color: "var(--text-invert-muted)",
                        flexShrink: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      ◼
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: FOR AGENTS
      ============================================================ */}
      <section
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--gold)",
          borderBottom: "1px solid var(--gold)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "var(--s-9)",
              alignItems: "center",
            }}
          >
            {/* Left */}
            <div>
              <Eyebrow label="FOR REAL ESTATE AGENTS" />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-h2)",
                  lineHeight: 1.14,
                  color: "var(--text)",
                  margin: "0 0 var(--s-5)",
                  fontWeight: 400,
                }}
              >
                Send us the listing that will not move.
              </h2>
              <p
                style={{
                  fontSize: "var(--t-body-lg)",
                  lineHeight: 1.35,
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                If you have a buyer looking for a property that needs work, or a
                listing sitting because of its condition, walk it with us. We
                produce the feasibility study at no cost to you or your client.
                You keep the client and the commission. We want the renovation.
              </p>
            </div>

            {/* Right: CTA right-aligned */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                href="#inquiry"
                style={{
                  display: "inline-block",
                  background: "var(--red)",
                  color: "var(--text-invert)",
                  fontSize: "var(--t-btn)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "14px 28px",
                  borderRadius: 0,
                  textDecoration: "none",
                }}
              >
                SUBMIT A PROPERTY
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: FAQ
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-alt)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="FAQ" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-8)",
              fontWeight: 400,
            }}
          >
            Common questions.
          </h2>
          <InvestorFAQ />
        </div>
      </section>

      {/* ============================================================
          SECTION 10: INQUIRY FORM
      ============================================================ */}
      <section
        id="inquiry"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
          }}
        >
          <Eyebrow label="GET STARTED" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-4)",
              fontWeight: 400,
            }}
          >
            Tell us what you are looking for.
          </h2>
          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-muted)",
              margin: "0 0 var(--s-8)",
              maxWidth: "68ch",
            }}
          >
            We will come back to you within one business day. If you already
            have a property in mind, mention the address and we will walk it.
          </p>

          <InvestorForm />
        </div>
      </section>

      {/* ============================================================
          SECTION 11: CLOSING BAND
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-ink)",
          borderTop: "1px solid var(--gold)",
          padding: "var(--s-9) 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "var(--s-8)",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text-invert)",
              margin: 0,
              fontWeight: 400,
              maxWidth: "24ch",
            }}
          >
            Walk the showroom before you write an offer.
          </h2>

          {/* Right: two buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "var(--s-4)",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Link
              href="#inquiry"
              style={{
                display: "inline-block",
                background: "var(--red)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              REQUEST A FEASIBILITY STUDY
            </Link>

            <a
              href="tel:+16196267545"
              style={{
                display: "inline-block",
                background: "transparent",
                border: "1px solid var(--line-invert)",
                color: "var(--text-invert)",
                fontSize: "var(--t-btn)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "14px 28px",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              CALL THE SHOWROOM
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

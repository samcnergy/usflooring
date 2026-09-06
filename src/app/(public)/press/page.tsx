import Link from "next/link";
import BoilerplatePanels from "./BoilerplatePanels";

export const metadata = {
  title: "Press and Media | US Floor Design Center",
  description:
    "Logos, company facts, approved photography and press contact for US Floor Design Center, a design and build showroom in Rancho Santa Margarita, California.",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://usfloordesign.com/#organization",
  name: "US Floor Design Center",
  alternateName: "US Floor",
  url: "https://usfloordesign.com",
  logo: "https://usfloordesign.com/US_FLOOR_Logo_Primary.svg",
  description:
    "Design and build showroom in Rancho Santa Margarita, California, handling kitchen, bath and flooring renovations for homeowners and investors across Orange County.",
  telephone: "+1-619-626-7545",
  email: "info@usfloordesign.com",
  foundingDate: "1993",
  address: {
    "@type": "PostalAddress",
    streetAddress: "30092 Santa Margarita Pkwy, Suite G",
    addressLocality: "Rancho Santa Margarita",
    addressRegion: "CA",
    postalCode: "92688",
    addressCountry: "US",
  },
  areaServed: { "@type": "AdministrativeArea", name: "Orange County, California" },
  founder: [
    { "@type": "Person", name: "Parham Shariat", jobTitle: "Owner and Operator" },
    { "@type": "Person", name: "Shirin Salamat", jobTitle: "Co-Owner" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Kitchen remodeling" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bathroom remodeling" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Flooring supply and installation" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Renovation feasibility studies for property investors" } },
  ],
  sameAs: [],
};

const FACTS: [string, string][] = [
  ["Legal and trade name", "US Floor Design Center"],
  ["Former name", "US Floor, Kitchen and Bath (retired)"],
  ["Founded", "Early 1990s"],
  ["Owner and Operator", "Parham Shariat"],
  ["Co-Owner", "Shirin Salamat"],
  ["Showroom", "30092 Santa Margarita Pkwy, Suite G, Rancho Santa Margarita, CA 92688"],
  ["Center", "Arroyo Crossroads Shopping Center"],
  ["Phone", "(619) 626-7545"],
  ["Email", "info@usfloordesign.com"],
  ["Website", "usfloordesign.com"],
  ["Hours", "Mon to Fri 9:00 am to 5:30 pm · Sat 10:00 am to 4:00 pm · Sun closed"],
  ["Service area", "Orange County, California"],
  ["Services", "Kitchen, bath and flooring design and remodeling; material supply; investor feasibility studies"],
  ["Projects completed", "800+"],
  ["Years in Orange County", "30+"],
  ["Locations", "One showroom"],
  ["CSLB license", "TODO [CONFIRM] — Add license number before publishing"],
];

const LOGOS = [
  { file: "US_FLOOR_Logo_Primary.svg", label: "Primary", note: "White and light backgrounds. The default.", dark: false },
  { file: "US_FLOOR_Logo_Reversed.svg", label: "Reversed", note: "Black and dark backgrounds", dark: true },
  { file: "US_FLOOR_Logo_Reversed_OnBlack.svg", label: "Reversed on black", note: "When you need the black panel included", dark: true },
  { file: "US_FLOOR_Logo_Mono_Black.svg", label: "One color, black", note: "Single-color print, engraving, fax-grade documents", dark: false },
  { file: "US_FLOOR_Logo_Mono_White.svg", label: "One color, white", note: "Knockout on dark photography", dark: true },
  { file: "US_FLOOR_Wordmark_Black.svg", label: "Wordmark, black", note: "Small sizes where the descriptor stops being legible", dark: false },
  { file: "US_FLOOR_Wordmark_White.svg", label: "Wordmark, white", note: "Same, on dark", dark: true },
];

const NAME_RULES = [
  { rule: "First mention", value: "US Floor Design Center" },
  { rule: "Subsequent mentions", value: "US Floor" },
  { rule: "Never", value: "U.S. Floor with periods. That is the retired name." },
  { rule: "Never", value: "US Floor Kitchen and Bath. Retired in 2025." },
  { rule: "Never", value: "USFloor as one word, and never all lowercase." },
  { rule: "The showroom is a", value: "design center, not a design centre or a gallery." },
];

function Eyebrow({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
      <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
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

export default function PressPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ============================================================
          SECTION 1: HEADER
      ============================================================ */}
      <section
        style={{
          background: "var(--surface-ink)",
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
          <Eyebrow label="Press and Media" dark />
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h1)",
              lineHeight: 1.1,
              color: "var(--text-invert)",
              margin: "0 0 var(--s-5)",
              maxWidth: "22ch",
              fontWeight: 400,
            }}
          >
            Everything you need to write about us accurately.
          </h1>
          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-invert-muted)",
              margin: "0 0 var(--s-6)",
              maxWidth: "56ch",
            }}
          >
            Logos, approved photography, company facts, and a contact. If something you need is not here, email us and we will send it.
          </p>
          {/* TODO: wire to actual ZIP download once media kit is assembled */}
          <a
            href="mailto:info@usfloordesign.com?subject=Media%20kit%20request"
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
            Download the Media Kit
          </a>
          <p style={{ fontSize: "var(--t-small)", color: "var(--text-invert-muted)", marginTop: "var(--s-3)" }}>
            {/* TODO: replace with direct ZIP link once assembled */}
            Media kit ZIP (logos + boilerplate) — currently request by email; ZIP coming shortly.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: BOILERPLATE
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
          <Eyebrow label="Company Boilerplate" />
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
            Pick the length that fits.
          </h2>
          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-muted)",
              margin: "0 0 var(--s-7)",
              maxWidth: "60ch",
            }}
          >
            Use these verbatim. They are cleared for publication.
          </p>
          <BoilerplatePanels />
        </div>
      </section>

      {/* ============================================================
          SECTION 3: FAST FACTS
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
          <Eyebrow label="Fast Facts" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-7)",
              fontWeight: 400,
            }}
          >
            At a glance.
          </h2>
          <div style={{ border: "1px solid var(--line)", maxWidth: 800 }}>
            {FACTS.map(([label, value], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                }}
              >
                <div
                  style={{
                    padding: "var(--s-4) var(--s-5)",
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    background: "var(--surface)",
                    borderRight: "1px solid var(--line)",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    padding: "var(--s-4) var(--s-5)",
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.45,
                    fontVariantNumeric: "tabular-nums",
                    background: "var(--surface)",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: NAME USAGE
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
          <Eyebrow label="How to Write the Name" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-7)",
              fontWeight: 400,
            }}
          >
            Spelling and usage.
          </h2>
          <div style={{ border: "1px solid var(--line)", maxWidth: 700 }}>
            {NAME_RULES.map(({ rule, value }, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  borderTop: i > 0 ? "1px solid var(--line)" : undefined,
                }}
              >
                <div
                  style={{
                    padding: "var(--s-4) var(--s-5)",
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    borderRight: "1px solid var(--line)",
                  }}
                >
                  {rule}
                </div>
                <div
                  style={{
                    padding: "var(--s-4) var(--s-5)",
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.45,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: LOGOS
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
          <Eyebrow label="Logos" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-7)",
              fontWeight: 400,
            }}
          >
            Logo files.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--s-4)",
              marginBottom: "var(--s-8)",
            }}
          >
            {LOGOS.map((logo) => (
              <div
                key={logo.file}
                style={{
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Logo preview */}
                <div
                  style={{
                    background: logo.dark ? "var(--surface-ink)" : "var(--surface)",
                    padding: "var(--s-6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 120,
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/${logo.file}`}
                    alt={logo.label}
                    style={{ maxHeight: 60, maxWidth: "100%", width: "auto" }}
                  />
                </div>
                {/* Info + download */}
                <div style={{ padding: "var(--s-4)", flex: 1 }}>
                  <div
                    style={{
                      fontSize: "var(--t-label)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text)",
                      marginBottom: "var(--s-2)",
                    }}
                  >
                    {logo.label}
                  </div>
                  <p
                    style={{
                      fontSize: "var(--t-small)",
                      color: "var(--text-muted)",
                      margin: "0 0 var(--s-4)",
                      lineHeight: 1.45,
                    }}
                  >
                    {logo.note}
                  </p>
                  <a
                    href={`/${logo.file}`}
                    download
                    style={{
                      fontSize: "var(--t-label)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--red)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--red)",
                      paddingBottom: 1,
                    }}
                  >
                    Download SVG
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Usage note */}
          <div style={{ border: "1px solid var(--line)", padding: "var(--s-6)", maxWidth: 700 }}>
            <Eyebrow label="Using our logo" />
            <p style={{ fontSize: "var(--t-body)", lineHeight: 1.55, color: "var(--text-muted)", margin: "0 0 var(--s-3)" }}>
              Use the files as supplied. Do not recolor, stretch, rotate, or add effects to the mark. Do not add a tagline or contact details to the lockup. Keep clear space on all four sides equal to the height of the letter U in the wordmark. Do not use the logo in a way that implies we endorse a product, service or organization without our written agreement.
            </p>
            <p style={{ fontSize: "var(--t-small)", color: "var(--text-muted)", margin: 0 }}>
              Brand colors: Signal Red{" "}
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)" }}>#D71920</span>
              {" "}and Brass{" "}
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, color: "var(--text)" }}>#A1834F</span>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: PHOTOGRAPHY
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
          <Eyebrow label="Photography" />
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
            Approved images.
          </h2>
          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-muted)",
              margin: "0 0 var(--s-4)",
              maxWidth: "60ch",
            }}
          >
            Use these with the credit line shown. For anything else, email us and we will get you what you need.
          </p>
          <p style={{ fontSize: "var(--t-small)", color: "var(--text-muted)", margin: "0 0 var(--s-7)" }}>
            Credit: Courtesy of US Floor Design Center
          </p>
          {/* TODO: Replace placeholder with real project and showroom photography before publishing */}
          <div
            style={{
              border: "1px solid var(--line)",
              padding: "var(--s-7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
              background: "var(--surface-alt)",
            }}
          >
            <p style={{ fontSize: "var(--t-body)", color: "var(--text-muted)", textAlign: "center", margin: 0 }}>
              TODO: Photography grid coming once the showroom and project shoot is complete.<br />
              Per spec, only genuine project and showroom photography appears here.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: LEADERSHIP
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
          <Eyebrow label="Leadership" />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text)",
              margin: "0 0 var(--s-7)",
              fontWeight: 400,
            }}
          >
            The people who run it.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-5)", maxWidth: 900 }}>
            {/* Parham */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", padding: "var(--s-6)" }}>
              {/* TODO: Add headshot once available */}
              <div
                style={{
                  width: "100%",
                  height: 200,
                  background: "var(--surface-alt)",
                  border: "1px solid var(--line)",
                  marginBottom: "var(--s-5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "var(--t-small)", color: "var(--text-muted)" }}>TODO: Headshot</span>
              </div>
              <div
                style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "var(--s-2)",
                }}
              >
                Owner and Operator
              </div>
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
                Parham Shariat
              </h3>
              <p style={{ fontSize: "var(--t-body)", lineHeight: 1.55, color: "var(--text-muted)", margin: 0 }}>
                Parham Shariat leads US Floor Design Center. He spent eleven years as a real estate broker and worked in institutional real estate and private equity in Dubai before returning to Southern California. He runs the showroom, the build operation, and the company's investor services.
              </p>
            </div>
            {/* Shirin */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--line)", padding: "var(--s-6)" }}>
              <div
                style={{
                  width: "100%",
                  height: 200,
                  background: "var(--surface-alt)",
                  border: "1px solid var(--line)",
                  marginBottom: "var(--s-5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "var(--t-small)", color: "var(--text-muted)" }}>TODO: Headshot</span>
              </div>
              <div
                style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "var(--s-2)",
                }}
              >
                Co-Owner
              </div>
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
                Shirin Salamat
              </h3>
              {/* TODO [CONFIRM]: Add Shirin's bio — 2-3 sentences, same length as Parham's */}
              <p style={{ fontSize: "var(--t-body)", lineHeight: 1.55, color: "var(--text-muted)", margin: 0 }}>
                TODO [CONFIRM]: Add two or three sentences covering Shirin&apos;s role in the business and relevant background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: PRESS CONTACT
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
          }}
        >
          <Eyebrow label="Press Contact" dark />
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--t-h2)",
              lineHeight: 1.14,
              color: "var(--text-invert)",
              margin: "0 0 var(--s-5)",
              fontWeight: 400,
            }}
          >
            Ask us directly.
          </h2>
          <p
            style={{
              fontSize: "var(--t-body-lg)",
              lineHeight: 1.35,
              color: "var(--text-invert-muted)",
              margin: "0 0 var(--s-6)",
              maxWidth: "56ch",
            }}
          >
            For interviews, project details, high-resolution images, or anything not on this page.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
            <p style={{ margin: 0, fontSize: "var(--t-body)", color: "var(--text-invert)", fontWeight: 700 }}>
              Parham Shariat, Owner
            </p>
            <div style={{ display: "flex", gap: "var(--s-5)", flexWrap: "wrap" }}>
              <a
                href="mailto:info@usfloordesign.com"
                style={{ fontSize: "var(--t-body)", color: "var(--text-invert-muted)", textDecoration: "none", borderBottom: "1px solid var(--line-invert)", paddingBottom: 1 }}
              >
                info@usfloordesign.com
              </a>
              <a
                href="tel:+16196267545"
                style={{ fontSize: "var(--t-body)", color: "var(--text-invert-muted)", textDecoration: "none", borderBottom: "1px solid var(--line-invert)", paddingBottom: 1 }}
              >
                (619) 626-7545
              </a>
            </div>
            <p style={{ margin: "var(--s-2) 0 0", fontSize: "var(--t-small)", color: "var(--text-invert-muted)" }}>
              Response within one business day.
            </p>
            <p style={{ margin: "var(--s-5) 0 0", fontSize: "var(--t-small)", color: "var(--text-invert-muted)", lineHeight: 1.55 }}>
              US Floor Design Center · 30092 Santa Margarita Pkwy, Suite G, Rancho Santa Margarita, CA 92688<br />
              {/* TODO [CONFIRM]: Add CSLB license number */}
              CSLB License #[TODO — confirm before publishing]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ApplicationForm from "./ApplicationForm";

export const metadata: Metadata = {
  title: "Careers | US Floor Design Center",
  description:
    "Open roles at a design and build showroom in Rancho Santa Margarita. No flooring experience required. We train.",
};

const WHY_BLOCKS = [
  {
    heading: "You will be trained",
    body: "We hire for how you deal with people, not for what you already know about tile. Product knowledge is teachable and we teach it. Most of our team started knowing nothing about flooring.",
  },
  {
    heading: "One location",
    body: "No territory, no travel, no driving between branches. The showroom is in Rancho Santa Margarita and that is where the work is.",
  },
  {
    heading: "Small company, visible work",
    body: "Twelve people, not twelve hundred. What you do lands on a real house in this county, and you will meet the customer who lives in it.",
  },
  {
    heading: "The owners are here",
    /* TODO [CONFIRM]: update copy if ownership presence changes */
    body: "Parham and Shirin are on site most days. That is a real advantage over the regional chains, and most applicants notice it.",
  },
];

const OPEN_ROLES = [
  {
    title: "Showroom Sales Consultant",
    type: "Full time",
    location: "Rancho Santa Margarita, CA",
    href: "/careers/showroom-sales-consultant",
  },
];

export default function CareersIndexPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          background: "var(--surface-ink)",
          borderBottom: "1px solid var(--gold)",
          padding: "var(--s-9) var(--gutter)",
        }}
      >
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "var(--s-4)",
            }}
          >
            Careers
          </p>
          <h1
            style={{
              fontSize: "var(--t-h2)",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--text-invert)",
              lineHeight: 1.15,
              maxWidth: "22ch",
              marginBottom: "var(--s-5)",
            }}
          >
            Thirty years of work, and a team we are still building.
          </h1>
          <p
            style={{
              fontSize: "var(--t-body)",
              color: "var(--text-invert-muted)",
              lineHeight: 1.6,
              maxWidth: "52ch",
            }}
          >
            The showroom has been here since the early 1990s. The ownership is new, the
            systems are new, and we are hiring the people who will run the next stretch of
            it.
          </p>
        </div>
      </section>

      {/* Why work here */}
      <section style={{ background: "var(--surface)", padding: "var(--s-9) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--s-6)",
            }}
          >
            Why work here
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 0,
              border: "1px solid var(--line)",
            }}
          >
            {WHY_BLOCKS.map((block) => (
              <div
                key={block.heading}
                style={{
                  padding: "var(--s-6)",
                  borderRight: "1px solid var(--line)",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--t-body)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    marginBottom: "var(--s-3)",
                    color: "var(--text)",
                  }}
                >
                  {block.heading}
                </p>
                <p
                  style={{
                    fontSize: "var(--t-small)",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section
        style={{
          background: "var(--surface-alt)",
          padding: "var(--s-9) var(--gutter)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--s-6)",
            }}
          >
            Open roles
          </p>
          <div style={{ border: "1px solid var(--line)" }}>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: "var(--s-5)",
                padding: "var(--s-4) var(--s-5)",
                borderBottom: "1px solid var(--line)",
                background: "var(--surface)",
              }}
            >
              {["Role", "Type", "Location", ""].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {OPEN_ROLES.map((role) => (
              <div
                key={role.href}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: "var(--s-5)",
                  padding: "var(--s-5)",
                  borderBottom: "1px solid var(--line)",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "var(--t-body)", color: "var(--text)" }}>
                  {role.title}
                </span>
                <span style={{ fontSize: "var(--t-small)", color: "var(--text-muted)" }}>
                  {role.type}
                </span>
                <span style={{ fontSize: "var(--t-small)", color: "var(--text-muted)" }}>
                  {role.location}
                </span>
                <Link
                  href={role.href}
                  style={{
                    fontSize: "var(--t-label)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--red)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  View role
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nothing here that fits */}
      <section style={{ background: "var(--surface)", padding: "var(--s-9) var(--gutter)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "var(--t-h3)",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              marginBottom: "var(--s-4)",
              color: "var(--text)",
            }}
          >
            Nothing here that fits?
          </h2>
          <p
            style={{
              fontSize: "var(--t-body)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              maxWidth: "52ch",
              marginBottom: "var(--s-6)",
            }}
          >
            Send us your details anyway. We hire when we meet the right person, not only
            when a role is posted.
          </p>
          <a
            href="#apply"
            style={{
              display: "inline-block",
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "14px 28px",
              background: "var(--red)",
              color: "var(--text-invert)",
              textDecoration: "none",
            }}
          >
            Send a general application
          </a>
        </div>
      </section>

      {/* General application form */}
      <section
        id="apply"
        style={{
          background: "var(--surface-alt)",
          padding: "var(--s-9) var(--gutter)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--s-6)",
            }}
          >
            General application
          </p>
          <ApplicationForm defaultRole="General interest" />
        </div>
      </section>
    </>
  );
}

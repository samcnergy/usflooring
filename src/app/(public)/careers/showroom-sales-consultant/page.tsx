import type { Metadata } from "next";
import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "Showroom Sales Consultant | US Floor Design Center",
  description:
    "Full-time showroom sales role in Rancho Santa Margarita, California. No flooring experience needed, we train. Saturdays on rotation.",
};

const JOB_POSTING_LD = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Showroom Sales Consultant",
  description:
    "Someone walks into the showroom with a photo on their phone and a kitchen they are tired of. Your job is to figure out what they actually want, show them the material, get them a number, and stay with them until the job is booked or they tell you no. That is most of it. You are the first person a customer meets and usually the one they keep calling.\n\nWhat you will do:\n- Greet everyone who comes through the door, including the ones who say they are just looking\n- Ask enough questions to understand the room, the budget and the timeline\n- Walk customers through the samples and help them narrow it down\n- Measure, or arrange the measure, and put together the quote\n- Follow up. Call the people who came in last week and never heard back.\n- Keep your quotes and your customers current in our order system\n- Hand the job cleanly to the install team and stay reachable while it runs\n- Keep the showroom floor and the sample displays in order\n\nWhat we are looking for: We are not looking for a flooring background. We are looking for two things. You like people, and it shows. You follow up.\n\nWhat you do not need: No experience with flooring, tile, stone or cabinetry. We will teach you the products, the installation basics, the measuring, and the pricing. If you have sold anything to anyone and you are willing to learn a trade, you can do this job. No degree. No design background. No contractor license.\n\nWhat we will teach you: Materials, how to read a room and estimate square footage, how installation works, our pricing, and our order system from quote to invoice to install schedule.",
  identifier: {
    "@type": "PropertyValue",
    name: "US Floor Design Center",
    value: "USF-SALES-01",
  },
  datePosted: "2026-09-06",
  /* TODO [CONFIRM]: set validThrough to actual close date; remove page or set past date when filled */
  validThrough: "2026-12-05",
  employmentType: "FULL_TIME",
  hiringOrganization: { "@id": "https://usfloordesign.com/#organization" },
  jobLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      streetAddress: "30092 Santa Margarita Pkwy, Suite G",
      addressLocality: "Rancho Santa Margarita",
      addressRegion: "CA",
      postalCode: "92688",
      addressCountry: "US",
    },
  },
  baseSalary: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      value: 24000,
      unitText: "YEAR",
    },
  },
  experienceRequirements: {
    "@type": "OccupationalExperienceRequirements",
    monthsOfExperience: 0,
  },
  educationRequirements: null,
  directApply: true,
};

const FACT_ROWS = [
  {
    label: "Pay",
    value: "$24,000 base salary + commission. Expected first-year total: $75,000 to $150,000.",
    todo: false,
  },
  {
    label: "Schedule",
    value: "Monday to Friday, 9:00 am to 5:30 pm. Saturdays 10:00 am to 4:00 pm on a rotation.",
    todo: false,
  },
  { label: "Reports to", value: "Parham Shariat, Owner", todo: false },
  { label: "Experience required", value: "None", todo: false },
  { label: "Start", value: "As soon as we find the right person", todo: false },
];

export default function ShowroomSalesConsultantPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JOB_POSTING_LD) }}
      />

      {/* Posting header */}
      <section
        style={{
          background: "var(--surface)",
          padding: "var(--s-9) var(--gutter)",
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
              marginBottom: "var(--s-4)",
            }}
          >
            <a
              href="/careers"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Careers
            </a>
            {" / "}
            Open role
          </p>

          <h1
            style={{
              fontSize: "var(--t-h2)",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--text)",
              lineHeight: 1.15,
              marginBottom: "var(--s-3)",
            }}
          >
            Showroom Sales Consultant
          </h1>
          <p
            style={{
              fontSize: "var(--t-body)",
              color: "var(--text-muted)",
              marginBottom: "var(--s-7)",
            }}
          >
            Rancho Santa Margarita, California &middot; Full time &middot; On site
          </p>

          {/* Fact strip */}
          <div
            style={{
              border: "1px solid var(--line)",
              marginBottom: "var(--s-7)",
              display: "inline-block",
              width: "100%",
              maxWidth: 640,
            }}
          >
            {FACT_ROWS.map((row, i) => (
              <div
                key={row.label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap: "var(--s-4)",
                  padding: "var(--s-4) var(--s-5)",
                  borderBottom: i < FACT_ROWS.length - 1 ? "1px solid var(--line)" : undefined,
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--t-small)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--t-small)",
                    color: row.todo ? "var(--red)" : "var(--text)",
                    fontStyle: row.todo ? "italic" : "normal",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div>
            <a
              href="#apply"
              style={{
                display: "inline-block",
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "16px 32px",
                background: "var(--red)",
                color: "var(--text-invert)",
                textDecoration: "none",
              }}
            >
              Apply for this role
            </a>
          </div>
        </div>
      </section>

      {/* Job body */}
      <section style={{ background: "var(--surface)", padding: "var(--s-9) var(--gutter)" }}>
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            maxWidth: "720px",
            display: "flex",
            flexDirection: "column",
            gap: "var(--s-8)",
          }}
        >
          {/* The job */}
          <div>
            <p
              style={{
                fontSize: "var(--t-body)",
                lineHeight: 1.7,
                color: "var(--text)",
                borderLeft: "3px solid var(--gold)",
                paddingLeft: "var(--s-5)",
                margin: 0,
              }}
            >
              Someone walks into the showroom with a photo on their phone and a kitchen
              they are tired of. Your job is to figure out what they actually want, show
              them the material, get them a number, and stay with them until the job is
              booked or they tell you no.
              <br />
              <br />
              That is most of it. You are the first person a customer meets and usually
              the one they keep calling.
            </p>
          </div>

          {/* What you will do */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              What you will do
            </h2>
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
              {[
                "Greet everyone who comes through the door, including the ones who say they are just looking",
                "Ask enough questions to understand the room, the budget and the timeline",
                "Walk customers through the samples and help them narrow it down",
                "Measure, or arrange the measure, and put together the quote",
                "Follow up. Call the people who came in last week and never heard back.",
                "Keep your quotes and your customers current in our order system",
                "Hand the job cleanly to the install team and stay reachable while it runs",
                "Keep the showroom floor and the sample displays in order",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.55,
                    paddingLeft: "var(--s-5)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "var(--red)",
                      fontWeight: 700,
                    }}
                  >
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What we are looking for */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              What we are looking for
            </h2>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "var(--s-5)",
                fontStyle: "italic",
              }}
            >
              We are not looking for a flooring background. We are looking for two things.
            </p>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)", marginBottom: "var(--s-6)" }}
            >
              {[
                {
                  heading: "You like people, and it shows.",
                  body: "You are the person who talks to strangers in line. You look up when someone walks in. You can tell when a customer wants help and when they want to be left alone for five minutes, and you do not take it personally either way.",
                },
                {
                  heading: "You follow up.",
                  body: "This is the one that separates people in this job. Most customers do not buy on the first visit. They take a sample home, they talk to a spouse, they get busy. The consultants who do well here are the ones who call back on Tuesday like they said they would, and again the following week, without being a nuisance about it. If you have ever been told you are hard to shake, that is the trait.",
                },
              ].map((block) => (
                <div key={block.heading}>
                  <p
                    style={{
                      fontSize: "var(--t-body)",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "var(--s-2)",
                    }}
                  >
                    {block.heading}
                  </p>
                  <p
                    style={{
                      fontSize: "var(--t-body)",
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

            <p
              style={{
                fontSize: "var(--t-small)",
                color: "var(--text-muted)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--s-3)",
              }}
            >
              Beyond that:
            </p>
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
              {[
                "Comfortable talking about money and asking for the sale",
                "Organized enough to keep twenty open quotes straight",
                "Can use a computer and learn a new system",
                "Available Saturdays on a rotation. Saturday is our busiest day.",
                "Valid California driver's license",
                "Legally authorized to work in the United States",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.55,
                    paddingLeft: "var(--s-5)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "var(--red)",
                      fontWeight: 700,
                    }}
                  >
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What you do not need */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              What you do not need
            </h2>
            <p
              style={{
                fontSize: "var(--t-body)",
                lineHeight: 1.7,
                color: "var(--text)",
                borderLeft: "3px solid var(--gold)",
                paddingLeft: "var(--s-5)",
                margin: 0,
              }}
            >
              <strong>No experience with flooring, tile, stone or cabinetry.</strong> None.
              We will teach you the products, the installation basics, the measuring, and
              the pricing. If you have sold anything to anyone and you are willing to learn
              a trade, you can do this job.
              <br />
              <br />
              No degree. No design background. No contractor license.
            </p>
          </div>

          {/* What we will teach you */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              What we will teach you
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--s-3)",
                marginBottom: "var(--s-5)",
              }}
            >
              {[
                "Materials: hardwood, luxury vinyl, porcelain, natural stone, quartz, and what each is actually good for",
                "How to read a room and estimate square footage",
                "How installation works, so you can answer questions honestly instead of guessing",
                "Our pricing, and where the margin is",
                "Our order system, from quote to invoice to install schedule",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.55,
                    paddingLeft: "var(--s-5)",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: "var(--red)",
                      fontWeight: 700,
                    }}
                  >
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Training is on the job and paid, alongside someone who has been doing it for
              years.
            </p>
          </div>

          {/* Compensation */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              Compensation
            </h2>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text)",
                lineHeight: 1.7,
                marginBottom: "var(--s-4)",
              }}
            >
              Base salary of $24,000 annually, plus commission on every job you close.
              First-year total compensation typically runs between $75,000 and $150,000,
              depending on your sales volume.
            </p>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text)",
                lineHeight: 1.7,
                marginBottom: "var(--s-4)",
              }}
            >
              The base is there from day one, while you are learning. The commission
              structure is in writing before any offer is made and a copy goes to you.
            </p>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              This is a non-exempt (hourly-equivalent) position. Overtime is paid after
              eight hours in a day and forty hours in a week. Meal and rest breaks are
              provided per California law.
            </p>
          </div>

          {/* How we hire */}
          <div>
            <h2
              style={{
                fontSize: "var(--t-h4)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                marginBottom: "var(--s-4)",
                color: "var(--text)",
              }}
            >
              How we hire
            </h2>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "var(--s-5)",
              }}
            >
              Four steps, and we tell you where you stand at each one.
            </p>
            <ol
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "var(--s-4)",
                counterReset: "steps",
              }}
            >
              {[
                ["Apply.", "The form takes about five minutes. A resume is welcome but not required."],
                ["Phone call,", "fifteen minutes, with Parham."],
                ["Come into the showroom.", "Meet the team, walk the floor, and talk through how you would handle a customer. Plan on an hour."],
                ["Offer.", "In writing, with the pay and the schedule spelled out."],
              ].map(([bold, rest], i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "var(--s-4)",
                    alignItems: "flex-start",
                    fontSize: "var(--t-body)",
                    color: "var(--text)",
                    lineHeight: 1.55,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 28,
                      height: 28,
                      background: "var(--surface-ink)",
                      color: "var(--text-invert)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--t-small)",
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <strong>{bold}</strong> {rest}
                  </span>
                </li>
              ))}
            </ol>
            <p
              style={{
                fontSize: "var(--t-body)",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginTop: "var(--s-5)",
              }}
            >
              We aim to get back to everyone who applies within one week, including the
              people we are not moving forward with.
            </p>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section
        id="apply"
        style={{
          background: "var(--surface-alt)",
          padding: "var(--s-9) var(--gutter)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", maxWidth: "720px" }}>
          <p
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
            Apply
          </p>
          <h2
            style={{
              fontSize: "var(--t-h3)",
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              color: "var(--text)",
              marginBottom: "var(--s-6)",
            }}
          >
            Showroom Sales Consultant
          </h2>
          <ApplicationForm defaultRole="Showroom Sales Consultant" />
        </div>
      </section>

      {/* EEO */}
      <section
        style={{
          background: "var(--surface)",
          padding: "var(--s-7) var(--gutter)",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", maxWidth: "720px" }}>
          <p
            style={{
              fontSize: "var(--t-small)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            US Floor Design Center is an equal opportunity employer. We consider all
            qualified applicants without regard to race, color, religion, sex, sexual
            orientation, gender identity, national origin, ancestry, age, disability,
            medical condition, genetic information, marital status, military or veteran
            status, or any other characteristic protected by federal, state or local law.
          </p>
          <p
            style={{
              fontSize: "var(--t-small)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginTop: "var(--s-3)",
              marginBottom: 0,
            }}
          >
            We consider qualified applicants with criminal histories in a manner consistent
            with the California Fair Chance Act and applicable local ordinances.
          </p>
          <p
            style={{
              fontSize: "var(--t-small)",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginTop: "var(--s-3)",
              marginBottom: 0,
            }}
          >
            If you need a reasonable accommodation to apply or to interview, contact us at{" "}
            <a
              href="mailto:info@usfloordesign.com"
              style={{ color: "var(--text-muted)" }}
            >
              info@usfloordesign.com
            </a>{" "}
            and we will arrange it.
          </p>
        </div>
      </section>
    </>
  );
}

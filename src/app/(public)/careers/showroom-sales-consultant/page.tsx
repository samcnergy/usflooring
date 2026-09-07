import type { Metadata } from "next";
import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "Showroom Sales Consultant | US Floor Design Center",
  description:
    "Full-time sales role in Rancho Santa Margarita. First point of contact for every client, from initial visit through project completion. No flooring experience needed, we train.",
};

const JOB_POSTING_LD = {
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: "Showroom Sales Consultant",
  description:
    "You are the first point of contact for every US Floor client. That means building your own pipeline through networking, trade shows, and direct outreach alongside the leads we bring in, visiting homes to measure and take notes, helping clients choose materials, coordinating with designers, tracking deposits and collecting payment, and making sure the handoff to the project manager is clean so the job lands the way the client expected.\n\nWhat you will do:\n- Follow up on every lead we give you and build your own pipeline through networking events, trade shows, and direct outreach\n- Greet everyone who walks into the showroom, including the ones who say they are just looking\n- Visit client homes to measure, photograph, and understand the space\n- Help clients select materials and work alongside their designer or our in-house designer\n- Put together accurate quotes and present them clearly\n- Ask for the sale and keep following up until you get a yes or a no\n- Track deposits, approvals, and final payments, and collect them\n- Hand the project cleanly to the project manager so nothing is lost in the transfer\n- Stay reachable while the job runs and make sure it finishes the way the client expected\n- Keep your pipeline, open quotes, and active jobs current in our order system\n- Keep the showroom floor and sample displays in order\n\nWhat we are looking for: We are not looking for a flooring background. We are looking for someone who likes people, follows up without being asked, and takes responsibility for their part of the process from first contact through a clean handoff.\n\nWhat you do not need: No experience with flooring, tile, stone or cabinetry. We will teach you the products, the installation basics, the measuring, and the pricing. If you have managed a client relationship from first contact through completion and you are willing to learn a trade, you can do this job. No degree. No design background. No contractor license.\n\nWhat we will teach you: Materials, how to read a room and estimate square footage, how installation works, our pricing, and our order system from quote to invoice to install schedule.",
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
            maxWidth: "720px",
            margin: "0 auto",
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
              You are the first point of contact for every US Floor client.
              <br />
              <br />
              That means building your own pipeline alongside the leads we bring in,
              visiting client homes to measure and understand the space, helping them choose
              materials, working with their designer or ours, tracking and collecting
              payment, and making sure the handoff to the project manager is clean so the
              job lands the way the client expected.
              <br />
              <br />
              The client is US Floor&rsquo;s client. Your job is to make sure every step
              from first conversation to project handoff goes smoothly.
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
                "Follow up on every lead we give you and build your own pipeline through networking events, trade shows, and direct outreach",
                "Greet everyone who walks into the showroom, including the ones who say they are just looking",
                "Visit client homes to measure, photograph, and understand the space",
                "Help clients select materials and work alongside their designer or our in-house designer to move the project forward",
                "Put together accurate quotes and present them clearly",
                "Ask for the sale and keep following up until you get a yes or a no",
                "Track deposits, approvals, and final payments, and collect them",
                "Hand the project cleanly to the project manager so nothing is lost in the transfer",
                "Stay reachable while the job runs and make sure it finishes the way the client expected",
                "Keep your pipeline, open quotes, and active jobs current in our order system",
                "Keep the showroom floor and sample displays in order",
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
              We are not looking for a flooring background. We are looking for three things.
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
                  body: "Most customers do not buy on the first visit. They take a sample home, they talk to a spouse, they get busy. The consultants who do well here call back on Tuesday like they said they would, and again the following week, without being a nuisance about it. They also pick up the phone and call people who have never heard of us. Cold outreach, trade events, referral partners -- they treat every channel as a source.",
                },
                {
                  heading: "You take responsibility for your part of the process.",
                  body: "This role does not end when the contract is signed. You track the job through to handoff, make sure the project manager has everything they need, and stay reachable while the job runs. If something is unclear or going sideways, you find out early and flag it. The consultants who build a real book of business here are the ones clients ask for on the next project.",
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
                "Comfortable talking about money, asking for the sale, and collecting payment",
                "Organized enough to manage open quotes and active jobs at the same time",
                "Willing to pick up the phone and make outbound calls to people who do not know you yet",
                "Can use a computer and learn a new system",
                "Available Saturdays on a rotation. Saturday is our busiest day.",
                "Valid California driver's license (client visits are part of this role)",
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
              the pricing. If you have managed a client relationship from first contact
              through completion and you are willing to learn a trade, you can do this job.
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
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
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
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
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

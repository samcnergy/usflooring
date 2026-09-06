import Link from "next/link";

export const metadata = {
  title: "About | US Floor Design Center",
  description: "US Floor Design Center is a 30-year-old design-build studio in Rancho Santa Margarita, Orange County. Kitchen remodeling, bathroom remodeling, flooring, tile, cabinets, and countertops.",
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "url": "https://usfloordesign.com/about",
      "name": "About US Floor Design Center",
      "description": "US Floor Design Center is a 30-year design-build studio in Rancho Santa Margarita, Orange County. Kitchen remodeling, bathroom remodeling, flooring, tile, cabinets, and countertops.",
      "about": { "@id": "https://usfloordesign.com/#organization" },
    },
    {
      "@type": "Person",
      "@id": "https://usfloordesign.com/#parham-shariat",
      "name": "Parham Shariat",
      "jobTitle": "Owner and Operator",
      "worksFor": { "@id": "https://usfloordesign.com/#organization" },
      "description": "Parham Shariat is the owner and operator of US Floor Design Center. He has 4+ years as a senior project manager at Millennium Tile and Marble, a background in residential renovation and real estate, and is a published author of five books including a book on generative engine optimization. He holds AI certifications from Wharton and has 20+ years of executive and systems engineering experience.",
      "knowsAbout": ["kitchen remodeling", "bathroom remodeling", "flooring installation", "tile installation", "countertop fabrication", "design-build", "project management", "generative engine optimization"],
      "alumniOf": "Wharton School",
      "award": "Wharton AI Fundamentals, AI Strategy and Governance, AI in Marketing and Finance, AI in People Management"
    },
    {
      "@type": "Person",
      "@id": "https://usfloordesign.com/#shirin-salamat",
      "name": "Shirin Salamat",
      "jobTitle": "Owner",
      "worksFor": { "@id": "https://usfloordesign.com/#organization" },
      "description": "Shirin Salamat is co-owner of US Floor Design Center. She is an attorney with 22 years of legal experience and a member of the Iran Central Bar Association since 2004. She brings vendor negotiation and contract structure to the business.",
    }
  ]
};

export default function AboutPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface-alt)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0 var(--s-8)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-5)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}>
                About us
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--t-h1)",
              lineHeight: 1.10,
              letterSpacing: "-0.01em",
              color: "var(--text)",
              maxWidth: "24ch",
              marginBottom: "var(--s-5)",
            }}>
              A 30-year Orange County showroom, with the crews and relationships that built it, and the systems it never had.
            </h1>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "56ch" }}>
              US Floor Design Center has been remodeling kitchens, bathrooms, and floors in Orange County for three decades. The experienced crews, the supplier relationships, the showroom - all intact. The infrastructure around it, rebuilt from scratch.
            </p>
          </div>
        </div>
      </div>

      {/* Spec table replacing dark stats band */}
      <div style={{ borderTop: "1px solid var(--gold)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { n: "30+", label: "Years in Orange County" },
              { n: "800+", label: "Projects completed" },
              { n: "1", label: "Showroom, Orange County" },
              { n: "Design + build", label: "One team, start to finish" },
            ].map((item, i) => (
              <div key={item.n} style={{
                padding: "var(--s-6) var(--s-5)",
                borderLeft: i > 0 ? "1px solid var(--line)" : "none",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--t-numeral)",
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: i === 2 ? "var(--gold)" : "var(--text)",
                  marginBottom: "var(--s-2)",
                }}>
                  {item.n}
                </div>
                <div style={{
                  fontSize: "var(--t-label)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The story */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-10)", padding: "var(--s-9) 0" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>The business</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text)", lineHeight: 1.25, marginBottom: "var(--s-5)" }}>
                What was here before we arrived
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                The original US Floor, Kitchen and Bath opened in Rancho Santa Margarita in the early 1990s and operated out of the same showroom at Arroyo Crossroads for thirty years. The owner, Mr. Hedayati, built it the way most successful small businesses are built: good crews, strong word of mouth, supplier relationships that took years to develop, and real knowledge of how to run a remodeling job.
              </p>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                The business had one significant gap. Every quote, every invoice, every job order was on paper. There was no CRM, no digital record of 30 years of customers, no online presence worth mentioning, and no way to measure where business was coming from. The operation was strong. The infrastructure around it was not.
              </p>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35 }}>
                Since 2025, Parham Shariat and Shirin Salamat have run the business. The sales team and installation crews stayed. The relationships stayed. They added the systems.
              </p>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>What changed</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text)", lineHeight: 1.25, marginBottom: "var(--s-5)" }}>
                What we built before we walked in
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                Before joining the business in 2025, we built the order-management platform the business now runs on. One entry creates the invoice, the work order, the installer's daily order, and the vendor purchase order. Thirty years of paper invoices are now a searchable customer database.
              </p>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                We rebuilt the website as an actual lead channel and product catalog, not a placeholder. We added structured inventory, quote tracking, and a sales process the team can follow consistently.
              </p>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35 }}>
                None of this changed the trade. The same crews do the same work. What changed is that the business can now track, measure, and improve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The people */}
      <div style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>The owners</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-8)" }}>
              Who runs the business
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-8)" }}>

              {/* Parham */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/parham-shariat.png"
                  alt="Parham Shariat - Owner and Operator, US Floor Design Center"
                  style={{ width: "100%", maxWidth: 280, height: 340, objectFit: "cover", objectPosition: "center top", display: "block", marginBottom: "var(--s-5)", border: "1px solid var(--line)" }}
                />
                <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--s-3)" }}>Owner and Operator</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text)", marginBottom: "var(--s-5)" }}>Parham Shariat</h3>

                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                  Before joining US Floor in 2025, Parham spent four-plus years as a senior project manager at Millennium Tile and Marble, where he managed installation projects across Southern California. Before that, between 2003 and 2012, he was involved in purchasing and renovating residential properties for sale - which is how he came to understand what a remodel actually costs, what takes time, and where things go wrong.
                </p>
                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                  He is also a systems builder. He built the order-management and e-commerce platform that runs this business before joining in 2025. He has 20-plus years of executive and engineering experience, including managing mission-critical systems for a major healthcare network.
                </p>
                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-6)" }}>
                  He is a published author of five books, including a book on generative engine optimization - the discipline of making businesses visible in AI-generated search results. He holds AI certifications from the Wharton School.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
                  {[
                    "4+ years at Millennium Tile and Marble",
                    "Residential renovation since 2003",
                    "Published author - 5 books",
                    "Wharton AI certifications",
                    "20+ years executive and engineering",
                  ].map((tag) => (
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

              {/* Shirin */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/shirin-salamat.png"
                  alt="Shirin Salamat - Co-Owner, US Floor Design Center"
                  style={{ width: "100%", maxWidth: 280, height: 340, objectFit: "cover", objectPosition: "center top", display: "block", marginBottom: "var(--s-5)", border: "1px solid var(--line)" }}
                />
                <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--s-3)" }}>Co-Owner</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text)", marginBottom: "var(--s-5)" }}>Shirin Salamat</h3>

                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)" }}>
                  Shirin is an attorney with 22 years of legal experience. She has been a member of the Iran Central Bar Association since 2004 and has represented multinational companies including Procter and Gamble and Werner throughout her career.
                </p>
                <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-6)" }}>
                  At US Floor, she is responsible for vendor agreements, supplier negotiations, and the legal and contractual framework that protects the business and its customers. She also has a strong network across Orange County that contributes to the business's referral base.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)" }}>
                  {[
                    "22 years legal experience",
                    "Iran Central Bar Association since 2004",
                    "Multinational corporate representation",
                    "Orange County network",
                  ].map((tag) => (
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

            </div>
          </div>
        </div>
      </div>

      {/* Our approach */}
      <div style={{ background: "var(--surface)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ padding: "var(--s-9) 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
              <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
              <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>How we work</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h2)", color: "var(--text)", lineHeight: 1.14, letterSpacing: "-0.01em", marginBottom: "var(--s-5)", maxWidth: "22ch" }}>
              Design and build under one roof
            </h2>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)", maxWidth: "68ch" }}>
              Most remodeling problems start with handoffs - between the designer who specified something and the contractor who has to build it, between the person who sold the job and the crew that shows up on site. When design and construction are managed separately, each side blames the other when something does not fit.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, marginBottom: "var(--s-4)", maxWidth: "68ch" }}>
              We handle the full scope. Material selection, design drawings, permits, demolition, construction, installation, and final inspection happen through one team with one point of contact. If something changes mid-project - because it always does - there is no gap between who knew and who did the work.
            </p>
            <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-muted)", lineHeight: 1.35, maxWidth: "68ch" }}>
              Our installation crews are experienced tradespeople, not day-rate subcontractors found online. The supplier relationships we work with have been developed over 30 years. That is not easy to replicate quickly, and it shows in the quality of the work.
            </p>
          </div>
        </div>
      </div>

      {/* Showroom + contact */}
      <div style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--line-invert)" }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "0 var(--gutter)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-10)", padding: "var(--s-9) 0" }}>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-invert-muted)" }}>Visit us</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text-invert)", lineHeight: 1.25, marginBottom: "var(--s-5)" }}>
                Come to the showroom
              </h2>
              <p style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert-muted)", lineHeight: 1.35, marginBottom: "var(--s-6)" }}>
                The showroom is the right place to start. You can see every material at full scale, compare options side by side, and talk through a project with someone who has actually done it. Walk-ins are welcome. If you want dedicated time with a designer, book an appointment.
              </p>
              <div style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert)", lineHeight: 1.45, marginBottom: "var(--s-6)" }}>
                <div>30092 Santa Margarita Pkwy, Suite G</div>
                <div>Rancho Santa Margarita, CA 92688</div>
                <div style={{ marginTop: "var(--s-2)", color: "var(--text-invert-muted)", fontSize: "var(--t-body)" }}>Arroyo Crossroads Shopping Center</div>
              </div>
              <div style={{ fontSize: "var(--t-body)", color: "var(--text-invert-muted)", lineHeight: 1.45, marginBottom: "var(--s-6)" }}>
                <div>Mon - Fri: 9:00 am - 5:30 pm</div>
                <div>Saturday: 10:00 am - 4:00 pm</div>
                <div>Sunday: Closed</div>
              </div>
              <div style={{ display: "flex", gap: "var(--s-4)", flexWrap: "wrap" }}>
                <Link href="/request-a-visit" style={{
                  display: "inline-block",
                  background: "var(--red)",
                  color: "var(--text-invert)",
                  fontSize: "var(--t-btn)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "14px 28px",
                  textDecoration: "none",
                  borderRadius: "var(--radius)",
                }}>
                  Schedule a consultation
                </Link>
                <Link href="/showroom" style={{
                  display: "inline-block",
                  border: "1px solid var(--line-invert)",
                  color: "var(--text-invert)",
                  fontSize: "var(--t-btn)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "14px 28px",
                  textDecoration: "none",
                  borderRadius: "var(--radius)",
                }}>
                  Showroom details
                </Link>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-4)" }}>
                <div style={{ width: 32, height: 2, background: "var(--red)", flexShrink: 0 }} />
                <span style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-invert-muted)" }}>Contact</span>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "var(--t-h3)", color: "var(--text-invert)", lineHeight: 1.25, marginBottom: "var(--s-5)" }}>
                Get in touch
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
                <div>
                  <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-invert-muted)", marginBottom: "var(--s-2)" }}>Phone</div>
                  <a href="tel:+16196267545" style={{ fontFamily: "var(--font-display)", fontSize: "var(--t-h3)", color: "var(--text-invert)", textDecoration: "none" }}>
                    (619) 626-7545
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-invert-muted)", marginBottom: "var(--s-2)" }}>Email</div>
                  <a href="mailto:info@usfloordesign.com" style={{ fontSize: "var(--t-body-lg)", color: "var(--text-invert)", textDecoration: "none" }}>
                    info@usfloordesign.com
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: "var(--t-label)", fontFamily: "var(--font-body)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-invert-muted)", marginBottom: "var(--s-2)" }}>Trade inquiries</div>
                  <p style={{ fontSize: "var(--t-body)", color: "var(--text-invert-muted)", lineHeight: 1.45, margin: 0 }}>
                    Designers, contractors, architects, and property managers can apply for trade pricing and a dedicated point of contact through our trade program.
                  </p>
                  <Link href="/trade" style={{ display: "inline-block", marginTop: "var(--s-3)", fontSize: "var(--t-body)", color: "var(--text-invert)", textDecoration: "underline" }}>
                    Apply for trade access
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

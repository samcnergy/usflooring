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
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>About us</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)",
              }}>
                Thirty years in this showroom. A new team behind it.
              </h1>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "44ch" }}>
                US Floor Design Center has been remodeling kitchens, bathrooms, and floors in Orange County for three decades. We acquired the business in 2025 and kept what worked - the experienced crews, the supplier relationships, the showroom - and built the systems and processes it never had.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fast facts bar */}
      <div style={{ background: "var(--pub-ink)", borderBottom: "1px solid rgba(241,238,231,0.1)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, padding: "32px 0" }}>
            {[
              { n: "30+", label: "Years in Orange County" },
              { n: "800+", label: "Projects completed" },
              { n: "1", label: "Showroom, Orange County" },
              { n: "Design + build", label: "One team, start to finish" },
            ].map((item, i) => (
              <div key={item.n} style={{
                padding: "0 32px",
                borderLeft: i > 0 ? "1px solid rgba(241,238,231,0.15)" : "none",
              }}>
                <div style={{ fontFamily: "var(--pub-serif)", fontSize: 28, color: "var(--pub-stone)", fontWeight: 400, lineHeight: 1.2 }}>{item.n}</div>
                <div style={{ fontSize: 13, color: "rgba(241,238,231,0.55)", marginTop: 6 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The story */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "80px 0" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>The business</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 24 }}>
                What was here before we arrived
              </h2>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                The original US Floor, Kitchen and Bath opened in Rancho Santa Margarita in the early 1990s and operated out of the same showroom at Arroyo Crossroads for thirty years. The owner, Mr. Hedayati, built it the way most successful small businesses are built: good crews, strong word of mouth, supplier relationships that took years to develop, and real knowledge of how to run a remodeling job.
              </p>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                The business had one significant gap. Every quote, every invoice, every job order was on paper. There was no CRM, no digital record of 30 years of customers, no online presence worth mentioning, and no way to measure where business was coming from. The operation was strong. The infrastructure around it was not.
              </p>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8 }}>
                We acquired the business in 2025. The sales team and installation crews stayed. The relationships stayed. We added the systems.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>What changed</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 24 }}>
                What we built before we walked in
              </h2>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                Before the acquisition closed, we built the order-management platform the business runs on. One entry creates the invoice, the work order, the installer's daily order, and the vendor purchase order. Thirty years of paper invoices are now a searchable customer database.
              </p>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                We rebuilt the website as an actual lead channel and product catalog, not a placeholder. We added structured inventory, quote tracking, and a sales process the team can follow consistently.
              </p>
              <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8 }}>
                None of this changed the trade. The same crews do the same work. What changed is that the business can now track, measure, and improve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The people */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)", borderBottom: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>The owners</div>
            <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 48 }}>
              Who runs the business
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>

              {/* Parham */}
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/parham-shariat.png"
                  alt="Parham Shariat - Owner and Operator, US Floor Design Center"
                  style={{ width: "100%", maxWidth: 280, height: 340, objectFit: "cover", objectPosition: "center top", display: "block", marginBottom: 24, borderRadius: 2 }}
                />
                <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Owner and Operator</div>
                <h3 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26, color: "var(--pub-ink)", marginBottom: 20 }}>Parham Shariat</h3>

                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.8, marginBottom: 16 }}>
                  Before acquiring US Floor, Parham spent four-plus years as a senior project manager at Millennium Tile and Marble, where he managed installation projects across Southern California. Before that, between 2003 and 2012, he was involved in purchasing and renovating residential properties for sale - which is how he came to understand what a remodel actually costs, what takes time, and where things go wrong.
                </p>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.8, marginBottom: 16 }}>
                  He is also a systems builder. He built the order-management and e-commerce platform that runs this business before the acquisition closed. He has 20-plus years of executive and engineering experience, including managing mission-critical systems for a major healthcare network.
                </p>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.8, marginBottom: 24 }}>
                  He is a published author of five books, including a book on generative engine optimization - the discipline of making businesses visible in AI-generated search results. He holds AI certifications from the Wharton School.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "4+ years at Millennium Tile and Marble",
                    "Residential renovation since 2003",
                    "Published author - 5 books",
                    "Wharton AI certifications",
                    "20+ years executive and engineering",
                  ].map((tag) => (
                    <span key={tag} style={{
                      fontSize: 12, padding: "5px 12px",
                      background: "#fff", border: "1px solid var(--pub-line)",
                      borderRadius: 2, color: "var(--pub-ink)",
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
                  style={{ width: "100%", maxWidth: 280, height: 340, objectFit: "cover", objectPosition: "center top", display: "block", marginBottom: 24, borderRadius: 2 }}
                />
                <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Co-Owner</div>
                <h3 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26, color: "var(--pub-ink)", marginBottom: 20 }}>Shirin Salamat</h3>

                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.8, marginBottom: 16 }}>
                  Shirin is an attorney with 22 years of legal experience. She has been a member of the Iran Central Bar Association since 2004 and has represented multinational companies including Procter and Gamble and Werner throughout her career.
                </p>
                <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.8, marginBottom: 24 }}>
                  At US Floor, she is responsible for vendor agreements, supplier negotiations, and the legal and contractual framework that protects the business and its customers. She also has a strong network across Orange County that contributes to the business's referral base.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "22 years legal experience",
                    "Iran Central Bar Association since 2004",
                    "Multinational corporate representation",
                    "Orange County network",
                  ].map((tag) => (
                    <span key={tag} style={{
                      fontSize: 12, padding: "5px 12px",
                      background: "#fff", border: "1px solid var(--pub-line)",
                      borderRadius: 2, color: "var(--pub-ink)",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Our approach */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>How we work</div>
                <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 30, color: "var(--pub-ink)", lineHeight: 1.3 }}>
                  Design and build under one roof
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                  Most remodeling problems start with handoffs - between the designer who specified something and the contractor who has to build it, between the person who sold the job and the crew that shows up on site. When design and construction are managed separately, each side blames the other when something does not fit.
                </p>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8, marginBottom: 18 }}>
                  We handle the full scope. Material selection, design drawings, permits, demolition, construction, installation, and final inspection happen through one team with one point of contact. If something changes mid-project - because it always does - there is no gap between who knew and who did the work.
                </p>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.8 }}>
                  Our installation crews are experienced tradespeople, not day-rate subcontractors found online. The supplier relationships we work with have been developed over 30 years. That is not easy to replicate quickly, and it shows in the quality of the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showroom + contact */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, padding: "72px 0" }}>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Visit us</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 24 }}>
                Come to the showroom
              </h2>
              <p style={{ fontSize: 15, color: "#4B4A45", lineHeight: 1.7, marginBottom: 28 }}>
                The showroom is the right place to start. You can see every material at full scale, compare options side by side, and talk through a project with someone who has actually done it. Walk-ins are welcome. If you want dedicated time with a designer, book an appointment.
              </p>
              <div style={{ fontSize: 15, color: "var(--pub-ink)", lineHeight: 1.9, marginBottom: 28 }}>
                <div>30092 Santa Margarita Pkwy, Suite G</div>
                <div>Rancho Santa Margarita, CA 92688</div>
                <div style={{ marginTop: 4, color: "var(--pub-muted)", fontSize: 14 }}>Arroyo Crossroads Shopping Center</div>
              </div>
              <div style={{ fontSize: 14, color: "#4B4A45", lineHeight: 1.8, marginBottom: 28 }}>
                <div>Mon - Fri: 9:00 am - 5:30 pm</div>
                <div>Saturday: 10:00 am - 4:00 pm</div>
                <div style={{ color: "var(--pub-muted)" }}>Sunday: Closed</div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/request-a-visit" style={{
                  display: "inline-block",
                  background: "var(--pub-forest)", color: "var(--pub-stone)",
                  fontSize: 14, padding: "13px 24px", textDecoration: "none", borderRadius: 2,
                }}>
                  Schedule a consultation
                </Link>
                <Link href="/showroom" style={{
                  display: "inline-block",
                  border: "1px solid var(--pub-ink)", color: "var(--pub-ink)",
                  fontSize: 14, padding: "13px 24px", textDecoration: "none", borderRadius: 2,
                }}>
                  Showroom details
                </Link>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: "var(--pub-brass)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Contact</div>
              <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 24 }}>
                Get in touch
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Phone</div>
                  <a href="tel:+16196267545" style={{ fontSize: 20, fontFamily: "var(--pub-serif)", color: "var(--pub-ink)", textDecoration: "none" }}>
                    (619) 626-7545
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Email</div>
                  <a href="mailto:info@usfloordesign.com" style={{ fontSize: 16, color: "var(--pub-ink)", textDecoration: "none" }}>
                    info@usfloordesign.com
                  </a>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Trade inquiries</div>
                  <p style={{ fontSize: 14, color: "#4B4A45", lineHeight: 1.6, margin: 0 }}>
                    Designers, contractors, architects, and property managers can apply for trade pricing and a dedicated point of contact through our trade program.
                  </p>
                  <Link href="/trade" style={{ display: "inline-block", marginTop: 10, fontSize: 14, color: "var(--pub-ink)", textDecoration: "underline" }}>
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

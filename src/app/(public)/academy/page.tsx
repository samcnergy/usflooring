import Link from "next/link";

export const metadata = {
  title: "US Floor Academy | Free Training and Certificates",
  description: "Free installation training courses for tile, cabinets, and flooring. Earn a certificate and build your skills. A skills program from US Floor Design Center.",
};

const COURSES = [
  {
    slug: "tile-installation",
    label: "Tile installation",
    level: "Beginner to intermediate",
    duration: "6 hours · self-paced",
    topics: [
      "Substrate prep and waterproofing",
      "Layout and planning",
      "Mortar, thinset, and adhesives",
      "Cutting techniques",
      "Grouting and sealing",
      "Natural stone - handling, variation, and sealer requirements",
    ],
    cert: "Tile Installation Fundamentals Certificate",
    note: "Safety module links to Cal-OSHA and NIOSH guidance on silica dust from cutting stone, quartz, and porcelain.",
  },
  {
    slug: "cabinet-installation",
    label: "Cabinet installation",
    level: "Beginner to intermediate",
    duration: "5 hours · self-paced",
    topics: [
      "Layout and site assessment",
      "Locating studs and planning anchors",
      "Upper cabinet installation",
      "Base cabinet leveling and fastening",
      "Face frames, doors, and adjustments",
      "Filler strips and trim",
    ],
    cert: "Cabinet Installation Fundamentals Certificate",
    note: "",
  },
  {
    slug: "flooring-installation",
    label: "Flooring installation",
    level: "Beginner to intermediate",
    duration: "5 hours · self-paced",
    topics: [
      "Subfloor inspection and prep",
      "Hardwood - nail-down, glue-down, and floating methods",
      "LVP and laminate - click and glue systems",
      "Transitions and thresholds",
      "Moisture testing and vapor barriers",
      "Pattern flooring and herringbone layouts",
    ],
    cert: "Flooring Installation Fundamentals Certificate",
    note: "",
  },
];

const VIDEOS = {
  diy: [
    { title: "How to clean and seal natural stone tile", duration: "8 min" },
    { title: "Replacing a broken tile without disturbing the surrounding tiles", duration: "11 min" },
    { title: "Adjusting cabinet door hinges for alignment", duration: "5 min" },
    { title: "Removing and replacing grout in a shower", duration: "14 min" },
    { title: "Cleaning luxury vinyl plank: what works and what damages it", duration: "7 min" },
    { title: "Resealing a quartz countertop", duration: "6 min" },
  ],
  process: [
    { title: "Our full kitchen tile installation: from demo to final grout", duration: "22 min" },
    { title: "How we plan a cabinet layout before anything is ordered", duration: "16 min" },
    { title: "Herringbone hardwood flooring: how we handle the cuts", duration: "18 min" },
    { title: "Curbless shower waterproofing: our process", duration: "12 min" },
    { title: "Material selection walk-through with a client", duration: "20 min" },
    { title: "Our post-install inspection checklist", duration: "9 min" },
  ],
};

export default function AcademyPage() {
  return (
    <div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--pub-line)", background: "var(--pub-stone)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 56px" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>US Floor Academy</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{
                fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 48,
                lineHeight: 1.15, color: "var(--pub-ink)", maxWidth: "15ch",
              }}>
                Learn how the work is actually done.
              </h1>
              <div>
                <p style={{ fontSize: 16, color: "#4B4A45", lineHeight: 1.7, maxWidth: "44ch", marginBottom: 0 }}>
                  Free, self-paced installation courses with a certificate on completion. Built for people who want to develop real skills - whether you are changing careers, growing your capabilities, or just want to understand what a professional installation actually involves.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate disclaimer */}
      <div style={{ background: "var(--pub-ink)", borderBottom: "1px solid rgba(241,238,231,0.15)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "20px 0", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{ color: "var(--pub-brass)", fontSize: 16, flexShrink: 0, marginTop: 1 }}>&#9432;</span>
            <p style={{ fontSize: 14, color: "rgba(241,238,231,0.7)", lineHeight: 1.65, margin: 0, maxWidth: "80ch" }}>
              Certificates from US Floor Academy confirm completion of a training course. They are not professional licenses and do not guarantee employment, placement on our installer list, or a specific rate of pay. All certificates say this plainly.
            </p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Course catalog</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {COURSES.map((course, i) => (
                <div key={course.slug} style={{
                  padding: "48px 0",
                  borderBottom: i < COURSES.length - 1 ? "1px solid var(--pub-line)" : "none",
                  display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 64, alignItems: "start",
                }}>
                  {/* Left */}
                  <div>
                    <h2 style={{
                      fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 26,
                      color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 12,
                      textTransform: "capitalize",
                    }}>
                      {course.label}
                    </h2>
                    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 2,
                        background: "var(--pub-stone)", color: "var(--pub-muted)",
                      }}>
                        {course.level}
                      </span>
                      <span style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 2,
                        background: "var(--pub-stone)", color: "var(--pub-muted)",
                      }}>
                        {course.duration}
                      </span>
                    </div>
                    <div style={{
                      padding: "16px 18px", border: "1px solid var(--pub-line)", borderRadius: 2,
                      marginBottom: 20,
                    }}>
                      <div style={{ fontSize: 11, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Certificate awarded
                      </div>
                      <div style={{ fontSize: 14, color: "var(--pub-ink)", lineHeight: 1.4 }}>
                        {course.cert}
                      </div>
                    </div>
                    <Link href={`/academy/${course.slug}`} style={{
                      display: "inline-block",
                      background: "var(--pub-forest)", color: "var(--pub-stone)",
                      fontSize: 13, padding: "12px 22px", textDecoration: "none", borderRadius: 2,
                    }}>
                      Enroll - free
                    </Link>
                  </div>

                  {/* Right - topics */}
                  <div>
                    <div style={{ fontSize: 13, color: "var(--pub-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      What this course covers
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {course.topics.map((t) => (
                        <div key={t} style={{
                          padding: "14px 16px", border: "1px solid var(--pub-line)", borderRadius: 2,
                          fontSize: 14, color: "var(--pub-ink)", lineHeight: 1.45,
                          display: "flex", alignItems: "flex-start", gap: 10,
                        }}>
                          <span style={{ color: "var(--pub-brass)", flexShrink: 0, marginTop: 1 }}>·</span>
                          {t}
                        </div>
                      ))}
                    </div>
                    {course.note && (
                      <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.6, marginTop: 16 }}>
                        {course.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video library */}
      <div style={{ background: "var(--pub-stone)", borderTop: "1px solid var(--pub-line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "72px 0" }}>
            <div style={{ fontSize: 13, color: "var(--pub-brass)", marginBottom: 16 }}>Video library</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

              {/* DIY videos */}
              <div>
                <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 22, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 20 }}>
                  DIY homeowner guides
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {VIDEOS.diy.map((v, i) => (
                    <div key={v.title} style={{
                      padding: "16px 0", borderBottom: "1px solid var(--pub-line)",
                      display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 2, flexShrink: 0,
                        background: "linear-gradient(135deg, #D6CFC4, #C0B9AD)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 14, color: "#fff" }}>▶</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: "var(--pub-ink)", lineHeight: 1.4 }}>{v.title}</div>
                        <div style={{ fontSize: 12, color: "var(--pub-muted)", marginTop: 3 }}>{v.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process videos */}
              <div>
                <h2 style={{ fontFamily: "var(--pub-serif)", fontWeight: 400, fontSize: 22, color: "var(--pub-ink)", lineHeight: 1.3, marginBottom: 20 }}>
                  How we do it - our process
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {VIDEOS.process.map((v) => (
                    <div key={v.title} style={{
                      padding: "16px 0", borderBottom: "1px solid var(--pub-line)",
                      display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 2, flexShrink: 0,
                        background: "linear-gradient(135deg, #2F4A38, #1E2320)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <span style={{ fontSize: 14, color: "rgba(241,238,231,0.9)" }}>▶</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: "var(--pub-ink)", lineHeight: 1.4 }}>{v.title}</div>
                        <div style={{ fontSize: 12, color: "var(--pub-muted)", marginTop: 3 }}>{v.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--pub-ink)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--pub-serif)", fontSize: 30, color: "var(--pub-stone)", marginBottom: 10, fontWeight: 400, lineHeight: 1.3 }}>
                Start with any course. It&apos;s free.
              </p>
              <p style={{ fontSize: 15, color: "rgba(241,238,231,0.65)", lineHeight: 1.65, maxWidth: "44ch" }}>
                All three courses are self-paced and at no cost. A certificate is issued once you pass the final assessment.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {COURSES.map((c) => (
                <Link key={c.slug} href={`/academy/${c.slug}`} style={{
                  display: "block",
                  background: "rgba(241,238,231,0.1)", color: "var(--pub-stone)",
                  border: "1px solid rgba(241,238,231,0.2)",
                  fontSize: 14, padding: "13px 24px", textDecoration: "none", borderRadius: 2,
                  textTransform: "capitalize",
                }}>
                  Enroll in {c.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

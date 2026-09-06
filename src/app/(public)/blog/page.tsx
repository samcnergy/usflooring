import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Blog | US Floor Design Center",
  description: "Countertop care guides, design trends and homeowner resources from US Floor Design Center in Rancho Santa Margarita, Orange County.",
};

const POSTS = [
  {
    href: "/blog/2027-interior-design-trends",
    cover: "/blog-2027-cover.png",
    label: "Design trends",
    title: "2027 Interior Design Trends",
    description: "The directions showing up in Orange County homes right now - warm materials, quieter kitchens, and rooms built for the long term.",
  },
  {
    href: "/blog/quartz-countertop-maintenance-guide",
    cover: "/blog-quartz-cover.png",
    label: "Homeowner care guide",
    title: "Quartz Countertop Maintenance Guide",
    description: "Simple cleaning, heat protection and long-term care for engineered quartz surfaces.",
  },
  {
    href: "/blog/porcelain-countertop-care-maintenance",
    cover: "/blog-porcelain-cover.png",
    label: "Homeowner care guide",
    title: "Porcelain Countertop Care and Maintenance",
    description: "A practical guide to cleaning, stain removal, heat protection and edge care for porcelain slabs.",
  },
  {
    href: "/blog/natural-stone-countertop-care-maintenance",
    cover: "/blog-natural-stone-cover.png",
    label: "Homeowner care guide",
    title: "Natural Stone Countertop Care and Maintenance",
    description: "How to clean, protect, seal and preserve granite, quartzite, marble and other natural stones.",
  },
];

export default function BlogIndexPage() {
  return (
    <div>

      {/* Header */}
      <div style={{ borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "64px 0 48px" }}>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>From US Floor Design Center</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end" }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, lineHeight: 1.15, color: "var(--text)" }}>
                Guides, trends, and care advice.
              </h1>
              <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "42ch" }}>
                Practical resources for homeowners planning a remodel, caring for their materials, or figuring out what direction to take a room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Post grid */}
      <div style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, padding: "2px 0 80px" }}>
            {POSTS.map((post, i) => (
              <Link key={post.href} href={post.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  borderBottom: "1px solid var(--line)",
                  borderRight: i % 2 === 0 ? "1px solid var(--line)" : "none",
                  padding: "0 0 40px",
                }}>
                  <div style={{ position: "relative", height: 260, overflow: "hidden", marginBottom: 24 }}>
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center", transition: "transform 0.3s ease" }}
                    />
                  </div>
                  <div style={{ padding: "0 32px" }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                      {post.label}
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, color: "var(--text)", lineHeight: 1.3, marginBottom: 12 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.45, margin: 0 }}>
                      {post.description}
                    </p>
                    <div style={{ marginTop: 20, fontSize: 13, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                      Read the guide <span style={{ fontSize: 16 }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ padding: "56px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--text)", fontWeight: 400, lineHeight: 1.3, marginBottom: 10 }}>
                Ready to start a project?
              </p>
              <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.45, maxWidth: "44ch" }}>
                Visit the showroom or schedule a consultation with our design team in Rancho Santa Margarita.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/request-a-visit" style={{
                display: "inline-block",
                background: "var(--red)", color: "var(--text-invert)",
                fontSize: 14, fontWeight: 500, padding: "14px 26px",
                textDecoration: "none", borderRadius: 0,
              }}>
                Schedule a consultation
              </Link>
              <Link href="/faq" style={{
                display: "inline-block",
                color: "var(--text)", border: "1px solid var(--text)",
                fontSize: 14, padding: "14px 26px",
                textDecoration: "none", borderRadius: 0,
              }}>
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

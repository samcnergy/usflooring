import Link from "next/link";
import PublicNav from "./PublicNav";

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"],
      "@id": "https://usfloordesign.com/#organization",
      "name": "US Floor Design Center",
      "url": "https://usfloordesign.com",
      "telephone": "+16196267545",
      "email": "info@usfloordesign.com",
      "description": "Design-build studio specializing in kitchen, bathroom, and flooring remodeling in Rancho Santa Margarita, Orange County, California. Full design-build, countertops, cabinetry, tile, flooring, and installation.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "30092 Santa Margarita Pkwy, Suite G",
        "addressLocality": "Rancho Santa Margarita",
        "addressRegion": "CA",
        "postalCode": "92688",
        "addressCountry": "US"
      },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "17:30" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "16:00" }
      ],
      "areaServed": { "@type": "Place", "name": "Orange County, California" },
      "knowsAbout": ["kitchen remodeling","bathroom remodeling","flooring installation","tile installation","cabinet installation","countertop fabrication","design-build","home remodeling"],
      "founder": {
        "@type": "Person",
        "name": "Parham Shariat",
        "jobTitle": "Owner",
        "worksFor": { "@id": "https://usfloordesign.com/#organization" }
      },
      "sameAs": ["https://usflooring.onrender.com"]
    }
  ]
};

const FOOTER_COLS = [
  {
    heading: "Services",
    links: [
      { href: "/services", label: "Overview" },
      { href: "/services#design", label: "Design" },
      { href: "/services#remodel", label: "Remodel" },
      { href: "/services#delivery", label: "Delivery" },
      { href: "/warranty", label: "Warranty" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { href: "/shop", label: "Browse materials" },
      { href: "/projects", label: "Projects" },
      { href: "/showroom", label: "Showroom" },
      { href: "/academy", label: "Academy" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/press", label: "Press" },
      { href: "/faq", label: "FAQ" },
      { href: "/trade", label: "Trade program" },
      { href: "/about#careers", label: "Careers" },
    ],
  },
  {
    heading: "Visit",
    links: [
      { href: "/request-a-visit", label: "Plan a visit" },
      { href: "/showroom", label: "Showroom hours" },
      { href: "tel:+16196267545", label: "(619) 626-7545" },
      { href: "mailto:info@usfloordesign.com", label: "info@usfloordesign.com" },
    ],
  },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface)", color: "var(--text)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />

      <PublicNav />

      <main>{children}</main>

      <footer style={{ background: "var(--surface-ink)", borderTop: "1px solid var(--gold)" }}>
        {/* Four-column link grid */}
        <div style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: `var(--s-9) var(--gutter)`,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
          gap: "var(--s-8)",
        }}>
          {/* Brand column */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/US_FLOOR_Logo_Black.png"
              alt="US Floor Design Center"
              style={{ height: 48, width: "auto", marginBottom: "var(--s-5)" }}
            />
            <p style={{
              fontSize: "var(--t-small)",
              color: "var(--text-invert-muted)",
              lineHeight: 1.45,
              maxWidth: "28ch",
            }}>
              30092 Santa Margarita Pkwy, Suite G<br />
              Rancho Santa Margarita, CA 92688
            </p>
            <p style={{ fontSize: "var(--t-small)", color: "var(--text-invert-muted)", marginTop: "var(--s-3)", lineHeight: 1.45 }}>
              Mon-Fri 9 AM - 5:30 PM<br />
              Sat 10 AM - 4 PM
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p style={{
                fontSize: "var(--t-label)",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-invert)",
                marginBottom: "var(--s-4)",
              }}>
                {col.heading}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontSize: "var(--t-small)",
                      color: "var(--text-invert-muted)",
                      textDecoration: "none",
                      lineHeight: 1.4,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legal row */}
        <div style={{ borderTop: "1px solid var(--line-invert)" }}>
          <div style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: `var(--s-5) var(--gutter)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "var(--s-5)",
            flexWrap: "wrap",
          }}>
            <p style={{ fontSize: "var(--t-small)", color: "var(--text-invert-muted)" }}>
              &copy; {new Date().getFullYear()} US Floor Design Center. All rights reserved.
            </p>
            <Link href="/login" style={{ fontSize: "var(--t-small)", color: "var(--text-invert-muted)", textDecoration: "none" }}>
              Team login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

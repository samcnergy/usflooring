import Link from "next/link";

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
      "areaServed": {
        "@type": "Place",
        "name": "Orange County, California"
      },
      "knowsAbout": ["kitchen remodeling", "bathroom remodeling", "flooring installation", "tile installation", "cabinet installation", "countertop fabrication", "design-build", "home remodeling"],
      "founder": {
        "@type": "Person",
        "name": "Parham Shariat",
        "jobTitle": "Owner",
        "worksFor": { "@id": "https://usfloordesign.com/#organization" }
      },
      "sameAs": [
        "https://usflooring.onrender.com"
      ]
    }
  ]
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--pub-stone)", color: "var(--pub-ink)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }} />
      <style>{`
        :root {
          --pub-stone: #F1EEE7;
          --pub-ink: #1E2320;
          --pub-forest: #2F4A38;
          --pub-brass: #A9863F;
          --pub-line: #DDD7C9;
          --pub-muted: #8C8577;
          --pub-serif: var(--font-newsreader, 'Georgia', serif);
          --pub-sans: var(--font-inter, system-ui, sans-serif);
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px" }}>
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "28px 0", borderBottom: "1px solid var(--pub-line)",
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="US Floor Design Center"
              style={{ height: 52, width: "auto" }}
            />
          </Link>
          <nav style={{ display: "flex", gap: 36, fontSize: 14, color: "var(--pub-ink)" }}>
            <Link href="/shop" style={{ color: "inherit", textDecoration: "none" }}>Shop</Link>
            <Link href="/services" style={{ color: "inherit", textDecoration: "none" }}>Services</Link>
            <Link href="/projects" style={{ color: "inherit", textDecoration: "none" }}>Projects</Link>
            <Link href="/showroom" style={{ color: "inherit", textDecoration: "none" }}>Showroom</Link>
            <Link href="/academy" style={{ color: "inherit", textDecoration: "none" }}>Academy</Link>
            <Link href="/blog" style={{ color: "inherit", textDecoration: "none" }}>Blog</Link>
            <Link href="/faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</Link>
            <Link href="/about" style={{ color: "inherit", textDecoration: "none" }}>About</Link>
          </nav>
          <Link href="/request-a-visit" style={{
            border: "1px solid var(--pub-ink)", borderRadius: 2, padding: "9px 20px",
            fontSize: 13, textDecoration: "none", color: "var(--pub-ink)",
          }}>
            Plan a visit
          </Link>
        </header>
      </div>

      <main>{children}</main>

      <footer style={{ borderTop: "1px solid var(--pub-line)", marginTop: 80 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--pub-serif)", fontSize: 18, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--pub-ink)", marginBottom: 8 }}>
              US Floor Design Center
            </p>
            <p style={{ fontSize: 13, color: "var(--pub-muted)", lineHeight: 1.6 }}>
              30092 Santa Margarita Pkwy, Suite G<br />
              Rancho Santa Margarita, CA 92688<br />
              <a href="tel:+16196267545" style={{ color: "var(--pub-muted)", textDecoration: "none" }}>(619) 626-7545</a>
            </p>
          </div>
          <div style={{ display: "flex", gap: 64 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick links</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                <Link href="/request-a-visit" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Request a visit</Link>
                <Link href="/shop" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Browse materials</Link>
                <Link href="/services" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Services</Link>
                <Link href="/projects" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Projects</Link>
                <Link href="/trade" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Trade</Link>
                <Link href="/warranty" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Warranty</Link>
                <Link href="/academy" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Academy</Link>
                <Link href="/blog" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Blog</Link>
                <Link href="/faq" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>FAQ</Link>
                <Link href="/about" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>About</Link>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Admin</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                <Link href="/login" style={{ color: "var(--pub-muted)", textDecoration: "none" }}>Team login</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--pub-line)", padding: "16px 40px", maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: "var(--pub-muted)" }}>
            &copy; {new Date().getFullYear()} US Floor Design Center. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

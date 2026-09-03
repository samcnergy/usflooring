import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--pub-stone)", color: "var(--pub-ink)", minHeight: "100vh" }}>
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
          <Link href="/" style={{
            fontFamily: "var(--pub-serif)", fontSize: 18, letterSpacing: "0.06em",
            color: "var(--pub-ink)", textDecoration: "none", textTransform: "uppercase",
            fontWeight: 400,
          }}>
            US Floor Design Center
          </Link>
          <nav style={{ display: "flex", gap: 36, fontSize: 14, color: "var(--pub-ink)" }}>
            <Link href="/shop" style={{ color: "inherit", textDecoration: "none" }}>Shop</Link>
            <Link href="/#studio" style={{ color: "inherit", textDecoration: "none" }}>Design center</Link>
            <Link href="/#start-here" style={{ color: "inherit", textDecoration: "none" }}>Projects</Link>
            <Link href="/#proof" style={{ color: "inherit", textDecoration: "none" }}>Showroom</Link>
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
              Rancho Santa Margarita, CA<br />
              Orange County&apos;s design-build studio.
            </p>
          </div>
          <div style={{ display: "flex", gap: 64 }}>
            <div>
              <p style={{ fontSize: 12, color: "var(--pub-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Quick links</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                <Link href="/request-a-visit" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Request a visit</Link>
                <Link href="/shop" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Browse materials</Link>
                <Link href="/#start-here" style={{ color: "var(--pub-ink)", textDecoration: "none" }}>Start here</Link>
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

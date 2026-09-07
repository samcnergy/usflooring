"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Showroom" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/investors", label: "Investors" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const transparent = isHome && !scrolled && !menuOpen;

  return (
    <>
      <style>{`
        .pub-nav-link {
          position: relative;
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding-bottom: 4px;
          transition: color var(--dur) var(--ease);
        }
        .pub-nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 100%;
          height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform var(--dur) var(--ease);
        }
        .pub-nav-link:hover::after,
        .pub-nav-link.active::after {
          transform: scaleX(1);
        }
        .pub-nav-btn {
          font-size: var(--t-btn);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 14px 28px;
          background: var(--red);
          color: var(--text-invert);
          border: none;
          border-radius: var(--radius);
          transition: background var(--dur) var(--ease);
          white-space: nowrap;
        }
        .pub-nav-btn:hover {
          background: var(--red-deep);
        }
        .pub-nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          padding: 6px;
          background: none;
          border: none;
          cursor: pointer;
          flex-shrink: 0;
        }
        .pub-nav-hamburger span {
          display: block;
          height: 2px;
          background: var(--text);
          border-radius: 1px;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }
        .pub-nav-hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .pub-nav-hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .pub-nav-hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .pub-nav-drawer {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--surface);
          z-index: 99;
          padding: var(--s-6) var(--gutter) var(--s-8);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.25s ease;
        }
        .pub-nav-drawer.open {
          transform: translateX(0);
        }
        .pub-nav-drawer-link {
          font-size: var(--t-h4);
          font-family: var(--font-display);
          font-weight: 400;
          text-decoration: none;
          color: var(--text);
          padding: var(--s-4) 0;
          border-bottom: 1px solid var(--line);
          display: block;
        }
        @media (max-width: 860px) {
          .pub-nav-desktop { display: none !important; }
          .pub-nav-cta { display: none !important; }
          .pub-nav-hamburger { display: flex; }
        }
        @media (min-width: 861px) {
          .pub-nav-drawer { display: none !important; }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: transparent ? "transparent" : "var(--surface)",
          borderBottom: transparent ? "none" : "1px solid var(--line)",
          transition: `background var(--dur) var(--ease), border-color var(--dur) var(--ease)`,
        }}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: `0 var(--gutter)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 80,
          }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="US Floor Design Center"
              style={{ height: 48, width: "auto", display: "block" }}
            />
          </Link>

          <nav className="pub-nav-desktop" style={{ display: "flex", alignItems: "center", gap: "var(--s-6)" }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`pub-nav-link${active ? " active" : ""}`}
                  style={{ color: "var(--text)" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link href="/request-a-visit" className="pub-nav-btn pub-nav-cta">
            Plan a visit
          </Link>

          <button
            className={`pub-nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`pub-nav-drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="pub-nav-drawer-link"
              style={{ color: active ? "var(--red)" : "var(--text)" }}
            >
              {label}
            </Link>
          );
        })}
        <div style={{ marginTop: "var(--s-7)" }}>
          <Link href="/request-a-visit" className="pub-nav-btn">
            Plan a visit
          </Link>
        </div>
      </div>
    </>
  );
}

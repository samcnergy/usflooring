"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/showroom", label: "Showroom" },
  { href: "/academy", label: "Academy" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

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
        .pub-nav-btn.outline {
          background: transparent;
          border: 1px solid currentColor;
        }
        .pub-nav-btn.outline:hover {
          background: var(--red);
          color: var(--text-invert);
          border-color: var(--red);
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
            height: scrolled ? 60 : 80,
            transition: `height var(--dur) var(--ease)`,
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "block" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="US Floor Design Center"
              style={{
                height: scrolled ? 36 : 48,
                width: "auto",
                display: "block",
                transition: `height var(--dur) var(--ease), filter var(--dur) var(--ease)`,
                filter: transparent ? "brightness(0) invert(1)" : "none",
              }}
            />
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "var(--s-6)" }}>
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`pub-nav-link${active ? " active" : ""}`}
                  style={{ color: transparent ? "var(--text-invert)" : "var(--text)" }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <Link href="/request-a-visit" className="pub-nav-btn">
            Plan a visit
          </Link>
        </div>
      </header>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Navigation data ────────────────────────────────────────────────────────
// Main menu: About Us ▾ · Our Work ▾ · Insight ▾ · Investors · Login

type NavLink = { label: string; href: string };
type NavColumn = { key: string; heading: string; links: NavLink[]; viewAll?: NavLink; columns?: number };
type MenuKey = "about" | "work" | "insight";

const ABOUT_COLS: NavColumn[] = [
  {
    key: "about",
    heading: "About Us",
    links: [
      { label: "Leadership",            href: "/leadership" },
      { label: "Our Brand",             href: "/our-brand" },
      { label: "Social Responsibility", href: "/social-responsibility" },
    ],
  },
];

const WORK_COLS: NavColumn[] = [
  {
    key: "services",
    heading: "Services",
    links: [
      { label: "Medical Offices",   href: "/services/expertise/medical-offices" },
      { label: "Retail Buildout",   href: "/services/expertise/retail-buildout" },
      { label: "Investor Services", href: "/services/expertise/investor-services" },
      { label: "Kitchen Remodel",   href: "/services/expertise/kitchen-remodel" },
      { label: "Bathroom Remodel",  href: "/services/expertise/bathroom-remodel" },
      { label: "Backyard",          href: "/services/expertise/backyard" },
      { label: "Windows and Doors", href: "/services/expertise/windows-and-doors" },
    ],
    viewAll: { label: "View all services", href: "/services" },
  },
  {
    key: "markets",
    heading: "Markets",
    columns: 2,
    links: [
      { label: "Rancho Santa Margarita", href: "/services/markets/rancho-santa-margarita" },
      { label: "Coto de Caza",           href: "/services/markets/coto-de-caza" },
      { label: "San Juan Capistrano",    href: "/services/markets/san-juan-capistrano" },
      { label: "San Clemente",           href: "/services/markets/san-clemente" },
      { label: "Lake Forest",            href: "/services/markets/lake-forest" },
      { label: "Laguna Niguel",          href: "/services/markets/laguna-niguel" },
      { label: "Laguna Hills",           href: "/services/markets/laguna-hills" },
      { label: "Laguna Beach",           href: "/services/markets/laguna-beach" },
      { label: "Aliso Viejo",            href: "/services/markets/aliso-viejo" },
      { label: "Mission Viejo",          href: "/services/markets/mission-viejo" },
      { label: "Dana Point",             href: "/services/markets/dana-point" },
      { label: "Ladera Ranch",           href: "/services/markets/ladera-ranch" },
      { label: "Rancho Mission Viejo",   href: "/services/markets/rancho-mission-viejo" },
    ],
    viewAll: { label: "View all markets", href: "/services/markets" },
  },
  {
    key: "projects",
    heading: "Projects",
    links: [
      { label: "Rancho Santa Margarita kitchen", href: "/projects#rsm-kitchen-2024" },
      { label: "Mission Viejo primary bath",     href: "/projects#mv-primary-bath-2024" },
    ],
    viewAll: { label: "View all projects", href: "/projects" },
  },
];

const INSIGHT_COLS: NavColumn[] = [
  {
    key: "insight",
    heading: "Insight",
    links: [
      { label: "Blog",                href: "/blog" },
      { label: "Podcast",             href: "/podcast" },
      { label: "Academy",             href: "/academy" },
      { label: "Digital Innovations", href: "/digital-innovations" },
    ],
  },
];

const MENUS: { key: MenuKey; label: string; cols: NavColumn[]; paths: string[] }[] = [
  { key: "about",   label: "About Us", cols: ABOUT_COLS,   paths: ["/about", "/leadership", "/our-brand", "/social-responsibility"] },
  { key: "work",    label: "Our Work", cols: WORK_COLS,    paths: ["/projects", "/services"] },
  { key: "insight", label: "Insight",  cols: INSIGHT_COLS, paths: ["/blog", "/podcast", "/academy", "/digital-innovations"] },
];

const PLAIN_LINKS: NavLink[] = [
  { label: "Investors", href: "/investors" },
  { label: "Login",     href: "/login" },
];

function matches(pathname: string, p: string) {
  return pathname === p || pathname.startsWith(p + "/");
}

// ── Dropdown panel (shared by every menu) ──────────────────────────────────

function MenuPanel({ cols }: { cols: NavColumn[] }) {
  return (
    <div
      style={{
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "var(--s-6) var(--gutter) var(--s-7)",
        display: "flex",
        gap: "var(--s-9)",
        alignItems: "flex-start",
      }}
    >
      {cols.map((col) => (
        <div key={col.key} style={{ minWidth: 200 }}>
          <p className="mega-heading">{col.heading}</p>
          <div style={{ columns: col.columns ?? 1, columnGap: "var(--s-7)" }}>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} className="mega-link">
                {link.label}
              </Link>
            ))}
          </div>
          {col.viewAll && (
            <Link href={col.viewAll.href} className="mega-view-all">
              {col.viewAll.label} &rarr;
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PublicNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);  // mobile drawer
  const [openMenu, setOpenMenu]           = useState<MenuKey | null>(null);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const [lastPath, setLastPath]           = useState(pathname);

  // Close menus on navigation
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setOpenMenu(null);
    setMobileSection(null);
  }

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement>>>({});

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const startClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, [cancelClose]);

  const openNamed = useCallback((key: MenuKey) => {
    cancelClose();
    setOpenMenu(key);
  }, [cancelClose]);

  const toggleMenu = useCallback((key: MenuKey) => {
    cancelClose();
    setOpenMenu((prev) => (prev === key ? null : key));
  }, [cancelClose]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Escape key closes mega-menu, returns focus to trigger
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && openMenu) {
        const key = openMenu;
        setOpenMenu(null);
        triggerRefs.current[key]?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openMenu]);

  const transparent = isHome && !scrolled && !menuOpen && !openMenu;
  const activeMenu = MENUS.find((m) => m.key === openMenu);

  return (
    <>
      <style>{`
        /* ── Desktop link/button styles ── */
        .pub-nav-link,
        .pub-nav-trigger {
          position: relative;
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0 0 4px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text);
          transition: color var(--dur) var(--ease);
        }
        .pub-nav-link::after,
        .pub-nav-trigger::after {
          content: '';
          position: absolute;
          left: 0; bottom: -8px;
          width: 100%; height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform var(--dur) var(--ease);
        }
        .pub-nav-link:hover::after,
        .pub-nav-link.active::after,
        .pub-nav-trigger:hover::after,
        .pub-nav-trigger.active::after,
        .pub-nav-trigger[aria-expanded="true"]::after { transform: scaleX(1); }

        /* ── CTA button ── */
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
          cursor: pointer;
        }
        .pub-nav-btn:hover { background: var(--red-deep); }

        /* ── Hamburger ── */
        .pub-nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px; height: 40px;
          padding: 6px;
          background: none; border: none;
          cursor: pointer; flex-shrink: 0;
        }
        .pub-nav-hamburger span {
          display: block; height: 2px;
          background: var(--text); border-radius: 1px;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }
        .pub-nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .pub-nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .pub-nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .pub-nav-drawer {
          position: fixed;
          top: 80px; left: 0; right: 0; bottom: 0;
          background: var(--surface);
          z-index: 99;
          padding: var(--s-6) var(--gutter) var(--s-8);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.25s ease;
        }
        .pub-nav-drawer.open { transform: translateX(0); }
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

        /* ── Mobile accordion section ── */
        .pub-mob-section-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--t-h4);
          font-family: var(--font-display);
          font-weight: 400;
          color: var(--text);
          padding: var(--s-4) 0;
          border-bottom: 1px solid var(--line);
          background: none; border-top: none; border-left: none; border-right: none;
          cursor: pointer; text-align: left;
        }
        .pub-mob-section-btn.open { border-bottom: none; }
        .pub-mob-section-chevron {
          font-size: 18px;
          color: var(--text-muted);
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .pub-mob-section-btn.open .pub-mob-section-chevron { transform: rotate(90deg); }
        .pub-mob-section-body {
          border-bottom: 1px solid var(--line);
          padding-bottom: var(--s-4);
        }
        .pub-mob-col-heading {
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: var(--s-4) 0 var(--s-2);
        }
        .pub-mob-sublink {
          display: block;
          font-size: var(--t-body);
          color: var(--text);
          text-decoration: none;
          padding: var(--s-2) var(--s-4);
          line-height: 1.4;
        }
        .pub-mob-sublink:hover { color: var(--red); }

        /* ── Mega-menu panel ── */
        .mega-panel {
          position: fixed;
          top: 80px; left: 0; right: 0;
          background: var(--surface);
          border-bottom: 1px solid var(--line);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          z-index: 99;
          animation: mega-in 150ms var(--ease) both;
        }
        @keyframes mega-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mega-overlay {
          position: fixed;
          inset: 0;
          top: 80px;
          background: var(--surface-scrim);
          opacity: 0.25;
          z-index: 98;
          pointer-events: none;
        }
        .mega-heading {
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: var(--s-3);
          padding-bottom: var(--s-3);
          border-bottom: 1px solid var(--line);
        }
        .mega-link {
          display: block;
          font-size: var(--t-body);
          font-family: var(--font-body);
          color: var(--text);
          text-decoration: none;
          line-height: 1.45;
          padding: 5px 0;
          break-inside: avoid;
          transition: color var(--dur) var(--ease);
        }
        .mega-link:hover { color: var(--red); }
        .mega-view-all {
          display: inline-block;
          margin-top: var(--s-4);
          font-size: var(--t-small);
          font-family: var(--font-body);
          font-weight: 700;
          text-decoration: none;
          color: var(--red);
        }
        .mega-view-all:hover { color: var(--red-deep); }

        /* ── Breakpoints ── */
        @media (max-width: 860px) {
          .pub-nav-desktop { display: none !important; }
          .pub-nav-cta     { display: none !important; }
          .pub-nav-hamburger { display: flex; }
        }
        @media (min-width: 861px) {
          .pub-nav-drawer { display: none !important; }
        }
      `}</style>

      {/* ── Header bar ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: transparent ? "transparent" : "var(--surface)",
          borderBottom: transparent ? "none" : "1px solid var(--line)",
          transition: `background var(--dur) var(--ease), border-color var(--dur) var(--ease)`,
        }}
        onMouseLeave={startClose}
      >
        <div
          style={{
            maxWidth: "var(--container)",
            margin: "0 auto",
            padding: "0 var(--gutter)",
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

          {/* Desktop nav */}
          <nav
            className="pub-nav-desktop"
            style={{ display: "flex", alignItems: "center", gap: "var(--s-6)" }}
          >
            {MENUS.map(({ label, key, paths }) => (
              <button
                key={key}
                ref={(el) => { if (el) triggerRefs.current[key] = el; }}
                className={`pub-nav-trigger${paths.some((p) => matches(pathname, p)) || openMenu === key ? " active" : ""}`}
                aria-expanded={openMenu === key}
                aria-controls={`mega-panel-${key}`}
                onMouseEnter={() => openNamed(key)}
                onClick={() => toggleMenu(key)}
              >
                {label}
              </button>
            ))}
            {PLAIN_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`pub-nav-link${matches(pathname, href) ? " active" : ""}`}
                onMouseEnter={startClose}
              >
                {label}
              </Link>
            ))}
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
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── Mega-menu panel (desktop) ── */}
      {activeMenu && (
        <>
          <div className="mega-overlay" aria-hidden="true" />
          <div
            id={`mega-panel-${activeMenu.key}`}
            className="mega-panel"
            role="region"
            aria-label={`${activeMenu.label} menu`}
            onMouseEnter={cancelClose}
            onMouseLeave={startClose}
          >
            <MenuPanel cols={activeMenu.cols} />
          </div>
        </>
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`pub-nav-drawer${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {MENUS.map(({ key, label, cols }) => (
          <div key={key}>
            <button
              className={`pub-mob-section-btn${mobileSection === key ? " open" : ""}`}
              onClick={() => setMobileSection((s) => (s === key ? null : key))}
              aria-expanded={mobileSection === key}
            >
              {label}
              <span className="pub-mob-section-chevron">›</span>
            </button>
            {mobileSection === key && (
              <div className="pub-mob-section-body">
                {cols.map((col) => (
                  <div key={col.key}>
                    {cols.length > 1 && <p className="pub-mob-col-heading">{col.heading}</p>}
                    {col.links.map((link) => (
                      <Link key={link.href} href={link.href} className="pub-mob-sublink">
                        {link.label}
                      </Link>
                    ))}
                    {col.viewAll && (
                      <Link
                        href={col.viewAll.href}
                        className="pub-mob-sublink"
                        style={{ color: "var(--red)", fontWeight: 600, marginTop: "var(--s-1)" }}
                      >
                        {col.viewAll.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {PLAIN_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="pub-nav-drawer-link"
            style={{ color: matches(pathname, href) ? "var(--red)" : "var(--text)" }}
          >
            {label}
          </Link>
        ))}

        <div style={{ marginTop: "var(--s-7)" }}>
          <Link href="/request-a-visit" className="pub-nav-btn">
            Plan a visit
          </Link>
        </div>
      </div>
    </>
  );
}

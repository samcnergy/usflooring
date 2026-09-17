"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

// ── Navigation data ────────────────────────────────────────────────────────

const SERVICES_COLS = [
  {
    key: "approach",
    heading: "Approach",
    viewAllHref: "/services/approach",
    links: [
      { label: "Pre-construction",  href: "/services/approach/pre-construction" },
      { label: "Design",            href: "/services/approach/design" },
      { label: "Project Management",href: "/services/approach/project-management" },
      { label: "Delivery",          href: "/services/approach/delivery" },
      { label: "Warranty",          href: "/services/approach/warranty" },
      { label: "Investor Services", href: "/services/approach/investor-services" },
      { label: "HOA Approval",      href: "/services/approach/hoa-approval" },
    ],
  },
  {
    key: "expertise",
    heading: "Expertise",
    viewAllHref: "/services/expertise",
    links: [
      { label: "Medical Offices",   href: "/services/expertise/medical-offices" },
      { label: "Retail Buildout",   href: "/services/expertise/retail-buildout" },
      { label: "Investor Services", href: "/services/expertise/investor-services" },
      { label: "Kitchen Remodel",   href: "/services/expertise/kitchen-remodel" },
      { label: "Bathroom Remodel",  href: "/services/expertise/bathroom-remodel" },
      { label: "Backyard",          href: "/services/expertise/backyard" },
      { label: "Windows and Doors", href: "/services/expertise/windows-and-doors" },
    ],
  },
];

const WORK_MARKETS = [
  { label: "Rancho Santa Margarita", href: "/projects/markets/rancho-santa-margarita" },
  { label: "Coto de Caza",           href: "/projects/markets/coto-de-caza" },
  { label: "San Juan Capistrano",    href: "/projects/markets/san-juan-capistrano" },
  { label: "San Clemente",           href: "/projects/markets/san-clemente" },
  { label: "Lake Forest",            href: "/projects/markets/lake-forest" },
  { label: "Laguna Niguel",          href: "/projects/markets/laguna-niguel" },
  { label: "Laguna Hills",           href: "/projects/markets/laguna-hills" },
  { label: "Laguna Beach",           href: "/projects/markets/laguna-beach" },
  { label: "Aliso Viejo",            href: "/projects/markets/aliso-viejo" },
  { label: "Mission Viejo",          href: "/projects/markets/mission-viejo" },
  { label: "Dana Point",             href: "/projects/markets/dana-point" },
  { label: "Ladera Ranch",           href: "/projects/markets/ladera-ranch" },
  { label: "Rancho Mission Viejo",   href: "/projects/markets/rancho-mission-viejo" },
];

const INSIGHT_TILES = [
  { label: "Blog",                href: "/blog",                desc: "Design trends, care guides, and homeowner resources." },
  { label: "Podcast",             href: "/podcast",             desc: "Conversations on design, remodeling, and living well." },
  { label: "Academy",             href: "/academy",             desc: "Practical education for homeowners and trade professionals." },
  { label: "Digital Innovations", href: "/digital-innovations", desc: "How we use technology to improve the project experience." },
];

const ABOUT_TILES = [
  { label: "Investors",            href: "/investors",             desc: "Ownership structure, financials, and the investment case." },
  { label: "Leadership",           href: "/leadership",            desc: "The team behind US Floor Design Center." },
  { label: "Our Brand",            href: "/our-brand",             desc: "Our identity, values, and design principles." },
  { label: "Social Responsibility",href: "/social-responsibility", desc: "How we give back to Orange County." },
];

type MenuKey = "work" | "services" | "insight" | "about";

const TRIGGER_ITEMS: { label: string; key: MenuKey }[] = [
  { label: "Our Work",  key: "work" },
  { label: "Services",  key: "services" },
  { label: "Insight",   key: "insight" },
  { label: "About Us",  key: "about" },
];

// ── Our Work panel ─────────────────────────────────────────────────────────

function WorkPanel() {
  return (
    <div
      style={{
        maxWidth: "var(--container)",
        margin: "0 auto",
        padding: "var(--s-6) var(--gutter) var(--s-7)",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "var(--s-7)",
        alignItems: "start",
      }}
    >
      {/* Intro */}
      <div style={{ paddingRight: "var(--s-6)", borderRight: "1px solid var(--line)" }}>
        <p style={{
          fontSize: "var(--t-label)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "var(--s-3)",
        }}>
          Our Work
        </p>
        <p style={{
          fontSize: "var(--t-small)",
          color: "var(--text-muted)",
          lineHeight: 1.5,
          marginBottom: "var(--s-5)",
        }}>
          Project case studies, plus local planning notes for the South Orange County communities around our showroom.
        </p>
        <Link href="/projects" className="pub-nav-btn" style={{ fontSize: "var(--t-label)", padding: "10px 18px" }}>
          View Projects
        </Link>
      </div>

      {/* Markets */}
      <div>
        <p style={{
          fontSize: "var(--t-label)",
          fontFamily: "var(--font-body)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "var(--s-3)",
          paddingBottom: "var(--s-3)",
          borderBottom: "1px solid var(--line)",
        }}>
          Markets
        </p>
        <div style={{ columns: 3, columnGap: "var(--s-7)" }}>
          {WORK_MARKETS.map((link) => (
            <Link key={link.href} href={link.href} className="mega-link">
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/projects/markets" className="mega-view-all" style={{ marginTop: "var(--s-4)", display: "inline-block" }}>
          View all Markets
        </Link>
      </div>
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
    setMenuOpen(false);
    setOpenMenu(null);
    setMobileSection(null);
  }, [pathname]);

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

  // Active-state helpers
  const isWorkActive      = pathname.startsWith("/projects");
  const isServicesActive  = pathname.startsWith("/services");
  const isInsightActive   = ["/blog", "/podcast", "/academy", "/digital-innovations"].some(p => pathname === p || pathname.startsWith(p + "/"));
  const isAboutActive     = ["/investors", "/leadership", "/our-brand", "/social-responsibility", "/about"].some(p => pathname === p || pathname.startsWith(p + "/"));

  function activeFor(key: MenuKey) {
    if (key === "work")     return isWorkActive;
    if (key === "services") return isServicesActive;
    if (key === "insight")  return isInsightActive;
    if (key === "about")    return isAboutActive;
    return false;
  }

  // ── Panels ────────────────────────────────────────────────────────────

  function ServicesPanel() {
    return (
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "var(--s-6) var(--gutter) var(--s-7)",
          display: "grid",
          gridTemplateColumns: `240px repeat(${SERVICES_COLS.length}, 1fr)`,
          gap: "var(--s-7)",
          alignItems: "start",
        }}
      >
        {/* Intro */}
        <div style={{ paddingRight: "var(--s-6)", borderRight: "1px solid var(--line)" }}>
          <p style={{
            fontSize: "var(--t-label)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "var(--s-3)",
          }}>
            Services
          </p>
          <p style={{
            fontSize: "var(--t-small)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "var(--s-5)",
          }}>
            Design, coordination, and delivery for kitchens, bathrooms, and every surface in between.
          </p>
          <Link href="/services" className="pub-nav-btn" style={{ fontSize: "var(--t-label)", padding: "10px 18px" }}>
            All Services
          </Link>
        </div>

        {/* Columns */}
        {SERVICES_COLS.map((col) => (
          <div key={col.key}>
            <p style={{
              fontSize: "var(--t-label)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "var(--s-3)",
              paddingBottom: "var(--s-3)",
              borderBottom: "1px solid var(--line)",
            }}>
              {col.heading}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-1)" }}>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href} className="mega-link">
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href={col.viewAllHref} className="mega-view-all" style={{ marginTop: "var(--s-4)", display: "inline-block" }}>
              View all {col.heading}
            </Link>
          </div>
        ))}
      </div>
    );
  }

  function TilePanel({
    tiles,
    label,
    introText,
    ctaHref,
    ctaLabel,
  }: {
    tiles: typeof INSIGHT_TILES;
    label: string;
    introText: string;
    ctaHref: string;
    ctaLabel: string;
  }) {
    return (
      <div
        style={{
          maxWidth: "var(--container)",
          margin: "0 auto",
          padding: "var(--s-6) var(--gutter) var(--s-7)",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "var(--s-7)",
          alignItems: "start",
        }}
      >
        {/* Intro */}
        <div style={{ paddingRight: "var(--s-6)", borderRight: "1px solid var(--line)" }}>
          <p style={{
            fontSize: "var(--t-label)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "var(--s-3)",
          }}>
            {label}
          </p>
          <p style={{
            fontSize: "var(--t-small)",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "var(--s-5)",
          }}>
            {introText}
          </p>
          <Link href={ctaHref} className="pub-nav-btn" style={{ fontSize: "var(--t-label)", padding: "10px 18px" }}>
            {ctaLabel}
          </Link>
        </div>

        {/* 2×2 tile grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
          {tiles.map((tile) => (
            <Link key={tile.href} href={tile.href} className="mega-tile">
              <span style={{
                display: "block",
                fontSize: "var(--t-body)",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: "var(--s-2)",
              }}>
                {tile.label}
              </span>
              <span style={{
                display: "block",
                fontSize: "var(--t-small)",
                color: "var(--text-muted)",
                lineHeight: 1.45,
              }}>
                {tile.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        /* ── Existing desktop link/button styles (unchanged) ── */
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
          left: 0; bottom: -8px;
          width: 100%; height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform var(--dur) var(--ease);
        }
        .pub-nav-link:hover::after,
        .pub-nav-link.active::after { transform: scaleX(1); }

        /* ── Trigger button (mega-menu opener) — styled like a nav link ── */
        .pub-nav-trigger {
          position: relative;
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0 0 4px;
          background: none;
          border: none;
          cursor: pointer;
          transition: color var(--dur) var(--ease);
          color: var(--text);
        }
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
        .pub-nav-trigger:hover::after,
        .pub-nav-trigger.active::after,
        .pub-nav-trigger[aria-expanded="true"]::after { transform: scaleX(1); }

        /* ── CTA button (unchanged) ── */
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

        /* ── Hamburger (unchanged) ── */
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

        /* ── Mobile drawer (base unchanged) ── */
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
        .mega-link {
          display: block;
          font-size: var(--t-small);
          font-family: var(--font-body);
          color: var(--text-muted);
          text-decoration: none;
          line-height: 1.45;
          padding: 5px 0;
          transition: color var(--dur) var(--ease);
        }
        .mega-link:hover { color: var(--text); }
        .mega-view-all {
          display: inline-block;
          font-size: var(--t-label);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--text-muted);
          border: 1px solid var(--line);
          padding: 6px 14px;
          transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
        }
        .mega-view-all:hover { color: var(--text); border-color: var(--text); }
        .mega-tile {
          display: block;
          text-decoration: none;
          padding: var(--s-4);
          border: 1px solid var(--line);
          transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
        }
        .mega-tile:hover {
          border-color: var(--text);
          background: var(--surface-alt);
        }

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
            {/* Plain link: Home */}
            <Link
              href="/"
              className={`pub-nav-link${pathname === "/" ? " active" : ""}`}
              style={{ color: "var(--text)" }}
            >
              Home
            </Link>

            {/* Mega-menu triggers */}
            {TRIGGER_ITEMS.map(({ label, key }) => (
              <button
                key={key}
                ref={(el) => { if (el) triggerRefs.current[key] = el; }}
                className={`pub-nav-trigger${activeFor(key) || openMenu === key ? " active" : ""}`}
                aria-expanded={openMenu === key}
                aria-controls={`mega-panel-${key}`}
                onMouseEnter={() => openNamed(key)}
                onClick={() => toggleMenu(key)}
              >
                {label}
              </button>
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
      {openMenu && (
        <>
          <div className="mega-overlay" aria-hidden="true" />
          <div
            id={`mega-panel-${openMenu}`}
            className="mega-panel"
            role="region"
            aria-label={`${openMenu} menu`}
            onMouseEnter={cancelClose}
            onMouseLeave={startClose}
          >
            {openMenu === "work" && <WorkPanel />}
            {openMenu === "services" && <ServicesPanel />}
            {openMenu === "insight" && (
              <TilePanel
                tiles={INSIGHT_TILES}
                label="Insight"
                introText="Perspectives on design, materials, and the remodeling process from the US Floor team."
                ctaHref="/blog"
                ctaLabel="Browse Insight"
              />
            )}
            {openMenu === "about" && (
              <TilePanel
                tiles={ABOUT_TILES}
                label="About Us"
                introText="The story, people, and values behind US Floor Design Center in Rancho Santa Margarita."
                ctaHref="/about"
                ctaLabel="Our Story"
              />
            )}
          </div>
        </>
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`pub-nav-drawer${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
      >
        {/* Plain links */}
        <Link
          href="/"
          className="pub-nav-drawer-link"
          style={{ color: pathname === "/" ? "var(--red)" : "var(--text)" }}
        >
          Home
        </Link>

        {/* Accordion: Our Work */}
        <button
          className={`pub-mob-section-btn${mobileSection === "work" ? " open" : ""}`}
          onClick={() => setMobileSection((s) => (s === "work" ? null : "work"))}
          aria-expanded={mobileSection === "work"}
        >
          Our Work
          <span className="pub-mob-section-chevron">›</span>
        </button>
        {mobileSection === "work" && (
          <div className="pub-mob-section-body">
            <Link href="/projects" className="pub-mob-sublink" style={{ paddingTop: "var(--s-4)" }}>
              Projects
            </Link>
            <p className="pub-mob-col-heading">Markets</p>
            {WORK_MARKETS.map((link) => (
              <Link key={link.href} href={link.href} className="pub-mob-sublink">
                {link.label}
              </Link>
            ))}
            <Link
              href="/projects/markets"
              className="pub-mob-sublink"
              style={{ color: "var(--red)", fontWeight: 600, marginTop: "var(--s-1)" }}
            >
              View all Markets
            </Link>
          </div>
        )}

        {/* Accordion: Services */}
        <button
          className={`pub-mob-section-btn${mobileSection === "services" ? " open" : ""}`}
          onClick={() => setMobileSection((s) => (s === "services" ? null : "services"))}
          aria-expanded={mobileSection === "services"}
        >
          Services
          <span className="pub-mob-section-chevron">›</span>
        </button>
        {mobileSection === "services" && (
          <div className="pub-mob-section-body">
            {SERVICES_COLS.map((col) => (
              <div key={col.key}>
                <p className="pub-mob-col-heading">{col.heading}</p>
                {col.links.map((link) => (
                  <Link key={link.href} href={link.href} className="pub-mob-sublink">
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={col.viewAllHref}
                  className="pub-mob-sublink"
                  style={{ color: "var(--red)", fontWeight: 600, marginTop: "var(--s-1)" }}
                >
                  View all {col.heading}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Accordion: Insight */}
        <button
          className={`pub-mob-section-btn${mobileSection === "insight" ? " open" : ""}`}
          onClick={() => setMobileSection((s) => (s === "insight" ? null : "insight"))}
          aria-expanded={mobileSection === "insight"}
        >
          Insight
          <span className="pub-mob-section-chevron">›</span>
        </button>
        {mobileSection === "insight" && (
          <div className="pub-mob-section-body">
            {INSIGHT_TILES.map((tile) => (
              <Link key={tile.href} href={tile.href} className="pub-mob-sublink">
                {tile.label}
              </Link>
            ))}
          </div>
        )}

        {/* Accordion: About Us */}
        <button
          className={`pub-mob-section-btn${mobileSection === "about" ? " open" : ""}`}
          onClick={() => setMobileSection((s) => (s === "about" ? null : "about"))}
          aria-expanded={mobileSection === "about"}
        >
          About Us
          <span className="pub-mob-section-chevron">›</span>
        </button>
        {mobileSection === "about" && (
          <div className="pub-mob-section-body">
            {ABOUT_TILES.map((tile) => (
              <Link key={tile.href} href={tile.href} className="pub-mob-sublink">
                {tile.label}
              </Link>
            ))}
          </div>
        )}

        <div style={{ marginTop: "var(--s-7)" }}>
          <Link href="/request-a-visit" className="pub-nav-btn">
            Plan a visit
          </Link>
        </div>
      </div>
    </>
  );
}

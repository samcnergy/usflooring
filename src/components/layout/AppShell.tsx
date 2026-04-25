import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

type NavLink = { href: string; label: string };

type Props = {
  navLinks: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  userLabel?: string;
  children: React.ReactNode;
};

// Mirrors the live website's header bar: logo top-left, nav centered, bright
// green CTA pinned to the top-right. Page background is the warm marble
// off-white (--usfkb-stone-50, exposed as marble-50).

export function AppShell({ navLinks, ctaHref, ctaLabel, userLabel, children }: Props) {
  return (
    <div className="min-h-full bg-marble-50 text-marble-900 flex flex-col">
      <header className="bg-marble-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-6">
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Image
              src="/logo-knockout.svg"
              alt="U.S. Floor, Kitchen & Bath"
              width={64}
              height={40}
              priority
            />
            <span className="hidden sm:inline font-semibold tracking-tight">
              U.S. Floor, Kitchen &amp; Bath
            </span>
          </Link>
          <nav className="flex-1 flex items-center justify-center gap-6 text-sm">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand-100">
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            href={ctaHref}
            className={cn(
              "inline-flex items-center justify-center rounded bg-brand-500 hover:bg-brand-700",
              "text-white font-medium px-4 h-10 text-sm",
            )}
          >
            {ctaLabel}
          </Link>
        </div>
      </header>
      {userLabel ? (
        <div className="border-b border-marble-200 bg-marble-100 text-marble-700 text-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 h-8 flex items-center justify-end">
            Signed in as {userLabel}
          </div>
        </div>
      ) : null}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}

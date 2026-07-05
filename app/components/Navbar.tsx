/**
 * Navbar — Server Component
 * Styling via Tailwind v4 utility classes.
 * Design tokens (@theme) tersedia sebagai bg-primary, text-ink, dll.
 */

import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Kalender Kegiatan", href: "/event" },
  { label: "Links", href: "/links" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-black/[0.08] flex items-center justify-between px-6 gap-3"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
      }}
    >

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="flex items-center gap-2.5 shrink-0 no-underline"
        aria-label="HIMAKOM — Halaman Utama"
      >
        <span className="w-8 h-8 rounded-button flex items-center justify-center shrink-0">
          <Image src="/himakom.png" alt="HIMAKOM" width={32} height={32} className="rounded-button" />
        </span>
        <span className="text-[15px] font-semibold leading-5 tracking-[-0.2px] text-ink">
          HIMAKOM
        </span>
      </Link>

      {/* ── Nav Links (desktop) ────────────────────────────────────────────── */}
      <nav
        aria-label="Navigasi utama"
        className="hidden md:flex items-center gap-1 flex-1 justify-center"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-body px-3 py-2 hover:border-b hover:border-b-gray-800 hover:text-ink transition-colors whitespace-nowrap no-underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ── CTA (desktop) ──────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {/* nav-cta-login: outline style */}
        <Link
          href="/login"
          id="nav-cta-login"
          className="text-sm font-medium text-black/90 px-4 py-2 border border-black/90 h-9 inline-flex items-center hover:bg-black/10 transition-colors no-underline"
        >
          Masuk
        </Link>
      </div>

      {/* ── Mobile: hamburger + dropdown — CLIENT COMPONENT ─────────────── */}
      <MobileMenu />
    </header>
  );
}
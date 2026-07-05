"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Kalender Kegiatan", href: "/kegiatan" },
  { label: "Links", href: "/links" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", close, { passive: true });
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <>
      {/* Hamburger button — hanya tampil di mobile */}
      <button
        id="nav-hamburger"
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-button text-ink hover:bg-alpha-black transition-colors border-none bg-transparent cursor-pointer"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((p) => !p)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-label="Menu navigasi mobile"
        aria-hidden={!open}
        className={[
          "md:hidden fixed top-16 left-0 right-0 z-40",
          "bg-canvas border-b border-hairline",
          "px-6 pt-3 pb-6",
          "transition-all duration-200 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-3 pointer-events-none",
        ].join(" ")}
      >
        <nav aria-label="Navigasi mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-body px-3.5 py-2.5 rounded-pill hover:bg-alpha-black hover:text-ink transition-colors no-underline block"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-hairline flex flex-col gap-2">
          <Link
            href="/masuk"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-primary px-4 py-2.5 rounded-button border border-primary text-center hover:bg-primary-soft transition-colors no-underline"
          >
            Masuk
          </Link>
        </div>
      </div>
    </>
  );
}

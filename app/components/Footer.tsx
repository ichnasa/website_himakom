import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
    { label: "Beranda", href: "/" },
    { label: "Kalender Kegiatan", href: "/kegiatan" },
    { label: "Links", href: "/links" },
    { label: "Feedback", href: "#feedback" },
];

const SOCIAL_LINKS = [
    {
        label: "Instagram",
        href: "https://instagram.com/himakom.unlam",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "YouTube",
        href: "https://youtube.com/@himakom",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/company/himakom",
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            aria-label="Footer HIMAKOM"
            style={{
                background: "linear-gradient(180deg, #111110 0%, #0a0a09 100%)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 w-fit no-underline"
                        aria-label="HIMAKOM — Halaman Utama"
                    >
                        <span
                            className="w-8 h-8 rounded-button flex items-center justify-center shrink-0 overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                            <Image src="/himakom.png" alt="HIMAKOM" width={32} height={32} className="rounded-button" />
                        </span>
                        <span className="text-[15px] font-semibold tracking-[-0.2px] text-white">
                            HIMAKOM
                        </span>
                    </Link>
                    <p className="text-sm leading-6 m-0 text-white/45" style={{ maxWidth: "260px" }}>
                        Himpunan Mahasiswa Ilmu Komputer — Kabinet Arunanta.
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-3 mt-1">
                        {SOCIAL_LINKS.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className="no-underline text-white/40 hover:text-white/90 transition-colors"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[1.5px] m-0 mb-1 text-white/30">
                        Navigasi
                    </p>
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm no-underline w-fit text-white/55 hover:text-white/95 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[1.5px] m-0 mb-1 text-white/30">
                        Kontak
                    </p>
                    <p className="text-sm m-0 text-white/55">Universitas Lambung Mangkurat</p>
                    <p className="text-sm m-0 text-white/55">Fakultas MIPA</p>
                    <a
                        href="mailto:himakom@ulm.ac.id"
                        className="text-sm no-underline text-white/55 hover:text-white/95 transition-colors w-fit"
                    >
                        himakom@ulm.ac.id
                    </a>
                </div>

            </div>

            {/* Bottom bar */}
            <div
                className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
                <p className="text-xs m-0 text-white/28">
                    © {year} HIMAKOM — Kabinet Arunanta. All rights reserved.
                </p>
                <p className="text-xs m-0 text-white/20">
                    Program Studi Ilmu Komputer · ULM
                </p>
            </div>
        </footer>
    );
}
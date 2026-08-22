"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    getDashboardStatsAction,
    getRecentFeedbackAction,
    getUpcomingEventsAction,
    type DashboardStats,
    type RecentFeedback,
    type UpcomingEvent,
} from "@/app/action/dashboard/action";
import { getCurrentUser } from "@/app/action/pengguna/action";

/* ------------------------------------------------------------------ */
/*  Helpers                                                              */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(t: string | null) {
    if (!t) return "";
    // time stored as "HH:MM:SS"
    return t.slice(0, 5);
}

const CATEGORY_COLORS: Record<string, string> = {
    saran: "bg-zinc-100 text-zinc-700 border-zinc-200",
    kritik: "bg-zinc-100 text-zinc-700 border-zinc-200",
    pertanyaan: "bg-zinc-100 text-zinc-700 border-zinc-200",
    pujian: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

function categoryBadge(category: string) {
    const cls = CATEGORY_COLORS[category.toLowerCase()] ?? "bg-gray-50 text-gray-600 border-gray-200";
    return (
        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${cls}`}>
            {category}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Stat Card                                                           */
/* ------------------------------------------------------------------ */

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    accent: string; // tailwind bg class for icon bg
    href?: string;
    subtitle?: string;
}

function StatCard({ label, value, icon, accent, href, subtitle }: StatCardProps) {
    const inner = (
        <div className="group flex h-full flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#78736f]">{label}</p>
                    <p className="mt-2 text-4xl font-semibold tracking-tight text-[rgba(0,0,0,0.95)]">{value}</p>
                    {subtitle && <p className="mt-1 text-xs text-[#78736f]">{subtitle}</p>}
                </div>
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${accent}`}>{icon}</span>
            </div>
            {href && (
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-900 transition-opacity group-hover:opacity-80">
                    Lihat semua
                    <svg width="12" height="12" fill="none" viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
            )}
        </div>
    );

    return href ? <Link href={href} className="block h-full no-underline">{inner}</Link> : <div className="h-full">{inner}</div>;
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                            */
/* ------------------------------------------------------------------ */

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-zinc-100 ${className}`} />
    );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [feedback, setFeedback] = useState<RecentFeedback[]>([]);
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [username, setUsername] = useState<string>("Admin");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const [s, f, e, u] = await Promise.all([
                getDashboardStatsAction(),
                getRecentFeedbackAction(5),
                getUpcomingEventsAction(5),
                getCurrentUser(),
            ]);
            setStats(s);
            setFeedback(f);
            setEvents(e);
            if (u?.username) setUsername(u.username as string);
            setLoading(false);
        }
        load();
    }, []);

    /* -------- render -------- */

    const now = new Date();
    const hour = now.getHours();
    const greeting =
        hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* ── Header ── */}
            <div className="mb-8">
                <p className="text-sm font-medium text-[#78736f]">
                    {now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[rgba(0,0,0,0.95)]">
                    {greeting}, {username}.
                </h1>
                <p className="mt-1 text-sm text-[rgba(0,0,0,0.60)]">
                    Berikut ringkasan aktivitas Himakom hari ini.
                </p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            label="Total Pengguna"
                            value={stats?.totalUsers ?? 0}
                            href="/pengguna"
                            subtitle="Akun terdaftar di sistem"
                            accent="bg-zinc-50 border border-zinc-200"
                            icon={
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Total Event"
                            value={stats?.totalEvents ?? 0}
                            href="/event"
                            subtitle="Event di seluruh periode"
                            accent="bg-zinc-50 border border-zinc-200"
                            icon={
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Upcoming Event"
                            value={stats?.upcomingEventsCount ?? 0}
                            subtitle="Event yang akan datang"
                            accent="bg-zinc-50 border border-zinc-200"
                            icon={
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                        <StatCard
                            label="Total Feedback"
                            value={stats?.totalFeedback ?? 0}
                            subtitle="Masukan dari mahasiswa"
                            accent="bg-zinc-50 border border-zinc-200"
                            icon={
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                    </>
                )}
            </div>

            {/* ── Two-column lower section ── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

                {/* ── Upcoming Events (3/5) ── */}
                <section className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-[rgba(0,0,0,0.95)]">Event Mendatang</h2>
                        <Link href="/event" className="text-xs font-medium text-zinc-900 hover:underline">
                            Lihat kalender →
                        </Link>
                    </div>

                    <div className="rounded-xl border border-black/10 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                        {loading ? (
                            <div className="divide-y divide-black/[0.06]">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="flex gap-4 p-4">
                                        <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-[#dfdcd9] mb-3">
                                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <p className="text-sm text-[#78736f]">Tidak ada event mendatang.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-black/[0.06]">
                                {events.map((ev) => {
                                    const d = new Date(ev.date);
                                    const dayNum = d.toLocaleDateString("id-ID", { day: "numeric" });
                                    const mon = d.toLocaleDateString("id-ID", { month: "short" });
                                    return (
                                        <li key={ev.id} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-zinc-50">
                                            {/* date badge */}
                                            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm">
                                                <span className="text-lg font-bold leading-none">{dayNum}</span>
                                                <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{mon}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-[rgba(0,0,0,0.95)]">{ev.name}</p>
                                                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#78736f]">
                                                    <svg width="11" height="11" fill="none" viewBox="0 0 16 16" className="shrink-0">
                                                        <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5z" stroke="currentColor" strokeWidth="1.4" />
                                                        <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.4" />
                                                    </svg>
                                                    {ev.location}
                                                </p>
                                                {(ev.time_start || ev.time_end) && (
                                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-[#78736f]">
                                                        <svg width="11" height="11" fill="none" viewBox="0 0 16 16" className="shrink-0">
                                                            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                                                            <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                                        </svg>
                                                        {formatTime(ev.time_start)}
                                                        {ev.time_end ? ` – ${formatTime(ev.time_end)}` : ""}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </section>

                {/* ── Recent Feedback (2/5) ── */}
                <section className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-base font-semibold text-[rgba(0,0,0,0.95)]">Feedback Terbaru</h2>
                    </div>

                    <div className="rounded-xl border border-black/10 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
                        {loading ? (
                            <div className="divide-y divide-black/[0.06]">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="p-4 space-y-2">
                                        <Skeleton className="h-3 w-1/3" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        ) : feedback.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="text-[#dfdcd9] mb-3">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-sm text-[#78736f]">Belum ada feedback masuk.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-black/[0.06]">
                                {feedback.map((fb) => (
                                    <li key={fb.id} className="px-5 py-4 transition-colors hover:bg-[#f9f9f8]">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            {categoryBadge(fb.category)}
                                            <span className="text-[10px] text-[#a39e98] shrink-0">
                                                {formatDate(fb.created_at)}
                                            </span>
                                        </div>
                                        <p className="line-clamp-2 text-sm text-[rgba(0,0,0,0.75)]">{fb.message}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>

            {/* ── Quick Actions ── */}
            <section className="mt-8">
                <h2 className="mb-3 text-base font-semibold text-[rgba(0,0,0,0.95)]">Aksi Cepat</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        {
                            href: "/pengguna",
                            label: "Kelola Pengguna",
                            desc: "Tambah atau hapus akun",
                            icon: (
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ),
                        },
                        {
                            href: "/peminjaman-barang",
                            label: "Peminjaman Barang",
                            desc: "Lihat daftar peminjaman",
                            icon: (
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ),
                        },
                        {
                            href: "/groups",
                            label: "Kelola Grup",
                            desc: "Atur akses pengguna",
                            icon: (
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ),
                        },
                        {
                            href: "/pengaturan",
                            label: "Pengaturan",
                            desc: "Toggle modul aktif",
                            icon: (
                                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="text-zinc-800">
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ),
                        },
                    ].map(({ href, label, desc, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
                        >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-50 border border-black/[0.06] transition-colors group-hover:bg-zinc-100">
                                {icon}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[rgba(0,0,0,0.95)] group-hover:text-black transition-colors">{label}</p>
                                <p className="text-xs text-[#78736f] mt-0.5">{desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
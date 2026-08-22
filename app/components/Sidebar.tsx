"use client"

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { getModulesAction } from "../action/sidebar/action";
import { ModuleItem } from "../types/navigation";
import { getCurrentUser } from "../action/pengguna/action";
import { logoutAction } from "../action/login/action";

/* ------------------------------------------------------------------ */
/* Icon map — keyed by module.name                                      */
/* ------------------------------------------------------------------ */
const MODULE_ICONS: Record<string, React.ReactNode> = {
    dashboard: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    "peminjaman-barang": (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    fitur: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    pengaturan: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    groups: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    pengguna: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ),
    kalender: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    ),
    feedback: (
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

const DEFAULT_ICON = (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

/* ------------------------------------------------------------------ */
/* Avatar initials                                                       */
/* ------------------------------------------------------------------ */
function Avatar({ name }: { name: string }) {
    const initials = name.slice(0, 1).toUpperCase();
    return (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-900 select-none">
            {initials}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Sidebar Component                                                     */
/* ------------------------------------------------------------------ */
export default function Sidebar() {
    const pathname = usePathname();
    const [sidebarNavigationItems, setSidebarNavigationItems] = useState<ModuleItem[]>([]);
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [logoutPending, startLogoutTransition] = useTransition();

    const loadSidebarNavigationItems = async () => {
        const user = await getCurrentUser();

        if (user?.username) setUsername(user.username as string);
        if (user?.role) setRole(user.role as string);

        const data = await getModulesAction(
            user?.username as string | undefined,
            user?.role as string | undefined
        );

        // Only super_admin sees pengaturan
        setSidebarNavigationItems(
            user?.role === 'super_admin'
                ? data
                : data.filter((module) => module.name !== 'pengaturan')
        );
    };

    useEffect(() => {
        loadSidebarNavigationItems();

        const handleModulesUpdated = () => loadSidebarNavigationItems();
        window.addEventListener("modules:updated", handleModulesUpdated);
        return () => window.removeEventListener("modules:updated", handleModulesUpdated);
    }, []);

    return (
        <aside
            id="admin-sidebar"
            aria-label="Sidebar navigasi admin"
            className="flex w-60 shrink-0 flex-col h-screen sticky top-0 border-r border-black/10 bg-white"
        >
            {/* ── Brand header ── */}
            <div className="flex items-center gap-2.5 border-b border-black/10 px-4 py-4">
                {/* Logo mark */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-zinc-900">
                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20" aria-hidden>
                        <path d="M10 2L14.5 7H16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1.5L10 2z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M7 17v-5h6v5" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight text-[rgba(0,0,0,0.95)]">Himakom</p>
                    <p className="text-[10px] text-[#78736f]">Admin Panel</p>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#a39e98]">
                    Menu
                </p>
                <ul className="space-y-0.5">
                    {sidebarNavigationItems.map(({ id, name, label, href, is_active }) => {
                        if (is_active !== 1) return null;

                        // Active: exact match or sub-path
                        const isActive = pathname === href || pathname.startsWith(href + "/");

                        return (
                            <li key={id}>
                                <Link
                                    href={href}
                                    className={`
                                        group relative flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm transition-colors
                                        ${isActive
                                            ? "bg-zinc-100 font-medium text-zinc-900"
                                            : "font-normal text-[rgba(0,0,0,0.75)] hover:bg-zinc-50 hover:text-[rgba(0,0,0,0.95)]"
                                        }
                                    `}
                                >
                                    {/* Active indicator bar */}
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-zinc-900" />
                                    )}
                                    {/* Icon */}
                                    <span className={`shrink-0 ${isActive ? "text-zinc-900" : "text-[#78736f] group-hover:text-[rgba(0,0,0,0.75)]"}`}>
                                        {MODULE_ICONS[name] ?? DEFAULT_ICON}
                                    </span>
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ── User info + Logout ── */}
            <div className="border-t border-black/10 p-3">
                {username && (
                    <div className="mb-2 flex items-center gap-2.5 rounded-[6px] px-2 py-2">
                        <Avatar name={username} />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[rgba(0,0,0,0.95)]">{username}</p>
                            <p className="truncate text-[10px] capitalize text-[#78736f]">{role || "pengguna"}</p>
                        </div>
                    </div>
                )}
                <button
                    id="sidebar-logout-btn"
                    type="button"
                    disabled={logoutPending}
                    onClick={() => startLogoutTransition(() => logoutAction())}
                    className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-sm text-[rgba(0,0,0,0.75)] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden className="shrink-0">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {logoutPending ? "Keluar…" : "Keluar"}
                </button>
            </div>
        </aside>
    );
}
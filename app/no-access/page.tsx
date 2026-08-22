"use client"

import Link from "next/link";
import { useTransition } from "react";
import { logoutAction } from "@/app/action/login/action";

export default function NoAccessPage() {
    const [pending, startTransition] = useTransition();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-zinc-400">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="12" cy="15.5" r="0.75" fill="currentColor" />
                    </svg>
                </div>

                {/* Text */}
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">
                    Akses Dibatasi
                </h1>
                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
                    Akun Anda belum memiliki akses ke halaman ini. Hubungi administrator untuk meminta akses atau bergabung ke grup yang sesuai.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => startTransition(() => logoutAction())}
                        disabled={pending}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        {pending ? "Keluar…" : "Keluar"}
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                    >
                        Ke Halaman Utama
                    </Link>
                </div>
            </div>
        </div>
    );
}

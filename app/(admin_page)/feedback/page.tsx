"use client";

import { useEffect, useState, useTransition } from "react";
import {
    getFeedbacksAction,
    deleteFeedbackAction,
    Feedback,
} from "@/app/action/feedback/action";

const CATEGORIES = ["all", "Saran", "Kritik", "Pertanyaan", "Lainnya"] as const;

const CATEGORY_STYLE: Record<string, string> = {
    Saran:      "bg-zinc-100 text-zinc-600",
    Kritik:     "bg-zinc-800 text-zinc-100",
    Pertanyaan: "bg-zinc-200 text-zinc-700",
    Lainnya:    "bg-zinc-100 text-zinc-500",
};

function formatDateTime(dateStr: string) {
    return new Date(dateStr).toLocaleString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function FeedbackAdminPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<typeof CATEGORIES[number]>("all");
    const [isPending, startTransition] = useTransition();

    const load = async () => {
        setLoading(true);
        setFeedbacks(await getFeedbacksAction(filter));
        setLoading(false);
    };

    useEffect(() => { load(); }, [filter]);

    const handleDelete = (id: number) => {
        if (!confirm("Hapus feedback ini?")) return;
        startTransition(async () => {
            await deleteFeedbackAction(id);
            load();
        });
    };

    const counts = feedbacks.reduce<Record<string, number>>((acc, f) => {
        acc[f.category] = (acc[f.category] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Kotak Feedback</h1>
                    <p className="mt-1 text-sm text-zinc-500">
                        Kelola dan baca masukan dari pengguna website Himakom.
                    </p>
                </div>
                {/* Stats */}
                <div className="flex shrink-0 gap-3">
                    {(["Saran","Kritik","Pertanyaan"] as const).map(cat => (
                        <div key={cat} className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-center shadow-sm">
                            <p className="text-lg font-bold text-zinc-900">{counts[cat] ?? 0}</p>
                            <p className="text-[10px] text-zinc-400">{cat}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-6 flex gap-1 overflow-x-auto border-b border-zinc-100 pb-px">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`shrink-0 rounded-t px-4 py-2 text-sm font-medium transition-colors ${
                            filter === cat
                                ? "border-b-2 border-zinc-900 text-zinc-900"
                                : "text-zinc-400 hover:text-zinc-700"
                        }`}
                    >
                        {cat === "all" ? "Semua" : cat}
                        {cat !== "all" && counts[cat] ? (
                            <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600">
                                {counts[cat]}
                            </span>
                        ) : null}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-zinc-100" />
                    ))}
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-3 text-zinc-200">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm font-medium text-zinc-400">Belum ada feedback.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {feedbacks.map(fb => (
                        <div
                            key={fb.id}
                            className="group rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_STYLE[fb.category] ?? "bg-zinc-100 text-zinc-500"}`}>
                                            {fb.category}
                                        </span>
                                        <span className="text-xs text-zinc-400">{formatDateTime(fb.created_at)}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">{fb.message}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(fb.id)}
                                    disabled={isPending}
                                    title="Hapus feedback"
                                    className="shrink-0 rounded-md p-1.5 text-zinc-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-400 group-hover:opacity-100 disabled:opacity-50 sm:opacity-100"
                                >
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                        <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
    getEventsAction,
    createEventAction,
    updateEventAction,
    deleteEventAction,
    Event,
    EventState,
} from "@/app/action/event/action";

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
const emptyState: EventState = { success: false, error: "", fieldErrors: {} };

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
}

function formatTime(t: string | null) {
    if (!t) return null;
    return t.slice(0, 5);
}

function toDateInputValue(dateStr: string) {
    // event.date may be "2026-08-25" or full datetime — take first 10 chars
    return dateStr?.slice(0, 10) ?? "";
}

/* ------------------------------------------------------------------ */
/*  Event Form Modal                                                    */
/* ------------------------------------------------------------------ */
interface EventModalProps {
    mode: "create" | "edit";
    initialData?: Event;
    onClose: () => void;
    onSuccess: () => void;
}

function EventModal({ mode, initialData, onClose, onSuccess }: EventModalProps) {
    const action = mode === "create" ? createEventAction : updateEventAction;
    const [state, formAction, pending] = useActionState<EventState, FormData>(action, emptyState);

    useEffect(() => { if (state.success) onSuccess(); }, [state.success]);

    const field = (label: string, name: string, type = "text", required = false, defaultValue?: string, hint?: string) => (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                name={name}
                type={type}
                defaultValue={defaultValue ?? ""}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
            {hint && <p className="mt-1 text-[10px] text-zinc-400">{hint}</p>}
            {(state.fieldErrors as any)[name]?.[0] && (
                <p className="mt-1 text-xs text-red-500">{(state.fieldErrors as any)[name][0]}</p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-zinc-900">
                        {mode === "create" ? "Tambah Event" : "Edit Event"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {state.error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-4">
                    {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}

                    {field("Nama Event", "name", "text", true, initialData?.name)}

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-zinc-700">Deskripsi</label>
                        <textarea
                            name="description"
                            rows={2}
                            defaultValue={initialData?.description ?? ""}
                            className="w-full resize-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                        />
                    </div>

                    {field("Lokasi", "location", "text", true, initialData?.location)}
                    {field("Tanggal", "date", "date", true, toDateInputValue(initialData?.date ?? ""))}

                    <div className="grid grid-cols-2 gap-3">
                        {field("Waktu Mulai", "time_start", "time", false, formatTime(initialData?.time_start ?? null) ?? "")}
                        {field("Waktu Selesai", "time_end", "time", false, formatTime(initialData?.time_end ?? null) ?? "")}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button" onClick={onClose}
                            className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit" disabled={pending}
                            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
                        >
                            {pending ? "Menyimpan…" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Month Calendar View                                                 */
/* ------------------------------------------------------------------ */
function MonthCalendar({ events, year, month }: { events: Event[]; year: number; month: number }) {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const eventsByDate: Record<string, Event[]> = {};
    events.forEach(ev => {
        const key = ev.date.slice(0, 10);
        if (!eventsByDate[key]) eventsByDate[key] = [];
        eventsByDate[key].push(ev);
    });

    const cells: (number | null)[] = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    return (
        <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-zinc-100">
                {DAYS.map(d => (
                    <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                        {d}
                    </div>
                ))}
            </div>
            {/* Cells */}
            <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                    if (!day) return <div key={`empty-${i}`} className="min-h-[80px] border-b border-r border-zinc-100 bg-zinc-50/50" />;

                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const dayEvents = eventsByDate[dateKey] ?? [];
                    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

                    return (
                        <div key={day} className={`min-h-[80px] border-b border-r border-zinc-100 p-1.5 ${isToday ? "bg-zinc-50" : ""}`}>
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium mb-1 ${
                                isToday ? "bg-zinc-900 text-white" : "text-zinc-600"
                            }`}>
                                {day}
                            </span>
                            {dayEvents.slice(0, 2).map(ev => (
                                <div key={ev.id} className="truncate rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 mb-0.5">
                                    {ev.name}
                                </div>
                            ))}
                            {dayEvents.length > 2 && (
                                <div className="text-[10px] text-zinc-400">+{dayEvents.length - 2} lagi</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */
const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

export default function KalenderAdmin() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
    const [editEvent, setEditEvent] = useState<Event | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    const today = new Date();
    const [calYear, setCalYear] = useState(today.getFullYear());
    const [calMonth, setCalMonth] = useState(today.getMonth());

    const load = async () => {
        setLoading(true);
        setEvents(await getEventsAction());
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleDelete = (id: number) => {
        if (!confirm("Hapus event ini?")) return;
        startTransition(async () => { await deleteEventAction(id); load(); });
    };

    const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
    const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Kalender Kegiatan</h1>
                    <p className="mt-1 text-sm text-zinc-500">Kelola jadwal dan event yang akan ditampilkan di halaman publik.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex rounded-md border border-zinc-200 overflow-hidden">
                        <button
                            onClick={() => setView("calendar")}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "calendar" ? "bg-zinc-900 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}
                        >
                            Kalender
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-zinc-900 text-white" : "bg-white text-zinc-600 hover:bg-zinc-50"}`}
                        >
                            Daftar
                        </button>
                    </div>
                    <button
                        onClick={() => { setEditEvent(undefined); setModalMode("create"); }}
                        className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Tambah Event
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-zinc-100" />)}
                </div>
            ) : view === "calendar" ? (
                /* ── Calendar View ── */
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-zinc-900">
                            {MONTHS[calMonth]} {calYear}
                        </h2>
                        <div className="flex gap-1">
                            <button onClick={prevMonth} className="rounded-md border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <button onClick={() => { setCalYear(today.getFullYear()); setCalMonth(today.getMonth()); }}
                                className="rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
                                Hari ini
                            </button>
                            <button onClick={nextMonth} className="rounded-md border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-50">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                    </div>
                    <MonthCalendar events={events} year={calYear} month={calMonth} />
                </div>
            ) : (
                /* ── List View ── */
                <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
                    {events.length === 0 ? (
                        <div className="py-20 text-center text-sm text-zinc-400">Belum ada event.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-zinc-100 bg-zinc-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">Event</th>
                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">Tanggal & Waktu</th>
                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500">Lokasi</th>
                                    <th className="px-5 py-3 text-xs font-medium text-zinc-500 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {events.map(ev => (
                                    <tr key={ev.id} className="hover:bg-zinc-50 group">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-zinc-900">{ev.name}</p>
                                            {ev.description && (
                                                <p className="text-xs text-zinc-400 line-clamp-1">{ev.description}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-zinc-700">{formatDate(ev.date)}</p>
                                            {ev.time_start && (
                                                <p className="text-xs text-zinc-400">
                                                    {formatTime(ev.time_start)}{ev.time_end ? ` – ${formatTime(ev.time_end)}` : ""}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-zinc-600">{ev.location}</td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
                                                <button
                                                    onClick={() => { setEditEvent(ev); setModalMode("edit"); }}
                                                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(ev.id)}
                                                    disabled={isPending}
                                                    className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Modal */}
            {modalMode && (
                <EventModal
                    mode={modalMode}
                    initialData={editEvent}
                    onClose={() => setModalMode(null)}
                    onSuccess={() => { setModalMode(null); load(); }}
                />
            )}
        </main>
    );
}

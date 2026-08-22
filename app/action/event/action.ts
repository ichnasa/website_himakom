"use server";

import db from "@/app/utils/database";
import z from "zod";

export interface Event {
    id: number;
    name: string;
    description: string | null;
    location: string;
    date: string;
    time_start: string | null;
    time_end: string | null;
    created_at: string;
}

export type EventState = {
    success: boolean;
    error: string;
    fieldErrors: {
        name?: string[];
        location?: string[];
        date?: string[];
        time_start?: string[];
        time_end?: string[];
    };
};

const EventSchema = z.object({
    name: z.string().min(3, "Nama event minimal 3 karakter"),
    description: z.string().optional(),
    location: z.string().min(2, "Lokasi harus diisi"),
    date: z.string().min(1, "Tanggal harus diisi"),
    time_start: z.string().optional(),
    time_end: z.string().optional(),
});

const emptyFieldErrors = { name: [], location: [], date: [], time_start: [], time_end: [] };

export async function getEventsAction(): Promise<Event[]> {
    return db.prepare("SELECT * FROM event ORDER BY date ASC, time_start ASC").all() as Event[];
}

export async function createEventAction(initialState: EventState, formData: FormData): Promise<EventState> {
    const result = EventSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        location: formData.get("location"),
        date: formData.get("date"),
        time_start: formData.get("time_start") || undefined,
        time_end: formData.get("time_end") || undefined,
    });

    if (!result.success) {
        return {
            success: false,
            error: "Oops! Ada isian yang belum sesuai. Mohon periksa kembali form Anda.",
            fieldErrors: result.error.flatten().fieldErrors as EventState["fieldErrors"],
        };
    }

    const stmt = db.prepare(`
        INSERT INTO event (name, description, location, date, time_start, time_end)
        VALUES (:name, :description, :location, :date, :time_start, :time_end)
    `).run({
        name: result.data.name,
        description: result.data.description ?? null,
        location: result.data.location,
        date: result.data.date,
        time_start: result.data.time_start ?? null,
        time_end: result.data.time_end ?? null,
    });

    if (stmt.changes === 0) return { success: false, error: "Gagal menambah event", fieldErrors: emptyFieldErrors };
    return { success: true, error: "", fieldErrors: emptyFieldErrors };
}

export async function updateEventAction(initialState: EventState, formData: FormData): Promise<EventState> {
    const id = formData.get("id");
    if (!id) return { success: false, error: "ID tidak valid", fieldErrors: emptyFieldErrors };

    const result = EventSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
        location: formData.get("location"),
        date: formData.get("date"),
        time_start: formData.get("time_start") || undefined,
        time_end: formData.get("time_end") || undefined,
    });

    if (!result.success) {
        return {
            success: false,
            error: "Oops! Ada isian yang belum sesuai. Mohon periksa kembali form Anda.",
            fieldErrors: result.error.flatten().fieldErrors as EventState["fieldErrors"],
        };
    }

    const stmt = db.prepare(`
        UPDATE event SET name=:name, description=:description, location=:location,
        date=:date, time_start=:time_start, time_end=:time_end WHERE id=:id
    `).run({
        id: Number(id),
        name: result.data.name,
        description: result.data.description ?? null,
        location: result.data.location,
        date: result.data.date,
        time_start: result.data.time_start ?? null,
        time_end: result.data.time_end ?? null,
    });

    if (stmt.changes === 0) return { success: false, error: "Gagal mengupdate event", fieldErrors: emptyFieldErrors };
    return { success: true, error: "", fieldErrors: emptyFieldErrors };
}

export async function deleteEventAction(id: number): Promise<{ success: boolean; error?: string }> {
    const stmt = db.prepare("DELETE FROM event WHERE id = ?").run(id);
    if (stmt.changes === 0) return { success: false, error: "Event tidak ditemukan" };
    return { success: true };
}

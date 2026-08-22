"use server";

import db from "@/app/utils/database";
import z from "zod";

export interface Feedback {
    id: number;
    category: string;
    message: string;
    created_at: string;
}

export type FeedbackState = {
    success: boolean;
    error: string;
    fieldErrors: {
        category?: string[];
        message?: string[];
    };
};

const FeedbackSchema = z.object({
    category: z.enum(["Saran", "Kritik", "Pertanyaan", "Lainnya"]),
    message: z.string().min(10, "Pesan minimal 10 karakter").max(1000, "Pesan maksimal 1000 karakter"),
});

const emptyFieldErrors = { category: [], message: [] };

export async function submitFeedbackAction(
    initialState: FeedbackState,
    formData: FormData
): Promise<FeedbackState> {
    const result = FeedbackSchema.safeParse({
        category: formData.get("category"),
        message: formData.get("message"),
    });

    if (!result.success) {
        return {
            success: false,
            error: "Oops! Ada beberapa isian yang belum sesuai. Mohon periksa kembali form Anda.",
            fieldErrors: result.error.flatten().fieldErrors as FeedbackState["fieldErrors"],
        };
    }

    const stmt = db.prepare(
        "INSERT INTO feedback (category, message) VALUES (:category, :message)"
    ).run({ category: result.data.category, message: result.data.message });

    if (stmt.changes === 0) {
        return { success: false, error: "Gagal mengirim feedback", fieldErrors: emptyFieldErrors };
    }

    return { success: true, error: "", fieldErrors: emptyFieldErrors };
}

export async function getFeedbacksAction(category?: string): Promise<Feedback[]> {
    if (category && category !== "all") {
        return db.prepare(
            "SELECT * FROM feedback WHERE category = ? ORDER BY created_at DESC"
        ).all(category) as Feedback[];
    }
    return db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all() as Feedback[];
}

export async function deleteFeedbackAction(id: number): Promise<{ success: boolean; error?: string }> {
    const stmt = db.prepare("DELETE FROM feedback WHERE id = ?").run(id);
    if (stmt.changes === 0) return { success: false, error: "Feedback tidak ditemukan" };
    return { success: true };
}

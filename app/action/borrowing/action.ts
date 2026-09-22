"use server";

import db from "@/app/utils/database";
import z from "zod";
import { Item, Borrowing, ItemState, BorrowingState, BorrowingStatus } from "@/app/types/borrowing";
import { revalidatePath } from "next/cache";
import path from "node:path";
import fs from "node:fs/promises";

/* ================================================================== */
/*  VALIDATION SCHEMAS & UPLOAD HELPERS                                 */
/* ================================================================== */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "barang");
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function saveUploadedImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { success: false, error: "Format foto harus JPG, PNG, WEBP, GIF, atau SVG" };
    }
    if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: "Ukuran foto maksimal 5MB" };
    }

    try {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
        const ext = path.extname(file.name) || ".jpg";
        const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "").substring(0, 20) || "barang";
        const uniqueFileName = `${cleanName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        return { success: true, url: `/uploads/barang/${uniqueFileName}` };
    } catch (err) {
        console.error("Error saving image file:", err);
        return { success: false, error: "Gagal menyimpan file foto" };
    }
}

async function removeLocalImage(imageUrl: string | null | undefined) {
    if (!imageUrl || !imageUrl.startsWith("/uploads/barang/")) return;
    try {
        const fileName = path.basename(imageUrl);
        const filePath = path.join(UPLOAD_DIR, fileName);
        await fs.unlink(filePath);
    } catch {
        // ignore if file doesn't exist
    }
}

const ItemSchema = z.object({
    name: z.string().min(2, "Nama barang minimal 2 karakter"),
    description: z.string().optional(),
    quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
    category: z.string().optional(),
    image_url: z.string().optional(),
});

const BorrowingSchema = z.object({
    item_id: z.coerce.number().min(1, "Barang harus dipilih"),
    borrower_name: z.string().min(2, "Nama peminjam minimal 2 karakter"),
    borrower_nim: z.string().min(5, "NIM minimal 5 karakter"),
    borrower_phone: z.string().optional(),
    purpose: z.string().min(5, "Keperluan minimal 5 karakter"),
    quantity: z.coerce.number().min(1, "Jumlah pinjam minimal 1"),
    borrow_date: z.string().min(1, "Tanggal pinjam harus diisi"),
    return_date: z.string().min(1, "Tanggal kembali harus diisi"),
}).refine((data) => {
    if (!data.borrow_date || !data.return_date) return true;
    return new Date(data.return_date) >= new Date(data.borrow_date);
}, {
    message: "Tgl kembali tidak boleh sebelum tgl pinjam",
    path: ["return_date"],
});

const emptyItemErrors = { name: [], description: [], quantity: [], category: [], image: [] };
const emptyBorrowErrors = { item_id: [], borrower_name: [], borrower_nim: [], borrower_phone: [], purpose: [], quantity: [], borrow_date: [], return_date: [] };

/* ================================================================== */
/*  ITEMS CRUD (ADMIN)                                                  */
/* ================================================================== */

export async function getItemsAction(): Promise<Item[]> {
    return db.prepare(`SELECT * FROM item ORDER BY id DESC`).all() as Item[];
}

export async function getAvailableItemsAction(): Promise<Item[]> {
    return db.prepare(`SELECT * FROM item WHERE available > 0 ORDER BY name ASC`).all() as Item[];
}

export async function createItemAction(
    initialState: ItemState,
    formData: FormData
): Promise<ItemState> {
    const result = ItemSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        return {
            success: false,
            error: "Validasi gagal",
            fieldErrors: result.error.flatten().fieldErrors as ItemState["fieldErrors"],
        };
    }

    const imageFile = formData.get("image_file") as File | null;
    let imageUrl: string | null = (formData.get("image_url") as string | null)?.trim() || null;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const uploadResult = await saveUploadedImage(imageFile);
        if (!uploadResult.success) {
            return {
                success: false,
                error: uploadResult.error || "Gagal mengunggah foto",
                fieldErrors: { ...emptyItemErrors, image: [uploadResult.error || "Gagal mengunggah foto"] },
            };
        }
        imageUrl = uploadResult.url ?? null;
    }

    try {
        db.prepare(`
            INSERT INTO item (name, description, quantity, available, category, image_url)
            VALUES (:name, :description, :quantity, :quantity, :category, :image_url)
        `).run({
            name: result.data.name,
            description: result.data.description ?? null,
            quantity: result.data.quantity,
            category: result.data.category ?? null,
            image_url: imageUrl,
        });
        revalidatePath("/peminjaman-barang");
        revalidatePath("/peminjaman");
        return { success: true, error: "", fieldErrors: emptyItemErrors };
    } catch {
        return { success: false, error: "Gagal membuat barang", fieldErrors: emptyItemErrors };
    }
}

export async function updateItemAction(
    initialState: ItemState,
    formData: FormData
): Promise<ItemState> {
    const id = formData.get("id");
    if (!id) return { success: false, error: "ID tidak valid", fieldErrors: emptyItemErrors };

    const result = ItemSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
        return {
            success: false,
            error: "Validasi gagal",
            fieldErrors: result.error.flatten().fieldErrors as ItemState["fieldErrors"],
        };
    }

    const currentItem = db.prepare(`SELECT quantity, available, image_url FROM item WHERE id = ?`).get(id) as { quantity: number; available: number; image_url: string | null } | undefined;
    if (!currentItem) return { success: false, error: "Barang tidak ditemukan", fieldErrors: emptyItemErrors };

    const removeImage = formData.get("remove_image") === "true";
    const imageFile = formData.get("image_file") as File | null;
    const imageUrlInput = (formData.get("image_url") as string | null)?.trim();

    let finalImageUrl = currentItem.image_url;

    if (removeImage) {
        await removeLocalImage(currentItem.image_url);
        finalImageUrl = null;
    } else if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const uploadResult = await saveUploadedImage(imageFile);
        if (!uploadResult.success) {
            return {
                success: false,
                error: uploadResult.error || "Gagal mengunggah foto",
                fieldErrors: { ...emptyItemErrors, image: [uploadResult.error || "Gagal mengunggah foto"] },
            };
        }
        await removeLocalImage(currentItem.image_url);
        finalImageUrl = uploadResult.url ?? null;
    } else if (imageUrlInput !== undefined && imageUrlInput !== null) {
        if (imageUrlInput === "") {
            finalImageUrl = null;
        } else if (imageUrlInput !== currentItem.image_url) {
            await removeLocalImage(currentItem.image_url);
            finalImageUrl = imageUrlInput;
        }
    }

    // Calculate new available quantity (maintain difference between total and available)
    const borrowedCount = currentItem.quantity - currentItem.available;
    const newAvailable = Math.max(0, result.data.quantity - borrowedCount);

    try {
        db.prepare(`
            UPDATE item 
            SET name = :name, description = :description, quantity = :quantity, available = :available, category = :category, image_url = :image_url, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        `).run({
            id: Number(id),
            name: result.data.name,
            description: result.data.description ?? null,
            quantity: result.data.quantity,
            available: newAvailable,
            category: result.data.category ?? null,
            image_url: finalImageUrl,
        });
        revalidatePath("/peminjaman-barang");
        revalidatePath("/peminjaman");
        return { success: true, error: "", fieldErrors: emptyItemErrors };
    } catch {
        return { success: false, error: "Gagal update barang", fieldErrors: emptyItemErrors };
    }
}

export async function deleteItemAction(id: number): Promise<{ success: boolean; error?: string }> {
    const currentItem = db.prepare(`SELECT image_url FROM item WHERE id = ?`).get(id) as { image_url: string | null } | undefined;
    const stmt = db.prepare(`DELETE FROM item WHERE id = ?`).run(id);
    if (stmt.changes === 0) return { success: false, error: "Barang tidak ditemukan" };
    if (currentItem?.image_url) {
        await removeLocalImage(currentItem.image_url);
    }
    revalidatePath("/peminjaman-barang");
    revalidatePath("/peminjaman");
    return { success: true };
}

/* ================================================================== */
/*  BORROWING (PUBLIC & ADMIN)                                          */
/* ================================================================== */

export async function getBorrowingsAction(statusFilter?: BorrowingStatus | 'all'): Promise<Borrowing[]> {
    let query = `
        SELECT b.*, i.name as item_name 
        FROM borrowing b
        JOIN item i ON b.item_id = i.id
    `;
    let params: any[] = [];

    if (statusFilter && statusFilter !== 'all') {
        query += ` WHERE b.status = ?`;
        params.push(statusFilter);
    }
    
    query += ` ORDER BY b.created_at DESC`;

    return db.prepare(query).all(...params) as Borrowing[];
}

export async function createBorrowingAction(
    initialState: BorrowingState,
    formData: FormData
): Promise<BorrowingState> {
    const result = BorrowingSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        return {
            success: false,
            error: "Pastikan semua kolom terisi dengan benar.",
            fieldErrors: result.error.flatten().fieldErrors as BorrowingState["fieldErrors"],
        };
    }

    const item = db.prepare(`SELECT available FROM item WHERE id = ?`).get(result.data.item_id) as { available: number } | undefined;
    if (!item) {
        return { success: false, error: "Barang tidak ditemukan", fieldErrors: emptyBorrowErrors };
    }
    if (item.available < result.data.quantity) {
        return { success: false, error: `Stok tidak cukup. Hanya tersisa ${item.available} unit.`, fieldErrors: emptyBorrowErrors };
    }

    try {
        db.prepare(`
            INSERT INTO borrowing (item_id, borrower_name, borrower_nim, borrower_phone, purpose, quantity, borrow_date, return_date, status)
            VALUES (:item_id, :borrower_name, :borrower_nim, :borrower_phone, :purpose, :quantity, :borrow_date, :return_date, 'menunggu')
        `).run({
            item_id: result.data.item_id,
            borrower_name: result.data.borrower_name,
            borrower_nim: result.data.borrower_nim,
            borrower_phone: result.data.borrower_phone ?? null,
            purpose: result.data.purpose,
            quantity: result.data.quantity,
            borrow_date: result.data.borrow_date,
            return_date: result.data.return_date,
        });
        revalidatePath("/peminjaman-barang");
        return { success: true, error: "", fieldErrors: emptyBorrowErrors };
    } catch {
        return { success: false, error: "Gagal mengajukan peminjaman. Silakan coba lagi.", fieldErrors: emptyBorrowErrors };
    }
}

export async function updateBorrowingStatusAction(
    id: number,
    newStatus: BorrowingStatus,
    note?: string
): Promise<{ success: boolean; error?: string }> {
    const trx = db.transaction(() => {
        const current = db.prepare(`SELECT item_id, quantity, status FROM borrowing WHERE id = ?`).get(id) as { item_id: number; quantity: number; status: BorrowingStatus } | undefined;
        if (!current) throw new Error("Data peminjaman tidak ditemukan");

        // Update borrowing
        db.prepare(`
            UPDATE borrowing SET status = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).run(newStatus, note ?? null, id);

        // Adjust item stock based on state transitions
        if (current.status === 'menunggu' && newStatus === 'disetujui') {
            // Approving -> decrease available stock
            db.prepare(`UPDATE item SET available = available - ? WHERE id = ?`).run(current.quantity, current.item_id);
        } 
        else if (current.status === 'disetujui' && (newStatus === 'dikembalikan' || newStatus === 'ditolak')) {
            // Returning or revoking approval -> increase available stock
            db.prepare(`UPDATE item SET available = available + ? WHERE id = ?`).run(current.quantity, current.item_id);
        }
    });

    try {
        trx();
        revalidatePath("/peminjaman-barang");
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || "Gagal mengupdate status peminjaman" };
    }
}

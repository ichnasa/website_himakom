"use server";

import db from "@/app/utils/database";
import z from "zod";
import { Group, GroupMember, GroupModuleAccess, GroupState } from "@/app/types/groups";

/* ------------------------------------------------------------------ */
/*  Validation                                                          */
/* ------------------------------------------------------------------ */
const GroupSchema = z.object({
    name: z.string().min(2, "Nama group minimal 2 karakter"),
    description: z.string().optional(),
});

const emptyFieldErrors = { name: [], description: [] };

/* ================================================================== */
/*  GROUP CRUD                                                          */
/* ================================================================== */

/** Ambil semua group beserta jumlah anggota & modul */
export async function getGroupsAction(): Promise<Group[]> {
    const rows = db.prepare(`
        SELECT
            g.id,
            g.name,
            g.description,
            g.created_by,
            g.created_at,
            g.updated_at,
            COUNT(DISTINCT ug.user_id) AS member_count,
            COUNT(DISTINCT gm.module_id) AS module_count
        FROM "group" g
        LEFT JOIN user_group ug ON ug.group_id = g.id
        LEFT JOIN group_module gm ON gm.group_id = g.id
        GROUP BY g.id
        ORDER BY g.created_at ASC
    `).all() as Group[];
    return rows;
}

/** Buat group baru */
export async function createGroupAction(
    initialState: GroupState,
    formData: FormData
): Promise<GroupState> {
    const result = GroupSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
    });

    if (!result.success) {
        return {
            success: false,
            error: "Validasi gagal",
            fieldErrors: result.error.flatten().fieldErrors as GroupState["fieldErrors"],
        };
    }

    const existing = db.prepare(`SELECT id FROM "group" WHERE name = ?`).get(result.data.name);
    if (existing) {
        return { success: false, error: "Nama group sudah digunakan", fieldErrors: emptyFieldErrors };
    }

    const stmt = db.prepare(`
        INSERT INTO "group" (name, description) VALUES (:name, :description)
    `).run({ name: result.data.name, description: result.data.description ?? null });

    if (stmt.changes === 0) {
        return { success: false, error: "Gagal membuat group", fieldErrors: emptyFieldErrors };
    }

    return { success: true, error: "", fieldErrors: emptyFieldErrors };
}

/** Update nama/deskripsi group */
export async function updateGroupAction(
    initialState: GroupState,
    formData: FormData
): Promise<GroupState> {
    const id = formData.get("id");
    if (!id) return { success: false, error: "ID group tidak valid", fieldErrors: emptyFieldErrors };

    const result = GroupSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description") || undefined,
    });

    if (!result.success) {
        return {
            success: false,
            error: "Validasi gagal",
            fieldErrors: result.error.flatten().fieldErrors as GroupState["fieldErrors"],
        };
    }

    const stmt = db.prepare(`
        UPDATE "group" SET name = :name, description = :description, updated_at = CURRENT_TIMESTAMP WHERE id = :id
    `).run({ id: Number(id), name: result.data.name, description: result.data.description ?? null });

    if (stmt.changes === 0) {
        return { success: false, error: "Gagal mengupdate group", fieldErrors: emptyFieldErrors };
    }

    return { success: true, error: "", fieldErrors: emptyFieldErrors };
}

/** Hapus group */
export async function deleteGroupAction(groupId: number): Promise<{ success: boolean; error?: string }> {
    const stmt = db.prepare(`DELETE FROM "group" WHERE id = ?`).run(groupId);
    if (stmt.changes === 0) return { success: false, error: "Group tidak ditemukan" };
    return { success: true };
}

/* ================================================================== */
/*  ANGGOTA GROUP                                                       */
/* ================================================================== */

/** List user yang ada di suatu group */
export async function getGroupMembersAction(groupId: number): Promise<GroupMember[]> {
    const rows = db.prepare(`
        SELECT
            u.id AS user_id,
            u.username,
            u.role,
            ug.created_at AS joined_at
        FROM user_group ug
        JOIN user u ON u.id = ug.user_id
        WHERE ug.group_id = ?
        ORDER BY ug.created_at ASC
    `).all(groupId) as GroupMember[];
    return rows;
}

/** List user yang BELUM masuk ke group ini */
export async function getUsersNotInGroupAction(groupId: number): Promise<{ id: number; username: string; role: string }[]> {
    const rows = db.prepare(`
        SELECT u.id, u.username, u.role
        FROM user u
        WHERE u.id NOT IN (
            SELECT user_id FROM user_group WHERE group_id = ?
        )
        ORDER BY u.username ASC
    `).all(groupId) as { id: number; username: string; role: string }[];
    return rows;
}

/** Tambah user ke group */
export async function addUserToGroupAction(
    userId: number,
    groupId: number
): Promise<{ success: boolean; error?: string }> {
    try {
        db.prepare(`INSERT INTO user_group (user_id, group_id) VALUES (?, ?)`).run(userId, groupId);
        return { success: true };
    } catch {
        return { success: false, error: "User sudah menjadi anggota group ini" };
    }
}

/** Hapus user dari group */
export async function removeUserFromGroupAction(
    userId: number,
    groupId: number
): Promise<{ success: boolean; error?: string }> {
    const stmt = db.prepare(`DELETE FROM user_group WHERE user_id = ? AND group_id = ?`).run(userId, groupId);
    if (stmt.changes === 0) return { success: false, error: "Anggota tidak ditemukan" };
    return { success: true };
}

/* ================================================================== */
/*  AKSES MODUL GROUP                                                   */
/* ================================================================== */

/** List semua modul + flag apakah group ini punya akses (pengaturan dikecualikan — hanya super_admin) */
export async function getGroupModulesAction(groupId: number): Promise<GroupModuleAccess[]> {
    const rows = db.prepare(`
        SELECT
            m.id AS module_id,
            m.name,
            m.label,
            m.href,
            m.icon,
            m.is_active,
            CASE WHEN gm.module_id IS NOT NULL THEN 1 ELSE 0 END AS has_access
        FROM module m
        LEFT JOIN group_module gm ON gm.module_id = m.id AND gm.group_id = ?
        WHERE m.name != 'pengaturan'
        ORDER BY m.id ASC
    `).all(groupId) as GroupModuleAccess[];
    return rows;
}

/** Toggle akses group ke modul (tambah / hapus baris di group_module) */
export async function toggleGroupModuleAction(
    groupId: number,
    moduleId: number,
    grant: boolean
): Promise<{ success: boolean; error?: string }> {
    if (grant) {
        try {
            db.prepare(`INSERT INTO group_module (group_id, module_id) VALUES (?, ?)`).run(groupId, moduleId);
        } catch {
            return { success: false, error: "Akses sudah ada" };
        }
    } else {
        const stmt = db.prepare(`DELETE FROM group_module WHERE group_id = ? AND module_id = ?`).run(groupId, moduleId);
        if (stmt.changes === 0) return { success: false, error: "Akses tidak ditemukan" };
    }
    return { success: true };
}

"use server"

import db from "../../utils/database";

import { ModuleItem } from "../../types/navigation";

export async function getModulesAction(username?: string, role?: string): Promise<ModuleItem[] | []> {
    // admin & super_admin see all active modules
    if (!username || role === 'admin' || role === 'super_admin') {
        const rows: ModuleItem[] = db.prepare('SELECT * FROM module WHERE is_active = 1;').all() as ModuleItem[];
        return rows;
    }

    // pengguna: only return modules their groups have access to
    const rows = db.prepare(`
        SELECT DISTINCT m.*
        FROM module m
        JOIN group_module gm ON gm.module_id = m.id
        JOIN user_group ug ON ug.group_id = gm.group_id
        JOIN user u ON u.id = ug.user_id
        WHERE u.username = ? AND m.is_active = 1
    `).all(username) as ModuleItem[];

    return rows;
}

export async function toggleModuleAction(id: number, value: number) {
    const result = db.prepare(`
    UPDATE module
    SET is_active = ?
    WHERE id = ?
  `).run(value, id);

    if (result.changes === 0) {
        return { success: false, updated: null };
    }

    const updated = db.prepare(`
    SELECT * FROM module WHERE id = ?
  `).get(id) as ModuleItem;
    return { success: true, updated };
}
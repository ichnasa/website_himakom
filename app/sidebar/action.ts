"use server"

import db from "../utils/database";

import { ModuleItem } from "../types/navigation";

export async function getModulesAction(): Promise<ModuleItem[] | []> {
    const rows: ModuleItem[] = db.prepare('SELECT * FROM module;').all() as ModuleItem[];
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
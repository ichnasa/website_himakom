"use server"

import db from "../utils/database";

import { NavigationItem } from "../types/navigation";

export async function getSidebarNavigationItemsAction(): Promise<NavigationItem[] | []> {
    const rows: NavigationItem[] = db.prepare('SELECT * FROM module WHERE is_show_in_sidebar = 1;').all() as NavigationItem[];
    return rows;
}
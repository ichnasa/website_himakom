"use server"

import db from "@/app/utils/database";

export type DashboardStats = {
    totalUsers: number;
    totalEvents: number;
    totalFeedback: number;
    upcomingEventsCount: number;
};

export type RecentFeedback = {
    id: number;
    category: string;
    message: string;
    created_at: string;
};

export type UpcomingEvent = {
    id: number;
    name: string;
    description: string | null;
    location: string;
    date: string;
    time_start: string | null;
    time_end: string | null;
};

export async function getDashboardStatsAction(): Promise<DashboardStats> {
    const totalUsers = (db.prepare("SELECT COUNT(*) as count FROM user").get() as { count: number }).count;
    const totalEvents = (db.prepare("SELECT COUNT(*) as count FROM event").get() as { count: number }).count;
    const totalFeedback = (db.prepare("SELECT COUNT(*) as count FROM feedback").get() as { count: number }).count;
    const today = new Date().toISOString().split("T")[0];
    const upcomingEventsCount = (
        db.prepare("SELECT COUNT(*) as count FROM event WHERE date >= ?").get(today) as { count: number }
    ).count;

    return { totalUsers, totalEvents, totalFeedback, upcomingEventsCount };
}

export async function getRecentFeedbackAction(limit = 5): Promise<RecentFeedback[]> {
    const rows = db
        .prepare("SELECT id, category, message, created_at FROM feedback ORDER BY created_at DESC LIMIT ?")
        .all(limit) as RecentFeedback[];
    return rows;
}

export async function getUpcomingEventsAction(limit = 5): Promise<UpcomingEvent[]> {
    const today = new Date().toISOString().split("T")[0];
    const rows = db
        .prepare(
            "SELECT id, name, description, location, date, time_start, time_end FROM event WHERE date >= ? ORDER BY date ASC LIMIT ?"
        )
        .all(today, limit) as UpcomingEvent[];
    return rows;
}

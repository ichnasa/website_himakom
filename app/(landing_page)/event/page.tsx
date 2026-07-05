import db from "@/app/utils/database";
import Calendar from "@/app/components/Calendar";

interface Event {
    id: number;
    name: string;
    description: string;
    location: string;
    date: string;
    created_at: string;
    time_start: string;
    time_end: string;
}

export default function Event() {
    const stmt = db.prepare('SELECT * FROM event ORDER BY date DESC');
    const event = stmt.all() as Event[];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Kalender Event</h1>
                <p className="text-slate-500 mt-2">Lihat jadwal dan event mendatang</p>
            </div>
            <Calendar events={event} />
        </div>
    )
}
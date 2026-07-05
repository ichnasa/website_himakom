"use client";

import { useState } from 'react';

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

export default function Calendar({ events }: { events: Event[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const eventsByDate: Record<string, Event[]> = {};
    events.forEach(event => {
        const dateStr = event.date;
        if (!eventsByDate[dateStr]) {
            eventsByDate[dateStr] = [];
        }
        eventsByDate[dateStr].push(event);
    });

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white">
                <h2 className="text-xl font-bold text-slate-800">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:ring-4 focus:ring-slate-100"
                    >
                        Hari Ini
                    </button>
                    <div className="flex space-x-1">
                        <button
                            onClick={prevMonth}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
                {dayNames.map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r last:border-r-0 border-slate-200">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-slate-200 gap-px">
                {blanks.map(blank => (
                    <div key={`blank-${blank}`} className="bg-slate-50/50 min-h-[120px]"></div>
                ))}
                {days.map(day => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = eventsByDate[dateStr] || [];
                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

                    return (
                        <div key={day} className="bg-white min-h-[120px] p-2 hover:bg-slate-50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                    {day}
                                </div>
                            </div>
                            <div className="space-y-1.5 overflow-y-auto max-h-[80px] pr-1 custom-scrollbar">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        onClick={() => setSelectedEvent(event)}
                                        className="text-xs px-2 py-1.5 rounded-md bg-slate-900 text-white border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm"
                                        title={`${event.name} - ${event.location}`}
                                    >
                                        <div className="font-semibold truncate">{event.name}</div>
                                        <div className="text-[10px] opacity-80 mt-0.5">{event.time_start.slice(0, 5)} - {event.time_end.slice(0, 5)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{selectedEvent.name}</h3>
                                <p className="text-sm font-medium text-slate-600 mt-1">
                                    {new Date(selectedEvent.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center text-slate-700">
                                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>{selectedEvent.time_start.slice(0, 5)} - {selectedEvent.time_end.slice(0, 5)}</span>
                            </div>
                            <div className="flex items-center text-slate-700">
                                <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>{selectedEvent.location}</span>
                            </div>

                            {selectedEvent.description && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Deskripsi</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors focus:ring-4 focus:ring-slate-200"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

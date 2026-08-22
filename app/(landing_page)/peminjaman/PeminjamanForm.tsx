"use client";

import { useActionState, useEffect, useState } from "react";
import { Item, BorrowingState } from "@/app/types/borrowing";
import { createBorrowingAction } from "@/app/action/borrowing/action";

export default function PeminjamanForm({ availableItems }: { availableItems: Item[] }) {
    const [state, formAction, pending] = useActionState<BorrowingState, FormData>(createBorrowingAction, { success: false, error: "", fieldErrors: {} });
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [borrowDate, setBorrowDate] = useState("");
    const [today, setToday] = useState("");

    useEffect(() => {
        setToday(new Date().toISOString().split('T')[0]);
    }, []);

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const item = availableItems.find(i => i.id.toString() === e.target.value);
        setSelectedItem(item || null);
        setQuantity(1); // Reset quantity when item changes
    };

    if (state.success) {
        return (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-emerald-900">Permohonan Terkirim!</h3>
                <p className="text-sm text-emerald-700 max-w-md mx-auto">
                    Terima kasih, permohonan peminjaman Anda telah kami terima dan sedang menunggu persetujuan dari admin. Silakan cek secara berkala atau hubungi contact person kami.
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-6 rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                    Ajukan Peminjaman Lain
                </button>
            </div>
        );
    }

    return (
        <form action={formAction} className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold tracking-tight text-gray-900">Formulir Pengajuan</h3>
            
            {state.error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    <div className="flex gap-2">
                        <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                        <p>{state.error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Pilih Barang <span className="text-red-500">*</span></label>
                    <select 
                        name="item_id" 
                        onChange={handleItemChange} 
                        defaultValue=""
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                    >
                        <option value="" disabled>-- Pilih barang yang tersedia --</option>
                        {availableItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name} (Tersedia: {item.available})</option>
                        ))}
                    </select>
                    {state.fieldErrors.item_id?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.item_id[0]}</p>}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Jumlah Pinjam <span className="text-red-500">*</span></label>
                    <input 
                        name="quantity" 
                        type="number" 
                        min="1" 
                        max={selectedItem?.available || 1}
                        value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                        disabled={!selectedItem}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed" 
                    />
                    {selectedItem && <p className="mt-1 text-xs text-gray-500">Maksimal: {selectedItem.available} unit</p>}
                    {state.fieldErrors.quantity?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.quantity[0]}</p>}
                </div>
                
                <div className="hidden sm:block"></div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Tanggal Ambil <span className="text-red-500">*</span></label>
                    <input 
                        name="borrow_date" 
                        type="date"
                        min={today}
                        value={borrowDate}
                        onChange={(e) => setBorrowDate(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                    {state.fieldErrors.borrow_date?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.borrow_date[0]}</p>}
                </div>
                
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Tanggal Kembali <span className="text-red-500">*</span></label>
                    <input 
                        name="return_date" 
                        type="date"
                        min={borrowDate || today}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                    {state.fieldErrors.return_date?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.return_date[0]}</p>}
                </div>

                <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Data Peminjam</h4>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input 
                        name="borrower_name" 
                        type="text" 
                        placeholder="Nama lengkap sesuai KTP/KTM"
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                    {state.fieldErrors.borrower_name?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.borrower_name[0]}</p>}
                </div>
                
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">NIM / NIP <span className="text-red-500">*</span></label>
                    <input 
                        name="borrower_nim" 
                        type="text" 
                        placeholder="Nomor Induk Mahasiswa/Pegawai"
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                    {state.fieldErrors.borrower_nim?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.borrower_nim[0]}</p>}
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Nomor HP/WhatsApp</label>
                    <input 
                        name="borrower_phone" 
                        type="text" 
                        placeholder="Contoh: 08123456789"
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Keperluan <span className="text-red-500">*</span></label>
                    <textarea 
                        name="purpose" 
                        rows={3} 
                        placeholder="Jelaskan secara singkat untuk kegiatan apa barang ini dipinjam..."
                        className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white focus:ring-1 focus:ring-black" 
                    />
                    {state.fieldErrors.purpose?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.purpose[0]}</p>}
                </div>
            </div>

            <div className="mt-8 pt-4">
                <button 
                    type="submit" 
                    disabled={pending}
                    className="w-full rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                    {pending ? (
                        <>
                            <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Mengirim...
                        </>
                    ) : "Kirim Permohonan"}
                </button>
            </div>
        </form>
    );
}

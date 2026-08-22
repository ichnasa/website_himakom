"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { Item, Borrowing, BorrowingStatus, ItemState } from "@/app/types/borrowing";
import {
    getItemsAction,
    createItemAction,
    updateItemAction,
    deleteItemAction,
    getBorrowingsAction,
    updateBorrowingStatusAction
} from "@/app/action/borrowing/action";

function Badge({ text, color }: { text: string; color: "blue" | "green" | "red" | "gray" | "yellow" }) {
    const cls = {
        blue: "bg-zinc-200 text-zinc-700",
        green: "bg-zinc-100 text-zinc-600",
        red: "bg-zinc-800 text-zinc-100",
        yellow: "bg-zinc-100 text-zinc-600",
        gray: "bg-zinc-100 text-zinc-500",
    }[color];
    return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cls}`}>{text}</span>;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' });
};

/* ------------------------------------------------------------------ */
/*  Modal: Buat / Edit Barang                                           */
/* ------------------------------------------------------------------ */
function ItemModal({ mode, initialData, onClose, onSuccess }: { mode: "create" | "edit", initialData?: Item, onClose: () => void, onSuccess: () => void }) {
    const action = mode === "create" ? createItemAction : updateItemAction;
    const [state, formAction, pending] = useActionState<ItemState, FormData>(action, { success: false, error: "", fieldErrors: {} });

    useEffect(() => { if (state.success) onSuccess(); }, [state.success]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-base font-semibold">{mode === "create" ? "Tambah Barang" : "Edit Barang"}</h2>
                    <button onClick={onClose} className="rounded-full p-1 hover:bg-[#f9f9f8]"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
                </div>

                {state.error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">{state.error}</div>}

                <form action={formAction} className="space-y-4">
                    {mode === "edit" && <input type="hidden" name="id" value={initialData?.id} />}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Nama Barang <span className="text-red-500">*</span></label>
                        <input name="name" defaultValue={initialData?.name} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" />
                        {state.fieldErrors.name?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Kategori</label>
                        <input name="category" defaultValue={initialData?.category ?? ""} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Total Jumlah (Stok Fisik) <span className="text-red-500">*</span></label>
                        <input name="quantity" type="number" min="1" defaultValue={initialData?.quantity ?? 1} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" />
                        {mode === "edit" && <p className="mt-1 text-[10px] text-zinc-500">Stok tersedia saat ini akan disesuaikan otomatis jika barang sedang dipinjam.</p>}
                        {state.fieldErrors.quantity?.[0] && <p className="mt-1 text-xs text-red-500">{state.fieldErrors.quantity[0]}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Deskripsi Singkat</label>
                        <textarea name="description" rows={2} defaultValue={initialData?.description ?? ""} className="w-full resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Batal</button>
                        <button type="submit" disabled={pending} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50">
                            {pending ? "Menyimpan…" : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Modal: Status Peminjaman (Approve/Reject)                           */
/* ------------------------------------------------------------------ */
function StatusModal({ borrowing, onClose, onSuccess }: { borrowing: Borrowing, onClose: () => void, onSuccess: () => void }) {
    const [status, setStatus] = useState<BorrowingStatus>(borrowing.status);
    const [note, setNote] = useState(borrowing.note ?? "");
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState("");

    const handleSubmit = () => {
        startTransition(async () => {
            const res = await updateBorrowingStatusAction(borrowing.id, status, note);
            if (res.success) onSuccess();
            else setError(res.error || "Gagal mengupdate");
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl">
                <h2 className="text-base font-semibold mb-4">Ubah Status Peminjaman</h2>
                {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
                
                <div className="mb-4 bg-zinc-50 p-3 rounded-md border border-zinc-200 text-sm">
                    <p><span className="font-semibold">Peminjam:</span> {borrowing.borrower_name}</p>
                    <p><span className="font-semibold">Barang:</span> {borrowing.item_name} ({borrowing.quantity} unit)</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Status Baru</label>
                        <select value={status} onChange={e => setStatus(e.target.value as BorrowingStatus)} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900">
                            <option value="menunggu">Menunggu</option>
                            <option value="disetujui">Setujui (Dipinjam)</option>
                            <option value="ditolak">Tolak</option>
                            <option value="dikembalikan">Dikembalikan (Selesai)</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold">Catatan Admin (Opsional)</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Misal: Alasan ditolak, atau kondisi barang saat dikembalikan..." className="w-full resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-6">
                    <button onClick={onClose} className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">Batal</button>
                    <button onClick={handleSubmit} disabled={pending} className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50">
                        {pending ? "Menyimpan…" : "Simpan Status"}
                    </button>
                </div>
            </div>
        </div>
    );
}


/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */
export default function PeminjamanBarangAdmin() {
    const [activeTab, setActiveTab] = useState<"items" | "borrowings">("borrowings");
    
    // Items state
    const [items, setItems] = useState<Item[]>([]);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Item | undefined>(undefined);
    
    // Borrowings state
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [statusFilter, setStatusFilter] = useState<BorrowingStatus | "all">("all");
    const [manageBorrowing, setManageBorrowing] = useState<Borrowing | undefined>(undefined);
    
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const loadData = async () => {
        setLoading(true);
        if (activeTab === "items") {
            const data = await getItemsAction();
            setItems(data);
        } else {
            const data = await getBorrowingsAction(statusFilter);
            setBorrowings(data);
        }
        setLoading(false);
    };

    useEffect(() => { loadData(); }, [activeTab, statusFilter]);

    const handleDeleteItem = (id: number) => {
        if (!confirm("Hapus barang ini? Data transaksi peminjamannya juga akan ikut terhapus.")) return;
        startTransition(async () => {
            await deleteItemAction(id);
            loadData();
        });
    };

    return (
        <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8 font-sans">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Peminjaman Barang</h1>
                    <p className="mt-1 text-sm text-zinc-500">Kelola inventaris barang dan persetujuan peminjaman.</p>
                </div>
                {activeTab === "items" && (
                    <button onClick={() => { setEditItem(undefined); setIsItemModalOpen(true); }} className="flex items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        Tambah Barang
                    </button>
                )}
            </div>

            <div className="mb-6 flex border-b border-black/10">
                <button onClick={() => setActiveTab("borrowings")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "borrowings" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-800"}`}>
                    Daftar Peminjaman
                </button>
                <button onClick={() => setActiveTab("items")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === "items" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-800"}`}>
                    Katalog Barang
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse flex gap-4 p-4"><div className="h-20 w-full bg-zinc-100 rounded-xl"></div></div>
            ) : activeTab === "items" ? (
                // TAB 1: ITEMS
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.length === 0 && <p className="col-span-full py-10 text-center text-sm text-zinc-400">Katalog barang kosong.</p>}
                    {items.map(item => (
                        <div key={item.id} className="flex flex-col rounded-xl border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="mb-3 flex items-start justify-between">
                                <Badge text={item.category || "Umum"} color="gray" />
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditItem(item); setIsItemModalOpen(true); }} className="text-zinc-400 hover:text-zinc-900 p-1"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                    <button onClick={() => handleDeleteItem(item.id)} disabled={isPending} className="text-zinc-400 hover:text-red-500 p-1 disabled:opacity-50"><svg width="14" height="14" fill="none" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                                </div>
                            </div>
                            <h3 className="font-semibold leading-tight text-zinc-900 mb-1">{item.name}</h3>
                            <p className="text-xs text-zinc-500 mb-4 line-clamp-2 flex-1">{item.description}</p>
                            
                            <div className="mt-auto border-t border-zinc-100 pt-3 flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Tersedia:</span>
                                <span className={`font-semibold ${item.available > 0 ? 'text-zinc-900' : 'text-red-500'}`}>
                                    {item.available} <span className="text-zinc-400 font-normal">/ {item.quantity}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // TAB 2: BORROWINGS
                <div className="rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm">
                    <div className="border-b border-zinc-100 p-4 flex items-center justify-between bg-zinc-50">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="rounded-md border-zinc-200 text-sm bg-white py-1.5 px-3 border outline-none focus:border-zinc-900"
                        >
                            <option value="all">Semua Status</option>
                            <option value="menunggu">Menunggu Persetujuan</option>
                            <option value="disetujui">Sedang Dipinjam</option>
                            <option value="dikembalikan">Telah Dikembalikan</option>
                            <option value="ditolak">Ditolak</option>
                        </select>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-600">
                            <thead className="bg-zinc-50 text-xs uppercase text-zinc-500 border-b border-zinc-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Peminjam</th>
                                    <th className="px-6 py-3 font-medium">Barang</th>
                                    <th className="px-6 py-3 font-medium">Jadwal</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {borrowings.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-zinc-400">Belum ada data peminjaman.</td></tr>
                                )}
                                {borrowings.map(b => (
                                    <tr key={b.id} className="hover:bg-zinc-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-zinc-900">{b.borrower_name}</p>
                                            <p className="text-xs text-zinc-500">{b.borrower_nim} • {b.borrower_phone || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-zinc-900">{b.item_name}</p>
                                            <p className="text-xs text-zinc-500">{b.quantity} unit • {b.purpose}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-zinc-900">{formatDate(b.borrow_date)}</p>
                                            <p className="text-xs text-zinc-500">s/d {formatDate(b.return_date)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                text={b.status} 
                                                color={b.status === 'menunggu' ? 'yellow' : b.status === 'disetujui' ? 'blue' : b.status === 'dikembalikan' ? 'green' : 'red'} 
                                            />
                                            {b.note && <p className="mt-1 text-[10px] text-zinc-400 line-clamp-1" title={b.note}>"{b.note}"</p>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setManageBorrowing(b)}
                                                className="inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                                            >
                                                Ubah Status
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isItemModalOpen && (
                <ItemModal 
                    mode={editItem ? "edit" : "create"} 
                    initialData={editItem} 
                    onClose={() => setIsItemModalOpen(false)} 
                    onSuccess={() => { setIsItemModalOpen(false); loadData(); }} 
                />
            )}
            
            {manageBorrowing && (
                <StatusModal 
                    borrowing={manageBorrowing}
                    onClose={() => setManageBorrowing(undefined)}
                    onSuccess={() => { setManageBorrowing(undefined); loadData(); }}
                />
            )}
        </main>
    );
}
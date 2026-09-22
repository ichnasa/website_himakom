import { getItemsAction } from "@/app/action/borrowing/action";
import PeminjamanForm from "./PeminjamanForm";
import ItemImage from "@/app/components/ItemImage";

export default async function PeminjamanPage() {
    // Get all items to display in catalog
    const allItems = await getItemsAction();
    // Filter items with available stock > 0 for the form
    const availableItems = allItems.filter(item => item.available > 0);

    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* HERO SECTION */}
            <section className="bg-black pt-32 pb-16 px-6 relative overflow-hidden" aria-label="Header Peminjaman Barang">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center gap-6">

                    <h1 className="text-[clamp(32px,8vw,56px)] font-bold leading-tight tracking-tight text-white m-0 max-w-4xl">
                        Peminjaman Barang & Inventaris HIMAKOM
                    </h1>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* LEFT: KATALOG BARANG */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Katalog Inventaris</h2>
                        <p className="text-gray-500 text-sm">Daftar barang yang dapat dipinjam. Stok akan diperbarui secara real-time.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {allItems.length === 0 ? (
                            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
                                <p className="text-gray-500 font-medium">Belum ada barang yang tersedia.</p>
                            </div>
                        ) : (
                            allItems.map(item => (
                                <div key={item.id} className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    {/* Photo Banner with Badges */}
                                    <div className="relative h-44 w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                                        <ItemImage
                                            src={item.image_url}
                                            alt={item.name}
                                            containerClassName="h-full w-full"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-xs border border-gray-200/80 uppercase tracking-wider">
                                                {item.category || "Umum"}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            {item.available > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-xs border border-emerald-200/80">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    Tersedia
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-red-700 shadow-xs border border-red-200/80">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                    Dipinjam
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1.5 text-base group-hover:text-black transition-colors line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mb-5 line-clamp-2 flex-1">{item.description || "Tidak ada deskripsi."}</p>

                                        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                                            <span className="text-gray-500 text-xs font-medium">Sisa Stok</span>
                                            <span className={`font-bold ${item.available > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                                                {item.available} <span className="text-gray-400 font-normal text-xs">/ {item.quantity} unit</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div id="form-peminjaman" className="lg:col-span-5 sticky top-24">
                    <PeminjamanForm availableItems={availableItems} />
                </div>
            </div>
        </main>
    );
}

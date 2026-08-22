"use client";

import { getModulesAction, toggleModuleAction } from "@/app/action/sidebar/action";
import { getCurrentUser } from "@/app/action/pengguna/action";
import { ModuleItem } from "@/app/types/navigation";
import { useEffect, useState } from "react";
import { User } from "@/app/types/pengguna";

export default function Pengaturan() {
    const [modules, setModules] = useState<ModuleItem[]>([]);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);

    const toggleModule = async (id: number, value: number) => {
        const result = await toggleModuleAction(id, value);

        if (!result.success || !result.updated) {
            return;
        }

        const updatedModules = modules.map((module) =>
            module.id === result.updated.id
                ? { ...module, is_active: result.updated.is_active }
                : module
        );

        setModules(updatedModules);
        window.dispatchEvent(new Event("modules:updated"));
    }

    useEffect(() => {
        async function loadData() {
            const data = await getModulesAction();
            setModules(data);
            
            const user = await getCurrentUser();
            setCurrentUser(user as Partial<User> | null);
        }

        loadData();
    }, [])

    return (
        <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Pengaturan</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Kelola fitur mana yang aktif atau nonaktif dari satu kartu kontrol.
                </p>
            </div>
            {currentUser?.role === 'super_admin' ? (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-slate-900">Toggle Fitur</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Klik switch untuk mengaktifkan atau menonaktifkan modul.
                        </p>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {modules.map((module) => (
                            (module.name != 'pengaturan' &&
                                <div key={module.id} className="flex items-center justify-between gap-4 px-6 py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{module.label}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => toggleModule(module.id, module.is_active ? 0 : 1)}
                                        className={`relative inline-flex h-9 w-16 items-center rounded-full border transition-colors duration-200 ${module.is_active
                                            ? "border-emerald-500 bg-emerald-500"
                                            : "border-slate-300 bg-slate-300"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${module.is_active ? "translate-x-8" : "translate-x-1"
                                                }`}
                                        />
                                        <span className="sr-only">
                                            {module.is_active ? `Nonaktifkan ${module.label}` : `Aktifkan ${module.label}`}
                                        </span>
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-start gap-3">
                        <svg className="h-6 w-6 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-medium text-amber-800">Akses Dibatasi</h3>
                            <p className="mt-1 text-sm text-amber-700">
                                Anda tidak memiliki akses untuk mengubah konfigurasi fitur. Fitur ini hanya tersedia untuk pengguna dengan peran Super Admin.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
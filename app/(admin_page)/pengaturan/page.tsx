"use client";

import { getModulesAction, toggleModuleAction } from "@/app/action/sidebar/action";
import { ModuleItem } from "@/app/types/navigation";
import { useEffect, useState } from "react";

export default function Pengaturan() {
    const [modules, setModules] = useState<ModuleItem[]>([]);

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
        async function loadModules() {
            const data = await getModulesAction();
            setModules(data);
        }

        loadModules();
    }, [])

    return (
        <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Pengaturan</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Kelola fitur mana yang aktif atau nonaktif dari satu kartu kontrol.
                </p>
            </div>
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
        </section>
    );
}
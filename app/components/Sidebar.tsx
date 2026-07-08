"use client"

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { getModulesAction } from "../action/sidebar/action";
import { ModuleItem } from "../types/navigation";
import { getCurrentUser } from "../action/pengguna/action";
import { logoutAction } from "../action/login/action";


export default function Sidebar() {
    const [currentNav, setCurrentNav] = useState<number | null>(null);
    const [sidebarNavigationItems, setSidebarNavigationItems] = useState<ModuleItem[]>([]);
    const [pending, startTransition] = useTransition();

    const loadSidebarNavigationItems = async () => {
        const data = await getModulesAction();
        const user = await getCurrentUser();

        setSidebarNavigationItems(
            user?.role !== "admin"
                ? data.filter((module) => module.name !== "pengaturan")
                : data
        )
    };

    useEffect(() => {
        loadSidebarNavigationItems();

        const handleModulesUpdated = () => {
            loadSidebarNavigationItems();
        };

        window.addEventListener("modules:updated", handleModulesUpdated);

        return () => {
            window.removeEventListener("modules:updated", handleModulesUpdated);
        };
    }, []);

    return (
        <aside id="default-sidebar" className=" w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 border-r border-gray-200">
                <ul className="space-y-2 font-medium">
                    {sidebarNavigationItems.map(({ id, label, href, is_active }) => (
                        (is_active === 1 &&
                            <li key={id}>
                                <Link onClick={() => setCurrentNav(id)} href={href} className={`${currentNav === id ? 'bg-gray-200' : ''} flex items-center px-2 py-1.5 text-gray-700 rounded-none hover:bg-gray-200 hover:text-black group transition-colors`}>
                                    <span className="ms-3">{label}</span>
                                </Link>
                            </li>
                        )
                    ))}
                </ul>
                <li>
                    <div onClick={() => startTransition(() => logoutAction())} className={`flex items-center px-2 py-1.5 text-gray-700 rounded-none hover:bg-gray-200 hover:text-black group transition-colors`}>
                        <button type="submit" className="ms-3">Log out</button>
                    </div>
                </li>
            </div>
        </aside>
    );
}
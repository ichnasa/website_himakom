"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSidebarNavigationItemsAction } from "../sidebar/action";
import { NavigationItem } from "../types/navigation";


export default function Sidebar() {
    const [currentNav, setCurrentNav] = useState<string>("dashboard");
    const [sidebarNavigationItems, setSidebarNavigationItems] = useState<NavigationItem[]>([]);

    useEffect(() => {
        async function getSiderbarNavigationItems() {
            const data= await getSidebarNavigationItemsAction();
            setSidebarNavigationItems(data);
        }

        getSiderbarNavigationItems();
    }, []);

    return (
        <aside id="default-sidebar" className=" w-64 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 border-r border-gray-200">
                <ul className="space-y-2 font-medium">
                    {sidebarNavigationItems.map(({ id, label, href }) => (
                        <li key={id}>
                            <Link onClick={() => setCurrentNav(id)} href={href} className={`${currentNav === id ? 'bg-gray-200' : ''} flex items-center px-2 py-1.5 text-gray-700 rounded-none hover:bg-gray-200 hover:text-black group transition-colors`}>
                                <span className="ms-3">{label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
import '../globals.css'
import Sidebar from "../components/Sidebar";


export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-row antialiased">
            <Sidebar />
            <main className="min-h-screen w-full px-6 py-4">
                {children}
            </main>
        </div>
    );
}

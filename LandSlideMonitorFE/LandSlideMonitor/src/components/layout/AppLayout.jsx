import { useState } from "react";
import { Outlet } from "react-router-dom";
import Button from "../ui/Button";
import Sidebar from "./Sidebar";

export default function AppLayout({ user, onLogout }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary"
            >
                Bỏ qua điều hướng
            </a>
            <Sidebar
                user={user}
                onLogout={onLogout}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/90 px-4 backdrop-blur lg:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Mở điều hướng"
                    onClick={() => setSidebarOpen(true)}
                >
                    <span className="material-symbols-outlined" aria-hidden="true">
                        menu
                    </span>
                </Button>
                <div className="min-w-0 text-right">
                    <p className="truncate text-sm font-bold text-on-surface">
                        Giám sát sạt lở
                    </p>
                    <p className="text-xs text-on-surface-variant">
                        {user?.username}
                    </p>
                </div>
            </header>
            <main id="main-content" className="min-h-screen lg:pl-72">
                <Outlet />
            </main>
        </div>
    );
}

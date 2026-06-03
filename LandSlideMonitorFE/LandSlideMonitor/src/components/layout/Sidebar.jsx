import { useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
    { path: "/map", label: "Bản đồ", icon: "map" },
    { path: "/alerts", label: "Cảnh báo", icon: "warning" },
    { path: "/devices", label: "Thiết bị", icon: "devices" },
    { path: "/users", label: "Người dùng", icon: "group", adminOnly: true },
    { path: "/thresholds", label: "Cấu hình", icon: "tune" },
];

export default function Sidebar({ onLogout, user, isOpen = false, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await onLogout?.();
        navigate("/login");
    };

    const handleNavigate = (path) => {
        navigate(path);
        onClose?.();
    };

    const sidebar = (
        <aside
            className="flex h-full w-72 flex-col border-r border-outline-variant/30 bg-surface-container-lowest text-sm shadow-sm"
            aria-label="Điều hướng chính"
        >
            <div className="flex flex-1 flex-col px-5 py-6">
                <div className="mb-8 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => handleNavigate("/devices")}
                        className="min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                        <p className="truncate font-headline text-lg font-extrabold tracking-tight text-primary">
                            Giám sát sạt lở
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
                            Digital Geologist
                        </p>
                    </button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onClose}
                        aria-label="Đóng điều hướng"
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                        >
                            close
                        </span>
                    </Button>
                </div>

                <nav className="flex-1 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        if (item.adminOnly && user?.role !== "Admin") return null;
                        const isActive = location.pathname.startsWith(
                            item.path,
                        );

                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => handleNavigate(item.path)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                                    isActive
                                        ? "bg-primary-container/25 font-bold text-primary"
                                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                                )}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    aria-hidden="true"
                                >
                                    {item.icon}
                                </span>
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-6 border-t border-outline-variant/25 pt-5">
                    {user && (
                        <div className="mb-4 flex min-w-0 items-center gap-3 rounded-lg bg-surface-container-low px-3 py-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container">
                                <span className="text-sm font-bold text-on-primary-container">
                                    {user.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-on-surface">
                                    {user.username}
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-on-surface-variant transition hover:bg-error-container/35 hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/25"
                    >
                        <span
                            className="material-symbols-outlined text-[20px]"
                            aria-hidden="true"
                        >
                            logout
                        </span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </aside>
    );

    return (
        <>
            <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
                {sidebar}
            </div>
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-on-surface/45"
                        aria-label="Đóng điều hướng"
                        onClick={onClose}
                    />
                    <div className="relative h-full">{sidebar}</div>
                </div>
            )}
        </>
    );
}

import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/authService";

// Sidebar — thanh điều hướng bên trái
export default function Sidebar({ onLogout, user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const NAV_ITEMS = [
        { path: "/monitoring", label: "Giám sát", icon: "monitoring" },
        { path: "/map", label: "Bản đồ", icon: "map" },
        { path: "/alerts", label: "Cảnh báo", icon: "warning" },
        { path: "/history", label: "Lịch sử", icon: "history" },
        { path: "/devices", label: "Thiết bị", icon: "devices" },
        { path: "/users", label: "Người dùng", icon: "group" },
    ];

    const handleLogout = async () => {
        await logout();
        onLogout();
        navigate("/login");
    };

    return (
        <aside className="flex flex-col fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 text-sm font-medium tracking-tight border-r border-outline-variant/30">
            <div className="px-6 py-8 flex flex-col flex-grow">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div>
                        <h1 className="font-headline font-extrabold text-blue-600 tracking-tighter text-lg leading-none">
                            Giám sát sạt lở
                        </h1>
                        <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">
                            Digital Geologist
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-grow">
                    {NAV_ITEMS.map((item) => {
                        if (item.path === "/users" && user?.role !== "Admin") {
                            return null;
                        }

                        const isActive = location.pathname.startsWith(
                            item.path,
                        );

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors rounded-xl text-left ${
                                    isActive
                                        ? "text-blue-700 dark:text-blue-300 font-bold bg-slate-200/50"
                                        : "text-slate-500 hover:bg-slate-200/50"
                                }`}
                            >
                                <span className="material-symbols-outlined">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="mt-auto pt-6 border-t border-outline-variant/20">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
                                <span className="font-bold text-on-primary-container">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-on-surface text-sm">
                                    {user.username}
                                </p>
                                <p className="text-xs text-on-surface-variant">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors rounded-xl text-left text-slate-500 hover:bg-red-100/50 hover:text-red-600"
                    >
                        <span className="material-symbols-outlined">
                            logout
                        </span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

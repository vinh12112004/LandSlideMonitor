import { useNavigate, useLocation } from "react-router-dom";

// Sidebar — thanh điều hướng bên trái
export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const NAV_ITEMS = [
        { path: "/monitoring", label: "Monitoring", icon: "monitoring" },
        { path: "/map", label: "Map", icon: "map" },
        { path: "/alerts", label: "Alerts", icon: "warning" },
        { path: "/history", label: "History", icon: "history" },
        { path: "/devices", label: "Devices", icon: "devices" },
    ];

    return (
        <aside className="flex flex-col fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 text-sm font-medium tracking-tight border-r border-outline-variant/30">
            <div className="px-6 py-8">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div>
                        <h1 className="font-headline font-extrabold text-blue-600 tracking-tighter text-lg leading-none">
                            Landslide Monitoring
                        </h1>
                        <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mt-1">
                            Digital Geologist
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors rounded-xl text-left ${
                                    isActive
                                        ? "text-blue-700 dark:text-blue-300 font-bold border-r-2 border-blue-600 bg-slate-200/50 rounded-l-xl"
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
            </div>
        </aside>
    );
}

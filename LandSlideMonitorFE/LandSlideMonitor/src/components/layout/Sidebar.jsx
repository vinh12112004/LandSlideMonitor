import { NAV_ITEMS } from "../../data/devices";

// Sidebar — thanh điều hướng bên trái
export default function Sidebar({ activePath, onNavigate }) {
    return (
        <aside className="flex flex-col h-full fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-slate-900 text-sm font-medium tracking-tight">
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
                        const isActive = activePath === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => onNavigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors rounded-xl group text-left ${
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

            {/* Footer */}
            {/* <div className="mt-auto p-6 space-y-4">
                <button className="w-full py-3 bg-white dark:bg-slate-800 text-on-surface border-outline-variant/20 border rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all text-xs">
                    Export Report
                </button>
                <div className="flex items-center gap-3 px-2">
                    <img
                        alt="User profile"
                        className="w-8 h-8 rounded-full border border-outline-variant/30 object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAC4YXN-r05TyRPxfuYNJQZOCnHMt1C9Hd4CsdAxsE1xkGUYh1UVRL478AUmbrAC_8L0zsuACAG1pe5TKLvVmyRsHc6ZrCiLCVxkcPwVd1izhk7P_DRrIuka3FaDG9iY5cjmnERXGNBoC_xQdISHBSw2jkwnur7cPp4_1S8pmvVqYRDjuxadK6u7nJYQSk22INhSW_t3A8Qwu6ZXJNkDer1z8wWQr0eHQk5jBIqBRrMpL6xt8vr0P0p_cZzdce3AESnD75AQhP1myFk"
                    />
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate">
                            Marcus Chen
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate">
                            Chief Surveyor
                        </p>
                    </div>
                </div>
            </div> */}
        </aside>
    );
}

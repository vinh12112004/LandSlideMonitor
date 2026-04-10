// Header — thanh điều hướng phía trên
export default function Header({ searchQuery, onSearch, placeholder }) {
    return (
        <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 w-full ml-64 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm shadow-blue-900/5 border-b border-outline-variant/30">
            <div className="flex items-center gap-6">
                {/* <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    TerrainWatch
                </span> */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                        search
                    </span>
                    <input
                        className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-80 focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder={placeholder || "Search..."}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-on-surface-variant hover:text-blue-500 transition-colors active:scale-95 duration-150">
                    <span className="material-symbols-outlined">
                        notifications
                    </span>
                </button>
                <button className="p-2 text-on-surface-variant hover:text-blue-500 transition-colors active:scale-95 duration-150">
                    <span className="material-symbols-outlined">
                        account_circle
                    </span>
                </button>
            </div>
        </header>
    );
}

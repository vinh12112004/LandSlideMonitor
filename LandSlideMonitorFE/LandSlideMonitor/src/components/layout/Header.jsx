// Header — thanh điều hướng phía trên
export default function Header({ searchQuery, onSearch, placeholder, user }) {
    return (
        <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 w-full ml-64 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm shadow-blue-900/5 border-b border-outline-variant/30">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                        search
                    </span>
                    <input
                        className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-80 focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder={placeholder || "Tìm kiếm..."}
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
                {user && (
                    <button className="flex items-center gap-2 p-2 text-on-surface-variant">
                        <span className="text-sm font-medium">
                            {user.username}
                        </span>
                        <span className="material-symbols-outlined">
                            arrow_drop_down
                        </span>
                    </button>
                )}
            </div>
        </header>
    );
}

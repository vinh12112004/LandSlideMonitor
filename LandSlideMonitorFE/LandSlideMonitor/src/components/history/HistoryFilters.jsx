// HistoryFilters — filter date range, export CSV
export default function HistoryFilters({ filters, onFilterChange }) {
    return (
        <div className="bg-surface-container-low rounded-2xl p-4 flex flex-wrap items-center gap-4">
            <div className="flex flex-1 items-center gap-3">
                {/* Date range */}
                <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/15">
                    <span className="material-symbols-outlined text-outline text-sm">
                        calendar_today
                    </span>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) =>
                            onFilterChange("dateFrom", e.target.value)
                        }
                        className="border-none bg-transparent text-xs font-medium focus:ring-0 p-0"
                    />
                    <span className="text-outline text-xs">to</span>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) =>
                            onFilterChange("dateTo", e.target.value)
                        }
                        className="border-none bg-transparent text-xs font-medium focus:ring-0 p-0"
                    />
                </div>
            </div>

            {/* Action buttons */}
            {/* <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-on-surface bg-surface-container-lowest border border-outline-variant/15 rounded-xl hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-sm">
                        tune
                    </span>
                    Columns
                </button>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-on-primary bg-primary rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10"
                >
                    <span className="material-symbols-outlined text-sm">
                        download
                    </span>
                    Export CSV
                </button>
            </div> */}
        </div>
    );
}

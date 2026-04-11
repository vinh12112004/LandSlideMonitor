import { useState, useEffect } from "react";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryTable from "../components/history/HistoryTable";
import HistoryPagination from "../components/history/HistoryPagination";
import AnomalyHighlightCards from "../components/history/AnomalyHighlightCards";
import sensordataService from "../services/sensordataService";
import { getDefaultDates } from "../utils/time";
const PAGE_SIZE = 10;

export default function HistoryPage({ searchQuery }) {
    const [records, setRecords] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const defaultDates = getDefaultDates();

    const [filters, setFilters] = useState({
        dateFrom: defaultDates.from,
        dateTo: defaultDates.to,
        deviceId: "all",
    });

    useEffect(() => {
        fetchHistory();
    }, [currentPage, filters]);

    useEffect(() => {
        if (searchQuery && searchQuery.trim() !== "") {
            setFilters((prev) => ({
                ...prev,
                deviceId: searchQuery,
            }));
            setCurrentPage(1);
        } else {
            // nếu clear search → về all
            setFilters((prev) => ({
                ...prev,
                deviceId: "all",
            }));
        }
    }, [searchQuery]);
    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await sensordataService.getAll({
                ...filters,
                page: currentPage,
                limit: PAGE_SIZE,
            });
            setRecords(result.data);
            setTotal(result.totalCount);
        } catch (err) {
            setError("Không thể tải dữ liệu lịch sử. Vui lòng thử lại.");
            console.error("Fetch history error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleExport = () => {
        // TODO: gọi API export CSV hoặc generate CSV từ records hiện tại
        console.log("Export CSV", filters);
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    // ── Loading state ─────────────────────────────────────────────
    if (loading) {
        return (
            <main className="ml-64 p-8 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-primary animate-spin block mb-4">
                        progress_activity
                    </span>
                    <p className="text-on-surface-variant text-sm">
                        Đang tải dữ liệu lịch sử...
                    </p>
                </div>
            </main>
        );
    }

    // ── Error state ───────────────────────────────────────────────
    if (error) {
        return (
            <main className="ml-64 p-8 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-tertiary block mb-4">
                        error_outline
                    </span>
                    <p className="text-on-surface font-bold mb-2">
                        Có lỗi xảy ra
                    </p>
                    <p className="text-on-surface-variant text-sm mb-6">
                        {error}
                    </p>
                    <button
                        onClick={fetchHistory}
                        className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="ml-64 p-8 bg-surface min-h-[calc(100vh-64px)]">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                            Data History
                        </h1>
                        <p className="text-on-surface-variant max-w-2xl font-body">
                            Complete chronological telemetry log from the
                            landslide sensor network. Filter by date range or
                            specific device clusters to analyze earth movement
                            patterns.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <HistoryFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onExport={handleExport}
                />

                {/* Table + Pagination */}
                <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
                    <HistoryTable records={records} />
                    <HistoryPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        total={total}
                        pageSize={PAGE_SIZE}
                        onPageChange={setCurrentPage}
                    />
                </div>

                {/* Anomaly + Network Health */}
                {/* <AnomalyHighlightCards /> */}
            </div>
        </main>
    );
}

import { useState, useEffect } from "react";
import HistoryFilters from "../components/history/HistoryFilters";
import HistoryTable from "../components/history/HistoryTable";
import HistoryPagination from "../components/history/HistoryPagination";
// import AnomalyHighlightCards from "../components/history/AnomalyHighlightCards";
import sensordataService from "../services/sensordataService";
import { getDefaultDates } from "../utils/time";
import { getConnection } from "../services/signalr";

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

    // ── Fetch API ─────────────────────────────────────────────
    useEffect(() => {
        fetchHistory();
    }, [currentPage, filters]);

    // ── SignalR realtime ──────────────────────────────────────
    useEffect(() => {
        const connection = getConnection();
        if (!connection) return;

        const handler = (data) => {
            setRecords((prev) => {
                if (currentPage !== 1) return prev;

                if (
                    filters.deviceId !== "all" &&
                    data.deviceId !== filters.deviceId
                ) {
                    return prev;
                }

                const ts = new Date(data.timestamp);
                const from = new Date(filters.dateFrom);

                const to = new Date(filters.dateTo);
                to.setHours(23, 59, 59, 999);

                if (ts < from || ts > to) return prev;

                return [data, ...prev].slice(0, PAGE_SIZE);
            });

            setTotal((prev) => prev + 1);
            console.log("SignalR: ReceiveSensorData", data);
        };

        connection.on("ReceiveSensorData", handler);

        return () => {
            connection.off("ReceiveSensorData", handler);
        };
    }, [filters, currentPage]);

    // ── Sync search → filter ──────────────────────────────────
    useEffect(() => {
        if (searchQuery && searchQuery.trim() !== "") {
            setFilters((prev) => ({
                ...prev,
                deviceId: searchQuery,
            }));
            setCurrentPage(1);
        } else {
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleExport = () => {
        console.log("Export CSV", filters);
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);

    // ── Loading ───────────────────────────────────────────────
    if (loading) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
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

    // ── Error ────────────────────────────────────────────────
    if (error) {
        return (
            <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)] flex items-center justify-center">
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
        <main className="ml-64 p-10 bg-surface min-h-[calc(100vh-64px)]">
            {/* Header giống Devices */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
                        Data History
                    </h2>
                    <p className="text-on-surface-variant font-body">
                        Complete chronological telemetry log from the landslide
                        sensor network. Filter by date range or device to
                        analyze patterns.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <HistoryFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onExport={handleExport}
                />
            </div>

            {/* Table + Pagination (style giống card Devices) */}
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

            {/* Optional */}
            {/* <AnomalyHighlightCards /> */}
        </main>
    );
}

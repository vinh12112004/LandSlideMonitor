import { useEffect, useState, useCallback } from "react";
import sensordataService from "../services/sensordataService";
import DataStatusBadge from "../components/alerts/DataStatusBadge";
import AlertRow from "../components/alerts/AlertRow";

const LIMIT = 10;

// Thống kê nhanh ở đầu trang
function StatCard({ icon, label, value, colorClass, bgClass }) {
    return (
        <div
            className={`rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 px-5 py-4 flex items-center gap-4 shadow-sm`}
        >
            <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}
            >
                <span
                    className={`material-symbols-outlined ${colorClass}`}
                    style={{ fontSize: 22 }}
                >
                    {icon}
                </span>
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums leading-none">
                    {value ?? "—"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

// Thanh phân trang
function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-1 pt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                >
                    chevron_left
                </span>
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                        p === currentPage
                            ? "bg-blue-600 text-white shadow"
                            : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18 }}
                >
                    chevron_right
                </span>
            </button>
        </div>
    );
}

export default function AlertsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Bộ lọc
    const [deviceId, setDeviceId] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);

    // Bộ lọc tạm thời (chỉ áp dụng khi nhấn "Tìm kiếm")
    const [appliedFilters, setAppliedFilters] = useState({
        deviceId: "",
        dateFrom: "",
        dateTo: "",
        page: 1,
    });

    const fetchAlerts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await sensordataService.getAlerts({
                deviceId: appliedFilters.deviceId,
                dateFrom: appliedFilters.dateFrom,
                dateTo: appliedFilters.dateTo,
                page: appliedFilters.page,
                limit: LIMIT,
            });
            setData(result);
        } catch (err) {
            setError("Không thể tải dữ liệu cảnh báo. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, [appliedFilters]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    const handleSearch = () => {
        setAppliedFilters({ deviceId, dateFrom, dateTo, page: 1 });
        setPage(1);
    };

    const handleReset = () => {
        setDeviceId("");
        setDateFrom("");
        setDateTo("");
        setPage(1);
        setAppliedFilters({ deviceId: "", dateFrom: "", dateTo: "", page: 1 });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setAppliedFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    // Đếm theo status
    const warningCount = data?.data?.filter((d) => d.status === 1).length ?? 0;
    const alertCount = data?.data?.filter((d) => d.status === 2).length ?? 0;

    return (
        <main className="ml-64 p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
            {/* Header */}
            <div className="mb-7">
                <div className="flex items-center gap-3 mb-1">
                    <span
                        className="material-symbols-outlined text-red-500"
                        style={{ fontSize: 28 }}
                    >
                        crisis_alert
                    </span>
                    <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                        Cảnh báo
                    </h1>
                </div>
                <p className="text-sm text-slate-400 ml-10">
                    Danh sách các bản ghi dữ liệu cảm biến vượt ngưỡng an toàn.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
                <StatCard
                    icon="list_alt"
                    label="Tổng bản ghi"
                    value={data?.totalCount}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50 dark:bg-blue-900/30"
                />
                <StatCard
                    icon="warning"
                    label="Cảnh báo (trang này)"
                    value={warningCount}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50 dark:bg-amber-900/30"
                />
                <StatCard
                    icon="crisis_alert"
                    label="Báo động (trang này)"
                    value={alertCount}
                    colorClass="text-red-600"
                    bgClass="bg-red-50 dark:bg-red-900/30"
                />
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 px-5 py-4 mb-5 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Bộ lọc
                </p>
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500 font-medium">
                            Thiết bị
                        </label>
                        <input
                            type="text"
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="VD: ESP32_HN_01"
                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 placeholder-slate-300"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500 font-medium">
                            Từ ngày
                        </label>
                        <input
                            type="datetime-local"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-slate-500 font-medium">
                            Đến ngày
                        </label>
                        <input
                            type="datetime-local"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 16 }}
                        >
                            search
                        </span>
                        Tìm kiếm
                    </button>
                    {(appliedFilters.deviceId ||
                        appliedFilters.dateFrom ||
                        appliedFilters.dateTo) && (
                        <button
                            onClick={handleReset}
                            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium flex items-center gap-1.5 transition-colors"
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ fontSize: 15 }}
                            >
                                close
                            </span>
                            Xoá lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20 gap-3">
                        <span
                            className="material-symbols-outlined text-blue-400 animate-spin"
                            style={{ fontSize: 28 }}
                        >
                            progress_activity
                        </span>
                        <span className="text-sm text-slate-400">
                            Đang tải dữ liệu...
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <span className="material-symbols-outlined text-red-400 text-5xl">
                            error_outline
                        </span>
                        <p className="text-sm text-slate-500">{error}</p>
                        <button
                            onClick={fetchAlerts}
                            className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-600 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : !data?.data?.length ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <span className="material-symbols-outlined text-slate-300 text-6xl">
                            check_circle
                        </span>
                        <p className="text-sm text-slate-400 font-medium">
                            Không có cảnh báo nào trong khoảng thời gian này.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-12">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Thiết bị
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Thời gian
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Lý do cảnh báo
                                        </th>
                                        <th className="px-4 py-3 w-10" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((alert, idx) => (
                                        <AlertRow
                                            key={alert.id}
                                            alert={alert}
                                            index={
                                                (appliedFilters.page - 1) *
                                                    LIMIT +
                                                idx +
                                                1
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer: total + pagination */}
                        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                            <p className="text-xs text-slate-400">
                                Tổng{" "}
                                <span className="font-semibold text-slate-600 dark:text-slate-300">
                                    {data.totalCount}
                                </span>{" "}
                                bản ghi — Trang{" "}
                                <span className="font-semibold text-slate-600 dark:text-slate-300">
                                    {data.currentPage}
                                </span>{" "}
                                / {data.totalPages}
                            </p>
                            <Pagination
                                currentPage={data.currentPage}
                                totalPages={data.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

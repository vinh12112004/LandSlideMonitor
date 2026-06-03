import { useMemo, useState } from "react";
import JsonViewer from "./JsonViewer";
import { DATA_STATUS_CONFIG } from "../../constants/sensorConfig";
import Pagination from "../common/Pagination";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";

const FILTERS = [
    { value: "all", label: "Tất cả" },
    { value: "0", label: "Bình thường" },
    { value: "1", label: "Cảnh báo" },
    { value: "2", label: "Nguy hiểm" },
];

const HistoryList = ({
    history,
    formatTime,
    loading = false,
    page = 1,
    totalPages = 1,
    onPageChange,
    totalCount = 0,
    pageSize = 10,
}) => {
    const [historyFilter, setHistoryFilter] = useState("all");

    const filteredHistory = useMemo(() => {
        if (historyFilter === "all") return history;
        return history.filter(
            (record) => record.status === parseInt(historyFilter, 10),
        );
    }, [history, historyFilter]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center">
                <span className="text-sm font-semibold text-on-surface-variant">
                    Lọc:
                </span>
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setHistoryFilter(option.value)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                                historyFilter === option.value
                                    ? "bg-primary text-on-primary"
                                    : "border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-on-surface-variant sm:ml-auto">
                    {filteredHistory.length} bản ghi
                </span>
            </div>

            {loading ? (
                <LoadingState message="Đang tải lịch sử..." />
            ) : filteredHistory.length === 0 ? (
                <EmptyState
                    icon="search_off"
                    title="Không có bản ghi"
                    description="Không có bản ghi nào phù hợp với bộ lọc hiện tại."
                />
            ) : (
                <div className="space-y-3">
                    {filteredHistory.map((record) => {
                        const status =
                            DATA_STATUS_CONFIG[record.status] ||
                            DATA_STATUS_CONFIG[0];
                        return (
                            <article
                                key={record.id}
                                className="rounded-lg border border-l-4 border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm"
                                style={{ borderLeftColor: status.color }}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className="material-symbols-outlined mt-0.5 text-[22px]"
                                        style={{ color: status.color }}
                                        aria-hidden="true"
                                    >
                                        {status.icon}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold text-on-surface">
                                                {formatTime(record.timestamp)}
                                            </span>
                                            <span
                                                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                                                style={{
                                                    background: status.bg,
                                                    color: status.text,
                                                }}
                                            >
                                                {status.label}
                                            </span>
                                            <span className="text-xs text-on-surface-variant">
                                                ID: {record.id}
                                            </span>
                                        </div>
                                        <JsonViewer data={record.jsonData} />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                total={totalCount}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default HistoryList;

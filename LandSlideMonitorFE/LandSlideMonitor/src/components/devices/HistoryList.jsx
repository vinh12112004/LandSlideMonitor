import { useState } from "react";
import JsonViewer from "./JsonViewer";
import { DATA_STATUS_CONFIG } from "../../constants/sensorConfig";

const HistoryList = ({
    history,
    formatTime,
    loading = false,
    page = 1,
    totalPages = 1,
    onPageChange,
}) => {
    const [historyFilter, setHistoryFilter] = useState("all");

    const filteredHistory =
        historyFilter === "all"
            ? history
            : history.filter((h) => h.status === parseInt(historyFilter));

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                <span
                    style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Lọc:
                </span>
                {[
                    { value: "all", label: "Tất cả" },
                    { value: "0", label: "Bình thường" },
                    { value: "1", label: "Cảnh báo" },
                    { value: "2", label: "Nguy hiểm" },
                ].map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setHistoryFilter(opt.value)}
                        style={{
                            padding: "5px 14px",
                            borderRadius: 20,
                            fontSize: 13,
                            cursor: "pointer",
                            background:
                                historyFilter === opt.value
                                    ? "#185FA5"
                                    : "none",
                            color:
                                historyFilter === opt.value
                                    ? "#fff"
                                    : "var(--color-text-secondary)",
                            border:
                                historyFilter === opt.value
                                    ? "none"
                                    : "0.5px solid var(--color-border-tertiary)",
                            fontWeight: historyFilter === opt.value ? 500 : 400,
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
                <span
                    style={{
                        marginLeft: "auto",
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {filteredHistory.length} bản ghi
                </span>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                {loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "28px 0",
                            color: "var(--color-text-secondary)",
                        }}
                    >
                        Đang tải lịch sử...
                    </div>
                )}

                {!loading &&
                    filteredHistory.map((record) => {
                        const dCfg = DATA_STATUS_CONFIG[record.status];
                        return (
                            <div
                                key={record.id}
                                style={{
                                    background:
                                        "var(--color-background-primary)",
                                    border: "0.5px solid var(--color-border-tertiary)",
                                    borderRadius: 12,
                                    padding: "16px 20px",
                                    borderLeft: `3px solid ${dCfg.color}`,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontSize: 20,
                                            color: dCfg.color,
                                        }}
                                    >
                                        {dCfg.icon}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: 500,
                                                    fontSize: 14,
                                                    color: "var(--color-text-primary)",
                                                }}
                                            >
                                                {formatTime(record.timestamp)}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    padding: "2px 8px",
                                                    borderRadius: 12,
                                                    background: dCfg.bg,
                                                    color: dCfg.text,
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {dCfg.label}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--color-text-secondary)",
                                                }}
                                            >
                                                ID: {record.id}
                                            </span>
                                        </div>
                                        <JsonViewer data={record.jsonData} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                {!loading && filteredHistory.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "48px 0",
                            background: "var(--color-background-primary)",
                            borderRadius: 12,
                            border: "0.5px solid var(--color-border-tertiary)",
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontSize: 40,
                                color: "var(--color-text-secondary)",
                                display: "block",
                                marginBottom: 10,
                            }}
                        >
                            search_off
                        </span>
                        <p
                            style={{
                                color: "var(--color-text-secondary)",
                                margin: 0,
                            }}
                        >
                            Không có bản ghi nào
                        </p>
                    </div>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 16,
                }}
            >
                <button
                    onClick={() => onPageChange?.(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "0.5px solid var(--color-border-tertiary)",
                        background: "none",
                        cursor: page <= 1 ? "not-allowed" : "pointer",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Trước
                </button>
                <span
                    style={{
                        fontSize: 13,
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Trang {page} / {totalPages}
                </span>
                <button
                    onClick={() =>
                        onPageChange?.(Math.min(totalPages, page + 1))
                    }
                    disabled={page >= totalPages}
                    style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "0.5px solid var(--color-border-tertiary)",
                        background: "none",
                        cursor: page >= totalPages ? "not-allowed" : "pointer",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default HistoryList;

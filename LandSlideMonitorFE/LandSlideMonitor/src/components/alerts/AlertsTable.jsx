import { useMemo, useState } from "react";
import DataTable from "../ui/DataTable";
import DataStatusBadge from "./DataStatusBadge";
import { SENSOR_LABELS } from "../../constants/sensorConfig";
import { resolveDataStatus } from "../../utils/dataStatus";

function SensorDetailRow({ jsonData }) {
    const parsed = (() => {
        try {
            return JSON.parse(jsonData);
        } catch {
            return null;
        }
    })();

    if (!parsed) {
        return (
            <div className="bg-surface-container-low/55 px-6 py-4 text-sm text-on-surface-variant">
                Không thể đọc dữ liệu chi tiết.
            </div>
        );
    }

    return (
        <div className="bg-surface-container-low/55 px-6 py-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Dữ liệu cảm biến chi tiết
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {Object.entries(parsed).map(([key, value]) => {
                    const meta = SENSOR_LABELS[key];
                    return (
                        <div
                            key={key}
                            className="rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-3 py-2"
                        >
                            <div className="mb-1 flex items-center gap-1">
                                {meta && (
                                    <span
                                        className="material-symbols-outlined text-[13px] text-primary"
                                        aria-hidden="true"
                                    >
                                        {meta.icon}
                                    </span>
                                )}
                                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-on-surface-variant">
                                    {meta?.label ?? key}
                                </p>
                            </div>
                            <p className="text-sm font-bold tabular-nums text-on-surface">
                                {typeof value === "number"
                                    ? value % 1 !== 0
                                        ? value.toFixed(3)
                                        : value
                                    : String(value)}
                                {meta?.unit && (
                                    <span className="ml-0.5 text-xs font-normal text-on-surface-variant">
                                        {meta.unit}
                                    </span>
                                )}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function AlertsTable({ alerts, loading, indexOffset = 0 }) {
    const [expandedId, setExpandedId] = useState(null);

    const columns = useMemo(
        () => [
            {
                key: "_index",
                label: "#",
                className: "w-12 font-mono text-xs text-on-surface-variant",
                render: (_, _row, index) => indexOffset + index + 1,
            },
            {
                key: "deviceId",
                label: "Thiết bị",
                render: (value) => (
                    <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-on-surface">
                        <span
                            className="material-symbols-outlined text-[15px] text-primary"
                            aria-hidden="true"
                        >
                            memory
                        </span>
                        {value}
                    </span>
                ),
            },
            {
                key: "timestamp",
                label: "Thời gian",
                render: (value) => (
                    <span className="whitespace-nowrap text-sm text-on-surface-variant">
                        {new Date(value).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </span>
                ),
            },
            {
                key: "status",
                label: "Trạng thái",
                render: (value) => <DataStatusBadge status={value} />,
            },
            {
                key: "alertReason",
                label: "Lý do cảnh báo",
                render: (value) =>
                    value ? (
                        <span className="flex items-start gap-1.5 text-sm text-on-surface-variant">
                            <span
                                className="material-symbols-outlined mt-0.5 shrink-0 text-[15px] text-error"
                                aria-hidden="true"
                            >
                                error
                            </span>
                            {value}
                        </span>
                    ) : (
                        <span className="text-xs italic text-on-surface-variant/45">
                            —
                        </span>
                    ),
            },
            {
                key: "_expand",
                label: "",
                align: "right",
                render: (_, row) => (
                    <span
                        className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${
                            expandedId === row.id ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                    >
                        expand_more
                    </span>
                ),
            },
        ],
        [expandedId, indexOffset],
    );

    const rowClassName = (row) => {
        const status = resolveDataStatus(row.status);
        if (status === 2) return "bg-error/[.03] hover:bg-error/[.06]";
        if (status === 1) return "bg-amber-500/[.03] hover:bg-amber-500/[.06]";
        return "";
    };

    return (
        <DataTable
            columns={columns}
            data={alerts}
            rowKey="id"
            loading={loading}
            emptyIcon="check_circle"
            emptyTitle="Không có cảnh báo"
            emptyText="Không có cảnh báo nào trong khoảng thời gian này."
            rowClassName={rowClassName}
            onRowClick={(row) =>
                setExpandedId((current) => (current === row.id ? null : row.id))
            }
            isRowExpanded={(row) => expandedId === row.id}
            expandedRowRender={(row) => <SensorDetailRow jsonData={row.jsonData} />}
        />
    );
}

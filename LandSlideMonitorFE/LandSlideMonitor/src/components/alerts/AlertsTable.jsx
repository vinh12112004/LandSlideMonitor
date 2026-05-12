import { useState } from "react";
import DataTable from "../ui/DataTable";
import DataStatusBadge from "./DataStatusBadge";

const SENSOR_LABELS = {
    soil_m: { label: "Độ ẩm đất", unit: "%", icon: "water_drop" },
    vib: { label: "Rung động", unit: "g", icon: "vibration" },
    tilt: { label: "Độ nghiêng", unit: "°", icon: "screen_rotation" },
    alt: { label: "Độ cao", unit: "m", icon: "landscape" },
    satellites: { label: "Vệ tinh GPS", unit: "", icon: "satellite_alt" },
    t_disp: { label: "Dịch chuyển", unit: "mm", icon: "open_with" },
    lat: { label: "Vĩ độ", unit: "", icon: "my_location" },
    lon: { label: "Kinh độ", unit: "", icon: "my_location" },
    fix_type: { label: "GPS Fix", unit: "", icon: "gps_fixed" },
};

function SensorDetailRow({ jsonData }) {
    const parsed = (() => {
        try {
            return JSON.parse(jsonData);
        } catch {
            return null;
        }
    })();

    if (!parsed) return null;

    return (
        <div className="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/10">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                Dữ liệu cảm biến chi tiết
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {Object.entries(parsed).map(([key, value]) => {
                    const meta = SENSOR_LABELS[key];
                    return (
                        <div
                            key={key}
                            className="bg-surface-container-lowest rounded-xl px-3 py-2 border border-outline-variant/15"
                        >
                            <div className="flex items-center gap-1 mb-0.5">
                                {meta && (
                                    <span className="material-symbols-outlined text-primary text-[13px]">
                                        {meta.icon}
                                    </span>
                                )}
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium truncate">
                                    {meta?.label ?? key}
                                </p>
                            </div>
                            <p className="text-sm font-bold text-on-surface tabular-nums">
                                {typeof value === "number"
                                    ? value % 1 !== 0
                                        ? value.toFixed(3)
                                        : value
                                    : String(value)}
                                {meta?.unit && (
                                    <span className="text-xs font-normal text-on-surface-variant ml-0.5">
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

    const columns = [
        {
            key: "_index",
            label: "#",
            className: "w-12 font-mono text-xs text-on-surface-variant",
            render: (_, row, idx) => indexOffset + idx + 1,
        },
        {
            key: "deviceId",
            label: "Thiết bị",
            render: (value) => (
                <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[15px]">
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
                <span className="text-sm text-on-surface-variant whitespace-nowrap">
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
                        <span className="material-symbols-outlined text-tertiary text-[15px] mt-0.5 shrink-0">
                            error
                        </span>
                        {value}
                    </span>
                ) : (
                    <span className="text-on-surface-variant/40 italic text-xs">
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
                    className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 text-[18px] ${
                        expandedId === row.id ? "rotate-180" : ""
                    }`}
                >
                    expand_more
                </span>
            ),
        },
    ];

    // Màu nền hàng theo status
    const rowClassName = (row) => {
        if (row.status === 2)
            return "bg-tertiary/[.03] hover:bg-tertiary/[.06]";
        if (row.status === 1)
            return "bg-amber-500/[.03] hover:bg-amber-500/[.06]";
        return "";
    };

    // Vì DataTable không hỗ trợ expanded rows, ta render thủ công
    return (
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-outline-variant/20 bg-surface-container-low/50">
                            {[
                                "#",
                                "Thiết bị",
                                "Thời gian",
                                "Trạng thái",
                                "Lý do cảnh báo",
                                "",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                                            progress_activity
                                        </span>
                                        <p className="text-sm">Đang tải...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : alerts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-16 text-center"
                                >
                                    <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                                        <span className="material-symbols-outlined text-5xl opacity-25">
                                            check_circle
                                        </span>
                                        <p className="text-sm">
                                            Không có cảnh báo nào trong khoảng
                                            thời gian này.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            alerts.map((alert, idx) => (
                                <>
                                    <tr
                                        key={alert.id}
                                        className={`border-b border-outline-variant/15 last:border-b-0 transition-colors cursor-pointer ${rowClassName(alert)}`}
                                        onClick={() =>
                                            setExpandedId(
                                                expandedId === alert.id
                                                    ? null
                                                    : alert.id,
                                            )
                                        }
                                    >
                                        <td className="px-6 py-4 font-mono text-xs text-on-surface-variant w-12">
                                            {indexOffset + idx + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-on-surface">
                                                <span className="material-symbols-outlined text-primary text-[15px]">
                                                    memory
                                                </span>
                                                {alert.deviceId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                                            {new Date(
                                                alert.timestamp,
                                            ).toLocaleString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <DataStatusBadge
                                                status={alert.status}
                                            />
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            {alert.alertReason ? (
                                                <span className="flex items-start gap-1.5 text-sm text-on-surface-variant">
                                                    <span className="material-symbols-outlined text-tertiary text-[15px] mt-0.5 shrink-0">
                                                        error
                                                    </span>
                                                    {alert.alertReason}
                                                </span>
                                            ) : (
                                                <span className="text-on-surface-variant/40 italic text-xs">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span
                                                className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 text-[18px] ${expandedId === alert.id ? "rotate-180" : ""}`}
                                            >
                                                expand_more
                                            </span>
                                        </td>
                                    </tr>

                                    {expandedId === alert.id && (
                                        <tr key={`${alert.id}-detail`}>
                                            <td colSpan={6} className="p-0">
                                                <SensorDetailRow
                                                    jsonData={alert.jsonData}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

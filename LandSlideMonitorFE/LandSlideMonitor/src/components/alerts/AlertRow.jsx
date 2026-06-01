import { useState } from "react";
import DataStatusBadge from "./DataStatusBadge";
import { SENSOR_LABELS } from "../../constants/sensorConfig";
/**
 * AlertRow — một hàng trong bảng cảnh báo, có thể mở rộng để xem chi tiết jsonData.
 */
export default function AlertRow({ alert, index }) {
    const [expanded, setExpanded] = useState(false);

    const parsed = (() => {
        try {
            return JSON.parse(alert.jsonData);
        } catch {
            return null;
        }
    })();

    const formattedTime = new Date(alert.timestamp).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const rowBg =
        alert.status === 2
            ? "bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30"
            : alert.status === 1
              ? "bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              : "hover:bg-slate-50 dark:hover:bg-slate-800/50";

    return (
        <>
            <tr
                className={`border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer ${rowBg}`}
                onClick={() => setExpanded((p) => !p)}
            >
                {/* Index */}
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                    {index}
                </td>

                {/* Device ID */}
                <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <span
                            className="material-symbols-outlined text-blue-500"
                            style={{ fontSize: 16 }}
                        >
                            memory
                        </span>
                        {alert.deviceId}
                    </span>
                </td>

                {/* Timestamp */}
                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formattedTime}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                    <DataStatusBadge status={alert.status} />
                </td>

                {/* Alert Reason */}
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                    {alert.alertReason ? (
                        <span className="flex items-start gap-1.5">
                            <span
                                className="material-symbols-outlined text-red-500 mt-0.5 shrink-0"
                                style={{ fontSize: 16 }}
                            >
                                error
                            </span>
                            {alert.alertReason}
                        </span>
                    ) : (
                        <span className="text-slate-300 dark:text-slate-600 italic text-xs">
                            —
                        </span>
                    )}
                </td>

                {/* Expand chevron */}
                <td className="px-4 py-3 text-right">
                    <span
                        className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${
                            expanded ? "rotate-180" : ""
                        }`}
                        style={{ fontSize: 18 }}
                    >
                        expand_more
                    </span>
                </td>
            </tr>

            {/* Expanded sensor detail row */}
            {expanded && parsed && (
                <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td
                        colSpan={6}
                        className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40"
                    >
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                            Dữ liệu cảm biến chi tiết
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {Object.entries(parsed).map(([key, value]) => {
                                const meta = SENSOR_LABELS[key];
                                return (
                                    <div
                                        key={key}
                                        className="bg-white dark:bg-slate-700/50 rounded-xl px-3 py-2 border border-slate-100 dark:border-slate-700"
                                    >
                                        <div className="flex items-center gap-1 mb-0.5">
                                            {meta && (
                                                <span
                                                    className="material-symbols-outlined text-blue-400"
                                                    style={{ fontSize: 13 }}
                                                >
                                                    {meta.icon}
                                                </span>
                                            )}
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium truncate">
                                                {meta?.label ?? key}
                                            </p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-100 tabular-nums">
                                            {typeof value === "number"
                                                ? value % 1 !== 0
                                                    ? value.toFixed(3)
                                                    : value
                                                : String(value)}
                                            {meta?.unit && (
                                                <span className="text-xs font-normal text-slate-400 ml-0.5">
                                                    {meta.unit}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

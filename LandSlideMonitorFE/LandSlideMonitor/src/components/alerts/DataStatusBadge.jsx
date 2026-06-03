/**
 * DataStatusBadge — hiển thị mức độ cảnh báo của dữ liệu cảm biến.
 * status: 0 = Normal, 1 = Warning, 2 = Alert
 * Khác với StatusBadge (trạng thái thiết bị: online/offline/...)
 */
const STATUS_CONFIG = {
    0: {
        label: "Bình thường",
        icon: "check_circle",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dotClass: "bg-emerald-500",
    },
    1: {
        label: "Cảnh báo",
        icon: "warning",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
        dotClass: "bg-amber-500",
        pulse: true,
    },
    2: {
        label: "Báo động",
        icon: "crisis_alert",
        className: "bg-red-50 text-red-700 ring-red-200",
        dotClass: "bg-red-500",
        pulse: true,
    },
};

export default function DataStatusBadge({ status, showIcon = true }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG[0];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cfg.className}`}
        >
            {showIcon && (
                <span
                    className="material-symbols-outlined text-sm leading-none"
                    style={{ fontSize: 14 }}
                >
                    {cfg.icon}
                </span>
            )}
            <span className="relative flex items-center gap-1">
                {cfg.pulse && (
                    <span className="relative flex h-1.5 w-1.5">
                        <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dotClass}`}
                        />
                        <span
                            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dotClass}`}
                        />
                    </span>
                )}
                {cfg.label}
            </span>
        </span>
    );
}

export { STATUS_CONFIG };

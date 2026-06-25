import {
    DATA_STATUS_BADGE_CONFIG,
    resolveDataStatus,
} from "../../utils/dataStatus";

/**
 * DataStatusBadge — hiển thị mức độ cảnh báo của dữ liệu cảm biến.
 * status: 0 = Normal, 1 = Warning, 2 = Alert
 * Khác với StatusBadge (trạng thái thiết bị: online/offline/...)
 */
export default function DataStatusBadge({ status, showIcon = true }) {
    const cfg = DATA_STATUS_BADGE_CONFIG[resolveDataStatus(status)];

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

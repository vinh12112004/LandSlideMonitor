export const DATA_STATUS_BADGE_CONFIG = {
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

const STATUS_NAME_MAP = {
    normal: 0,
    warning: 1,
    alert: 2,
};

export function resolveDataStatus(status) {
    if (typeof status === "number") {
        return DATA_STATUS_BADGE_CONFIG[status] ? status : 0;
    }

    if (typeof status === "string") {
        const value = status.trim();
        if (!value) return 0;

        const numericValue = Number(value);
        if (
            Number.isInteger(numericValue) &&
            DATA_STATUS_BADGE_CONFIG[numericValue]
        ) {
            return numericValue;
        }

        return STATUS_NAME_MAP[value.toLowerCase()] ?? 0;
    }

    return 0;
}

const STATUS_MAP = {
    0: "normal",
    1: "warning",
    2: "alert",
};

const BAR_COLOR = {
    normal: "bg-secondary",
    warning: "bg-yellow-400",
    alert: "bg-tertiary",
    idle: "bg-outline-variant",
};

export default function MoistureBar({ value, status }) {
    const statusText = STATUS_MAP[status];
    const barColor = BAR_COLOR[statusText] || BAR_COLOR.idle;

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{value}%</span>
            <div className="flex-1 h-1.5 w-12 bg-surface-container rounded-full overflow-hidden">
                <div
                    className={`${barColor} h-full rounded-full`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                />
            </div>
        </div>
    );
}

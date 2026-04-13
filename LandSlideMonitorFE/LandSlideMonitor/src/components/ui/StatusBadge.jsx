const STATUS_MAP = {
    0: {
        text: "OFFLINE",
        className: "bg-surface-container text-on-surface-variant",
    },
    1: {
        text: "ONLINE",
        className: "bg-secondary-container text-on-secondary-container",
    },
    2: {
        text: "LOW BATTERY",
        className: "bg-yellow-200 text-yellow-800",
    },
    3: {
        text: "MAINTENANCE",
        className: "bg-blue-200 text-blue-800",
    },
};

export default function StatusBadge({ status }) {
    const config = STATUS_MAP[status] || STATUS_MAP[0];

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.className}`}
        >
            {config.text}
        </span>
    );
}

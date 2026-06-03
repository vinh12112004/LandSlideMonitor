const STATUS_MAP = {
    0: {
        text: "Ngoại tuyến",
        className: "bg-surface-container text-on-surface-variant ring-outline-variant/45",
    },
    1: {
        text: "Trực tuyến",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    2: {
        text: "Pin yếu",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
    3: {
        text: "Bảo trì",
        className: "bg-blue-50 text-blue-700 ring-blue-200",
    },
};

export default function StatusBadge({ status }) {
    const config = STATUS_MAP[status] || STATUS_MAP[0];

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${config.className}`}
        >
            {config.text}
        </span>
    );
}

const STATUS_MAP = {
    0: "normal",
    1: "warning",
    2: "alert",
};

const STATUS_STYLES = {
    normal: "bg-secondary-container text-on-secondary-container",
    warning: "bg-yellow-300/50 text-yellow-900",
    alert: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function HistoryStatusBadge({ status }) {
    const statusText = STATUS_MAP[status] || "normal";
    const style = STATUS_STYLES[statusText];

    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${style}`}
        >
            {statusText}
        </span>
    );
}

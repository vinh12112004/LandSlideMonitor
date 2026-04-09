export default function StatusBadge({ status }) {
    let statusText;
    let statusClasses;

    switch (status) {
        case 1: // Online
            statusText = "ONLINE";
            statusClasses =
                "bg-secondary-container text-on-secondary-container";
            break;
        case 2: // Warning
            statusText = "WARNING";
            statusClasses = "bg-yellow-200 text-yellow-800"; // Example warning colors
            break;
        case 0: // Offline
        default:
            statusText = "OFFLINE";
            statusClasses = "bg-surface-container text-on-surface-variant";
            break;
    }

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClasses}`}
        >
            {statusText}
        </span>
    );
}

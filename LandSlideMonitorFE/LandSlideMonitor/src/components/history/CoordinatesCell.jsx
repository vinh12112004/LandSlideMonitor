export default function CoordinatesCell({ lat, lon, status }) {
    const isAlert = status === 2;
    const isWarning = status === 1;

    const wrapClass = isAlert
        ? "flex gap-2 text-tertiary font-bold"
        : isWarning
          ? "flex gap-2 text-yellow-700 font-medium"
          : "flex gap-2";

    const chipClass = isAlert
        ? "bg-tertiary-fixed px-1 rounded"
        : isWarning
          ? "bg-yellow-300/40 px-1 rounded"
          : "bg-surface-container px-1 rounded";

    return (
        <div
            className={`font-mono text-[11px] text-on-surface-variant ${wrapClass}`}
        >
            <span className={chipClass}>Lat: {lat?.toFixed(4) ?? "-"}</span>
            <span className={chipClass}>Lon: {lon?.toFixed(4) ?? "-"}</span>
        </div>
    );
}

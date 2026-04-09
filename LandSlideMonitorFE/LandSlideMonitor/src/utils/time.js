const TIME_UNITS = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
];

export function formatRelativeTime(dateString) {
    if (!dateString || dateString.startsWith("0001-01-01")) {
        return "Never";
    }

    const pastDate = new Date(dateString + "Z");
    const now = new Date();
    const secondsAgo = Math.round((now - pastDate) / 1000);

    if (secondsAgo < 5) {
        return "just now";
    }

    for (const { unit, seconds } of TIME_UNITS) {
        const interval = Math.floor(secondsAgo / seconds);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
        }
    }

    return "just now";
}
